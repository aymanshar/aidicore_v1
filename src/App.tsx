import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  EyeOff,
  HeartHandshake,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  UsersRound,
  ScrollText,
  Settings2,
  ShieldAlert,
  UserCog,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Layout } from './components/Layout';
import { categories } from './data/categories';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { login, loginWithGoogle, resetPassword, signup, updateCurrentUserProfile } from './services/authService';
import {
  createImpactRecord,
  listAllImpactRecords,
  listMyImpactRecords,
  listPendingImpactRecords,
  listPublicImpactRecords,
  reviewImpactRecord,
  updateImpactRecordStatus,
  deleteImpactRecord,
  getCommunityImpactStats,
} from './services/impactService';
import { listAuditLogs } from './services/auditService';
import { getSettings, saveSettings } from './services/settingsService';
import { deleteUserProfile, listUsers, updateUserRole, updateUserStatus } from './services/userService';
import { confirmVerificationLink, createVerificationLink, listVerificationLinks } from './services/verificationService';
import { AVATARS, calculateGrowthStage, getAvatar, getSafeDisplayName, isAliasAvailable, normalizeAlias, suggestAliases, validateAlias } from './services/passportService';
import type { AppSettings, AppUser, AuditLog, CommunityImpactStats, ImpactCategory, ImpactRecord, ImpactStatus, ImpactVerification, UserRole, UserStatus, Visibility } from './types';

export type Page =
  | 'home'
  | 'about'
  | 'actions'
  | 'rules'
  | 'impact'
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'record'
  | 'profile'
  | 'admin'
  | 'verify'
  | 'privacy'
  | 'terms'
  | 'contact';

const fade = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

function Shell() {
  const [page, setPage] = useState<Page>(() => new URLSearchParams(window.location.search).has('verify') ? 'verify' : 'home');
  return (
    <Layout page={page} setPage={setPage}>
      <Router page={page} setPage={setPage} />
    </Layout>
  );
}

function Router({ page, setPage }: { page: Page; setPage: (page: Page) => void }) {
  if (page === 'home') return <Home setPage={setPage} />;
  if (page === 'actions') return <Actions setPage={setPage} />;
  if (page === 'impact') return <Impact />;
  if (page === 'rules') return <Rules />;
  if (page === 'about') return <About />;
  if (page === 'login') return <AuthScreen mode="login" setPage={setPage} />;
  if (page === 'signup') return <AuthScreen mode="signup" setPage={setPage} />;
  if (page === 'dashboard') return <Dashboard setPage={setPage} />;
  if (page === 'record') return <RecordImpact setPage={setPage} />;
  if (page === 'profile') return <Profile setPage={setPage} />;
  if (page === 'admin') return <Admin />;
  if (page === 'verify') return <VerifyImpact />;
  return <SimplePage page={page} />;
}

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-4 py-16 ${className}`}>{children}</section>;
}

function copy(lang: 'ar' | 'en' | 'fr', ar: string, en: string, fr: string) {
  return lang === 'ar' ? ar : lang === 'fr' ? fr : en;
}

function categoryLabel(category: { ar: string; en: string; fr?: string }, lang: 'ar' | 'en' | 'fr') {
  return lang === 'ar' ? category.ar : lang === 'fr' ? (category.fr || category.en) : category.en;
}

function Home({ setPage }: { setPage: (p: Page) => void }) {
  const { t, lang } = useLanguage();
  const featuredCategories = categories.slice(0, 6);
  const [stats, setStats] = useState<CommunityImpactStats | null>(null);

  useEffect(() => {
    let mounted = true;
    getCommunityImpactStats()
      .then((items) => mounted && setStats(items))
      .catch(() => mounted && setStats(null));
    return () => { mounted = false; };
  }, []);

  const safeReviewText = stats ? `${stats.safeReviewRate}%` : '—';

  return (
    <>
      <Section className="py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <motion.div {...fade}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-200 shadow-[0_0_40px_rgba(16,185,129,.12)]">
              <Sparkles size={16} />
              {copy(lang, 'منصة أثر مجتمعي خصوصية-أولًا', 'Privacy-first community impact', 'Impact communautaire respectueux de la vie privée')}
            </div>
            <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white md:text-7xl">
              {t('tagline')}.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">{t('heroText')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={() => setPage('record')}>
                {t('recordImpact')}
                <ArrowRight size={18} />
              </button>
              <button className="btn-soft" onClick={() => setPage('impact')}>
                {t('exploreCommunity')}
              </button>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              <TrustPill icon={<LockKeyhole size={16} />} label={copy(lang, 'خصوصية افتراضية', 'Privacy by default', 'Confidentialité par défaut')} />
              <TrustPill icon={<ShieldCheck size={16} />} label={copy(lang, 'مراجعة قبل الاعتماد', 'Reviewed before approval', 'Examen avant approbation')} />
              <TrustPill icon={<EyeOff size={16} />} label={copy(lang, 'بدون تفاخر أو ترتيب', 'No leaderboard', 'Sans classement')} />
            </div>
          </motion.div>

          <motion.div {...fade} className="glass overflow-hidden rounded-[2rem] p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-emerald-300">AidiCore Impact Pulse</p>
                <h2 className="mt-1 text-2xl font-extrabold text-white">
                  {copy(lang, 'مؤشر الأثر الآمن', 'Safe Impact Snapshot', 'Indicateur d’impact sécurisé')}
                </h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-emerald-300">
                <HeartHandshake />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric title={copy(lang, 'أثر مسجل', 'Actions Recorded', 'Actions enregistrées')} value={stats ? String(stats.totalRecords) : '—'} />
              <Metric title={copy(lang, 'مدينة', 'Cities', 'Villes')} value={stats ? String(stats.citiesCount) : '—'} />
              <Metric title={copy(lang, 'مجالات خدمة', 'Categories', 'Domaines')} value={stats ? String(stats.categoriesCount) : '—'} />
              <Metric title={copy(lang, 'مراجعة آمنة', 'Safe Review', 'Examen sécurisé')} value={safeReviewText} />
            </div>
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">{copy(lang, 'حالة المجتمع الآن', 'Current community status', 'État actuel de la communauté')}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {stats && stats.approvedRecords > 0
                  ? copy(lang, `${stats.approvedRecords} أثر معتمد حتى الآن بدون كشف بيانات شخصية.`, `${stats.approvedRecords} approved impact records so far without exposing personal details.`, `${stats.approvedRecords} contributions approuvées jusqu’à présent sans exposer de données personnelles.`)
                  : copy(lang, 'لا توجد آثار معتمدة بعد. ستظهر البيانات الحية هنا بعد المراجعة.', 'No approved impact records yet. Live data will appear here after review.', 'Aucun impact approuvé pour le moment. Les données réelles apparaîtront ici après examen.')}
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section className="pt-4">
        <Title
          title={copy(lang, 'مجالات الأثر', 'Impact Categories', 'Domaines d’impact')}
          text={
            lang === 'ar'
              ? 'اختر المجال الأقرب للأثر الذي ترغب في تسجيله. تساعد هذه المجالات على توثيق المبادرات المجتمعية بطريقة مبسطة وآمنة.'
              : lang === 'fr' ? 'Choisissez le domaine le plus proche de l’impact que vous souhaitez enregistrer. Ces domaines simplifient la contribution tout en protégeant la confidentialité.'
              : 'Choose the closest category for the impact you want to record. Guided categories make contribution faster and reduce unnecessary sensitive details.'
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <button key={category.id} onClick={() => setPage('actions')} className="card group p-6 text-start transition hover:-translate-y-1 hover:border-emerald-300/35">
                <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${category.color} p-3 text-white shadow-lg`}>
                  <Icon />
                </div>
                <h3 className="text-xl font-bold text-white">{categoryLabel(category, lang)}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {copy(lang, 'سجل أثرًا مختصرًا وآمنًا ضمن مجال واضح.', 'Record safe, concise impact under a clear category.', 'Enregistrez un impact clair, court et sûr dans un domaine précis.')}
                </p>
              </button>
            );
          })}
        </div>
      </Section>

      <Section>
        <Title
          title={lang === 'ar' ? 'كيف يعمل؟' : 'How it works'}
          text={copy(lang, 'ثلاث خطوات بسيطة تحافظ على الثقة والخصوصية.', 'Three simple steps designed around trust and privacy.', 'Trois étapes simples conçues autour de la confiance et de la confidentialité.')}
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Step icon={<UserRoundCheck />} title={t('record')} text={copy(lang, 'المستخدم يسجل أثرًا إيجابيًا مع سياق آمن على مستوى المدينة.', 'Submit a positive action with safe city-level context.', 'Enregistrez une action positive avec un contexte limité à la ville.')} />
          <Step icon={<ShieldCheck />} title={t('review')} text={copy(lang, 'السجلات الحساسة أو المشكوك فيها تدخل مراجعة الإدارة.', 'Moderators review sensitive or suspicious records.', 'Les enregistrements sensibles ou douteux sont examinés par l’équipe.')} />
          <Step icon={<CheckCircle2 />} title={t('visibleImpact')} text={copy(lang, 'الأثر المعتمد يرفع مؤشر الأثر والثقة ببطء وبدون مبالغة.', 'Approved actions gradually increase impact and trust indicators.', 'Les actions approuvées renforcent progressivement les indicateurs d’impact et de confiance.')} />
        </div>
      </Section>
    </>
  );
}

function TrustPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-semibold text-slate-300">
      <span className="inline-flex items-center gap-2 text-emerald-200">{icon}{label}</span>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  const longValue = value.length > 8;
  return (
    <div className="card p-5">
      <div className={`${longValue ? 'text-xl leading-tight' : 'text-3xl'} font-extrabold text-white`}>{value}</div>
      <div className="mt-1 text-sm text-slate-400">{title}</div>
    </div>
  );
}

function Step({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="card p-6">
      <div className="mb-4 inline-flex rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">{icon}</div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 leading-7 text-slate-400">{text}</p>
    </div>
  );
}

function Title({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-extrabold text-white md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl leading-7 text-slate-400">{text}</p>
    </div>
  );
}

function Actions({ setPage }: { setPage: (p: Page) => void }) {
  const { lang } = useLanguage();
  return (
    <Section>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <Title
          title={copy(lang, 'مجالات الأثر', 'Impact Categories', 'Domaines d’impact')}
          text={copy(lang, 'اختر المجال الأقرب للأثر الذي ترغب في تسجيله. تساعد هذه المجالات على توثيق المبادرات المجتمعية بطريقة مبسطة وآمنة.', 'Choose the closest category for the impact you want to record. Guided categories help users record safer, clearer contributions.', 'Choisissez le domaine le plus proche de l’impact à enregistrer. Les catégories guidées rendent la contribution plus claire et plus sûre.')}
        />
        <button className="btn-primary w-fit" onClick={() => setPage('record')}>{copy(lang, 'سجّل أثرًا', 'Record Impact', 'Enregistrer un impact')}</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id} className="card p-6">
              <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${category.color} p-3 text-white`}>
                <Icon />
              </div>
              <h3 className="text-xl font-bold">{categoryLabel(category, lang)}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {copy(lang, 'سجل أثرًا مختصرًا وآمنًا ضمن مجال واضح.', 'Record concise, safe impact under a clear category.', 'Enregistrez un impact court et sûr dans un domaine clair.')}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function Impact() {
  const { lang } = useLanguage();
  const [stats, setStats] = useState<CommunityImpactStats | null>(null);

  useEffect(() => {
    let mounted = true;
    getCommunityImpactStats()
      .then((items) => mounted && setStats(items))
      .catch(() => mounted && setStats(null));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Section>
      <Title
        title={lang === 'ar' ? 'الأثر المجتمعي' : 'Community Impact'}
        text={copy(lang, 'تعرض هذه الصفحة ملخصًا عامًا للآثار المعتمدة داخل المنصة مع الحفاظ على الخصوصية وعدم إظهار بيانات شخصية.', 'This page shows a privacy-safe summary of approved impact records without exposing personal information.', 'Cette page présente un résumé anonyme des impacts approuvés sans exposer d’informations personnelles.')}
      />

      <div className="mb-8 grid gap-4 md:grid-cols-5">
        <Metric title={lang === 'ar' ? 'إجمالي السجلات' : 'Total records'} value={stats ? String(stats.totalRecords) : '…'} />
        <Metric title={copy(lang, 'معتمد', 'Approved', 'Approuvé')} value={stats ? String(stats.approvedRecords) : '…'} />
        <Metric title={lang === 'ar' ? 'قيد المراجعة' : 'Pending'} value={stats ? String(stats.pendingRecords) : '…'} />
        <Metric title={lang === 'ar' ? 'مدن' : 'Cities'} value={stats ? String(stats.citiesCount) : '…'} />
        <Metric title={copy(lang, 'مؤشر الأثر', 'Impact Index', 'Indice d’impact')} value={stats ? String(stats.totalImpactCredits) : '…'} />
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Step icon={<HeartHandshake />} title={copy(lang, 'مجهول افتراضيًا', 'Anonymous by default', 'Anonyme par défaut')} text={copy(lang, 'لا يظهر اسم المستخدم إلا إذا اختار ذلك بنفسه.', 'Names are only shown when the user chooses public attribution.', 'Le nom n’apparaît que si l’utilisateur le choisit.')} />
        <Step icon={<ClipboardCheck />} title={copy(lang, 'اعتماد قبل الظهور', 'Reviewed before visibility', 'Examen avant publication')} text={copy(lang, 'لا يظهر الأثر كمعتمد قبل المراجعة.', 'Impact is not treated as approved before review.', 'Un impact n’est pas considéré comme approuvé avant examen.')} />
        <Step icon={<Layers3 />} title={copy(lang, 'أثر لا منافسة', 'Impact, not competition', 'Impact, pas compétition')} text={copy(lang, 'لا توجد قوائم ترتيب أو ضغط اجتماعي.', 'No leaderboards or unhealthy social pressure.', 'Pas de classement ni de pression sociale.')} />
      </div>
      <PublicFeed />
    </Section>
  );
}

function PublicFeed() {
  const [records, setRecords] = useState<ImpactRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    let mounted = true;
    listPublicImpactRecords()
      .then((items) => mounted && setRecords(items))
      .catch(() => mounted && setRecords([]))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="card p-6 text-slate-300">{copy(lang, 'جارٍ تحميل الأثر العام...', 'Loading public impact...', 'Chargement de l’impact public...')}</div>;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-extrabold text-white">{copy(lang, 'أثر عام معتمد', 'Approved public impact', 'Impact public approuvé')}</h3>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-200">
          {records.length} {copy(lang, 'سجل', 'records', 'enregistrements')}
        </span>
      </div>
      {records.length === 0 ? (
        <div className="card p-6 text-slate-300">
          {copy(lang, 'لا توجد سجلات عامة معتمدة بعد. بعد مراجعة الإدارة ستظهر السجلات العامة هنا.', 'No approved public records yet. After admin review, public records will appear here.', 'Aucun impact public approuvé pour le moment. Les contributions apparaîtront ici après examen.')}
        </div>
      ) : (
        records.map((record) => <ImpactCard key={record.id} record={record} />)
      )}
    </div>
  );
}

function ImpactCard({ record }: { record: ImpactRecord }) {
  const { lang } = useLanguage();
  const actor = record.visibility === 'public_profile' ? record.userDisplayName : copy(lang, 'شخص ما', 'Someone', 'Quelqu’un');
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-white">{record.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{record.city}, {record.countryCode} · {actor}</p>
        </div>
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">{copy(lang, 'معتمد', 'Approved', 'Approuvé')}</span>
      </div>
    </div>
  );
}

function Rules() {
  const { lang } = useLanguage();
  const rules = [
    copy(lang, 'احمِ خصوصيتك وخصوصية الآخرين بعدم مشاركة أي معلومات شخصية أو بيانات تعريفية.', 'Protect your privacy and others by not sharing personal or identifying information.', 'Protégez votre vie privée et celle des autres en évitant toute information personnelle ou identifiable.'),
    copy(lang, 'استخدم وصفًا عامًا للمكان دون ذكر عناوين أو مواقع دقيقة.', 'Use a general location description without precise addresses.', 'Utilisez une description générale du lieu sans adresses précises.'),
    copy(lang, 'تمر السجلات بمرحلة مراجعة قبل ظهورها ضمن الأثر العام.', 'Records go through review before appearing as public impact.', 'Les contributions sont examinées avant d’apparaître publiquement.'),
    copy(lang, 'مؤشرات الأثر رمزية وتعكس الاستمرارية والجودة، وليست وعدًا ماليًا.', 'Impact indicators are symbolic and reflect consistency and quality, not financial value.', 'Les indicateurs d’impact sont symboliques et reflètent la constance et la qualité, sans valeur financière.'),
    copy(lang, 'قد يتم تقييد الحسابات التي تستخدم المنصة بصورة مضللة أو متكررة بشكل غير طبيعي.', 'Accounts that misuse the platform or submit unnatural repeated records may be restricted.', 'Les comptes utilisant la plateforme de façon trompeuse ou répétitive peuvent être limités.'),
  ];
  return (
    <Section>
      <Title
        title={copy(lang, 'قواعد المنصة', 'Platform Rules', 'Règles de la plateforme')}
        text={copy(lang, 'تم تصميم AidiCore لتشجيع الأثر الإيجابي مع الحفاظ على الخصوصية والثقة. تساعد هذه القواعد على توفير بيئة آمنة وعادلة لجميع المستخدمين.', 'AidiCore is designed to encourage positive impact while protecting privacy and trust. These rules help keep the platform safe and fair for everyone.', 'AidiCore encourage l’impact positif tout en protégeant la confidentialité et la confiance. Ces règles maintiennent un espace sûr et équitable.')}
      />
      <div className="grid gap-3">
        {rules.map((rule) => (
          <div className="card flex gap-3 p-5" key={rule}>
            <CheckCircle2 className="shrink-0 text-emerald-300" />
            <span>{rule}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function About() {
  const { lang } = useLanguage();
  return (
    <Section>
      <Title
        title={copy(lang, 'عن AidiCore', 'About AidiCore', 'À propos d’AidiCore')}
        text={copy(lang, 'AidiCore منصة مجتمعية تركز على توثيق الأثر الإيجابي بطريقة تحافظ على الخصوصية وتشجع على الاستمرارية.', 'AidiCore is a privacy-first community impact platform for recording meaningful positive contributions safely.', 'AidiCore est une plateforme communautaire axée sur l’impact positif et la protection de la vie privée.')}
      />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div className="card p-7 text-lg leading-8 text-slate-300">
          {copy(
            lang,
            'يمكن للأفراد تسجيل مساهماتهم المجتمعية أو الإنسانية أو التطوعية دون مشاركة بيانات شخصية حساسة. يتم مراجعة السجلات قبل اعتمادها، مع التركيز على الثقة وجودة المحتوى بدلًا من التفاخر أو المنافسة.',
            'People can record volunteer, social, or humanitarian actions without exposing sensitive personal data. Records are reviewed before approval, with a focus on trust, content quality, and long-term impact rather than competition.',
            'Les utilisateurs peuvent enregistrer des actions bénévoles, sociales ou humanitaires sans exposer de données sensibles. Chaque contribution est examinée avant approbation afin de privilégier la confiance, la qualité et l’impact réel.'
          )}
        </div>
        <div className="card p-7">
          <h3 className="text-xl font-bold text-white">{copy(lang, 'مبادئ المنتج', 'Product principles', 'Principes du produit')}</h3>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <TrustPill icon={<LockKeyhole size={16} />} label={copy(lang, 'خصوصية قبل الانتشار', 'Privacy before visibility', 'Confidentialité avant visibilité')} />
            <TrustPill icon={<ShieldCheck size={16} />} label={copy(lang, 'ثقة قبل التقدير', 'Trust before recognition', 'Confiance avant reconnaissance')} />
            <TrustPill icon={<HeartHandshake size={16} />} label={copy(lang, 'أثر لا تفاخر', 'Impact, not showing off', 'Impact, pas vanité')} />
          </div>
        </div>
      </div>
    </Section>
  );
}

function AuthScreen({ mode, setPage }: { mode: 'login' | 'signup'; setPage: (p: Page) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const { lang } = useLanguage();

  const friendlyError = (err: unknown) => {
    const message = err instanceof Error ? err.message : 'Authentication failed';
    if (message.includes('verify your email')) {
      return lang === 'ar'
        ? 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول. افحص صندوق البريد أو الرسائل غير المرغوب فيها.'
        : message;
    }
    if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password')) {
      return lang === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid email or password.';
    }
    if (message.includes('auth/unauthorized-domain')) {
      return lang === 'ar' ? 'هذا الدومين غير مضاف في Firebase Authentication. أضف aidicore.com و www.aidicore.com في Authorized Domains.' : lang === 'fr' ? 'Ce domaine n’est pas autorisé dans Firebase Authentication. Ajoutez aidicore.com et www.aidicore.com aux domaines autorisés.' : 'This domain is not authorized in Firebase Authentication. Add aidicore.com and www.aidicore.com to Authorized Domains.';
    }
    if (message.includes('auth/email-already-in-use')) {
      return lang === 'ar' ? 'هذا البريد مسجل بالفعل.' : 'This email is already registered.';
    }
    if (message.includes('auth/weak-password')) {
      return lang === 'ar' ? 'كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل.' : 'Password is too weak. Use at least 6 characters.';
    }
    return message;
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        setPage('dashboard');
      } else {
        await signup(email, password, name || email.split('@')[0]);
        setNotice(
          lang === 'ar'
            ? 'تم إنشاء الحساب. أرسلنا رسالة تأكيد إلى بريدك الإلكتروني. أكّد البريد ثم سجل الدخول.'
            : 'Account created. We sent a verification email. Verify your email, then sign in.',
        );
        setPassword('');
      }
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const googleLogin = async () => {
    setError('');
    setNotice('');
    setGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      setPage('dashboard');
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const forgotPassword = async () => {
    setError('');
    setNotice('');
    if (!email) {
      setError(lang === 'ar' ? 'اكتب البريد الإلكتروني أولًا.' : 'Enter your email first.');
      return;
    }
    try {
      await resetPassword(email);
      setNotice(lang === 'ar' ? 'تم إرسال رابط إعادة تعيين كلمة المرور إذا كان البريد مسجلًا.' : 'If this email is registered, a password reset link has been sent.');
    } catch (err) {
      setError(friendlyError(err));
    }
  };

  return (
    <Section className="max-w-xl">
      <div className="glass rounded-[2rem] p-8">
        <h1 className="text-3xl font-extrabold">{mode === 'login' ? (lang === 'ar' ? 'تسجيل الدخول' : 'Login') : (lang === 'ar' ? 'حساب جديد' : 'Create account')}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {mode === 'login'
            ? lang === 'ar'
              ? 'سجّل الدخول بأمان عبر Google أو بريدك الإلكتروني المؤكّد.'
              : 'Sign in securely with Google or your verified email.'
            : lang === 'ar'
              ? 'استخدم Google أو أنشئ حسابًا بالبريد الإلكتروني. يجب تأكيد البريد قبل الدخول.'
              : 'Use Google or create an email account. Email accounts must be verified before access.'}
        </p>

        <div className="mt-6 grid gap-4">
          <button type="button" className="btn-soft justify-center bg-white text-slate-950 hover:bg-slate-100" disabled={googleSubmitting || submitting} onClick={googleLogin}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-lg font-extrabold text-blue-600">G</span>
            {googleSubmitting ? (lang === 'ar' ? 'جارٍ فتح Google...' : 'Opening Google...') : (lang === 'ar' ? 'المتابعة باستخدام Google' : 'Continue with Google')}
          </button>

          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[.2em] text-slate-500">
            <span className="h-px flex-1 bg-white/10" />
            {lang === 'ar' ? 'أو' : 'or'}
            <span className="h-px flex-1 bg-white/10" />
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          {mode === 'signup' && <input className="input" placeholder={lang === 'ar' ? 'الاسم' : 'Display name'} value={name} onChange={(event) => setName(event.target.value)} />}
          <input className="input" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          {notice && <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}
          <button className="btn-primary justify-center" disabled={submitting || googleSubmitting} type="submit">
            {submitting ? (lang === 'ar' ? 'جارٍ المعالجة...' : 'Processing...') : mode === 'login' ? (lang === 'ar' ? 'تسجيل الدخول' : 'Login') : (lang === 'ar' ? 'إنشاء حساب' : 'Sign up')}
          </button>
          {mode === 'login' && <button type="button" className="text-sm text-slate-400 hover:text-white" onClick={forgotPassword}>{lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}</button>}
          <button type="button" className="text-sm text-slate-400 hover:text-white" onClick={() => setPage(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? (lang === 'ar' ? 'تحتاج حساب؟ أنشئ حسابًا' : 'Need an account? Sign up') : (lang === 'ar' ? 'لديك حساب؟ سجل الدخول' : 'Already have an account? Login')}
          </button>
        </form>
      </div>
    </Section>
  );
}

function Dashboard({ setPage }: { setPage: (p: Page) => void }) {
  const { appUser, firebaseUser } = useAuth();
  const { lang } = useLanguage();
  const [records, setRecords] = useState<ImpactRecord[]>([]);
  const [loading, setLoading] = useState(Boolean(firebaseUser));
  const [verificationMessage, setVerificationMessage] = useState('');
  const [latestVerificationLink, setLatestVerificationLink] = useState('');
  const [creatingVerificationId, setCreatingVerificationId] = useState('');

  useEffect(() => {
    if (!firebaseUser) return;
    let mounted = true;
    listMyImpactRecords(firebaseUser.uid)
      .then((items) => mounted && setRecords(items))
      .catch(() => mounted && setRecords([]))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [firebaseUser]);

  if (!firebaseUser) return <RequireLogin setPage={setPage} />;

  const pending = records.filter((record) => record.status === 'pending').length;
  const approved = records.filter((record) => record.status === 'approved').length;
  const categoriesCount = new Set(records.map((record) => record.category)).size;

  const createMyVerificationLink = async (record: ImpactRecord) => {
    if (!firebaseUser || record.userId !== firebaseUser.uid || record.status === 'rejected') return;
    setCreatingVerificationId(record.id);
    setVerificationMessage('');
    setLatestVerificationLink('');
    try {
      const result = await createVerificationLink(record, firebaseUser.uid, firebaseUser.email || undefined);
      const link = `${window.location.origin}?verify=${result.id}&token=${result.token}`;
      setLatestVerificationLink(link);
      await navigator.clipboard?.writeText(link).catch(() => null);
      setVerificationMessage(copy(lang, 'تم إنشاء رابط التزكية ونسخه. أرسله للشخص الذي ساعدته أو الشاهد. يجب أن يسجل الدخول أو ينشئ حسابًا لتأكيد الفعل، ولا يمكن لصاحب الأثر تأكيد فعله بنفسه.', 'Verification link created and copied. Send it to the person you helped or a witness. They must sign in or create an account to verify, and the impact owner cannot self-verify.', 'Lien de vérification créé et copié. Envoyez-le à la personne aidée ou à un témoin.'));
    } catch (error) {
      setVerificationMessage(error instanceof Error ? error.message : copy(lang, 'تعذر إنشاء رابط التزكية.', 'Could not create verification link.', 'Impossible de créer le lien.'));
    } finally {
      setCreatingVerificationId('');
    }
  };

  return (
    <Section>
      <Title title={copy(lang, 'لوحة الأثر', 'Impact Dashboard', 'Tableau d’impact')} text={`${copy(lang, 'مرحبًا', 'Welcome', 'Bienvenue')}, ${getSafeDisplayName(appUser) || firebaseUser.email}`} />
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title={copy(lang, 'مؤشر الأثر', 'Impact Index', 'Indice d’impact')} value={String(appUser?.impactCredits ?? appUser?.impactScore ?? 0)} />
        <Metric title={copy(lang, 'معتمد', 'Approved', 'Approuvé')} value={loading ? '…' : String(approved)} />
        <Metric title={lang === 'ar' ? 'قيد المراجعة' : 'Pending'} value={loading ? '…' : String(pending)} />
        <Metric title={lang === 'ar' ? 'مجالات' : 'Categories'} value={loading ? '…' : String(categoriesCount)} />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => setPage('record')}>{copy(lang, 'سجّل أثرًا', 'Record Impact', 'Enregistrer un impact')}</button>
        <button className="btn-soft" onClick={() => setPage('profile')}>{copy(lang, 'جواز الأثر', 'Impact Passport', 'Passeport d’impact')}</button>
      </div>
      {(verificationMessage || latestVerificationLink) && (
        <div className="card mt-6 p-5">
          {verificationMessage && <p className="text-sm leading-7 text-emerald-100">{verificationMessage}</p>}
          {latestVerificationLink && (
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center">
              <div dir="ltr" className="flex-1 break-all rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-200">{latestVerificationLink}</div>
              <button className="btn-soft !py-2" onClick={() => navigator.clipboard?.writeText(latestVerificationLink)}>{copy(lang, 'نسخ الرابط', 'Copy link', 'Copier')}</button>
            </div>
          )}
        </div>
      )}
      <MyRecords records={records} loading={loading} creatingVerificationId={creatingVerificationId} onCreateVerificationLink={createMyVerificationLink} />
    </Section>
  );
}

function MyRecords({ records, loading, creatingVerificationId, onCreateVerificationLink }: { records: ImpactRecord[]; loading: boolean; creatingVerificationId: string; onCreateVerificationLink: (record: ImpactRecord) => void }) {
  const { lang } = useLanguage();
  if (loading) return <div className="card mt-8 p-6 text-slate-300">{lang === 'ar' ? 'جارٍ تحميل أثرك...' : 'Loading your impact...'}</div>;
  const statusLabel = (status: ImpactStatus) => status === 'approved'
    ? copy(lang, 'معتمد', 'Approved', 'Approuvé')
    : status === 'rejected'
      ? copy(lang, 'مرفوض', 'Rejected', 'Rejeté')
      : copy(lang, 'قيد المراجعة', 'Pending review', 'En attente');
  return (
    <div className="mt-8 grid gap-3">
      {records.length === 0 ? <div className="card p-6 text-slate-300">{lang === 'ar' ? 'لم تسجل أي أثر بعد.' : 'No impact records yet.'}</div> : records.map((record) => (
        <div key={record.id} className="card p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <h3 className="font-bold text-white">{record.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{record.city}, {record.countryCode} · {categoryLabel(categories.find((item) => item.id === record.category) || categories[0], lang)}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">{statusLabel(record.status)}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300">{copy(lang, 'تزكيات', 'Verifications', 'Vérifications')}: {record.verificationCount || 0}</span>
                {record.verificationRiskFlags?.length ? <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-red-200">{copy(lang, 'تحتاج مراجعة ثقة', 'Trust review needed', 'Contrôle confiance')}</span> : null}
              </div>
            </div>
            <button
              className="btn-soft justify-center !py-2"
              disabled={record.status === 'rejected' || creatingVerificationId === record.id}
              onClick={() => onCreateVerificationLink(record)}
            >
              {creatingVerificationId === record.id
                ? copy(lang, 'جارٍ إنشاء الرابط...', 'Creating link...', 'Création...')
                : copy(lang, 'إرسال رابط تزكية', 'Send verification link', 'Envoyer lien')}
            </button>
          </div>
          <p className="mt-3 text-xs leading-6 text-slate-500">{copy(lang, 'أرسل الرابط لمن ساعدته أو لشاهد حضر الفعل. يمكنه تسجيل الدخول أو إنشاء حساب جديد للتأكيد. التزكية لا تعتمد الأثر وحدها.', 'Send the link to the person you helped or a witness. They can sign in or create a new account to verify. Verification does not approve the record by itself.', 'Envoyez le lien à la personne aidée ou à un témoin.')}</p>
        </div>
      ))}
    </div>
  );
}

function Profile({ setPage }: { setPage: (p: Page) => void }) {
  const { firebaseUser, appUser, refreshUser } = useAuth();
  const { lang } = useLanguage();
  const [displayName, setDisplayName] = useState(appUser?.displayName || firebaseUser?.displayName || '');
  const [alias, setAlias] = useState(appUser?.alias || suggestAliases(appUser?.displayName || firebaseUser?.email)[0] || 'community_seed');
  const [avatarId, setAvatarId] = useState(appUser?.avatarId || 'seed');
  const [realNameVisible, setRealNameVisible] = useState(Boolean(appUser?.realNameVisible));
  const [impactPassportEnabled, setImpactPassportEnabled] = useState(Boolean(appUser?.impactPassportEnabled));
  const [hideContributionCategories, setHideContributionCategories] = useState(Boolean(appUser?.hideContributionCategories));
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState<'success' | 'error' | 'info'>('info');
  const [checkingAlias, setCheckingAlias] = useState(false);
  const [aliasAvailability, setAliasAvailability] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(appUser?.displayName || firebaseUser?.displayName || '');
    setAlias(appUser?.alias || suggestAliases(appUser?.displayName || firebaseUser?.email)[0] || 'community_seed');
    setAvatarId(appUser?.avatarId || 'seed');
    setRealNameVisible(Boolean(appUser?.realNameVisible));
    setImpactPassportEnabled(Boolean(appUser?.impactPassportEnabled));
    setHideContributionCategories(Boolean(appUser?.hideContributionCategories));
  }, [appUser, firebaseUser]);

  useEffect(() => {
    if (!firebaseUser) return;
    const checked = validateAlias(alias);
    if (!checked.ok) {
      setAliasAvailability(alias ? 'invalid' : 'idle');
      return;
    }
    setAliasAvailability('checking');
    const handle = window.setTimeout(() => {
      isAliasAvailable(checked.alias, firebaseUser.uid)
        .then((available) => setAliasAvailability(available ? 'available' : 'taken'))
        .catch(() => setAliasAvailability('idle'));
    }, 450);
    return () => window.clearTimeout(handle);
  }, [alias, firebaseUser]);

  if (!firebaseUser) return <RequireLogin setPage={setPage} />;

  const impactIndex = appUser?.impactCredits ?? appUser?.impactScore ?? 0;
  const stage = appUser?.growthStage || calculateGrowthStage(appUser?.approvedActions || 0, impactIndex);
  const stageMap: Record<string, { icon: string; ar: string; en: string; fr: string; hintAr: string; hintEn: string; hintFr: string }> = {
    seed: { icon: '🌱', ar: 'بذرة', en: 'Seed', fr: 'Graine', hintAr: 'بداية هادئة لأثر مستمر.', hintEn: 'A quiet beginning for consistent impact.', hintFr: 'Un début discret pour un impact régulier.' },
    sprout: { icon: '🌿', ar: 'برعم', en: 'Sprout', fr: 'Pousse', hintAr: 'بدأت مساهماتك تظهر باستمرارية.', hintEn: 'Your contributions are becoming consistent.', hintFr: 'Vos contributions deviennent régulières.' },
    plant: { icon: '🪴', ar: 'نبتة', en: 'Plant', fr: 'Plante', hintAr: 'أثر متنوع ومستقر.', hintEn: 'Stable and diverse impact.', hintFr: 'Impact stable et diversifié.' },
    tree: { icon: '🌳', ar: 'شجرة', en: 'Tree', fr: 'Arbre', hintAr: 'حضور مجتمعي موثوق.', hintEn: 'A trusted community presence.', hintFr: 'Une présence communautaire fiable.' },
    forest: { icon: '🌲', ar: 'غابة', en: 'Forest', fr: 'Forêt', hintAr: 'أثر طويل المدى.', hintEn: 'Long-term community impact.', hintFr: 'Impact communautaire durable.' },
    oasis: { icon: '🏞️', ar: 'واحة', en: 'Oasis', fr: 'Oasis', hintAr: 'نموذج ملهم في العطاء.', hintEn: 'An inspiring model of contribution.', hintFr: 'Un modèle inspirant de contribution.' },
  };
  const stageInfo = stageMap[stage] || stageMap.seed;
  const stageLabel = copy(lang, stageInfo.ar, stageInfo.en, stageInfo.fr);
  const stageThresholds: Record<string, { min: number; next: number | null }> = {
    seed: { min: 0, next: 10 },
    sprout: { min: 10, next: 25 },
    plant: { min: 25, next: 50 },
    tree: { min: 50, next: 100 },
    forest: { min: 100, next: 250 },
    oasis: { min: 250, next: null },
  };
  const stageProgress = stageThresholds[stage] || stageThresholds.seed;
  const progressPercent = stageProgress.next ? Math.min(100, Math.max(0, ((Number(appUser?.approvedActions || 0) - stageProgress.min) / (stageProgress.next - stageProgress.min)) * 100)) : 100;
  const nextStageText = stageProgress.next
    ? copy(lang, `${appUser?.approvedActions || 0} / ${stageProgress.next} مساهمة معتمدة`, `${appUser?.approvedActions || 0} / ${stageProgress.next} approved contributions`, `${appUser?.approvedActions || 0} / ${stageProgress.next} contributions approuvées`)
    : copy(lang, 'أعلى مرحلة حالية', 'Highest current stage', 'Niveau actuel le plus élevé');
  const avatar = getAvatar(avatarId);
  const aliasCheck = validateAlias(alias);
  const aliasPreview = aliasCheck.alias ? `@${aliasCheck.alias}` : '@community_seed';
  const suggestions = suggestAliases(displayName || firebaseUser.email);
  const contributionPlaceholders = [
    copy(lang, '🌱 البيئة', '🌱 Environment', '🌱 Environnement'),
    copy(lang, '🤝 المجتمع', '🤝 Community', '🤝 Communauté'),
    copy(lang, '📚 التعليم', '📚 Education', '📚 Éducation'),
    copy(lang, '❤️ الصحة', '❤️ Health', '❤️ Santé'),
  ];
  const aliasAvailabilityText = aliasAvailability === 'checking'
    ? copy(lang, 'جارٍ فحص الاسم الرمزي...', 'Checking alias...', 'Vérification de l’alias...')
    : aliasAvailability === 'available'
      ? copy(lang, '✓ الاسم الرمزي متاح', '✓ Alias is available', '✓ Alias disponible')
      : aliasAvailability === 'taken'
        ? copy(lang, '✕ الاسم الرمزي مستخدم بالفعل', '✕ Alias is already taken', '✕ Alias déjà utilisé')
        : aliasAvailability === 'invalid'
          ? copy(lang, 'استخدم 3–20 حرفًا: إنجليزي، أرقام، أو _ فقط', 'Use 3–20 chars: letters, numbers, or _ only', 'Utilisez 3 à 20 caractères : lettres, chiffres ou _')
          : copy(lang, 'سيتم الفحص تلقائيًا أثناء الكتابة', 'Availability is checked while typing', 'La disponibilité est vérifiée pendant la saisie');
  const aliasAvailabilityClass = aliasAvailability === 'available'
    ? 'text-emerald-200'
    : aliasAvailability === 'taken' || aliasAvailability === 'invalid'
      ? 'text-red-200'
      : 'text-slate-400';

  const checkAlias = async () => {
    const checked = validateAlias(alias);
    if (!checked.ok) {
      setMessageTone('error');
      setMessage(checked.message);
      return;
    }
    setCheckingAlias(true);
    const available = await isAliasAvailable(checked.alias, firebaseUser.uid);
    setCheckingAlias(false);
    setMessageTone(available ? 'success' : 'error');
    setMessage(available
      ? copy(lang, 'الاسم الرمزي متاح.', 'Alias is available.', 'Alias disponible.')
      : copy(lang, 'هذا الاسم الرمزي مستخدم بالفعل.', 'This alias is already taken.', 'Cet alias est déjà utilisé.'));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const checked = validateAlias(alias);
    if (!checked.ok) {
      setMessageTone('error');
      setMessage(checked.message);
      return;
    }
    if (aliasAvailability === 'taken') {
      setMessageTone('error');
      setMessage(copy(lang, 'هذا الاسم الرمزي مستخدم بالفعل.', 'This alias is already taken.', 'Cet alias est déjà utilisé.'));
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      await updateCurrentUserProfile(firebaseUser, {
        displayName: displayName.trim() || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'AidiCore User',
        alias: checked.alias,
        realNameVisible,
        impactPassportEnabled,
        avatarId,
        hideContributionCategories,
      });
      await refreshUser();
      setAlias(checked.alias);
      setMessageTone('success');
      setMessage(copy(lang, 'تم حفظ جواز الأثر بأمان.', 'Impact Passport saved safely.', 'Passeport d’impact enregistré en toute sécurité.'));
    } catch (error) {
      setMessageTone('error');
      const rawMessage = error instanceof Error ? error.message : '';
      const deployRulesMessage = copy(
        lang,
        'يجب نشر قواعد Firestore الجديدة أولاً: firebase deploy --only firestore:rules',
        'Deploy the new Firestore rules first: firebase deploy --only firestore:rules',
        'Déployez d’abord les nouvelles règles Firestore : firebase deploy --only firestore:rules'
      );
      setMessage(rawMessage.includes('firebase deploy --only firestore:rules') ? deployRulesMessage : rawMessage || copy(lang, 'تعذر حفظ جواز الأثر.', 'Could not save Impact Passport.', 'Impossible d’enregistrer le passeport.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section className="max-w-6xl">
      <Title
        title={copy(lang, 'جواز الأثر', 'Impact Passport', 'Passeport d’impact')}
        text={copy(
          lang,
          'هوية أثر آمنة تعرض مساهماتك باسم رمزي وصورة ودية دون كشف بيانات حساسة.',
          'A safe impact identity that presents your contribution through an alias and friendly avatar without exposing sensitive information.',
          'Une identité d’impact sécurisée qui présente vos contributions avec un alias et un avatar convivial, sans données sensibles.'
        )}
      />

      <form onSubmit={save} className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="card overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-emerald-400/20 via-cyan-400/10 to-blue-500/10 p-6 md:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
            <div className="flex items-center gap-5">
              <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/15 bg-white/10 text-6xl shadow-2xl">
                {avatar.icon}
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[.22em] text-emerald-200">AidiCore Passport</p>
                <h3 dir="ltr" className="mt-2 text-3xl font-extrabold text-white">{aliasPreview}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  {realNameVisible ? displayName || copy(lang, 'عضو موثق', 'Verified member', 'Membre vérifié') : copy(lang, 'هوية أثر آمنة للمساهمة المجتمعية', 'Safe impact identity for community contribution', 'Identité d’impact sécurisée pour la contribution communautaire')}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[.18em] text-emerald-200">{copy(lang, 'المرحلة', 'Stage', 'Niveau')}</p>
                  <h4 className="mt-1 text-3xl font-extrabold text-white">{stageInfo.icon} {stageLabel}</h4>
                  <p className="mt-2 text-sm text-slate-300">{copy(lang, stageInfo.hintAr, stageInfo.hintEn, stageInfo.hintFr)}</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>{copy(lang, 'التقدم للمرحلة التالية', 'Progress to next stage', 'Progression vers le niveau suivant')}</span>
                      <span>{nextStageText}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-blue-400" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-center">
                  <div className="text-2xl font-extrabold text-white">{impactIndex}</div>
                  <div className="text-xs font-bold text-emerald-200">{copy(lang, 'مؤشر الأثر', 'Impact Index', 'Indice d’impact')}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric title={copy(lang, 'مستوى الثقة', 'Trust Level', 'Niveau de confiance')} value={`${appUser?.trustScore ?? 0}`} />
              <Metric title={copy(lang, 'مساهمات معتمدة', 'Approved Contributions', 'Contributions approuvées')} value={String(appUser?.approvedActions ?? 0)} />
              <div className="card p-5 text-center">
                <div className="text-sm font-bold text-slate-400">{copy(lang, 'الحالة', 'Status', 'Statut')}</div>
                <div className="mt-2 text-xl font-extrabold leading-tight text-white">{impactPassportEnabled ? copy(lang, 'جاهز للمساهمة', 'Ready to contribute', 'Prêt à contribuer') : copy(lang, 'وضع خاص', 'Private mode', 'Mode privé')}</div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 rounded-[1.5rem] border border-white/10 bg-black/15 p-5">
              <div>
                <p className="text-sm font-extrabold text-white">{copy(lang, 'مجالات المساهمة', 'Contribution areas', 'Domaines de contribution')}</p>
                <p className="mt-1 text-sm text-slate-400">{hideContributionCategories ? copy(lang, 'مخفية في النسخة العامة.', 'Hidden on the public version.', 'Masqués dans la version publique.') : copy(lang, 'ستظهر هنا المجالات الفعلية بعد اعتماد أول مساهمة. هذه أمثلة إرشادية.', 'Actual areas appear here after your first approved contribution. These are gentle placeholders.', 'Les vrais domaines apparaîtront après votre première contribution approuvée.')}</p>
                {!hideContributionCategories && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contributionPlaceholders.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-400">{item}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-white/10 pt-3">
                <p className="text-sm font-extrabold text-white">{copy(lang, 'رحلة الأثر', 'Impact journey', 'Parcours d’impact')}</p>
                <div className="mt-4 space-y-0 text-sm">
                  {[
                    { done: true, label: copy(lang, 'انضممت إلى AidiCore', 'Joined AidiCore', 'A rejoint AidiCore') },
                    { done: Number(appUser?.approvedActions || 0) > 0 || impactIndex > 0, label: copy(lang, 'أول مساهمة', 'First contribution', 'Première contribution') },
                    { done: Number(appUser?.approvedActions || 0) > 0, label: copy(lang, 'أول اعتماد', 'First approval', 'Première approbation') },
                    { done: Number(appUser?.approvedActions || 0) >= 10, label: copy(lang, 'الوصول إلى مرحلة البرعم', 'Reach Sprout stage', 'Atteindre le niveau Pousse') },
                  ].map((item, index, items) => (
                    <div key={item.label} className="grid grid-cols-[22px_1fr] gap-3">
                      <div className="flex flex-col items-center">
                        <span className={`mt-0.5 h-4 w-4 rounded-full border ${item.done ? 'border-emerald-300 bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,.35)]' : 'border-slate-500 bg-slate-800'}`} />
                        {index < items.length - 1 && <span className={`h-7 w-px ${item.done ? 'bg-emerald-300/45' : 'bg-white/10'}`} />}
                      </div>
                      <div className={item.done ? 'font-semibold text-slate-200' : 'text-slate-500'}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card grid gap-5 p-6 md:p-8">
          <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5">
            <p className="text-sm font-bold text-slate-400">{copy(lang, 'حالة الحساب', 'Account status', 'Statut du compte')}</p>
            <p className="mt-1 font-bold text-white">{copy(lang, 'حساب موثق ومتصل', 'Verified connected account', 'Compte vérifié connecté')}</p>
            <p className="mt-2 text-xs text-slate-500">{copy(lang, 'لا نعرض البريد الإلكتروني أو المعرفات الداخلية داخل جواز الأثر.', 'We do not display email addresses or internal IDs inside the Impact Passport.', 'Nous n’affichons pas les e-mails ni les identifiants internes dans le passeport d’impact.')}</p>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-200">{copy(lang, 'الاسم الحقيقي داخل الحساب', 'Real name inside account', 'Nom réel dans le compte')}</span>
            <input className="input" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
          </label>

          <div className="grid gap-2">
            <span className="text-sm font-bold text-slate-200">{copy(lang, 'الاسم الرمزي الفريد', 'Unique alias', 'Alias unique')}</span>
            <input dir="ltr" className="input" value={alias} onChange={(event) => setAlias(normalizeAlias(event.target.value))} placeholder="community_seed" required />
            <p className={`text-xs font-bold ${aliasAvailabilityClass}`}>{aliasAvailabilityText}</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button key={item} dir="ltr" type="button" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-slate-300 hover:border-emerald-300/40 hover:text-white" onClick={() => setAlias(item)}>
                  @{item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <span className="text-sm font-bold text-slate-200">{copy(lang, 'اختر صورة رمزية ودية', 'Choose a friendly avatar', 'Choisissez un avatar convivial')}</span>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {AVATARS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  title={copy(lang, item.ar, item.en, item.fr)}
                  className={`flex h-12 items-center justify-center rounded-2xl border text-2xl transition ${avatarId === item.id ? 'border-emerald-300 bg-emerald-400/20' : 'border-white/10 bg-white/5 hover:border-white/25'}`}
                  onClick={() => setAvatarId(item.id)}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/[.04] p-5">
            <label className="flex items-start gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={realNameVisible} onChange={(event) => setRealNameVisible(event.target.checked)} className="mt-1" />
              <span>{copy(lang, 'السماح بإظهار الاسم الحقيقي عند مشاركة جواز الأثر لاحقًا.', 'Allow showing my real name when I share my Impact Passport later.', 'Autoriser l’affichage de mon vrai nom lorsque je partagerai mon passeport d’impact.')}</span>
            </label>
            <label className="flex items-start gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={impactPassportEnabled} onChange={(event) => setImpactPassportEnabled(event.target.checked)} className="mt-1" />
              <span>{copy(lang, 'تجهيز جواز الأثر للمشاركة الخاصة عند إطلاق روابط المشاركة.', 'Prepare my Impact Passport for private sharing when share links launch.', 'Préparer mon passeport d’impact pour le partage privé lorsque les liens seront disponibles.')}</span>
            </label>
            <label className="flex items-start gap-3 text-sm text-slate-300">
              <input type="checkbox" checked={hideContributionCategories} onChange={(event) => setHideContributionCategories(event.target.checked)} className="mt-1" />
              <span>{copy(lang, 'إخفاء مجالات المساهمة في النسخة العامة من الجواز.', 'Hide contribution categories on the public passport.', 'Masquer les catégories de contribution dans la version publique.')}</span>
            </label>
          </div>

          {message && (
            <p className={`rounded-2xl border p-3 text-sm ${messageTone === 'error' ? 'border-red-400/20 bg-red-500/10 text-red-200' : messageTone === 'success' ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200' : 'border-blue-400/20 bg-blue-500/10 text-blue-200'}`}>
              {message}
            </p>
          )}
          <button className="btn-primary justify-center" disabled={saving}>{saving ? copy(lang, 'جارٍ الحفظ...', 'Saving...', 'Enregistrement...') : copy(lang, 'حفظ جواز الأثر', 'Save Impact Passport', 'Enregistrer le passeport')}</button>
        </div>
      </form>
    </Section>
  );
}

function RequireLogin({ setPage }: { setPage: (p: Page) => void }) {
  const { lang } = useLanguage();
  return (
    <Section>
      <div className="card p-8">
        <h2 className="text-2xl font-bold">{lang === 'ar' ? 'تسجيل الدخول مطلوب' : 'Login required'}</h2>
        <p className="mt-2 text-slate-400">{lang === 'ar' ? 'سجل الدخول للمتابعة.' : 'Please login to continue.'}</p>
        <button className="btn-primary mt-5" onClick={() => setPage('login')}>Login</button>
      </div>
    </Section>
  );
}

function RecordImpact({ setPage }: { setPage: (p: Page) => void }) {
  const { firebaseUser, appUser } = useAuth();
  const { lang } = useLanguage();

  const categoryTemplate = (category: ImpactCategory) => {
    const templates: Record<ImpactCategory, { titleAr: string; titleEn: string; detailsAr: string; detailsEn: string; credits: number }> = {
      community_service: { titleAr: 'مساهمة مجتمعية', titleEn: 'Community contribution', detailsAr: 'قدمت مساهمة مجتمعية آمنة ومختصرة دون مشاركة أي بيانات شخصية.', detailsEn: 'Provided a safe community contribution without sharing personal details.', credits: 0.1 },
      blood_donation: { titleAr: 'استعداد للتبرع بالدم', titleEn: 'Blood donation readiness', detailsAr: 'سجلت استعدادًا أو مشاركة مرتبطة بالتبرع بالدم بطريقة آمنة.', detailsEn: 'Recorded safe blood donation readiness or participation.', credits: 0.1 },
      visiting_patients: { titleAr: 'زيارة مريض', titleEn: 'Visited a patient', detailsAr: 'قمت بزيارة مريض وتقديم دعم معنوي دون مشاركة أي بيانات شخصية.', detailsEn: 'Visited a patient and provided emotional support without sharing personal details.', credits: 0.1 },
      helping_seniors: { titleAr: 'مساعدة كبير سن', titleEn: 'Helped a senior', detailsAr: 'ساعدت شخصًا كبير السن في موقف يومي آمن دون ذكر معلوماته الخاصة.', detailsEn: 'Helped a senior person in a safe everyday situation without exposing personal information.', credits: 0.1 },
      mental_support: { titleAr: 'دعم نفسي آمن', titleEn: 'Safe emotional support', detailsAr: 'قدمت دعمًا معنويًا أو نفسيًا عامًا بطريقة محترمة وآمنة.', detailsEn: 'Provided respectful and safe emotional support.', credits: 0.1 },
      anti_bullying: { titleAr: 'موقف ضد التنمر', titleEn: 'Anti-bullying support', detailsAr: 'ساهمت في دعم موقف ضد التنمر أو تشجيع بيئة آمنة.', detailsEn: 'Supported an anti-bullying situation or encouraged a safer environment.', credits: 0.1 },
      environment: { titleAr: 'مساهمة بيئية', titleEn: 'Environmental action', detailsAr: 'قمت بمساهمة بيئية بسيطة وآمنة ضمن المجتمع.', detailsEn: 'Completed a simple and safe environmental action in the community.', credits: 0.1 },
      education: { titleAr: 'دعم تعليمي', titleEn: 'Education support', detailsAr: 'قدمت دعمًا تعليميًا أو مساعدة معرفية دون مشاركة بيانات شخصية.', detailsEn: 'Provided education support without sharing personal details.', credits: 0.1 },
      volunteer_work: { titleAr: 'عمل تطوعي', titleEn: 'Volunteer work', detailsAr: 'شاركت في عمل تطوعي آمن يخدم المجتمع.', detailsEn: 'Participated in safe volunteer work serving the community.', credits: 0.1 },
      emergency_help: { titleAr: 'مساعدة طارئة', titleEn: 'Emergency assistance', detailsAr: 'قدمت مساعدة طارئة آمنة دون ذكر عناوين دقيقة أو بيانات شخصية.', detailsEn: 'Provided safe emergency assistance without precise addresses or personal details.', credits: 0.1 },
      food_support: { titleAr: 'دعم غذائي', titleEn: 'Food support', detailsAr: 'قدمت دعمًا غذائيًا أو ساعدت في إيصال طعام بطريقة آمنة ومحترمة.', detailsEn: 'Provided food support or helped deliver meals safely and respectfully.', credits: 0.1 },
      disability_support: { titleAr: 'دعم أصحاب الهمم', titleEn: 'Disability support', detailsAr: 'قدمت مساعدة آمنة أو تسهيلًا لشخص من أصحاب الهمم دون كشف بياناته.', detailsEn: 'Provided safe assistance or accessibility support without exposing personal details.', credits: 0.1 },
      animal_welfare: { titleAr: 'رعاية الحيوانات', titleEn: 'Animal welfare', detailsAr: 'ساهمت في رعاية حيوان أو دعم الرفق بالحيوان بطريقة آمنة.', detailsEn: 'Supported animal care or welfare in a safe and responsible way.', credits: 0.1 },
      family_support: { titleAr: 'دعم الأسر', titleEn: 'Family support', detailsAr: 'قدمت دعمًا آمنًا لأسرة أو ساعدت في احتياج يومي دون مشاركة بيانات حساسة.', detailsEn: 'Provided safe family support or helped with an everyday need without sensitive details.', credits: 0.1 },
    };
    return templates[category];
  };

  const cityOptions = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Cairo', 'Riyadh', 'Jeddah', 'Doha', 'Dammam'];
  const lastCity = typeof localStorage !== 'undefined' ? localStorage.getItem('aidicore_last_city') || 'Abu Dhabi' : 'Abu Dhabi';
  const lastCountry = typeof localStorage !== 'undefined' ? localStorage.getItem('aidicore_last_country') || 'AE' : 'AE';
  const defaultCategory: ImpactCategory = 'community_service';
  const initialTemplate = categoryTemplate(defaultCategory);

  const [form, setForm] = useState<{ title: string; category: ImpactCategory; details: string; occurredAt: string; countryCode: string; city: string; visibility: Visibility }>({
    title: lang === 'ar' ? initialTemplate.titleAr : initialTemplate.titleEn,
    category: defaultCategory,
    details: lang === 'ar' ? initialTemplate.detailsAr : initialTemplate.detailsEn,
    occurredAt: new Date().toISOString().slice(0, 10),
    countryCode: lastCountry,
    city: lastCity,
    visibility: 'anonymous_public' as Visibility,
  });
  const [done, setDone] = useState(false);
  const [createdId, setCreatedId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [locationNotice, setLocationNotice] = useState('');

  if (!firebaseUser) return <RequireLogin setPage={setPage} />;

  const selectedTemplate = categoryTemplate(form.category);
  const looksSensitive = /\b(\+?\d[\d\s-]{6,}|passport|emirates id|national id|رقم الهوية|جواز|هاتف|موبايل|عنوان)\b/i.test(form.details);

  const chooseCategory = (category: ImpactCategory) => {
    const template = categoryTemplate(category);
    setForm((prev) => ({
      ...prev,
      category,
      title: lang === 'ar' ? template.titleAr : template.titleEn,
      details: lang === 'ar' ? template.detailsAr : template.detailsEn,
    }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationNotice(lang === 'ar' ? 'المتصفح لا يدعم تحديد الموقع. اختر المدينة يدويًا.' : 'Geolocation is not supported. Select the city manually.');
      return;
    }
    setLocationNotice(lang === 'ar' ? 'تم طلب الموقع. نحفظ المدينة فقط ولا نحفظ عنوانًا دقيقًا.' : 'Location requested. AidiCore stores city-level context only, not a precise address.');
    navigator.geolocation.getCurrentPosition(
      () => setLocationNotice(lang === 'ar' ? 'تم السماح بالموقع. اختر أقرب مدينة من القائمة لحماية الخصوصية.' : 'Location allowed. Select the nearest city to protect privacy.'),
      () => setLocationNotice(lang === 'ar' ? 'لم يتم السماح بالموقع. اختر المدينة يدويًا.' : 'Location was not allowed. Select the city manually.'),
      { enableHighAccuracy: false, timeout: 6000 },
    );
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (form.title.trim().length < 4) {
      setError(lang === 'ar' ? 'اكتب عنوانًا أوضح للأثر.' : 'Please write a clearer impact title.');
      return;
    }
    if (form.details.trim().length < 20) {
      setError(lang === 'ar' ? 'اكتب تفاصيل آمنة من 20 حرفًا على الأقل.' : 'Write at least 20 characters of safe details.');
      return;
    }
    if (!form.city.trim()) {
      setError(lang === 'ar' ? 'اختر المدينة فقط بدون عنوان دقيق.' : 'Select the city only, not a precise address.');
      return;
    }
    setSubmitting(true);
    try {
      localStorage.setItem('aidicore_last_city', form.city.trim());
      localStorage.setItem('aidicore_last_country', form.countryCode.trim().toUpperCase() || 'AE');
      const id = await createImpactRecord({
        ...form,
        title: form.title.trim(),
        details: form.details.trim(),
        city: form.city.trim(),
        countryCode: form.countryCode.trim().toUpperCase() || 'AE',
        userId: firebaseUser.uid,
        userDisplayName: getSafeDisplayName(appUser) || firebaseUser.email || 'AidiCore Member',
      });
      setCreatedId(id);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : lang === 'ar' ? 'تعذر حفظ الأثر.' : 'Could not save impact record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section className="max-w-5xl">
      <Title title={lang === 'ar' ? 'سجّل أثرًا إيجابيًا' : 'Record Impact'} text={lang === 'ar' ? 'اختر نوع الأثر، وعدّل وصفًا قصيرًا إذا احتجت. نحاول تقليل الكتابة اليدوية وحماية الخصوصية.' : 'Choose the impact type and edit a short safe template if needed. AidiCore minimizes manual writing and protects privacy.'} />
      {done ? (
        <div className="card p-8">
          <CheckCircle2 className="text-emerald-300" />
          <h2 className="mt-3 text-2xl font-bold">{lang === 'ar' ? 'تم الإرسال للمراجعة' : 'Submitted for review'}</h2>
          <p className="mt-2 text-slate-400">
            {lang === 'ar' ? 'سيظهر الأثر في لوحة المستخدم كقيد المراجعة، ولن يظهر للعامة قبل الموافقة.' : 'The record now appears as pending in your dashboard and will not be public before approval.'}
          </p>
          {createdId && <p className="mt-3 text-xs text-slate-500">ID: {createdId}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={() => setPage('dashboard')}>{lang === 'ar' ? 'العودة للوحة الأثر' : 'Back to dashboard'}</button>
            <button className="btn-soft" onClick={() => { setDone(false); setCreatedId(''); chooseCategory(defaultCategory); }}>{lang === 'ar' ? 'تسجيل أثر آخر' : 'Record another'}</button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="card grid gap-6 p-6">
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
            {lang === 'ar'
              ? 'تذكير: سجّل أثرًا واحدًا لكل مساعدة فعلية. لا تقسّم نفس المساعدة إلى عدة سجلات ولا تكتب بيانات شخصية.'
              : 'Reminder: record one impact per real action. Do not split the same help into multiple records, and do not include personal data.'}
          </div>

          <div>
            <label className="mb-3 block text-sm font-bold text-slate-200">{lang === 'ar' ? '1. اختر نوع الأثر' : '1. Choose impact type'}</label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const active = form.category === category.id;
                return (
                  <button type="button" key={category.id} onClick={() => chooseCategory(category.id)} className={`rounded-3xl border p-4 text-start transition ${active ? 'border-emerald-300/60 bg-emerald-400/10' : 'border-white/10 bg-white/[.03] hover:border-emerald-300/30'}`}>
                    <div className={`mb-3 inline-flex rounded-2xl bg-gradient-to-br ${category.color} p-2 text-white`}><Icon size={18} /></div>
                    <div className="font-bold text-white">{categoryLabel(category, lang)}</div>
                    <div className="mt-1 text-xs text-emerald-200">+{categoryTemplate(category.id).credits} {copy(lang, 'مؤشر أثر بعد الاعتماد', 'impact index after approval', 'indice d’impact après approbation')}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">{lang === 'ar' ? 'عنوان مختصر' : 'Short title'}</label>
              <input className="input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">{copy(lang, 'مؤشر متوقع بعد الاعتماد', 'Expected impact index after approval', 'Indice d’impact attendu après approbation')}</label>
              <div className="input flex items-center text-emerald-200">+{selectedTemplate.credits}</div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">{lang === 'ar' ? 'وصف آمن قصير' : 'Short safe description'}</label>
            <textarea className="input min-h-28" value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} required />
          </div>
          {looksSensitive && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">
              {lang === 'ar' ? 'قد تحتوي التفاصيل على بيانات حساسة. يرجى حذف أي رقم هاتف أو عنوان دقيق أو رقم هوية.' : 'The details may contain sensitive data. Remove phone numbers, precise addresses, or ID numbers.'}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-200">{lang === 'ar' ? '2. المدينة والسياق العام' : '2. City-level context'}</label>
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <select className="input" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required>
                {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              <select className="input" value={form.countryCode} onChange={(event) => setForm({ ...form, countryCode: event.target.value })}>
                <option value="AE">UAE</option>
                <option value="EG">Egypt</option>
                <option value="SA">Saudi Arabia</option>
                <option value="QA">Qatar</option>
                <option value="BH">Bahrain</option>
                <option value="KW">Kuwait</option>
                <option value="OM">Oman</option>
              </select>
              <button type="button" className="btn-soft justify-center" onClick={detectLocation}>{lang === 'ar' ? 'اقتراح الموقع' : 'Suggest location'}</button>
            </div>
            {locationNotice && <p className="mt-2 text-xs text-slate-400">{locationNotice}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">{lang === 'ar' ? 'تاريخ الأثر' : 'Impact date'}</label>
              <input className="input" type="date" value={form.occurredAt} onChange={(event) => setForm({ ...form, occurredAt: event.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-200">{lang === 'ar' ? 'الخصوصية' : 'Privacy'}</label>
              <select className="input" value={form.visibility} onChange={(event) => setForm({ ...form, visibility: event.target.value as Visibility })}>
                <option value="private">{lang === 'ar' ? 'خاص: يظهر لك فقط' : 'Private: only visible to you'}</option>
                <option value="anonymous_public">{lang === 'ar' ? 'عام بدون اسم بعد الموافقة' : 'Anonymous public after approval'}</option>
                <option value="public_profile">{copy(lang, 'عام باسم جواز الأثر', 'Public with Impact Passport alias', 'Public avec alias du passeport')}</option>
              </select>
            </div>
          </div>

          {error && <p className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <button className="btn-primary justify-center" disabled={submitting || looksSensitive}>
            {submitting ? (lang === 'ar' ? 'جارٍ الإرسال...' : 'Submitting...') : (lang === 'ar' ? 'إرسال للمراجعة' : 'Submit for review')}
          </button>
        </form>
      )}
    </Section>
  );
}

function Admin() {
  const { isModerator, firebaseUser, appUser } = useAuth();
  const [tab, setTab] = useState<'overview' | 'records' | 'users' | 'logs' | 'settings'>('overview');
  const [recordFilter, setRecordFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [records, setRecords] = useState<ImpactRecord[]>([]);
  const [allRecords, setAllRecords] = useState<ImpactRecord[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [verifications, setVerifications] = useState<ImpactVerification[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [actionMessage, setActionMessage] = useState('');
  const [latestVerificationLink, setLatestVerificationLink] = useState('');
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  const loadAdminData = async () => {
    if (!isModerator) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [pending, all, appUsers, auditItems, appSettings, verificationItems] = await Promise.all([
      listPendingImpactRecords().catch(() => []),
      listAllImpactRecords().catch(() => []),
      listUsers().catch(() => []),
      listAuditLogs().catch(() => []),
      getSettings().catch(() => null),
      listVerificationLinks().catch(() => []),
    ]);
    setRecords(pending);
    setAllRecords(all);
    setUsers(appUsers);
    setLogs(auditItems);
    setSettings(appSettings);
    setVerifications(verificationItems);
    setLoading(false);
  };

  useEffect(() => { void loadAdminData(); }, [isModerator]);

  if (!isModerator) return <Section><div className="card p-8">Admin/moderator access required.</div></Section>;

  const tabs: { id: typeof tab; label: string; icon: ReactNode }[] = [
    { id: 'overview', label: lang === 'ar' ? 'نظرة عامة' : 'Overview', icon: <ShieldCheck size={16} /> },
    { id: 'records', label: lang === 'ar' ? 'سجلات الأثر' : 'Impact Records', icon: <ClipboardCheck size={16} /> },
    { id: 'users', label: lang === 'ar' ? 'المستخدمون' : 'Users', icon: <UsersRound size={16} /> },
    { id: 'logs', label: lang === 'ar' ? 'السجلات' : 'Audit Logs', icon: <ScrollText size={16} /> },
    { id: 'settings', label: lang === 'ar' ? 'الإعدادات' : 'Settings', icon: <Settings2 size={16} /> },
  ];

  const review = async (record: ImpactRecord, status: 'approved' | 'rejected') => {
    const note = reviewNotes[record.id]?.trim() || (status === 'approved' ? 'Approved by admin review center.' : 'Rejected by admin review center.');
    setActionMessage('');
    await reviewImpactRecord(record.id, status, firebaseUser!.uid, note, firebaseUser?.email || undefined);
    setReviewNotes((prev) => ({ ...prev, [record.id]: '' }));
    setActionMessage(status === 'approved' ? copy(lang, 'تم اعتماد الأثر.', 'Impact approved.', 'Impact approuvé.') : copy(lang, 'تم رفض الأثر.', 'Impact rejected.', 'Impact rejeté.'));
    await loadAdminData();
  };


  const changeRecordStatus = async (record: ImpactRecord, status: ImpactRecord['status']) => {
    const note = reviewNotes[record.id]?.trim() || `Manual status change to ${status}`;
    setActionMessage('');
    await updateImpactRecordStatus(record.id, status, firebaseUser!.uid, firebaseUser?.email || undefined, note);
    setActionMessage(copy(lang, 'تم تحديث حالة السجل.', 'Record status updated.', 'Statut mis à jour.'));
    await loadAdminData();
  };

  const removeImpactRecord = async (record: ImpactRecord) => {
    if (appUser?.role !== 'super_admin') return;
    const ok = window.confirm(copy(lang, `حذف سجل الأثر: ${record.title}؟`, `Delete impact record: ${record.title}?`, `Supprimer cette contribution : ${record.title} ?`));
    if (!ok) return;
    setActionMessage('');
    await deleteImpactRecord(record.id, firebaseUser!.uid, firebaseUser?.email || undefined);
    setActionMessage(copy(lang, 'تم حذف سجل الأثر.', 'Impact record deleted.', 'Contribution supprimée.'));
    await loadAdminData();
  };

  const makeVerificationLink = async (record: ImpactRecord) => {
    setActionMessage('');
    setLatestVerificationLink('');
    const result = await createVerificationLink(record, firebaseUser!.uid, firebaseUser?.email || undefined);
    const link = `${window.location.origin}?verify=${result.id}&token=${result.token}`;
    await navigator.clipboard?.writeText(link).catch(() => null);
    setLatestVerificationLink(link);
    setActionMessage(copy(lang, 'تم إنشاء رابط التزكية ونسخه. الرابط يستخدم مرة واحدة وينتهي بعد 7 أيام.', 'Verification link created and copied. The link is one-time and expires in 7 days.', 'Lien de vérification créé et copié. Il expire après 7 jours.'));
  };

  const updateRole = async (uid: string, role: UserRole) => {
    await updateUserRole(uid, role, firebaseUser!.uid, firebaseUser?.email || undefined);
    await loadAdminData();
  };

  const updateStatus = async (uid: string, status: UserStatus) => {
    await updateUserStatus(uid, status, firebaseUser!.uid, firebaseUser?.email || undefined);
    await loadAdminData();
  };

  const deleteUser = async (user: AppUser) => {
    if (!firebaseUser || appUser?.role !== 'super_admin') return;
    if (user.uid === firebaseUser.uid) {
      setActionMessage(copy(lang, 'لا يمكن حذف حسابك الحالي من لوحة الإدارة.', 'You cannot delete your current account from the admin console.', 'Vous ne pouvez pas supprimer votre compte actuel depuis la console.'));
      return;
    }
    const ok = window.confirm(copy(lang, `حذف ملف المستخدم ${getSafeDisplayName(user)}؟ لن يحذف هذا حساب Firebase Auth نفسه.`, `Delete ${getSafeDisplayName(user)} profile document? This will not delete the Firebase Auth account itself.`, `Supprimer le profil de ${getSafeDisplayName(user)} ? Le compte Firebase Auth ne sera pas supprimé.`));
    if (!ok) return;
    setActionMessage('');
    await deleteUserProfile(user.uid, firebaseUser.uid, firebaseUser.email || undefined);
    setActionMessage(copy(lang, 'تم حذف ملف المستخدم من قاعدة البيانات.', 'User profile document deleted from the database.', 'Le profil utilisateur a été supprimé de la base.'));
    await loadAdminData();
  };

  const saveAdminSettings = async () => {
    if (!settings || !firebaseUser) return;
    await saveSettings(settings, firebaseUser.uid, firebaseUser.email || undefined);
    await loadAdminData();
  };

  const approved = allRecords.filter((record) => record.status === 'approved').length;
  const rejected = allRecords.filter((record) => record.status === 'rejected').length;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const approvedToday = allRecords.filter((record) => record.status === 'approved' && Number(record.reviewedAt || record.createdAt || 0) >= todayStart.getTime()).length;

  const normalizedRecords = allRecords.map((record) => ({ ...record, status: (record.status || 'pending').toLowerCase() as ImpactRecord['status'] }));
  const visibleRecords = normalizedRecords.filter((record) => recordFilter === 'all' || record.status === recordFilter);
  const pendingCount = normalizedRecords.filter((record) => record.status === 'pending').length;
  const flaggedVerificationCount = verifications.filter((item) => item.status === 'flagged' || item.status === 'rejected' || item.riskFlags?.length).length;
  const confirmedVerificationCount = verifications.filter((item) => item.status === 'confirmed').length;
  const pendingVerificationCount = verifications.filter((item) => item.status === 'pending').length;
  const duplicateEmails = new Set(users.map((user) => user.email).filter((email, index, arr) => email && arr.indexOf(email) !== index));

  const statusLabel = (status: ImpactRecord['status']) => status === 'approved'
    ? copy(lang, 'معتمد', 'Approved', 'Approuvé')
    : status === 'rejected'
      ? copy(lang, 'مرفوض', 'Rejected', 'Rejeté')
      : copy(lang, 'قيد المراجعة', 'Pending', 'En attente');

  return (
    <Section>
      <Title title={lang === 'ar' ? 'لوحة الإدارة' : 'Admin Console'} text={lang === 'ar' ? 'مراجعة الأثر، إدارة المستخدمين، وسجل التدقيق.' : 'Review impact, manage users, and inspect audit activity.'} />
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button key={item.id} className={`${tab === item.id ? 'btn-primary' : 'btn-soft'} !px-4 !py-2`} onClick={() => setTab(item.id)}>
            {item.icon}{item.label}
          </button>
        ))}
      </div>

      {actionMessage && <div className="mb-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-200">{actionMessage}</div>}
      {latestVerificationLink && (
        <div className="mb-5 rounded-2xl border border-sky-400/20 bg-sky-500/10 p-4 text-sm text-sky-100">
          <div className="mb-2 font-bold">{copy(lang, 'آخر رابط تزكية', 'Latest verification link', 'Dernier lien de vérification')}</div>
          <div className="break-all rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-200">{latestVerificationLink}</div>
          <button className="btn-soft mt-3 !py-2" onClick={() => navigator.clipboard?.writeText(latestVerificationLink)}>{copy(lang, 'نسخ الرابط', 'Copy link', 'Copier le lien')}</button>
        </div>
      )}

      {loading ? <div className="card p-6 text-slate-300">Loading admin data...</div> : (
        <>
          {tab === 'overview' && (
            <div className="grid gap-4 md:grid-cols-6">
              <Metric title={lang === 'ar' ? 'قيد المراجعة' : 'Pending Review'} value={String(pendingCount)} />
              <Metric title={copy(lang, 'معتمد', 'Approved', 'Approuvé')} value={String(approved)} />
              <Metric title={lang === 'ar' ? 'اعتمد اليوم' : 'Approved Today'} value={String(approvedToday)} />
              <Metric title={lang === 'ar' ? 'مرفوض' : 'Rejected'} value={String(rejected)} />
              <Metric title={lang === 'ar' ? 'المستخدمون' : 'Users'} value={String(users.length)} />
              <Metric title={copy(lang, 'تزكيات مؤكدة', 'Confirmed Verifications', 'Vérifications confirmées')} value={String(confirmedVerificationCount)} />
              <Metric title={copy(lang, 'تزكيات معلقة', 'Pending Verifications', 'Vérifications en attente')} value={String(pendingVerificationCount)} />
              <Metric title={copy(lang, 'تزكيات مشبوهة', 'Flagged Verifications', 'Vérifications signalées')} value={String(flaggedVerificationCount)} />
            </div>
          )}

          {tab === 'records' && (
            <div className="grid gap-4">
              <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="text-sm font-bold text-slate-200">{copy(lang, 'فلترة سجلات الأثر', 'Filter impact records', 'Filtrer les contributions')}</div>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                    <button key={filter} className={`${recordFilter === filter ? 'btn-primary' : 'btn-soft'} !px-4 !py-2`} onClick={() => setRecordFilter(filter)}>
                      {filter === 'all' ? copy(lang, 'الكل', 'All', 'Tous') : statusLabel(filter)}
                    </button>
                  ))}
                </div>
              </div>

              {visibleRecords.length === 0 ? <div className="card p-6 text-slate-300">{copy(lang, 'لا توجد سجلات مطابقة للفلتر الحالي.', 'No records match the current filter.', 'Aucune contribution ne correspond au filtre actuel.')}</div> : visibleRecords.map((record) => (
                <div key={record.id} className="card p-5">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <h3 className="font-bold">{record.title}</h3>
                      <p className="text-sm text-slate-400">{record.city} · {categoryLabel(categories.find((item) => item.id === record.category) || categories[0], lang)} · +{Number(record.impactCredits || 0.1).toFixed(1)} · Fraud {record.fraudScore}/100 · {record.visibility}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`rounded-full border px-3 py-2 text-xs font-bold ${record.status === 'approved' ? 'border-emerald-300/20 bg-emerald-500/10 text-emerald-100' : record.status === 'rejected' ? 'border-red-300/20 bg-red-500/10 text-red-100' : 'border-amber-300/20 bg-amber-500/10 text-amber-100'}`}>{statusLabel(record.status)}</span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/[.03] p-4">
                    <p className="text-sm leading-6 text-slate-300">{record.details}</p>
                    <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-5">
                      <span>{copy(lang, 'المستخدم', 'User', 'Utilisateur')}: {record.userDisplayName || record.userId}</span>
                      <span>{copy(lang, 'المدينة', 'City', 'Ville')}: {record.city || '—'}</span>
                      <span>{copy(lang, 'الدولة', 'Country', 'Pays')}: {record.countryCode || '—'}</span>
                      <span>{copy(lang, 'الثقة', 'Confidence', 'Confiance')}: {record.confidenceScore ?? '—'}</span>
                      <span>{copy(lang, 'النقاط', 'Credits', 'Points')}: +{Number(record.impactCredits || 0.1).toFixed(1)}</span>
                    </div>
                  </div>
                  {record.auditNote && <p className="mt-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100"><ShieldAlert className="inline" size={16} /> {record.auditNote}</p>}
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                    <textarea
                      className="input min-h-[76px]"
                      value={reviewNotes[record.id] || ''}
                      placeholder={copy(lang, 'ملاحظات المراجعة للإدارة...', 'Admin moderation note...', 'Note de modération...')}
                      onChange={(event) => setReviewNotes((prev) => ({ ...prev, [record.id]: event.target.value }))}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <select className="input !w-auto !py-2" value={record.status} onChange={(event) => changeRecordStatus(record, event.target.value as ImpactRecord['status'])}>
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                      </select>
                      <button className="btn-soft !py-2" onClick={() => review(record, 'rejected')}>{copy(lang, 'رفض', 'Reject', 'Rejeter')}</button>
                      <button className="btn-primary !py-2" onClick={() => review(record, 'approved')}>{copy(lang, 'اعتماد', 'Approve', 'Approuver')}</button>
                      {appUser?.role === 'super_admin' && <button className="btn-soft !py-2 text-red-200" onClick={() => removeImpactRecord(record)}><Trash2 size={16} />{copy(lang, 'حذف', 'Delete', 'Supprimer')}</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'users' && (
            <div className="grid gap-3">
              {duplicateEmails.size > 0 && <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-100">{copy(lang, 'تنبيه: يوجد أكثر من ملف مستخدم لنفس البريد. راجع UID قبل الحذف.', 'Warning: multiple user profile documents share the same email. Check UID before deleting.', 'Attention : plusieurs profils partagent le même e-mail.')}</div>}
              {users.length === 0 ? <div className="card p-6 text-slate-300">No users found yet.</div> : users.map((user) => (
                <div key={user.uid} className="card flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <div className="font-bold text-white">{getSafeDisplayName(user)}</div>
                    <div className="text-sm text-slate-400">{user.email} · {user.role} · {user.status} · {copy(lang, 'مؤشر', 'Index', 'Indice')} {Number(user.impactCredits ?? user.impactScore ?? 0).toFixed(1)}</div>
                    <div className="mt-1 text-xs text-slate-600">UID: {user.uid}</div>
                    <div className="mt-1 text-xs text-slate-500">{copy(lang, 'الثقة', 'Trust', 'Confiance')}: {Number(user.trustScore || 0).toFixed(2)} · {copy(lang, 'مخاطر التزكية', 'Verification risk', 'Risque')}: {Number(user.trustRiskScore || 0).toFixed(2)} {duplicateEmails.has(user.email) ? '· duplicate-email' : ''}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select className="input !w-auto !py-2" value={user.role} onChange={(event) => updateRole(user.uid, event.target.value as UserRole)} disabled={appUser?.role !== 'super_admin' && user.role === 'super_admin'}>
                      <option value="user">user</option>
                      <option value="moderator">moderator</option>
                      <option value="admin">admin</option>
                      <option value="super_admin">super_admin</option>
                    </select>
                    <select className="input !w-auto !py-2" value={user.status} onChange={(event) => updateStatus(user.uid, event.target.value as UserStatus)}>
                      <option value="active">active</option>
                      <option value="suspended">suspended</option>
                    </select>
                    {appUser?.role === 'super_admin' && user.uid !== firebaseUser?.uid && (
                      <button className="btn-soft !py-2 text-red-200 hover:border-red-300/30" onClick={() => deleteUser(user)} title={copy(lang, 'حذف ملف المستخدم', 'Delete user profile', 'Supprimer le profil')}>
                        <Trash2 size={16} /> {copy(lang, 'حذف', 'Delete', 'Supprimer')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'logs' && (
            <div className="grid gap-3">
              <div className="card p-5">
                <h3 className="mb-3 font-bold">{copy(lang, 'سجل التزكيات', 'Verification activity', 'Activité de vérification')}</h3>
                {verifications.length === 0 ? <p className="text-sm text-slate-400">{copy(lang, 'لا توجد تزكيات بعد.', 'No verification links yet.', 'Aucune vérification.')}</p> : verifications.slice(0, 12).map((item) => (
                  <div key={item.id} className="border-t border-white/10 py-3 text-sm text-slate-300">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-white">{item.status}</span>
                      <span className="text-xs text-slate-500">{new Date(item.confirmedAt || item.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-400">impact: {item.impactId} · owner: {item.impactOwnerId} · verifier: {item.verifierEmail || item.verifierId || '—'}</div>
                    <div className="mt-1 text-xs text-slate-400">weight {Number(item.weight || 0).toFixed(2)} · penalty {Number(item.penalty || 0).toFixed(2)} · flags: {item.riskFlags?.join(', ') || 'none'}</div>
                  </div>
                ))}
              </div>
              {logs.length === 0 ? <div className="card p-6 text-slate-300">No audit logs yet.</div> : logs.map((log) => (
                <div key={log.id} className="card p-5">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div className="font-bold text-white">{log.action}</div>
                    <div className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</div>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{log.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{log.actorEmail || log.actorId} → {log.targetType}/{log.targetId}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'settings' && settings && (
            <div className="card grid gap-4 p-6">
              <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 p-4">
                <span>{lang === 'ar' ? 'المراجعة مطلوبة افتراضيًا' : 'Review required by default'}</span>
                <input type="checkbox" checked={settings.reviewRequiredByDefault} onChange={(event) => setSettings({ ...settings, reviewRequiredByDefault: event.target.checked })} />
              </label>
              <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 p-4">
                <span>{lang === 'ar' ? 'تفعيل الأثر العام' : 'Enable public feed'}</span>
                <input type="checkbox" checked={settings.publicFeedEnabled} onChange={(event) => setSettings({ ...settings, publicFeedEnabled: event.target.checked })} />
              </label>
              <label className="grid gap-2">
                <span>{lang === 'ar' ? 'الحد اليومي لكل مستخدم' : 'Daily record limit per user'}</span>
                <input className="input" type="number" min={1} max={50} value={settings.maxDailyRecordsPerUser} onChange={(event) => setSettings({ ...settings, maxDailyRecordsPerUser: Number(event.target.value) })} />
              </label>
              <button className="btn-primary justify-center" onClick={saveAdminSettings}><UserCog size={18} />{lang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}</button>
            </div>
          )}
        </>
      )}
    </Section>
  );
}

function VerifyImpact() {
  const { firebaseUser, appUser } = useAuth();
  const { lang } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const params = new URLSearchParams(window.location.search);
  const verificationId = params.get('verify') || '';
  const token = params.get('token') || '';

  const confirm = async () => {
    if (!firebaseUser || !appUser) {
      setStatus('error');
      setMessage(copy(lang, 'سجّل الدخول أولاً لتأكيد الأثر. لا يمكن لصاحب الأثر تأكيد فعله بنفسه.', 'Please sign in first to verify this impact. The owner cannot verify their own action.', 'Veuillez vous connecter pour confirmer cette action.'));
      return;
    }
    setStatus('working');
    try {
      const result = await confirmVerificationLink(verificationId, token, { uid: firebaseUser.uid, email: firebaseUser.email || undefined, createdAt: appUser.createdAt, trustScore: appUser.trustScore, approvedActions: appUser.approvedActions });
      setStatus(result.status === 'rejected' ? 'error' : 'done');
      setMessage(result.status === 'rejected'
        ? copy(lang, 'تم رفض التزكية: لا يمكن لصاحب الأثر تأكيد فعله بنفسه أو استخدام رابط مخالف لقواعد الثقة.', 'Verification rejected: the owner cannot verify their own action or use a link that violates trust rules.', 'Vérification rejetée : le propriétaire ne peut pas confirmer sa propre action.')
        : result.riskFlags.length
          ? copy(lang, 'تم تسجيل التزكية مع علامة مراجعة لأنها تبدو متكررة أو مشبوهة.', 'Verification recorded with a review flag because it may be repeated or suspicious.', 'Vérification enregistrée avec signalement.')
          : copy(lang, 'تم تأكيد الأثر. التزكية تساعد الثقة لكنها لا تعتمد السجل وحدها.', 'Impact verified. Verification helps trust but does not approve the record by itself.', 'Action confirmée.'));
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : copy(lang, 'تعذر تأكيد الرابط.', 'Could not verify this link.', 'Impossible de confirmer ce lien.'));
    }
  };

  return (
    <Section>
      <div className="card mx-auto grid max-w-2xl gap-5 p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-emerald-400/10 text-emerald-200"><HeartHandshake size={30} /></div>
        <Title title={copy(lang, 'تأكيد أثر مجتمعي', 'Verify Community Impact', 'Confirmer une action')} text={copy(lang, 'التزكية يرسلها صاحب الأثر لمن ساعده أو لشاهد، وتضيف إشارة ثقة صغيرة دون اعتماد السجل وحدها.', 'The impact owner sends verification to the helped person or a witness. It adds a small trust signal and never approves a record by itself.', 'La vérification ajoute un faible signal de confiance.')} />
        <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/[.03] p-4 text-start text-sm text-slate-300">
          <div className="font-bold text-white">{copy(lang, 'قواعد التزكية', 'Verification rules', 'Règles de vérification')}</div>
          <div>✓ {copy(lang, 'الرابط يستخدم مرة واحدة فقط.', 'The link can be used once only.', 'Le lien ne peut être utilisé qu’une seule fois.')}</div>
          <div>✓ {copy(lang, 'يمكن للمؤكد أن يكون مستخدمًا سابقًا أو ينشئ حسابًا جديدًا للتأكيد.', 'The verifier can be an existing user or create a new account to verify.', 'Le vérificateur peut être un utilisateur existant ou créer un compte.')}</div>
          <div>✕ {copy(lang, 'لا يمكن لصاحب الأثر تأكيد فعله بنفسه.', 'The impact owner cannot verify their own action.', 'Le propriétaire ne peut pas confirmer sa propre action.')}</div>
        </div>
        {!verificationId || !token ? <p className="text-red-200">{copy(lang, 'الرابط غير مكتمل.', 'Incomplete verification link.', 'Lien incomplet.')}</p> : null}
        {message && <p className={`rounded-2xl border p-3 text-sm ${status === 'done' ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100' : 'border-amber-400/20 bg-amber-500/10 text-amber-100'}`}>{message}</p>}
        <button className="btn-primary justify-center" disabled={status === 'working' || !verificationId || !token} onClick={confirm}>
          {status === 'working' ? copy(lang, 'جارٍ التأكيد...', 'Verifying...', 'Vérification...') : copy(lang, 'تأكيد الأثر', 'Verify Impact', 'Confirmer')}
        </button>
      </div>
    </Section>
  );
}

function SimplePage({ page }: { page: Page }) {
  const { lang } = useLanguage();
  const titles = useMemo<Record<Page, string>>(() => ({
    home: 'Home',
    about: copy(lang, 'عن AidiCore', 'About AidiCore', 'À propos d’AidiCore'),
    actions: copy(lang, 'مجالات الأثر', 'Impact Categories', 'Domaines d’impact'),
    rules: copy(lang, 'قواعد المنصة', 'Platform Rules', 'Règles de la plateforme'),
    impact: copy(lang, 'الأثر المجتمعي', 'Community Impact', 'Impact communautaire'),
    login: copy(lang, 'تسجيل الدخول', 'Login', 'Connexion'),
    signup: copy(lang, 'حساب جديد', 'Sign up', 'Créer un compte'),
    dashboard: copy(lang, 'لوحة الأثر', 'Impact Dashboard', 'Tableau d’impact'),
    record: copy(lang, 'سجّل أثرًا', 'Record Impact', 'Enregistrer un impact'),
    profile: copy(lang, 'جواز الأثر', 'Impact Passport', 'Passeport d’impact'),
    admin: copy(lang, 'الإدارة', 'Admin', 'Administration'),
    verify: copy(lang, 'تأكيد الأثر', 'Verify Impact', 'Confirmer'),
    privacy: copy(lang, 'سياسة الخصوصية', 'Privacy Policy', 'Politique de confidentialité'),
    terms: copy(lang, 'شروط الاستخدام', 'Terms of Use', 'Conditions d’utilisation'),
    contact: copy(lang, 'تواصل معنا', 'Contact', 'Contact'),
  }), [lang]);

  const descriptions = useMemo<Record<Page, string>>(() => ({
    home: '', about: '', actions: '', rules: '', impact: '', login: '', signup: '', dashboard: '', record: '', profile: '', admin: '', verify: '',
    privacy: copy(lang, 'نوضح كيف نحمي البيانات ونقلل جمع المعلومات الشخصية داخل AidiCore.', 'How AidiCore protects data and minimizes personal information collection.', 'Comment AidiCore protège les données et limite la collecte d’informations personnelles.'),
    terms: copy(lang, 'استخدام المنصة يعني الالتزام بالخصوصية وعدم إساءة استخدام نظام الأثر.', 'Using the platform means respecting privacy and not abusing the impact system.', 'L’utilisation de la plateforme implique le respect de la confidentialité et du système d’impact.'),
    contact: copy(lang, 'للاقتراحات أو الدعم أو الشراكات، تواصل معنا عبر القنوات الرسمية للمشروع.', 'For support, ideas, or partnerships, contact us through official AidiCore channels.', 'Pour le support, les idées ou les partenariats, contactez-nous via les canaux officiels d’AidiCore.'),
  }), [lang]);

  return (
    <Section>
      <Title title={titles[page]} text={descriptions[page] || copy(lang, 'سيتم تطوير محتوى هذه الصفحة في الإصدارات القادمة ضمن رؤية AidiCore الرسمية.', 'This page will be expanded in upcoming releases following the official AidiCore roadmap.', 'Cette page sera enrichie dans les prochaines versions selon la feuille de route officielle d’AidiCore.')} />
      <div className="card p-6 text-slate-300">
        {descriptions[page] || copy(lang, 'المحتوى قيد التطوير بدون بيانات تجريبية أو وعود غير مؤكدة.', 'Content is under development without demo claims or unsupported promises.', 'Contenu en cours de développement, sans données de démonstration ni promesses non vérifiées.')}
      </div>
    </Section>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </LanguageProvider>
  );
}
