export type Language = 'en' | 'ar' | 'fr';
export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin';
export type UserStatus = 'active' | 'suspended';
export type VerificationStatus = 'pending' | 'confirmed' | 'rejected' | 'expired' | 'flagged';
export type GrowthStage = 'seed' | 'sprout' | 'plant' | 'tree' | 'forest' | 'oasis';
export type ImpactStatus = 'pending' | 'approved' | 'rejected';
export type Visibility = 'private' | 'anonymous_public' | 'public_profile';
export type ImpactCategory = 'community_service' | 'blood_donation' | 'visiting_patients' | 'helping_seniors' | 'mental_support' | 'anti_bullying' | 'environment' | 'education' | 'volunteer_work' | 'emergency_help' | 'food_support' | 'disability_support' | 'animal_welfare' | 'family_support';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  avatarId?: string;
  impactScore: number;
  impactCredits?: number;
  trustScore?: number;
  trustRiskScore?: number;
  verificationPenalty?: number;
  riskFlags?: string[];
  approvedActions: number;
  alias?: string;
  aliasNormalized?: string;
  realNameVisible?: boolean;
  impactPassportEnabled?: boolean;
  hideContributionCategories?: boolean;
  growthStage?: GrowthStage;
  createdAt: number;
  lastLogin: number;
  status: UserStatus;
  emailVerified?: boolean;
  provider?: 'password' | 'google' | 'demo';
}


export interface ImpactRecord {
  id: string;
  userId: string;
  userDisplayName: string;
  title: string;
  category: ImpactCategory;
  details: string;
  occurredAt: string;
  countryCode: string;
  city: string;
  visibility: Visibility;
  status: ImpactStatus;
  fraudScore: number;
  impactCredits: number;
  duplicateLevel: number;
  confidenceScore: number;
  auditRequired: boolean;
  auditStatus: 'not_required' | 'queued' | 'reviewed';
  auditNote?: string;
  groupingKey: string;
  groupWindow: 'daily' | 'weekly' | 'monthly';
  createdAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
  verificationCount?: number;
  verificationWeight?: number;
  verificationRiskFlags?: string[];
}

export interface ImpactVerification {
  id: string;
  impactId: string;
  impactOwnerId: string;
  verifierId?: string;
  verifierEmail?: string;
  tokenHash: string;
  status: VerificationStatus;
  weight: number;
  penalty: number;
  riskFlags: string[];
  createdAt: number;
  expiresAt: number;
  confirmedAt?: number;
  createdBy: string;
}


export interface CommunityImpactStats {
  totalRecords: number;
  approvedRecords: number;
  pendingRecords: number;
  citiesCount: number;
  categoriesCount: number;
  publicRecords: number;
  safeReviewRate: number;
  totalImpactCredits: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'impact_submitted' | 'impact_approved' | 'impact_rejected' | 'system';
  read: boolean;
  createdAt: number;
}

export type AuditAction =
  | 'auth_signup'
  | 'auth_login'
  | 'create_impact'
  | 'approve_impact'
  | 'reject_impact'
  | 'update_profile'
  | 'update_user_role'
  | 'update_user_status'
  | 'update_settings'
  | 'delete_user_profile'
  | 'delete_impact_record'
  | 'update_impact_status'
  | 'create_verification_link'
  | 'confirm_impact_verification'
  | 'reject_impact_verification'
  | 'flag_verification_risk';

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail?: string;
  action: AuditAction | string;
  targetType: 'impact_record' | 'user' | 'settings' | 'auth';
  targetId: string;
  message: string;
  createdAt: number;
}

export interface AppSettings {
  id: 'public';
  reviewRequiredByDefault: boolean;
  publicFeedEnabled: boolean;
  maxDailyRecordsPerUser: number;
  sensitiveDataWarningEnabled: boolean;
  updatedAt: number;
  updatedBy?: string;
}
