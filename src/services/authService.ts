import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import type { AppUser, UserRole } from '../types';
import { createAuditLog } from './auditService';
import { upsertDemoUser } from './userService';
import { calculateGrowthStage, normalizeAlias, savePassportProfile, suggestAliases } from './passportService';

const DEMO_USER_KEY = 'aidicore_demo_user';
const demoEvents = new EventTarget();

function makeDemoUser(email: string, displayName?: string): AppUser {
  const role: UserRole = email.toLowerCase().includes('super')
    ? 'super_admin'
    : email.toLowerCase().includes('admin')
      ? 'admin'
      : email.toLowerCase().includes('mod')
        ? 'moderator'
        : 'user';
  return {
    uid: `demo_${btoa(email).replace(/=/g, '')}`,
    displayName: displayName || email.split('@')[0] || 'Demo User',
    email,
    role,
    impactScore: 0,
    impactCredits: 0,
    trustScore: 0,
    approvedActions: 0,
    alias: suggestAliases(displayName || email)[0] || 'community_seed',
    aliasNormalized: normalizeAlias(suggestAliases(displayName || email)[0] || 'community_seed'),
    avatarId: 'seed',
    realNameVisible: false,
    impactPassportEnabled: false,
    hideContributionCategories: false,
    growthStage: calculateGrowthStage(0, 0),
    createdAt: Date.now(),
    lastLogin: Date.now(),
    status: 'active',
    emailVerified: true,
    provider: 'demo',
  };
}

function toFirebaseLikeUser(user: AppUser): User {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.avatarUrl || null,
    emailVerified: user.emailVerified ?? true,
  } as User;
}

function readDemoUser(): AppUser | null {
  const raw = localStorage.getItem(DEMO_USER_KEY);
  return raw ? (JSON.parse(raw) as AppUser) : null;
}

function writeDemoUser(user: AppUser | null) {
  if (user) {
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
    upsertDemoUser(user);
  } else {
    localStorage.removeItem(DEMO_USER_KEY);
  }
  demoEvents.dispatchEvent(new Event('change'));
}

function buildUserDoc(user: User, role: UserRole = 'user'): AppUser {
  const provider = user.providerData.some((item) => item.providerId === 'google.com') ? 'google' : 'password';
  return {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'AidiCore User',
    email: user.email || '',
    avatarUrl: user.photoURL || null,
    avatarId: 'seed',
    role,
    impactScore: 0,
    impactCredits: 0,
    trustScore: 0,
    approvedActions: 0,
    alias: suggestAliases(user.displayName || user.email)[0] || 'community_seed',
    aliasNormalized: normalizeAlias(suggestAliases(user.displayName || user.email)[0] || 'community_seed'),
    realNameVisible: false,
    impactPassportEnabled: false,
    hideContributionCategories: false,
    growthStage: calculateGrowthStage(0, 0),
    createdAt: Date.now(),
    lastLogin: Date.now(),
    status: 'active',
    emailVerified: user.emailVerified,
    provider,
  };
}

async function ensureUserDocument(user: User, role: UserRole = 'user') {
  if (!isFirebaseConfigured) return;
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const newUser = buildUserDoc(user, role);
    await setDoc(ref, { ...newUser, createdAtServer: serverTimestamp(), lastLoginServer: serverTimestamp() });
    return;
  }
  await updateDoc(ref, {
    displayName: user.displayName || snap.data().displayName || user.email?.split('@')[0] || 'AidiCore User',
    email: user.email || snap.data().email || '',
    avatarUrl: user.photoURL || snap.data().avatarUrl || null,
    avatarId: snap.data().avatarId || 'seed',
    aliasNormalized: snap.data().aliasNormalized || normalizeAlias(snap.data().alias || user.displayName || user.email || 'community_seed'),
    hideContributionCategories: Boolean(snap.data().hideContributionCategories),
    growthStage: snap.data().growthStage || calculateGrowthStage(snap.data().approvedActions || 0, snap.data().impactCredits || snap.data().impactScore || 0),
    emailVerified: user.emailVerified,
    lastLogin: Date.now(),
    lastLoginServer: serverTimestamp(),
  }).catch(() => null);
}

export function listenToAuth(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured) {
    const emit = () => callback(readDemoUser() ? toFirebaseLikeUser(readDemoUser()!) : null);
    emit();
    demoEvents.addEventListener('change', emit);
    return () => demoEvents.removeEventListener('change', emit);
  }
  void setPersistence(auth, browserLocalPersistence).catch(() => null);
  return onAuthStateChanged(auth, async (user) => {
    if (user) await ensureUserDocument(user).catch(() => null);
    callback(user);
  });
}

export async function login(email: string, password: string) {
  if (!isFirebaseConfigured) {
    const existing = readDemoUser();
    const user = existing?.email === email ? { ...existing, lastLogin: Date.now() } : makeDemoUser(email);
    writeDemoUser(user);
    await createAuditLog({ actorId: user.uid, actorEmail: user.email, action: 'auth_login', targetType: 'auth', targetId: user.uid, message: 'Demo login' });
    return toFirebaseLikeUser(user);
  }
  await setPersistence(auth, browserLocalPersistence);
  const result = await signInWithEmailAndPassword(auth, email, password);
  await result.user.reload();
  if (!result.user.emailVerified) {
    await signOut(auth);
    throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
  }
  await ensureUserDocument(result.user);
  await createAuditLog({ actorId: result.user.uid, actorEmail: result.user.email || undefined, action: 'auth_login', targetType: 'auth', targetId: result.user.uid, message: 'User login' }).catch(() => null);
  return result.user;
}

export async function signup(email: string, password: string, displayName: string) {
  if (!isFirebaseConfigured) {
    const user = makeDemoUser(email, displayName);
    writeDemoUser(user);
    await createAuditLog({ actorId: user.uid, actorEmail: user.email, action: 'auth_signup', targetType: 'auth', targetId: user.uid, message: 'Demo signup' });
    return toFirebaseLikeUser(user);
  }
  await setPersistence(auth, browserLocalPersistence);
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  await ensureUserDocument(result.user);
  await sendEmailVerification(result.user);
  await createAuditLog({ actorId: result.user.uid, actorEmail: email, action: 'auth_signup', targetType: 'auth', targetId: result.user.uid, message: 'User signup - verification email sent' }).catch(() => null);
  await signOut(auth);
  return result.user;
}

export async function loginWithGoogle() {
  if (!isFirebaseConfigured) {
    const user = makeDemoUser('google.user@aidicore.local', 'Google User');
    writeDemoUser({ ...user, provider: 'google', emailVerified: true });
    await createAuditLog({ actorId: user.uid, actorEmail: user.email, action: 'auth_login', targetType: 'auth', targetId: user.uid, message: 'Demo Google login' });
    return toFirebaseLikeUser(user);
  }
  await setPersistence(auth, browserLocalPersistence);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  await ensureUserDocument(result.user);
  await createAuditLog({ actorId: result.user.uid, actorEmail: result.user.email || undefined, action: 'auth_login', targetType: 'auth', targetId: result.user.uid, message: 'Google login' }).catch(() => null);
  return result.user;
}

export async function resendVerificationEmail() {
  const user = auth.currentUser;
  if (!isFirebaseConfigured || !user) return;
  await sendEmailVerification(user);
}

export async function logout() {
  if (!isFirebaseConfigured) {
    writeDemoUser(null);
    return;
  }
  await signOut(auth);
}

export async function resetPassword(email: string) {
  if (!isFirebaseConfigured) return;
  await sendPasswordResetEmail(auth, email);
}

export async function getAppUser(uid: string): Promise<AppUser | null> {
  if (!isFirebaseConfigured) {
    const user = readDemoUser();
    return user && user.uid === uid ? user : null;
  }
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as AppUser) : null;
}

export async function updateCurrentUserProfile(user: User, updates: { displayName: string; alias: string; realNameVisible: boolean; impactPassportEnabled: boolean; avatarId: string; hideContributionCategories: boolean }) {
  const current = await getAppUser(user.uid);
  if (!current) throw new Error('User profile was not found.');
  const saved = await savePassportProfile(current, updates);
  if (!isFirebaseConfigured) {
    writeDemoUser({ ...current, ...saved });
  } else {
    await updateProfile(user, { displayName: saved.displayName }).catch(() => null);
  }
  await createAuditLog({ actorId: user.uid, actorEmail: user.email || undefined, action: 'update_profile', targetType: 'user', targetId: user.uid, message: 'Updated Impact Passport profile' }).catch(() => null);
}
