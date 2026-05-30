import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { ImpactCategory, ImpactRecord, Visibility } from '../types';
import { createAuditLog } from './auditService';
import { buildGroupingKey, calculateFraudScore } from './fraud';

const DEMO_RECORDS_KEY = 'aidicore_demo_impact_records';
const DEMO_USERS_KEY = 'aidicore_demo_users';
const DEMO_USER_KEY = 'aidicore_demo_user';

function readDemoRecords(): ImpactRecord[] {
  const raw = localStorage.getItem(DEMO_RECORDS_KEY);
  if (raw) return JSON.parse(raw) as ImpactRecord[];
  const seed: ImpactRecord[] = [
    {
      id: 'demo_public_1',
      userId: 'demo_seed',
      userDisplayName: 'Someone',
      title: 'Helped a senior citizen',
      category: 'helping_seniors',
      details: 'A safe anonymous example record for the public impact feed.',
      occurredAt: new Date().toISOString().slice(0, 10),
      countryCode: 'AE',
      city: 'Abu Dhabi',
      visibility: 'anonymous_public',
      status: 'approved',
      fraudScore: 8,
      auditRequired: false,
      auditStatus: 'reviewed',
      groupingKey: 'demo',
      groupWindow: 'daily',
      createdAt: Date.now() - 86400000,
    },
  ];
  localStorage.setItem(DEMO_RECORDS_KEY, JSON.stringify(seed));
  return seed;
}

function writeDemoRecords(records: ImpactRecord[]) {
  localStorage.setItem(DEMO_RECORDS_KEY, JSON.stringify(records));
}

function updateDemoUserImpact(userId: string) {
  const rawUsers = localStorage.getItem(DEMO_USERS_KEY);
  const users = rawUsers ? JSON.parse(rawUsers) : [];
  const nextUsers = users.map((user: any) => user.uid === userId ? { ...user, approvedActions: (user.approvedActions || 0) + 1, impactScore: (user.impactScore || 0) + 10 } : user);
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(nextUsers));
  const current = localStorage.getItem(DEMO_USER_KEY);
  if (current) {
    const currentUser = JSON.parse(current);
    if (currentUser.uid === userId) {
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify({ ...currentUser, approvedActions: (currentUser.approvedActions || 0) + 1, impactScore: (currentUser.impactScore || 0) + 10 }));
    }
  }
}

export async function createImpactRecord(input: { userId: string; userDisplayName: string; title: string; category: ImpactCategory; details: string; occurredAt: string; countryCode: string; city: string; visibility: Visibility; }) {
  const fraud = calculateFraudScore(input as Pick<ImpactRecord, 'title'|'details'|'city'|'category'>);
  const groupingKey = buildGroupingKey(input.userId, input.category, input.city, input.occurredAt);

  if (!isFirebaseConfigured) {
    const records = readDemoRecords();
    const duplicate = records.some((record) => record.groupingKey === groupingKey && record.status !== 'rejected');
    const id = `demo_${Date.now()}`;
    records.unshift({
      id,
      ...input,
      status: 'pending',
      fraudScore: duplicate ? Math.min(100, fraud.score + 35) : fraud.score,
      auditRequired: duplicate || fraud.auditRequired,
      auditStatus: duplicate || fraud.auditRequired ? 'queued' : 'not_required',
      auditNote: duplicate ? 'Possible duplicate same-day impact record.' : '',
      groupingKey,
      groupWindow: 'daily',
      createdAt: Date.now(),
    });
    writeDemoRecords(records);
    await createAuditLog({ actorId: input.userId, action: 'create_impact', targetType: 'impact_record', targetId: id, message: `Created impact record: ${input.title}` });
    return id;
  }

  const duplicateQuery = query(collection(db, 'impact_records'), where('groupingKey', '==', groupingKey), where('status', '!=', 'rejected'), limit(1));
  const duplicateSnap = await getDocs(duplicateQuery).catch(() => null);
  const duplicate = Boolean(duplicateSnap && !duplicateSnap.empty);

  const docRef = await addDoc(collection(db, 'impact_records'), {
    ...input,
    status: 'pending',
    fraudScore: duplicate ? Math.min(100, fraud.score + 35) : fraud.score,
    auditRequired: duplicate || fraud.auditRequired,
    auditStatus: duplicate || fraud.auditRequired ? 'queued' : 'not_required',
    auditNote: duplicate ? 'Possible duplicate same-day impact record.' : '',
    groupingKey,
    groupWindow: 'daily',
    createdAt: Date.now(),
    createdAtServer: serverTimestamp(),
  });
  await createAuditLog({ actorId: input.userId, action: 'create_impact', targetType: 'impact_record', targetId: docRef.id, message: `Created impact record: ${input.title}` }).catch(() => null);
  return docRef.id;
}

export async function listPublicImpactRecords() {
  if (!isFirebaseConfigured) {
    return readDemoRecords().filter(r => r.status === 'approved' && ['anonymous_public', 'public_profile'].includes(r.visibility)).sort((a, b) => b.createdAt - a.createdAt).slice(0, 50);
  }
  const q = query(collection(db, 'impact_records'), where('status', '==', 'approved'), where('visibility', 'in', ['anonymous_public', 'public_profile']), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ImpactRecord[];
}

export async function listMyImpactRecords(userId: string) {
  if (!isFirebaseConfigured) {
    return readDemoRecords().filter(r => r.userId === userId).sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
  }
  const q = query(collection(db, 'impact_records'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ImpactRecord[];
}

export async function listPendingImpactRecords() {
  if (!isFirebaseConfigured) {
    return readDemoRecords().filter(r => r.status === 'pending').sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
  }
  const q = query(collection(db, 'impact_records'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ImpactRecord[];
}

export async function listAllImpactRecords() {
  if (!isFirebaseConfigured) {
    return readDemoRecords().sort((a, b) => b.createdAt - a.createdAt).slice(0, 200);
  }
  const q = query(collection(db, 'impact_records'), orderBy('createdAt', 'desc'), limit(200));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ImpactRecord[];
}

export async function reviewImpactRecord(id: string, status: 'approved' | 'rejected', reviewedBy: string, auditNote: string, actorEmail?: string) {
  if (!isFirebaseConfigured) {
    let reviewedRecord: ImpactRecord | undefined;
    const records = readDemoRecords().map(r => {
      if (r.id !== id) return r;
      reviewedRecord = r;
      return { ...r, status, reviewedBy, auditNote, auditStatus: 'reviewed' as const, reviewedAt: Date.now() };
    });
    writeDemoRecords(records);
    if (status === 'approved' && reviewedRecord) updateDemoUserImpact(reviewedRecord.userId);
    await createAuditLog({ actorId: reviewedBy, actorEmail, action: status === 'approved' ? 'approve_impact' : 'reject_impact', targetType: 'impact_record', targetId: id, message: auditNote || `Record ${status}` });
    return;
  }

  const batch = writeBatch(db);
  const recordRef = doc(db, 'impact_records', id);
  const recordSnap = await getDoc(recordRef);
  const record = recordSnap.exists() ? (recordSnap.data() as ImpactRecord) : null;
  batch.update(recordRef, { status, reviewedBy, auditNote, auditStatus: 'reviewed', reviewedAt: Date.now() });
  if (status === 'approved' && record?.userId) {
    const userRef = doc(db, 'users', record.userId);
    batch.update(userRef, { approvedActions: increment(1), impactScore: increment(10) });
  }
  await batch.commit();
  await createAuditLog({ actorId: reviewedBy, actorEmail, action: status === 'approved' ? 'approve_impact' : 'reject_impact', targetType: 'impact_record', targetId: id, message: auditNote || `Record ${status}` });
}
