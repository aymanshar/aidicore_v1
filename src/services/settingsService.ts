import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { AppSettings } from '../types';
import { createAuditLog } from './auditService';

const DEMO_SETTINGS_KEY = 'aidicore_demo_settings';

export const defaultSettings: AppSettings = {
  id: 'public',
  reviewRequiredByDefault: true,
  publicFeedEnabled: true,
  maxDailyRecordsPerUser: 5,
  sensitiveDataWarningEnabled: true,
  updatedAt: Date.now(),
};

export async function getSettings(): Promise<AppSettings> {
  if (!isFirebaseConfigured) {
    const raw = localStorage.getItem(DEMO_SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as AppSettings) : defaultSettings;
  }
  const snap = await getDoc(doc(db, 'settings', 'public'));
  return snap.exists() ? ({ id: 'public', ...snap.data() } as AppSettings) : defaultSettings;
}

export async function saveSettings(settings: AppSettings, actorId: string, actorEmail?: string) {
  const payload = { ...settings, updatedAt: Date.now(), updatedBy: actorId };
  if (!isFirebaseConfigured) {
    localStorage.setItem(DEMO_SETTINGS_KEY, JSON.stringify(payload));
  } else {
    await setDoc(doc(db, 'settings', 'public'), { ...payload, updatedAtServer: serverTimestamp() }, { merge: true });
  }
  await createAuditLog({ actorId, actorEmail, action: 'update_settings', targetType: 'settings', targetId: 'public', message: 'Updated public system settings' });
}
