import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, type User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import type { AppUser, UserRole } from '../types';

const DEMO_USER_KEY = 'aidicore_demo_user';
const demoEvents = new EventTarget();

function makeDemoUser(email: string, displayName?: string): AppUser {
  const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
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
  return { uid: user.uid, email: user.email, displayName: user.displayName } as User;
}

function readDemoUser(): AppUser | null {
  const raw = localStorage.getItem(DEMO_USER_KEY);
  return raw ? JSON.parse(raw) as AppUser : null;
}

function writeDemoUser(user: AppUser | null) {
  if (user) localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(DEMO_USER_KEY);
  demoEvents.dispatchEvent(new Event('change'));
}

export function listenToAuth(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured) {
    const emit = () => callback(readDemoUser() ? toFirebaseLikeUser(readDemoUser()!) : null);
    emit();
    demoEvents.addEventListener('change', emit);
    return () => demoEvents.removeEventListener('change', emit);
  }
  return onAuthStateChanged(auth, callback);
}

export async function login(email: string, password: string) {
  if (!isFirebaseConfigured) {
    const user = makeDemoUser(email);
    writeDemoUser(user);
    return toFirebaseLikeUser(user);
  }
  const result = await signInWithEmailAndPassword(auth, email, password);
  await updateDoc(doc(db, 'users', result.user.uid), { lastLogin: Date.now() }).catch(() => null);
  return result.user;
}

export async function signup(email: string, password: string, displayName: string) {
  if (!isFirebaseConfigured) {
    const user = makeDemoUser(email, displayName);
    writeDemoUser(user);
    return toFirebaseLikeUser(user);
  }
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  const userDoc: AppUser = { uid: result.user.uid, displayName, email, role: 'user', impactScore: 0, approvedActions: 0, createdAt: Date.now(), lastLogin: Date.now(), status: 'active' };
  await setDoc(doc(db, 'users', result.user.uid), { ...userDoc, createdAtServer: serverTimestamp() });
  return result.user;
}

export async function logout() {
  if (!isFirebaseConfigured) {
    writeDemoUser(null);
    return;
  }
  await signOut(auth);
}

export async function getAppUser(uid: string): Promise<AppUser | null> {
  if (!isFirebaseConfigured) {
    const user = readDemoUser();
    return user && user.uid === uid ? user : null;
  }
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as AppUser) : null;
}
