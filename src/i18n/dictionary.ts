import type { Language } from '../types';

export const translations = {
  en: {
    home: 'Home', impact: 'Impact', actions: 'Actions', rules: 'Rules', about: 'About', login: 'Login', signup: 'Sign up', profile: 'Profile', dashboard: 'Dashboard', admin: 'Admin', logout: 'Logout',
    tagline: 'Make Good Visible', arTagline: 'Small Actions. Lasting Impact.', heroText: 'A privacy-first platform for recording, reviewing, and growing positive community impact safely.',
    recordImpact: 'Record Impact', exploreCommunity: 'Explore Community', howItWorks: 'How it works', record: 'Record', review: 'Review', visibleImpact: 'Impact',
    pending: 'Pending', approved: 'Approved', rejected: 'Rejected', private: 'Private', anonymous: 'Anonymous public', publicProfile: 'Public profile', submit: 'Submit', save: 'Save', approve: 'Approve', reject: 'Reject'
  },
  ar: {
    home: 'الرئيسية', impact: 'الأثر', actions: 'المجالات', rules: 'القواعد', about: 'عن المشروع', login: 'دخول', signup: 'تسجيل', profile: 'الملف', dashboard: 'لوحة المستخدم', admin: 'الإدارة', logout: 'خروج',
    tagline: 'خلّي الخير ظاهر', arTagline: 'كل فعل خير يصنع أثرًا', heroText: 'منصة خصوصية-أولًا لتسجيل ومراجعة وتعزيز الأثر المجتمعي بأمان.',
    recordImpact: 'سجّل أثرًا', exploreCommunity: 'استكشف المجتمع', howItWorks: 'كيف يعمل', record: 'تسجيل', review: 'مراجعة', visibleImpact: 'أثر',
    pending: 'قيد المراجعة', approved: 'معتمد', rejected: 'مرفوض', private: 'خاص', anonymous: 'عام بدون اسم', publicProfile: 'عام باسم المستخدم', submit: 'إرسال', save: 'حفظ', approve: 'موافقة', reject: 'رفض'
  }
} as const satisfies Record<Language, Record<string, string>>;
