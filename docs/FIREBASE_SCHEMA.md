# Firebase Schema

## users/{uid}

```ts
{
  uid: string;
  displayName: string;
  email: string;
  role: 'user' | 'moderator' | 'admin' | 'super_admin';
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
  groupWindow: 'daily';
  createdAt: number;
}
```

## audit_logs/{id}

```ts
{
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  message: string;
  createdAt: number;
}
```
