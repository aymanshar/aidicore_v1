import { HeartHandshake, Droplets, Hospital, HandHeart, Brain, ShieldAlert, Leaf, BookOpen, Users, Siren, Utensils, Accessibility, PawPrint, Home } from 'lucide-react';
import type { ImpactCategory } from '../types';
export const categories: { id: ImpactCategory; en: string; ar: string; fr: string; icon: typeof HeartHandshake; color: string }[] = [
  { id: 'community_service', en: 'Community Service', ar: 'خدمة مجتمعية', fr: 'Service communautaire', icon: HeartHandshake, color: 'from-blue-500 to-cyan-400' },
  { id: 'blood_donation', en: 'Blood Donation', ar: 'الاستعداد للتبرع بالدم', fr: 'Don du sang', icon: Droplets, color: 'from-red-500 to-rose-400' },
  { id: 'visiting_patients', en: 'Visiting Patients', ar: 'زيارة المرضى', fr: 'Visite aux patients', icon: Hospital, color: 'from-emerald-500 to-teal-400' },
  { id: 'helping_seniors', en: 'Helping Seniors', ar: 'مساعدة كبار السن', fr: 'Aide aux personnes âgées', icon: HandHeart, color: 'from-amber-500 to-yellow-400' },
  { id: 'mental_support', en: 'Mental Support', ar: 'دعم نفسي', fr: 'Soutien moral', icon: Brain, color: 'from-purple-500 to-indigo-400' },
  { id: 'anti_bullying', en: 'Anti-Bullying', ar: 'مكافحة التنمر', fr: 'Lutte contre le harcèlement', icon: ShieldAlert, color: 'from-sky-500 to-blue-400' },
  { id: 'environment', en: 'Environment', ar: 'البيئة', fr: 'Environnement', icon: Leaf, color: 'from-green-500 to-lime-400' },
  { id: 'education', en: 'Education Support', ar: 'دعم التعليم', fr: 'Soutien éducatif', icon: BookOpen, color: 'from-orange-500 to-amber-400' },
  { id: 'volunteer_work', en: 'Volunteer Work', ar: 'تطوع', fr: 'Bénévolat', icon: Users, color: 'from-fuchsia-500 to-pink-400' },
  { id: 'emergency_help', en: 'Emergency Assistance', ar: 'مساعدة طارئة', fr: 'Aide d’urgence', icon: Siren, color: 'from-red-600 to-orange-400' },
  { id: 'food_support', en: 'Food Support', ar: 'دعم غذائي', fr: 'Aide alimentaire', icon: Utensils, color: 'from-lime-500 to-emerald-400' },
  { id: 'disability_support', en: 'Disability Support', ar: 'دعم أصحاب الهمم', fr: 'Soutien au handicap', icon: Accessibility, color: 'from-indigo-500 to-violet-400' },
  { id: 'animal_welfare', en: 'Animal Welfare', ar: 'رعاية الحيوانات', fr: 'Bien-être animal', icon: PawPrint, color: 'from-teal-500 to-cyan-400' },
  { id: 'family_support', en: 'Family Support', ar: 'دعم الأسر', fr: 'Soutien familial', icon: Home, color: 'from-pink-500 to-rose-400' },
];
