import { HeartHandshake, Droplets, Hospital, HandHeart, Brain, ShieldAlert, Leaf, BookOpen, Users, Siren } from 'lucide-react';
import type { ImpactCategory } from '../types';
export const categories: { id: ImpactCategory; en: string; ar: string; icon: typeof HeartHandshake; color: string }[] = [
  { id: 'community_service', en: 'Community Service', ar: 'خدمة مجتمعية', icon: HeartHandshake, color: 'from-blue-500 to-cyan-400' },
  { id: 'blood_donation', en: 'Blood Donation', ar: 'الاستعداد للتبرع بالدم', icon: Droplets, color: 'from-red-500 to-rose-400' },
  { id: 'visiting_patients', en: 'Visiting Patients', ar: 'زيارة المرضى', icon: Hospital, color: 'from-emerald-500 to-teal-400' },
  { id: 'helping_seniors', en: 'Helping Seniors', ar: 'مساعدة كبار السن', icon: HandHeart, color: 'from-amber-500 to-yellow-400' },
  { id: 'mental_support', en: 'Mental Support', ar: 'دعم نفسي', icon: Brain, color: 'from-purple-500 to-indigo-400' },
  { id: 'anti_bullying', en: 'Anti-Bullying', ar: 'مكافحة التنمر', icon: ShieldAlert, color: 'from-sky-500 to-blue-400' },
  { id: 'environment', en: 'Environment', ar: 'البيئة', icon: Leaf, color: 'from-green-500 to-lime-400' },
  { id: 'education', en: 'Education Support', ar: 'دعم التعليم', icon: BookOpen, color: 'from-orange-500 to-amber-400' },
  { id: 'volunteer_work', en: 'Volunteer Work', ar: 'تطوع', icon: Users, color: 'from-fuchsia-500 to-pink-400' },
  { id: 'emergency_help', en: 'Emergency Assistance', ar: 'مساعدة طارئة', icon: Siren, color: 'from-red-600 to-orange-400' },
];
