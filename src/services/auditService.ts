import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { AuditLog } from '../types';

const DEMO_AUDIT_KEY = 'aidicore_demo_audit_logs';

function readDemoLogs(): AuditLog[] {
  const raw = localStorage.getItem(DEMO_AUDIT_KEY);
  return raw ? (JSON.parse(raw) as AuditLog[]) : [];
}

function writeDemoLogs(logs: AuditLog[]) {
  localStorage.setItem(DEMO_AUDIT_KEY, JSON.stringify(logs));
}

export async function createAuditLog(input: Omit<AuditLog, 'id' | 'createdAt'>) {
  const payload = { ...input, createdAt: Date.now() };
  if (!isFirebaseConfigured) {
    const logs = readDemoLogs();
    logs.unshift({ ...payload, id: `demo_log_${Date.now()}` });
    writeDemoLogs(logs.slice(0, 300));
    return;
  }
  await addDoc(collection(db, 'audit_logs'), { ...payload, createdAtServer: serverTimestamp() });
}

export async function listAuditLogs() {
  if (!isFirebaseConfigured) {
    return readDemoLogs().sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
  }
  const q = query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((item) => ({ id: item.id, ...item.data() })) as AuditLog[];
}
