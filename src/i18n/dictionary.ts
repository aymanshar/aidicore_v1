import type { Language } from '../types';

export const translations = {
  en: {
    home: 'Home', impact: 'Impact', actions: 'Categories', rules: 'Rules', about: 'About', login: 'Login', signup: 'Sign up', profile: 'Impact Passport', dashboard: 'Dashboard', admin: 'Admin', logout: 'Logout',
    tagline: 'Make Good Visible', arTagline: 'Small Actions. Lasting Impact.', heroText: 'A privacy-first platform for recording, reviewing, and growing community impact safely.',
    recordImpact: 'Record', exploreCommunity: 'Explore Community', howItWorks: 'How it works', record: 'Record', review: 'Review', visibleImpact: 'Impact',
    pending: 'Pending', approved: 'Approved', rejected: 'Rejected', private: 'Private', anonymous: 'Anonymous public', publicProfile: 'Public attribution', submit: 'Submit', save: 'Save', approve: 'Approve', reject: 'Reject'
  },
  ar: {
    home: 'الرئيسية', impact: 'الأثر', actions: 'المجالات', rules: 'القواعد', about: 'عن المنصة', login: 'دخول', signup: 'تسجيل', profile: 'جواز الأثر', dashboard: 'لوحتي', admin: 'الإدارة', logout: 'خروج',
    tagline: 'خلّي الخير ظاهر', arTagline: 'كل فعل خير يصنع أثرًا', heroText: 'منصة خصوصية-أولًا لتسجيل ومراجعة وتعزيز الأثر المجتمعي بأمان.',
    recordImpact: 'سجّل أثرًا', exploreCommunity: 'استكشف المجتمع', howItWorks: 'كيف يعمل', record: 'تسجيل', review: 'مراجعة', visibleImpact: 'أثر',
    pending: 'قيد المراجعة', approved: 'معتمد', rejected: 'مرفوض', private: 'خاص', anonymous: 'عام بدون اسم', publicProfile: 'عام باسم المستخدم', submit: 'إرسال', save: 'حفظ', approve: 'موافقة', reject: 'رفض'
  },
  fr: {
    home: 'Accueil', impact: 'Impact', actions: 'Domaines', rules: 'Règles', about: 'À propos', login: 'Connexion', signup: 'Créer un compte', profile: 'Passeport d’impact', dashboard: 'Dashboard', admin: 'Administration', logout: 'Déconnexion',
    tagline: 'Rendre le bien visible', arTagline: 'Petites actions. Impact durable.', heroText: 'Une plateforme axée sur la confidentialité pour enregistrer, examiner et développer l’impact communautaire en toute sécurité.',
    recordImpact: 'Enregistrer', exploreCommunity: 'Explorer la communauté', howItWorks: 'Comment ça marche', record: 'Enregistrer', review: 'Examiner', visibleImpact: 'Impact',
    pending: 'En attente', approved: 'Approuvé', rejected: 'Rejeté', private: 'Privé', anonymous: 'Public anonyme', publicProfile: 'Attribution publique', submit: 'Envoyer', save: 'Enregistrer', approve: 'Approuver', reject: 'Rejeter'
  }
} as const satisfies Record<Language, Record<string, string>>;
