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
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { ImpactRecord, ImpactVerification } from '../types';
import { createAuditLog } from './auditService';

const DEMO_VERIFICATIONS_KEY = 'aidicore_demo_impact_verifications';
const NORMAL_WEIGHT = 0.05;
const NEW_ACCOUNT_WEIGHT = 0.01;
const TRUSTED_VERIFIER_WEIGHT = 0.08;
const REPEATED_PAIR_PENALTY = -0.05;
const HIGH_FREQUENCY_PENALTY = -0.1;

function readDemoVerifications(): ImpactVerification[] {
  const raw = localStorage.getItem(DEMO_VERIFICATIONS_KEY);
  return raw ? JSON.parse(raw) as ImpactVerification[] : [];
}

function writeDemoVerifications(items: ImpactVerification[]) {
  localStorage.setItem(DEMO_VERIFICATIONS_KEY, JSON.stringify(items));
}

function makeToken() {
  const values = crypto.getRandomValues(new Uint32Array(4));
  return Array.from(values).map((value) => value.toString(36)).join('');
}

async function hashToken(token: string) {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function dayStart(timestamp: number) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function analyzeVerificationRisk(args: {
  impactOwnerId: string;
  verifierId: string;
  verifierCreatedAt?: number;
  verifierTrustScore?: number;
  verifierApprovedActions?: number;
  existing: ImpactVerification[];
}) {
  const now = Date.now();
  const flags: string[] = [];
  let weight = NORMAL_WEIGHT;
  let penalty = 0;

  if (args.impactOwnerId === args.verifierId) {
    return { status: 'rejected' as const, weight: 0, penalty: HIGH_FREQUENCY_PENALTY, flags: ['self_verification_attempt'] };
  }

  const samePair = args.existing.filter((item) => item.impactOwnerId === args.impactOwnerId && item.verifierId === args.verifierId && item.status === 'confirmed');
  const today = dayStart(now);
  const samePairToday = samePair.filter((item) => item.confirmedAt && item.confirmedAt >= today);
  const recentSamePair = samePair.filter((item) => item.confirmedAt && now - item.confirmedAt <= 7 * 24 * 60 * 60 * 1000);

  if (samePairToday.length >= 1) flags.push('repeated_same_day_verifier');
  if (recentSamePair.length >= 2) flags.push('repeated_pair_pattern');
  if (samePairToday.length >= 2) flags.push('high_frequency_verification');

  if (args.verifierCreatedAt && now - args.verifierCreatedAt < 7 * 24 * 60 * 60 * 1000) {
    flags.push('new_account_verifier');
    weight = NEW_ACCOUNT_WEIGHT;
  } else if ((args.verifierTrustScore || 0) >= 0.3 || (args.verifierApprovedActions || 0) >= 3) {
    flags.push('trusted_verifier');
    weight = TRUSTED_VERIFIER_WEIGHT;
  }

  if (flags.includes('repeated_pair_pattern')) {
    weight = 0;
    penalty += REPEATED_PAIR_PENALTY;
  }
  if (flags.includes('high_frequency_verification')) {
    weight = 0;
    penalty += HIGH_FREQUENCY_PENALTY;
  }

  return { status: flags.length ? 'flagged' as const : 'confirmed' as const, weight, penalty, flags };
}

export async function createVerificationLink(impact: ImpactRecord, createdBy: string, actorEmail?: string) {
  const token = makeToken();
  const tokenHash = await hashToken(token);
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

  const payload = {
    impactId: impact.id,
    impactOwnerId: impact.userId,
    tokenHash,
    status: 'pending' as const,
    weight: 0,
    penalty: 0,
    riskFlags: [],
    createdAt: Date.now(),
    expiresAt,
    createdBy,
  };

  let id = `demo_ver_${Date.now()}`;
  if (!isFirebaseConfigured) {
    const items = readDemoVerifications();
    items.unshift({ id, ...payload });
    writeDemoVerifications(items);
  } else {
    const ref = await addDoc(collection(db, 'impact_verifications'), { ...payload, createdAtServer: serverTimestamp() });
    id = ref.id;
  }

  await createAuditLog({ actorId: createdBy, actorEmail, action: 'create_verification_link', targetType: 'impact_record', targetId: impact.id, message: `Created verification link for impact ${impact.id}` }).catch(() => null);
  return { id, token, expiresAt };
}

export async function confirmVerificationLink(verificationId: string, token: string, verifier: { uid: string; email?: string; createdAt?: number; trustScore?: number; approvedActions?: number }) {
  const tokenHash = await hashToken(token);
  const now = Date.now();

  if (!isFirebaseConfigured) {
    const items = readDemoVerifications();
    const item = items.find((entry) => entry.id === verificationId);
    if (!item || item.tokenHash !== tokenHash || item.status !== 'pending' || item.expiresAt < now) throw new Error('Invalid or expired verification link.');
    const risk = analyzeVerificationRisk({ impactOwnerId: item.impactOwnerId, verifierId: verifier.uid, verifierCreatedAt: verifier.createdAt, verifierTrustScore: verifier.trustScore, verifierApprovedActions: verifier.approvedActions, existing: items });
    Object.assign(item, { status: risk.status, verifierId: verifier.uid, verifierEmail: verifier.email, weight: risk.weight, penalty: risk.penalty, riskFlags: risk.flags, confirmedAt: now });
    writeDemoVerifications(items);
    await createAuditLog({ actorId: verifier.uid, actorEmail: verifier.email, action: risk.status === 'rejected' ? 'reject_impact_verification' : 'confirm_impact_verification', targetType: 'impact_record', targetId: item.impactId, message: `Verification ${risk.status}. Flags: ${risk.flags.join(', ') || 'none'}` });
    return item;
  }

  const ref = doc(db, 'impact_verifications', verificationId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('Verification link not found.');
  const item = { id: snap.id, ...snap.data() } as ImpactVerification;
  if (item.tokenHash !== tokenHash || item.status !== 'pending' || item.expiresAt < now) throw new Error('Invalid or expired verification link.');

  const existingSnap = await getDocs(query(collection(db, 'impact_verifications'), where('impactOwnerId', '==', item.impactOwnerId), where('verifierId', '==', verifier.uid), orderBy('confirmedAt', 'desc'), limit(20))).catch(() => null);
  const existing = existingSnap ? existingSnap.docs.map((entry) => ({ id: entry.id, ...entry.data() })) as ImpactVerification[] : [];
  const risk = analyzeVerificationRisk({ impactOwnerId: item.impactOwnerId, verifierId: verifier.uid, verifierCreatedAt: verifier.createdAt, verifierTrustScore: verifier.trustScore, verifierApprovedActions: verifier.approvedActions, existing });

  await updateDoc(ref, { status: risk.status, verifierId: verifier.uid, verifierEmail: verifier.email || '', weight: risk.weight, penalty: risk.penalty, riskFlags: risk.flags, confirmedAt: now });
  await updateDoc(doc(db, 'impact_records', item.impactId), {
    verificationCount: increment(risk.status === 'rejected' ? 0 : 1),
    verificationWeight: increment(risk.weight),
    verificationRiskFlags: risk.flags,
  }).catch(() => null);
  if (risk.weight || risk.penalty) {
    await updateDoc(doc(db, 'users', item.impactOwnerId), {
      trustScore: increment(risk.weight),
      verificationPenalty: increment(risk.penalty),
      trustRiskScore: increment(Math.abs(risk.penalty)),
      riskFlags: risk.flags,
    }).catch(() => null);
  }
  await createAuditLog({ actorId: verifier.uid, actorEmail: verifier.email, action: risk.status === 'rejected' ? 'reject_impact_verification' : risk.flags.length ? 'flag_verification_risk' : 'confirm_impact_verification', targetType: 'impact_record', targetId: item.impactId, message: `Verification ${risk.status}. Weight ${risk.weight}. Penalty ${risk.penalty}. Flags: ${risk.flags.join(', ') || 'none'}` }).catch(() => null);
  return { ...item, status: risk.status, verifierId: verifier.uid, verifierEmail: verifier.email, weight: risk.weight, penalty: risk.penalty, riskFlags: risk.flags, confirmedAt: now };
}

export async function listVerificationLinks() {
  if (!isFirebaseConfigured) return readDemoVerifications().sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);
  const snap = await getDocs(query(collection(db, 'impact_verifications'), orderBy('createdAt', 'desc'), limit(100)));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() })) as ImpactVerification[];
}
