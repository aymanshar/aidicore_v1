import { collection, deleteDoc, doc, getDocs, limit, orderBy, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { AppUser, UserRole, UserStatus } from '../types';
import { createAuditLog } from './auditService';

const DEMO_USERS_KEY = 'aidicore_demo_users';
const DEMO_USER_KEY = 'aidicore_demo_user';

function readDemoUsers(): AppUser[] {
  const existing = localStorage.getItem(DEMO_USERS_KEY);
  const current = localStorage.getItem(DEMO_USER_KEY);
  const users = existing ? (JSON.parse(existing) as AppUser[]) : [];
  if (current) {
    const currentUser = JSON.parse(current) as AppUser;
    if (!users.some((user) => user.uid === currentUser.uid)) users.unshift(currentUser);
  }
  return users;
}

function writeDemoUsers(users: AppUser[]) {
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
  const current = localStorage.getItem(DEMO_USER_KEY);
  if (current) {
    const currentUser = JSON.parse(current) as AppUser;
    const updated = users.find((user) => user.uid === currentUser.uid);
    if (updated) localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
  }
}

export function upsertDemoUser(user: AppUser) {
  if (isFirebaseConfigured) return;
  const users = readDemoUsers();
  const next = [user, ...users.filter((item) => item.uid !== user.uid)];
  writeDemoUsers(next.slice(0, 200));
}

export async function listUsers() {
  if (!isFirebaseConfigured) {
    return readDemoUsers().sort((a, b) => b.lastLogin - a.lastLogin).slice(0, 100);
  }
  const q = query(collection(db, 'users'), orderBy('lastLogin', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((item) => ({ uid: item.id, ...item.data() })) as AppUser[];
}

export async function updateUserRole(uid: string, role: UserRole, actorId: string, actorEmail?: string) {
  if (!isFirebaseConfigured) {
    const users = readDemoUsers().map((user) => (user.uid === uid ? { ...user, role } : user));
    writeDemoUsers(users);
  } else {
    await updateDoc(doc(db, 'users', uid), { role });
  }
  await createAuditLog({ actorId, actorEmail, action: 'update_user_role', targetType: 'user', targetId: uid, message: `Updated role to ${role}` });
}

export async function updateUserStatus(uid: string, status: UserStatus, actorId: string, actorEmail?: string) {
  if (!isFirebaseConfigured) {
    const users = readDemoUsers().map((user) => (user.uid === uid ? { ...user, status } : user));
    writeDemoUsers(users);
  } else {
    await updateDoc(doc(db, 'users', uid), { status });
  }
  await createAuditLog({ actorId, actorEmail, action: 'update_user_status', targetType: 'user', targetId: uid, message: `Updated status to ${status}` });
}


export async function deleteUserProfile(uid: string, actorId: string, actorEmail?: string) {
  if (!isFirebaseConfigured) {
    const users = readDemoUsers().filter((user) => user.uid !== uid);
    writeDemoUsers(users);
  } else {
    const batch = writeBatch(db);
    batch.delete(doc(db, 'users', uid));
    const aliasSnap = await getDocs(query(collection(db, 'aliases'), where('uid', '==', uid))).catch(() => null);
    aliasSnap?.docs.forEach((item) => batch.delete(item.ref));
    await batch.commit();
  }
  await createAuditLog({ actorId, actorEmail, action: 'delete_user_profile', targetType: 'user', targetId: uid, message: 'Deleted user profile document from Firestore' });
}
