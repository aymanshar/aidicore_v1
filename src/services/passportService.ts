import { doc, getDoc, runTransaction, setDoc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import type { AppUser, GrowthStage } from '../types';

const DEMO_USERS_KEY = 'aidicore_demo_users';
const DEMO_USER_KEY = 'aidicore_demo_user';

export const RESERVED_ALIASES = new Set([
  'admin',
  'administrator',
  'aidicore',
  'official',
  'moderator',
  'support',
  'system',
  'root',
  'security',
  'firebase',
  'null',
  'undefined',
]);

export const AVATARS = [
  { id: 'seed', icon: '🌱', category: 'nature', ar: 'بذرة', en: 'Seed', fr: 'Graine' },
  { id: 'leaf', icon: '🍃', category: 'nature', ar: 'ورقة', en: 'Leaf', fr: 'Feuille' },
  { id: 'tree', icon: '🌳', category: 'nature', ar: 'شجرة', en: 'Tree', fr: 'Arbre' },
  { id: 'oasis', icon: '🏝️', category: 'nature', ar: 'واحة', en: 'Oasis', fr: 'Oasis' },
  { id: 'bridge', icon: '🌉', category: 'community', ar: 'جسر', en: 'Bridge', fr: 'Pont' },
  { id: 'hands', icon: '🤝', category: 'community', ar: 'تعاون', en: 'Helping Hands', fr: 'Mains solidaires' },
  { id: 'heart', icon: '💚', category: 'health', ar: 'قلب أخضر', en: 'Green Heart', fr: 'Cœur vert' },
  { id: 'book', icon: '📘', category: 'education', ar: 'كتاب', en: 'Book', fr: 'Livre' },
  { id: 'water', icon: '💧', category: 'environment', ar: 'قطرة ماء', en: 'Water Drop', fr: 'Goutte d’eau' },
  { id: 'shield', icon: '🛡️', category: 'emergency', ar: 'درع', en: 'Shield', fr: 'Bouclier' },
] as const;

export function isValidAvatarId(avatarId?: string | null) {
  return AVATARS.some((avatar) => avatar.id === avatarId);
}

export function getAvatar(avatarId?: string | null) {
  return AVATARS.find((avatar) => avatar.id === avatarId) || AVATARS[0];
}

export function normalizeAlias(value: string) {
  return value
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 20);
}

export function validateAlias(value: string) {
  const alias = normalizeAlias(value);
  if (alias.length < 3) return { ok: false, alias, message: 'Alias must be between 3 and 20 characters.' };
  if (!/^[a-z0-9_]{3,20}$/.test(alias)) return { ok: false, alias, message: 'Alias may only contain lowercase letters, numbers, and underscore.' };
  if (RESERVED_ALIASES.has(alias)) return { ok: false, alias, message: 'This alias is reserved.' };
  return { ok: true, alias, message: '' };
}

export function suggestAliases(displayName?: string | null) {
  const base = normalizeAlias(displayName || 'community_seed') || 'community_seed';
  const humanSuggestions = [
    'community_seed',
    'kind_helper',
    'green_impact',
    'silent_supporter',
    'hope_builder',
    'care_giver',
    'good_bridge',
    'oasis_helper',
  ];
  return [base, ...humanSuggestions]
    .filter((value, index, list) => validateAlias(value).ok && list.indexOf(value) === index)
    .slice(0, 4);
}

export function calculateGrowthStage(approvedActions = 0, impactCredits = 0): GrowthStage {
  const score = Math.max(approvedActions, Math.floor(impactCredits));
  if (score >= 250) return 'oasis';
  if (score >= 100) return 'forest';
  if (score >= 50) return 'tree';
  if (score >= 25) return 'plant';
  if (score >= 10) return 'sprout';
  return 'seed';
}

export function getSafeDisplayName(user?: Pick<AppUser, 'alias' | 'displayName' | 'realNameVisible'> | null) {
  if (!user) return 'AidiCore Member';
  if (user.realNameVisible && user.displayName) return user.displayName;
  return user.alias ? `@${normalizeAlias(user.alias)}` : 'AidiCore Member';
}

export function sanitizeText(value: string, maxLength = 160) {
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[{}$`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function readDemoUsers(): AppUser[] {
  const raw = localStorage.getItem(DEMO_USERS_KEY);
  return raw ? JSON.parse(raw) as AppUser[] : [];
}

export async function isAliasAvailable(alias: string, currentUid?: string) {
  const checked = validateAlias(alias);
  if (!checked.ok) return false;

  if (!isFirebaseConfigured) {
    return !readDemoUsers().some((user) => user.uid !== currentUid && normalizeAlias(user.alias || '') === checked.alias);
  }

  const aliasSnap = await getDoc(doc(db, 'aliases', checked.alias));
  return !aliasSnap.exists() || aliasSnap.data().uid === currentUid;
}

function isPermissionError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return message.includes('permission') || message.includes('insufficient') || message.includes('denied');
}

export async function savePassportProfile(user: AppUser, updates: { displayName: string; alias: string; realNameVisible: boolean; impactPassportEnabled: boolean; avatarId: string; hideContributionCategories: boolean; }) {
  const aliasCheck = validateAlias(updates.alias);
  if (!aliasCheck.ok) throw new Error(aliasCheck.message);
  if (!isValidAvatarId(updates.avatarId)) throw new Error('Invalid avatar selection.');

  const next = {
    displayName: sanitizeText(updates.displayName, 60) || user.displayName || 'AidiCore User',
    alias: aliasCheck.alias,
    aliasNormalized: aliasCheck.alias,
    avatarId: updates.avatarId,
    realNameVisible: updates.realNameVisible,
    impactPassportEnabled: updates.impactPassportEnabled,
    hideContributionCategories: updates.hideContributionCategories,
    growthStage: calculateGrowthStage(user.approvedActions || 0, user.impactCredits ?? user.impactScore ?? 0),
    updatedAt: Date.now(),
  };

  if (!isFirebaseConfigured) {
    const users = readDemoUsers().map((item) => item.uid === user.uid ? { ...item, ...next } : item);
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
    const current = localStorage.getItem(DEMO_USER_KEY);
    if (current) {
      const currentUser = JSON.parse(current) as AppUser;
      if (currentUser.uid === user.uid) localStorage.setItem(DEMO_USER_KEY, JSON.stringify({ ...currentUser, ...next }));
    }
    return next;
  }

  try {
    const available = await isAliasAvailable(aliasCheck.alias, user.uid);
    if (!available) throw new Error('Alias is already taken.');

    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', user.uid);
      const aliasRef = doc(db, 'aliases', aliasCheck.alias);
      const aliasSnap = await transaction.get(aliasRef);

      if (aliasSnap.exists() && aliasSnap.data().uid !== user.uid) {
        throw new Error('Alias is already taken.');
      }

      const previousAlias = normalizeAlias(user.aliasNormalized || user.alias || '');
      if (previousAlias && previousAlias !== aliasCheck.alias) {
        const previousAliasRef = doc(db, 'aliases', previousAlias);
        const previousAliasSnap = await transaction.get(previousAliasRef);
        if (previousAliasSnap.exists() && previousAliasSnap.data().uid === user.uid) {
          transaction.delete(previousAliasRef);
        }
      }

      transaction.set(userRef, next, { merge: true });
      transaction.set(aliasRef, { uid: user.uid, alias: aliasCheck.alias, updatedAt: Date.now() }, { merge: true });
    });
  } catch (error) {
    // Backward-compatible fallback for projects where the new /aliases rules have not been deployed yet.
    // It still saves the passport safely on the user's own document, then the alias index can be created
    // automatically after deploying firestore.rules.
    if (!isPermissionError(error)) throw error;
    try {
      await setDoc(doc(db, 'users', user.uid), next, { merge: true });
    } catch {
      throw new Error('Firestore rules need to be deployed. Run: firebase deploy --only firestore:rules');
    }
  }

  return next;
}

export async function refreshUserGrowthStage(uid: string, approvedActions: number, impactCredits: number) {
  const growthStage = calculateGrowthStage(approvedActions, impactCredits);
  if (!isFirebaseConfigured) return growthStage;
  await updateDoc(doc(db, 'users', uid), { growthStage });
  return growthStage;
}
