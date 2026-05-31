# Firebase Schema

## users/{uid}

```ts
{
  uid: string;
  displayName: string;
  email: string;
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
  avatarUrl?: string;
  impactScore: number;
  approvedActions: number;
  status: 'active' | 'suspended';
  createdAt: number;
  lastLogin: number;
}
```

## impact_records/{id}

```ts
{
  userId: string;
  userDisplayName: string;
  title: string;
  category: string;
  details: string;
  occurredAt: string;
  countryCode: string;
  city: string;
  visibility: 'private' | 'anonymous_public' | 'public_profile';
  status: 'pending' | 'approved' | 'rejected';
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
```

## audit_logs/{id}

```ts
{
  actorId: string;
  actorEmail?: string;
  action: string;
  targetType: 'impact_record' | 'user' | 'settings' | 'auth';
  targetId: string;
  message: string;
  createdAt: number;
}
```

## settings/public

```ts
{
  reviewRequiredByDefault: boolean;
  publicFeedEnabled: boolean;
  maxDailyRecordsPerUser: number;
  sensitiveDataWarningEnabled: boolean;
  updatedAt: number;
  updatedBy?: string;
}
```

## Admin Bootstrap Note

For real Firebase mode, the first admin must be bootstrapped manually after signup:

1. Create a normal account from the app.
2. Open Firestore > `users/{uid}`.
3. Change `role` from `user` to `super_admin` or `admin`.
4. Reload the app.

Demo mode automatically grants admin rights to emails containing `admin`.


## V1.5.1 Passport Fields

Additional user fields used by Impact Passport:

```ts
{
  alias?: string;
  aliasNormalized?: string;
  avatarId?: 'seed' | 'leaf' | 'tree' | 'oasis' | 'bridge' | 'hands' | 'heart' | 'book' | 'water' | 'shield';
  realNameVisible?: boolean;
  impactPassportEnabled?: boolean;
  hideContributionCategories?: boolean;
  growthStage?: 'seed' | 'sprout' | 'plant' | 'tree' | 'forest' | 'oasis';
  impactCredits?: number;
  trustScore?: number;
  updatedAt?: number;
}
```

## aliases/{alias}

```ts
{
  uid: string;
  alias: string;
  updatedAt: number;
}
```

Alias documents are used as a lightweight alias registry. The application also checks existing `users.aliasNormalized` values for compatibility with older users.
