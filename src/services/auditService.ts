import { addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { AuditLog } from '../types';

const DEMO_AUDIT_KEY = 'aidicore_demo_audit_logs';

function removeUndefinedValues<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefinedValues(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, removeUndefinedValues(item)]),
    ) as T;
  }

  return value;
}


function readDemoLogs(): AuditLog[] {
  const raw = localStorage.getItem(DEMO_AUDIT_KEY);
  return raw ? (JSON.parse(raw) as AuditLog[]) : [];
}

function writeDemoLogs(logs: AuditLog[]) {
  localStorage.setItem(DEMO_AUDIT_KEY, JSON.stringify(logs));
}

export async function createAuditLog(input: Omit<AuditLog, 'id' | 'createdAt'>) {
  const payload = removeUndefinedValues({ ...input, createdAt: Date.now() });
  if (!isFirebaseConfigured) {
    const logs = readDemoLogs();
    logs.unshift({ ...payload, id: `demo_log_${Date.now()}` });
    writeDemoLogs(logs.slice(0, 300));
    return;
  }
  await addDoc(collection(db, 'audit_logs'), removeUndefinedValues({ ...payload, createdAtServer: serverTimestamp() }));
}

export async function listAuditLogs() {
  if (!isFirebaseConfigured) {
    return readDemoLogs().sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
  }
  const q = query(collection(db, 'audit_logs'), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  return snap.docs.map((item) => ({ id: item.id, ...item.data() })) as AuditLog[];
}
