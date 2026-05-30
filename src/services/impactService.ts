import { addDoc, collection, doc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { ImpactCategory, ImpactRecord, Visibility } from '../types';
import { buildGroupingKey, calculateFraudScore } from './fraud';

const DEMO_RECORDS_KEY = 'aidicore_demo_impact_records';

function readDemoRecords(): ImpactRecord[] {
  const raw = localStorage.getItem(DEMO_RECORDS_KEY);
  if (raw) return JSON.parse(raw) as ImpactRecord[];
  const seed: ImpactRecord[] = [
    {
      id: 'demo_public_1', userId: 'demo_seed', userDisplayName: 'Someone', title: 'Helped a senior citizen', category: 'helping_seniors', details: 'A safe anonymous example record for the public impact feed.', occurredAt: new Date().toISOString().slice(0, 10), countryCode: 'AE', city: 'Abu Dhabi', visibility: 'anonymous_public', status: 'approved', fraudScore: 8, auditRequired: false, auditStatus: 'reviewed', groupingKey: 'demo', groupWindow: 'daily', createdAt: Date.now() - 86400000,
    },
  ];
  localStorage.setItem(DEMO_RECORDS_KEY, JSON.stringify(seed));
  return seed;
}

function writeDemoRecords(records: ImpactRecord[]) {
  localStorage.setItem(DEMO_RECORDS_KEY, JSON.stringify(records));
}

export async function createImpactRecord(input: { userId: string; userDisplayName: string; title: string; category: ImpactCategory; details: string; occurredAt: string; countryCode: string; city: string; visibility: Visibility; }) {
  const fraud = calculateFraudScore(input as Pick<ImpactRecord, 'title'|'details'|'city'|'category'>);
  const groupingKey = buildGroupingKey(input.userId, input.category, input.city, input.occurredAt);

  if (!isFirebaseConfigured) {
    const records = readDemoRecords();
    const id = `demo_${Date.now()}`;
    records.unshift({
      id,
      ...input,
      status: 'pending',
      fraudScore: fraud.score,
      auditRequired: fraud.auditRequired,
      auditStatus: fraud.auditRequired ? 'queued' : 'not_required',
      groupingKey,
      groupWindow: 'daily',
      createdAt: Date.now(),
    });
    writeDemoRecords(records);
    return id;
  }

  const docRef = await addDoc(collection(db, 'impact_records'), {
    ...input, status: 'pending', fraudScore: fraud.score, auditRequired: fraud.auditRequired, auditStatus: fraud.auditRequired ? 'queued' : 'not_required', groupingKey, groupWindow: 'daily', createdAt: Date.now(), createdAtServer: serverTimestamp()
  });
  return docRef.id;
}

export async function listPublicImpactRecords() {
  if (!isFirebaseConfigured) {
    return readDemoRecords().filter(r => r.status === 'approved' && ['anonymous_public', 'public_profile'].includes(r.visibility)).sort((a, b) => b.createdAt - a.createdAt).slice(0, 50);
  }
  const q = query(collection(db, 'impact_records'), where('status', '==', 'approved'), where('visibility', 'in', ['anonymous_public', 'public_profile']), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q); return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ImpactRecord[];
}

export async function listMyImpactRecords(userId: string) {
  if (!isFirebaseConfigured) {
    return readDemoRecords().filter(r => r.userId === userId).sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
  }
  const q = query(collection(db, 'impact_records'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(100)); const snap = await getDocs(q); return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ImpactRecord[];
}

export async function listPendingImpactRecords() {
  if (!isFirebaseConfigured) {
    return readDemoRecords().filter(r => r.status === 'pending').sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
  }
  const q = query(collection(db, 'impact_records'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'), limit(100)); const snap = await getDocs(q); return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ImpactRecord[];
}

export async function reviewImpactRecord(id: string, status: 'approved' | 'rejected', reviewedBy: string, auditNote: string) {
  if (!isFirebaseConfigured) {
    const records = readDemoRecords().map(r => r.id === id ? { ...r, status, reviewedBy, auditNote, auditStatus: 'reviewed' as const, reviewedAt: Date.now() } : r);
    writeDemoRecords(records);
    return;
  }
  await updateDoc(doc(db, 'impact_records', id), { status, reviewedBy, auditNote, auditStatus: 'reviewed', reviewedAt: Date.now() }); await addDoc(collection(db, 'audit_logs'), { actorId: reviewedBy, action: status === 'approved' ? 'approve_impact' : 'reject_impact', targetType: 'impact_record', targetId: id, message: auditNote || `Record ${status}`, createdAt: Date.now(), createdAtServer: serverTimestamp() });
}
