export type Language = 'en' | 'ar';
export type UserRole = 'user' | 'moderator' | 'admin' | 'super_admin';
export type ImpactStatus = 'pending' | 'approved' | 'rejected';
export type Visibility = 'private' | 'anonymous_public' | 'public_profile';
export type ImpactCategory = 'community_service' | 'blood_donation' | 'visiting_patients' | 'helping_seniors' | 'mental_support' | 'anti_bullying' | 'environment' | 'education' | 'volunteer_work' | 'emergency_help';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  impactScore: number;
  approvedActions: number;
  createdAt: number;
  lastLogin: number;
  status: 'active' | 'suspended';
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
  auditRequired: boolean;
  auditStatus: 'not_required' | 'queued' | 'reviewed';
  auditNote?: string;
  groupingKey: string;
  groupWindow: 'daily' | 'weekly' | 'monthly';
  createdAt: number;
  reviewedAt?: number;
  reviewedBy?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  targetType: 'impact_record' | 'user' | 'settings';
  targetId: string;
  message: string;
  createdAt: number;
}
