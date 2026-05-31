import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { ImpactCategory, ImpactRecord, ImpactStatus, Visibility } from '../types';
import { createAuditLog } from './auditService';
import { buildGroupingKey, calculateFraudScore } from './fraud';
import { calculateGrowthStage, sanitizeText } from './passportService';

const DEMO_RECORDS_KEY = 'aidicore_demo_impact_records';
const DEMO_USERS_KEY = 'aidicore_demo_users';
const DEMO_USER_KEY = 'aidicore_demo_user';

const CATEGORY_CREDITS: Record<ImpactCategory, number> = {
  community_service: 0.1,
  blood_donation: 0.1,
  visiting_patients: 0.1,
  helping_seniors: 0.1,
  mental_support: 0.1,
  anti_bullying: 0.1,
  environment: 0.1,
  education: 0.1,
  volunteer_work: 0.1,
  emergency_help: 0.1,
  food_support: 0.1,
  disability_support: 0.1,
  animal_welfare: 0.1,
  family_support: 0.1,
};

function getImpactCredits(category: ImpactCategory, duplicate: boolean) {
  if (duplicate) return 0;
  return CATEGORY_CREDITS[category] ?? 0.1;
}

function getConfidenceScore(fraudScore: number, duplicate: boolean) {
  if (duplicate) return 35;
  return Math.max(45, Math.min(95, 100 - fraudScore));
}

function readDemoRecords(): ImpactRecord[] {
  const raw = localStorage.getItem(DEMO_RECORDS_KEY);
  if (raw) return JSON.parse(raw) as ImpactRecord[];
  const seed: ImpactRecord[] = [];
  localStorage.setItem(DEMO_RECORDS_KEY, JSON.stringify(seed));
  return seed;
}

function writeDemoRecords(records: ImpactRecord[]) {
  localStorage.setItem(DEMO_RECORDS_KEY, JSON.stringify(records));
}

function withUpdatedImpact(user: any, credits: number) {
  const approvedActions = (user.approvedActions || 0) + 1;
  const impactScore = Number(((user.impactScore || 0) + credits).toFixed(2));
  const impactCredits = Number(((user.impactCredits || user.impactScore || 0) + credits).toFixed(2));
  return {
    ...user,
    approvedActions,
    impactScore,
    impactCredits,
    trustScore: Number(((user.trustScore || 0) + 0.01).toFixed(2)),
    growthStage: calculateGrowthStage(approvedActions, impactCredits),
  };
}

function updateDemoUserImpact(userId: string, credits: number) {
  const rawUsers = localStorage.getItem(DEMO_USERS_KEY);
  const users = rawUsers ? JSON.parse(rawUsers) : [];
  const nextUsers = users.map((user: any) => user.uid === userId ? withUpdatedImpact(user, credits) : user);
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(nextUsers));
  const current = localStorage.getItem(DEMO_USER_KEY);
  if (current) {
    const currentUser = JSON.parse(current);
    if (currentUser.uid === userId) localStorage.setItem(DEMO_USER_KEY, JSON.stringify(withUpdatedImpact(currentUser, credits)));
  }
}

export async function createImpactRecord(input: { userId: string; userDisplayName: string; userEmail?: string; title: string; category: ImpactCategory; details: string; occurredAt: string; countryCode: string; city: string; visibility: Visibility; }) {
  const safeInput = {
    ...input,
    userDisplayName: sanitizeText(input.userDisplayName, 60),
    userEmail: sanitizeText(input.userEmail || '', 120).toLowerCase(),
    title: sanitizeText(input.title, 90),
    details: sanitizeText(input.details, 700),
    city: sanitizeText(input.city, 60),
    countryCode: sanitizeText(input.countryCode, 4).toUpperCase(),
  };
  const fraud = calculateFraudScore(safeInput as Pick<ImpactRecord, 'title'|'details'|'city'|'category'>);
  const groupingKey = buildGroupingKey(safeInput.userId, safeInput.category, safeInput.city, safeInput.occurredAt);

  if (!isFirebaseConfigured) {
    const records = readDemoRecords();
    const duplicate = records.some((record) => record.groupingKey === groupingKey && record.status !== 'rejected');
    const id = `demo_${Date.now()}`;
    const impactCredits = getImpactCredits(input.category, duplicate);
    const finalFraudScore = duplicate ? Math.min(100, fraud.score + 35) : fraud.score;
    records.unshift({
      id,
      ...safeInput,
      status: 'pending',
      fraudScore: finalFraudScore,
      impactCredits,
      duplicateLevel: duplicate ? 1 : 0,
      confidenceScore: getConfidenceScore(finalFraudScore, duplicate),
      auditRequired: duplicate || fraud.auditRequired,
      auditStatus: duplicate || fraud.auditRequired ? 'queued' : 'not_required',
      auditNote: duplicate ? 'Possible duplicate same-day impact record.' : '',
      groupingKey,
      groupWindow: 'daily',
      createdAt: Date.now(),
    });
    writeDemoRecords(records);
    await createAuditLog({ actorId: safeInput.userId, action: 'create_impact', targetType: 'impact_record', targetId: id, message: `Created impact record: ${safeInput.title}` });
    return id;
  }

  const duplicateQuery = query(collection(db, 'impact_records'), where('groupingKey', '==', groupingKey), where('status', '!=', 'rejected'), limit(1));
  const duplicateSnap = await getDocs(duplicateQuery).catch(() => null);
  const duplicate = Boolean(duplicateSnap && !duplicateSnap.empty);
  const impactCredits = getImpactCredits(input.category, duplicate);
  const finalFraudScore = duplicate ? Math.min(100, fraud.score + 35) : fraud.score;

  const docRef = await addDoc(collection(db, 'impact_records'), {
    ...safeInput,
    status: 'pending',
    fraudScore: finalFraudScore,
    impactCredits,
    duplicateLevel: duplicate ? 1 : 0,
    confidenceScore: getConfidenceScore(finalFraudScore, duplicate),
    auditRequired: duplicate || fraud.auditRequired,
    auditStatus: duplicate || fraud.auditRequired ? 'queued' : 'not_required',
    auditNote: duplicate ? 'Possible duplicate same-day impact record.' : '',
    groupingKey,
    groupWindow: 'daily',
    createdAt: Date.now(),
    createdAtServer: serverTimestamp(),
  });
  await createAuditLog({ actorId: safeInput.userId, action: 'create_impact', targetType: 'impact_record', targetId: docRef.id, message: `Created impact record: ${safeInput.title}` }).catch(() => null);
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

export async function listMyImpactRecords(userId: string, userEmail?: string) {
  if (!isFirebaseConfigured) {
    return readDemoRecords()
      .filter(r => r.userId === userId || (userEmail && r.userEmail === userEmail.toLowerCase()))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 100);
  }

  // Keep this query simple to avoid missing composite index issues in production.
  // Sorting happens client-side after the owner-only result set is loaded.
  const byUserSnap = await getDocs(query(collection(db, 'impact_records'), where('userId', '==', userId), limit(100))).catch(() => null);
  let records = byUserSnap ? byUserSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as ImpactRecord[] : [];

  // Safety fallback for older records created before duplicate-user cleanup or before userEmail was saved.
  if (records.length === 0 && userEmail) {
    const byEmailSnap = await getDocs(query(collection(db, 'impact_records'), where('userEmail', '==', userEmail.toLowerCase()), limit(100))).catch(() => null);
    records = byEmailSnap ? byEmailSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as ImpactRecord[] : [];
  }

  return records.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)).slice(0, 100);
}

export async function getImpactRecordById(id: string) {
  if (!isFirebaseConfigured) return readDemoRecords().find((record) => record.id === id) || null;
  const snap = await getDoc(doc(db, 'impact_records', id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as ImpactRecord) : null;
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
    if (status === 'approved' && reviewedRecord) updateDemoUserImpact(reviewedRecord.userId, reviewedRecord.impactCredits || 0.1);
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
    const userSnap = await getDoc(userRef);
    const user = userSnap.exists() ? userSnap.data() : {};
    const nextApproved = (user.approvedActions || 0) + 1;
    const nextCredits = Number(((user.impactCredits || user.impactScore || 0) + (record.impactCredits || 0.1)).toFixed(2));
    batch.update(userRef, { approvedActions: increment(1), impactScore: increment(record.impactCredits || 0.1), impactCredits: increment(record.impactCredits || 0.1), trustScore: increment(0.01), growthStage: calculateGrowthStage(nextApproved, nextCredits) });
  }
  await batch.commit();
  await createAuditLog({ actorId: reviewedBy, actorEmail, action: status === 'approved' ? 'approve_impact' : 'reject_impact', targetType: 'impact_record', targetId: id, message: auditNote || `Record ${status}` });
}


export async function updateImpactRecordStatus(id: string, status: ImpactStatus, actorId: string, actorEmail?: string, auditNote = 'Status updated manually by admin.') {
  if (!isFirebaseConfigured) {
    const records = readDemoRecords().map((record) => record.id === id ? { ...record, status, auditNote, auditStatus: 'reviewed' as const, reviewedAt: Date.now(), reviewedBy: actorId } : record);
    writeDemoRecords(records);
  } else {
    const recordRef = doc(db, 'impact_records', id);
    await updateDoc(recordRef, { status, auditNote, auditStatus: 'reviewed', reviewedAt: Date.now(), reviewedBy: actorId });
  }
  await createAuditLog({ actorId, actorEmail, action: 'update_impact_status', targetType: 'impact_record', targetId: id, message: `${auditNote} New status: ${status}` });
}

export async function deleteImpactRecord(id: string, actorId: string, actorEmail?: string) {
  if (!isFirebaseConfigured) {
    writeDemoRecords(readDemoRecords().filter((record) => record.id !== id));
  } else {
    await deleteDoc(doc(db, 'impact_records', id));
  }
  await createAuditLog({ actorId, actorEmail, action: 'delete_impact_record', targetType: 'impact_record', targetId: id, message: 'Deleted impact record from admin console' });
}

export async function getCommunityImpactStats() {
  const records = await listAllImpactRecords().catch(() => []);
  const approved = records.filter((record) => record.status === 'approved');
  const pending = records.filter((record) => record.status === 'pending');
  const publicRecords = approved.filter((record) => ['anonymous_public', 'public_profile'].includes(record.visibility));

  return {
    totalRecords: records.length,
    approvedRecords: approved.length,
    pendingRecords: pending.length,
    citiesCount: new Set(records.map((record) => record.city).filter(Boolean)).size,
    categoriesCount: new Set(records.map((record) => record.category).filter(Boolean)).size,
    publicRecords: publicRecords.length,
    safeReviewRate: records.length ? Math.round((approved.length / records.length) * 100) : 0,
    totalImpactCredits: Number(approved.reduce((sum, record) => sum + (record.impactCredits || 0), 0).toFixed(2)),
  };
}
