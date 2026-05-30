import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import type { AppUser, UserRole } from '../types';
import { createAuditLog } from './auditService';
import { upsertDemoUser } from './userService';

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
    approvedActions: 0,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    status: 'active',
  };
}

function toFirebaseLikeUser(user: AppUser): User {
  return { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.avatarUrl || null } as User;
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

export function listenToAuth(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured) {
    const emit = () => callback(readDemoUser() ? toFirebaseLikeUser(readDemoUser()!) : null);
    emit();
    demoEvents.addEventListener('change', emit);
    return () => demoEvents.removeEventListener('change', emit);
  }
  void setPersistence(auth, browserLocalPersistence).catch(() => null);
  return onAuthStateChanged(auth, callback);
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
  await updateDoc(doc(db, 'users', result.user.uid), { lastLogin: Date.now() }).catch(() => null);
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
  const userDoc: AppUser = {
    uid: result.user.uid,
    displayName,
    email,
    role: 'user',
    impactScore: 0,
    approvedActions: 0,
    createdAt: Date.now(),
    lastLogin: Date.now(),
    status: 'active',
  };
  await setDoc(doc(db, 'users', result.user.uid), { ...userDoc, createdAtServer: serverTimestamp() });
  await createAuditLog({ actorId: result.user.uid, actorEmail: email, action: 'auth_signup', targetType: 'auth', targetId: result.user.uid, message: 'User signup' }).catch(() => null);
  return result.user;
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

export async function updateCurrentUserProfile(user: User, updates: { displayName: string; avatarUrl?: string }) {
  if (!isFirebaseConfigured) {
    const current = readDemoUser();
    if (!current) return;
    const next = { ...current, displayName: updates.displayName, avatarUrl: updates.avatarUrl };
    writeDemoUser(next);
    await createAuditLog({ actorId: next.uid, actorEmail: next.email, action: 'update_profile', targetType: 'user', targetId: next.uid, message: 'Updated demo profile' });
    return;
  }
  await updateProfile(user, { displayName: updates.displayName, photoURL: updates.avatarUrl || null });
  await updateDoc(doc(db, 'users', user.uid), { displayName: updates.displayName, avatarUrl: updates.avatarUrl || '' });
  await createAuditLog({ actorId: user.uid, actorEmail: user.email || undefined, action: 'update_profile', targetType: 'user', targetId: user.uid, message: 'Updated profile' }).catch(() => null);
}
