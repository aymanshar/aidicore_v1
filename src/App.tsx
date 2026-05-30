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
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Layout } from './components/Layout';
import { categories } from './data/categories';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { login, resetPassword, signup, updateCurrentUserProfile } from './services/authService';
import {
  createImpactRecord,
  listAllImpactRecords,
  listMyImpactRecords,
  listPendingImpactRecords,
  listPublicImpactRecords,
  reviewImpactRecord,
} from './services/impactService';
import { listAuditLogs } from './services/auditService';
import { getSettings, saveSettings } from './services/settingsService';
import { listUsers, updateUserRole, updateUserStatus } from './services/userService';
import type { AppSettings, AppUser, AuditLog, ImpactCategory, ImpactRecord, UserRole, UserStatus, Visibility } from './types';

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
  | 'privacy'
  | 'terms'
  | 'contact';

const fade = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

function Shell() {
  const [page, setPage] = useState<Page>('home');
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
  return <SimplePage page={page} />;
}

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-7xl px-4 py-16 ${className}`}>{children}</section>;
}

function Home({ setPage }: { setPage: (p: Page) => void }) {
  const { t, lang } = useLanguage();
  const featuredCategories = categories.slice(0, 6);

  return (
    <>
      <Section className="py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <motion.div {...fade}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-200 shadow-[0_0_40px_rgba(16,185,129,.12)]">
              <Sparkles size={16} />
              {lang === 'ar' ? 'منصة أثر مجتمعي خصوصية-أولًا' : 'Privacy-first community impact'}
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
              <TrustPill icon={<LockKeyhole size={16} />} label={lang === 'ar' ? 'خصوصية افتراضية' : 'Privacy by default'} />
              <TrustPill icon={<ShieldCheck size={16} />} label={lang === 'ar' ? 'مراجعة قبل الاعتماد' : 'Reviewed before approval'} />
              <TrustPill icon={<EyeOff size={16} />} label={lang === 'ar' ? 'بدون تفاخر أو ترتيب' : 'No leaderboard'} />
            </div>
          </motion.div>

          <motion.div {...fade} className="glass overflow-hidden rounded-[2rem] p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-emerald-300">AidiCore Impact Pulse</p>
                <h2 className="mt-1 text-2xl font-extrabold text-white">
                  {lang === 'ar' ? 'مؤشر الأثر الآمن' : 'Safe Impact Snapshot'}
                </h2>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-emerald-300">
                <HeartHandshake />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric title={lang === 'ar' ? 'أثر مسجل' : 'Actions Recorded'} value="12,458" />
              <Metric title={lang === 'ar' ? 'مدينة' : 'Cities'} value="41" />
              <Metric title={lang === 'ar' ? 'مجالات خدمة' : 'Categories'} value="18" />
              <Metric title={lang === 'ar' ? 'مراجعة آمنة' : 'Safe Review'} value="97%" />
            </div>
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">{lang === 'ar' ? 'مثال عرض عام' : 'Anonymous community feed example'}</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {lang === 'ar'
                  ? 'شخص في أبوظبي ساعد كبير سن اليوم — بدون كشف أي بيانات شخصية.'
                  : 'Someone in Abu Dhabi helped a senior today — without exposing personal details.'}
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      <Section className="pt-4">
        <Title
          title={lang === 'ar' ? 'مجالات أثر جاهزة وآمنة' : 'Guided impact categories'}
          text={
            lang === 'ar'
              ? 'قوالب واضحة تساعد المستخدم على التسجيل بسرعة، وتقلل مشاركة البيانات الحساسة.'
              : 'Clear templates make recording faster and reduce the chance of sharing sensitive information.'
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
                <h3 className="text-xl font-bold text-white">{lang === 'ar' ? category.ar : category.en}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {lang === 'ar' ? 'سجل أثرًا مختصرًا وآمنًا ضمن مجال واضح.' : 'Record safe, concise impact under a clear category.'}
                </p>
              </button>
            );
          })}
        </div>
      </Section>

      <Section>
        <Title
          title={lang === 'ar' ? 'كيف يعمل؟' : 'How it works'}
          text={lang === 'ar' ? 'ثلاث خطوات بسيطة تحافظ على الثقة والخصوصية.' : 'Three simple steps designed around trust and privacy.'}
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Step icon={<UserRoundCheck />} title={t('record')} text={lang === 'ar' ? 'المستخدم يسجل أثرًا إيجابيًا مع سياق آمن على مستوى المدينة.' : 'Submit a positive action with safe city-level context.'} />
          <Step icon={<ShieldCheck />} title={t('review')} text={lang === 'ar' ? 'الأفعال الحساسة أو المشكوك فيها تدخل مراجعة الإدارة.' : 'Moderators review suspicious or sensitive records.'} />
          <Step icon={<CheckCircle2 />} title={t('visibleImpact')} text={lang === 'ar' ? 'الأثر المعتمد يزيد رصيد الثقة والأثر المجتمعي.' : 'Approved actions increase personal and community impact.'} />
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
  return (
    <div className="card p-5">
      <div className="text-3xl font-extrabold text-white">{value}</div>
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
          title={lang === 'ar' ? 'مجالات الأثر' : 'Impact Categories'}
          text={lang === 'ar' ? 'قوالب واضحة تساعد المستخدم على التسجيل بدون كشف بيانات حساسة.' : 'Guided categories help users record safer, clearer impact.'}
        />
        <button className="btn-primary w-fit" onClick={() => setPage('record')}>{lang === 'ar' ? 'سجّل أثرًا' : 'Record Impact'}</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id} className="card p-6">
              <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${category.color} p-3 text-white`}>
                <Icon />
              </div>
              <h3 className="text-xl font-bold">{lang === 'ar' ? category.ar : category.en}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {lang === 'ar' ? 'سجل أثرًا مختصرًا وآمنًا بدون بيانات شخصية حساسة.' : 'Record concise, safe impact without sensitive personal data.'}
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
  return (
    <Section>
      <Title
        title={lang === 'ar' ? 'الأثر المجتمعي' : 'Community Impact'}
        text={lang === 'ar' ? 'صفحة عامة مجهولة الهوية لا تشبه شبكات التواصل ولا تعرض بيانات شخصية.' : 'An anonymous-first public impact view, not a social feed.'}
      />
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Step icon={<HeartHandshake />} title={lang === 'ar' ? 'مجهول افتراضيًا' : 'Anonymous by default'} text={lang === 'ar' ? 'لا يظهر اسم المستخدم إلا باختياره.' : 'Names are only shown when the user chooses public attribution.'} />
        <Step icon={<ClipboardCheck />} title={lang === 'ar' ? 'اعتماد قبل الظهور' : 'Reviewed before visibility'} text={lang === 'ar' ? 'لا يظهر الأثر كمعتمد قبل المراجعة.' : 'Impact is not treated as approved before review.'} />
        <Step icon={<Layers3 />} title={lang === 'ar' ? 'أثر لا منافسة' : 'Impact, not competition'} text={lang === 'ar' ? 'لا توجد قوائم ترتيب أو ضغط اجتماعي.' : 'No leaderboards or unhealthy social pressure.'} />
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

  if (loading) return <div className="card p-6 text-slate-300">{lang === 'ar' ? 'جارٍ تحميل الأثر العام...' : 'Loading public impact...'}</div>;

  return (
    <div className="grid gap-4">
      {records.length === 0 ? (
        <div className="card p-6 text-slate-300">
          {lang === 'ar' ? 'لا توجد سجلات عامة بعد. بعد إعداد Firebase واعتماد الأفعال ستظهر هنا.' : 'No public records yet. After Firebase setup and approval, records will appear here.'}
        </div>
      ) : (
        records.map((record) => <ImpactCard key={record.id} record={record} />)
      )}
    </div>
  );
}

function ImpactCard({ record }: { record: ImpactRecord }) {
  const { lang } = useLanguage();
  const actor = record.visibility === 'public_profile' ? record.userDisplayName : lang === 'ar' ? 'شخص ما' : 'Someone';
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-white">{record.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{record.city}, {record.countryCode} · {actor}</p>
        </div>
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">{lang === 'ar' ? 'معتمد' : 'Approved'}</span>
      </div>
    </div>
  );
}

function Rules() {
  const { lang } = useLanguage();
  const rules = lang === 'ar'
    ? ['لا تشارك بيانات شخصية حساسة.', 'لا تستخدم عناوين دقيقة.', 'الأثر لا يظهر كمعتمد قبل المراجعة.', 'النقاط رمزية وليست وعدًا ماليًا.', 'أي محاولة احتيال قد تؤدي لتعليق الحساب.']
    : ['Do not share sensitive personal data.', 'Do not use precise addresses.', 'Impact records are reviewed before approval.', 'Impact score is symbolic, not financial.', 'Abuse or spam can lead to suspension.'];
  return (
    <Section>
      <Title title={lang === 'ar' ? 'قواعد الثقة' : 'Trust Rules'} text={lang === 'ar' ? 'القواعد مصممة لحماية المستخدمين ومنع التفاخر أو الاحتيال.' : 'Rules are designed to protect users and prevent abuse.'} />
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
      <Title title={lang === 'ar' ? 'عن AidiCore' : 'About AidiCore'} text={lang === 'ar' ? 'AidiCore منصة أثر مجتمعي تحافظ على الخصوصية والثقة.' : 'AidiCore is a privacy-first community impact platform.'} />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <div className="card p-7 text-lg leading-8 text-slate-300">
          {lang === 'ar'
            ? 'نحن لا نبني شبكة اجتماعية للتفاخر، بل سجل أثر آمن يساعد الأفراد والمؤسسات على قياس الخير بطريقة محترمة وقابلة للتوسع.'
            : 'We are not building a social network for showing off. We are building a safer impact registry that helps people and organizations measure positive actions respectfully.'}
        </div>
        <div className="card p-7">
          <h3 className="text-xl font-bold text-white">{lang === 'ar' ? 'مبادئ المنتج' : 'Product principles'}</h3>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            <TrustPill icon={<LockKeyhole size={16} />} label={lang === 'ar' ? 'خصوصية قبل الانتشار' : 'Privacy before visibility'} />
            <TrustPill icon={<ShieldCheck size={16} />} label={lang === 'ar' ? 'ثقة قبل التقدير' : 'Trust before recognition'} />
            <TrustPill icon={<HeartHandshake size={16} />} label={lang === 'ar' ? 'أثر لا تفاخر' : 'Impact, not showing off'} />
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
  const { lang } = useLanguage();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setSubmitting(true);
    try {
      if (mode === 'login') await login(email, password);
      else await signup(email, password, name || email.split('@')[0]);
      setPage('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
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
      setNotice(lang === 'ar' ? 'إذا كان Firebase مفعّلًا، سيتم إرسال رابط إعادة التعيين.' : 'If Firebase is configured, a reset link will be sent.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    }
  };

  return (
    <Section className="max-w-xl">
      <div className="glass rounded-[2rem] p-8">
        <h1 className="text-3xl font-extrabold">{mode === 'login' ? (lang === 'ar' ? 'تسجيل الدخول' : 'Login') : (lang === 'ar' ? 'حساب جديد' : 'Create account')}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {lang === 'ar' ? 'في وضع التجربة يمكنك استخدام أي بريد. اجعل البريد يحتوي admin لتجربة لوحة الإدارة.' : 'In demo mode, use any email. Include admin in the email to test the admin console.'}
        </p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          {mode === 'signup' && <input className="input" placeholder={lang === 'ar' ? 'الاسم' : 'Display name'} value={name} onChange={(event) => setName(event.target.value)} />}
          <input className="input" type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          {error && <p className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          {notice && <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}
          <button className="btn-primary justify-center" disabled={submitting} type="submit">{submitting ? (lang === 'ar' ? 'جارٍ المعالجة...' : 'Processing...') : mode === 'login' ? 'Login' : 'Sign up'}</button>
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

  return (
    <Section>
      <Title title={lang === 'ar' ? 'لوحة الأثر' : 'Impact Dashboard'} text={`${lang === 'ar' ? 'مرحبًا' : 'Welcome'}, ${appUser?.displayName || firebaseUser.email}`} />
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Impact Score" value={String(appUser?.impactScore || approved * 10)} />
        <Metric title={lang === 'ar' ? 'معتمد' : 'Approved'} value={loading ? '…' : String(approved)} />
        <Metric title={lang === 'ar' ? 'قيد المراجعة' : 'Pending'} value={loading ? '…' : String(pending)} />
        <Metric title={lang === 'ar' ? 'مجالات' : 'Categories'} value={loading ? '…' : String(categoriesCount)} />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <button className="btn-primary" onClick={() => setPage('record')}>{lang === 'ar' ? 'سجّل أثرًا' : 'Record Impact'}</button>
        <button className="btn-soft" onClick={() => setPage('profile')}>{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</button>
      </div>
      <MyRecords records={records} loading={loading} />
    </Section>
  );
}

function MyRecords({ records, loading }: { records: ImpactRecord[]; loading: boolean }) {
  const { lang } = useLanguage();
  if (loading) return <div className="card mt-8 p-6 text-slate-300">{lang === 'ar' ? 'جارٍ تحميل أثرك...' : 'Loading your impact...'}</div>;
  return (
    <div className="mt-8 grid gap-3">
      {records.length === 0 ? <div className="card p-6 text-slate-300">{lang === 'ar' ? 'لم تسجل أي أثر بعد.' : 'No impact records yet.'}</div> : records.map((record) => <ImpactCard key={record.id} record={record} />)}
    </div>
  );
}

function Profile({ setPage }: { setPage: (p: Page) => void }) {
  const { firebaseUser, appUser, refreshUser } = useAuth();
  const { lang } = useLanguage();
  const [displayName, setDisplayName] = useState(appUser?.displayName || firebaseUser?.displayName || '');
  const [avatarUrl, setAvatarUrl] = useState(appUser?.avatarUrl || firebaseUser?.photoURL || '');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(appUser?.displayName || firebaseUser?.displayName || '');
    setAvatarUrl(appUser?.avatarUrl || firebaseUser?.photoURL || '');
  }, [appUser, firebaseUser]);

  if (!firebaseUser) return <RequireLogin setPage={setPage} />;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    await updateCurrentUserProfile(firebaseUser, { displayName, avatarUrl });
    await refreshUser();
    setSaving(false);
    setMessage(lang === 'ar' ? 'تم حفظ الملف الشخصي.' : 'Profile saved.');
  };

  return (
    <Section className="max-w-3xl">
      <Title title={lang === 'ar' ? 'الملف الشخصي' : 'Profile'} text={lang === 'ar' ? 'إدارة بيانات عامة فقط بدون كشف معلومات حساسة.' : 'Manage safe public profile details only.'} />
      <form onSubmit={save} className="card grid gap-4 p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-2xl font-extrabold text-emerald-200">
            {avatarUrl ? <img src={avatarUrl} className="h-full w-full object-cover" alt="avatar" /> : (displayName || firebaseUser.email || 'A').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-white">{firebaseUser.email}</div>
            <div className="text-sm text-slate-400">{lang === 'ar' ? 'الدور' : 'Role'}: {appUser?.role || 'user'} · {lang === 'ar' ? 'الحالة' : 'Status'}: {appUser?.status || 'active'}</div>
          </div>
        </div>
        <input className="input" placeholder={lang === 'ar' ? 'الاسم الظاهر' : 'Display name'} value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
        <input className="input" placeholder={lang === 'ar' ? 'رابط صورة اختيارية' : 'Optional avatar URL'} value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} />
        {message && <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</p>}
        <button className="btn-primary justify-center" disabled={saving}>{saving ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ' : 'Save')}</button>
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
  const [form, setForm] = useState({
    title: '',
    category: 'community_service' as ImpactCategory,
    details: '',
    occurredAt: new Date().toISOString().slice(0, 10),
    countryCode: 'AE',
    city: '',
    visibility: 'anonymous_public' as Visibility,
  });
  const [done, setDone] = useState(false);

  if (!firebaseUser) return <RequireLogin setPage={setPage} />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await createImpactRecord({
      ...form,
      userId: firebaseUser.uid,
      userDisplayName: appUser?.displayName || firebaseUser.email || 'User',
    });
    setDone(true);
  };

  return (
    <Section className="max-w-3xl">
      <Title title={lang === 'ar' ? 'سجّل أثرًا إيجابيًا' : 'Record Impact'} text={lang === 'ar' ? 'اكتب وصفًا آمنًا بدون أرقام هواتف أو عناوين دقيقة.' : 'Write a safe description without phone numbers or precise addresses.'} />
      {done ? (
        <div className="card p-8">
          <CheckCircle2 className="text-emerald-300" />
          <h2 className="mt-3 text-2xl font-bold">{lang === 'ar' ? 'تم الإرسال للمراجعة' : 'Submitted for review'}</h2>
        </div>
      ) : (
        <form onSubmit={submit} className="card grid gap-4 p-6">
          <input className="input" placeholder={lang === 'ar' ? 'العنوان' : 'Title'} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          <select className="input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ImpactCategory })}>
            {categories.map((category) => <option key={category.id} value={category.id}>{lang === 'ar' ? category.ar : category.en}</option>)}
          </select>
          <textarea className="input min-h-32" placeholder={lang === 'ar' ? 'التفاصيل الآمنة' : 'Safe details'} value={form.details} onChange={(event) => setForm({ ...form, details: event.target.value })} required />
          <div className="grid gap-4 md:grid-cols-3">
            <input className="input" type="date" value={form.occurredAt} onChange={(event) => setForm({ ...form, occurredAt: event.target.value })} />
            <input className="input" placeholder="Country" value={form.countryCode} onChange={(event) => setForm({ ...form, countryCode: event.target.value })} />
            <input className="input" placeholder={lang === 'ar' ? 'المدينة' : 'City'} value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
          </div>
          <select className="input" value={form.visibility} onChange={(event) => setForm({ ...form, visibility: event.target.value as Visibility })}>
            <option value="private">{lang === 'ar' ? 'خاص' : 'Private'}</option>
            <option value="anonymous_public">{lang === 'ar' ? 'عام بدون اسم' : 'Anonymous public'}</option>
            <option value="public_profile">{lang === 'ar' ? 'عام باسم المستخدم' : 'Public profile'}</option>
          </select>
          <button className="btn-primary justify-center">{lang === 'ar' ? 'إرسال للمراجعة' : 'Submit for review'}</button>
        </form>
      )}
    </Section>
  );
}

function Admin() {
  const { isModerator, firebaseUser, appUser } = useAuth();
  const [tab, setTab] = useState<'overview' | 'records' | 'users' | 'logs' | 'settings'>('overview');
  const [records, setRecords] = useState<ImpactRecord[]>([]);
  const [allRecords, setAllRecords] = useState<ImpactRecord[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  const loadAdminData = async () => {
    if (!isModerator) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [pending, all, appUsers, auditItems, appSettings] = await Promise.all([
      listPendingImpactRecords().catch(() => []),
      listAllImpactRecords().catch(() => []),
      listUsers().catch(() => []),
      listAuditLogs().catch(() => []),
      getSettings().catch(() => null),
    ]);
    setRecords(pending);
    setAllRecords(all);
    setUsers(appUsers);
    setLogs(auditItems);
    setSettings(appSettings);
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
    const note = window.prompt(status === 'approved' ? 'Approval note' : 'Rejection note', status) || status;
    await reviewImpactRecord(record.id, status, firebaseUser!.uid, note, firebaseUser?.email || undefined);
    await loadAdminData();
  };

  const updateRole = async (uid: string, role: UserRole) => {
    await updateUserRole(uid, role, firebaseUser!.uid, firebaseUser?.email || undefined);
    await loadAdminData();
  };

  const updateStatus = async (uid: string, status: UserStatus) => {
    await updateUserStatus(uid, status, firebaseUser!.uid, firebaseUser?.email || undefined);
    await loadAdminData();
  };

  const saveAdminSettings = async () => {
    if (!settings || !firebaseUser) return;
    await saveSettings(settings, firebaseUser.uid, firebaseUser.email || undefined);
    await loadAdminData();
  };

  const approved = allRecords.filter((record) => record.status === 'approved').length;
  const rejected = allRecords.filter((record) => record.status === 'rejected').length;

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

      {loading ? <div className="card p-6 text-slate-300">Loading admin data...</div> : (
        <>
          {tab === 'overview' && (
            <div className="grid gap-4 md:grid-cols-4">
              <Metric title={lang === 'ar' ? 'قيد المراجعة' : 'Pending Review'} value={String(records.length)} />
              <Metric title={lang === 'ar' ? 'معتمد' : 'Approved'} value={String(approved)} />
              <Metric title={lang === 'ar' ? 'مرفوض' : 'Rejected'} value={String(rejected)} />
              <Metric title={lang === 'ar' ? 'المستخدمون' : 'Users'} value={String(users.length)} />
            </div>
          )}

          {tab === 'records' && (
            <div className="grid gap-4">
              {records.length === 0 ? <div className="card p-6 text-slate-300">No pending records.</div> : records.map((record) => (
                <div key={record.id} className="card p-5">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <h3 className="font-bold">{record.title}</h3>
                      <p className="text-sm text-slate-400">{record.city} · Fraud {record.fraudScore}/100 · {record.auditRequired ? 'Audit required' : 'Standard'} · {record.visibility}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-soft !py-2" onClick={() => review(record, 'rejected')}>Reject</button>
                      <button className="btn-primary !py-2" onClick={() => review(record, 'approved')}>Approve</button>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{record.details}</p>
                  {record.auditNote && <p className="mt-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100"><ShieldAlert className="inline" size={16} /> {record.auditNote}</p>}
                </div>
              ))}
            </div>
          )}

          {tab === 'users' && (
            <div className="grid gap-3">
              {users.length === 0 ? <div className="card p-6 text-slate-300">No users found yet.</div> : users.map((user) => (
                <div key={user.uid} className="card flex flex-wrap items-center justify-between gap-4 p-5">
                  <div>
                    <div className="font-bold text-white">{user.displayName}</div>
                    <div className="text-sm text-slate-400">{user.email} · {user.role} · {user.status}</div>
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
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'logs' && (
            <div className="grid gap-3">
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

function SimplePage({ page }: { page: Page }) {
  const { lang } = useLanguage();
  const titles = useMemo<Record<Page, string>>(() => ({
    home: 'Home',
    about: lang === 'ar' ? 'عن المشروع' : 'About',
    actions: lang === 'ar' ? 'مجالات الأثر' : 'Actions',
    rules: lang === 'ar' ? 'قواعد الثقة' : 'Rules',
    impact: lang === 'ar' ? 'الأثر' : 'Impact',
    login: 'Login',
    signup: 'Signup',
    dashboard: 'Dashboard',
    record: 'Record Impact',
    profile: lang === 'ar' ? 'الملف الشخصي' : 'Profile',
    admin: 'Admin',
    privacy: lang === 'ar' ? 'الخصوصية' : 'Privacy',
    terms: lang === 'ar' ? 'الشروط' : 'Terms',
    contact: lang === 'ar' ? 'تواصل معنا' : 'Contact',
  }), [lang]);

  return (
    <Section>
      <Title title={titles[page]} text={lang === 'ar' ? 'هذه الصفحة مثبتة في خريطة AidiCore V1 وسيتم تطوير محتواها في الإصدارات القادمة.' : 'This page is prepared in the AidiCore V1 route map and will be expanded in upcoming releases.'} />
      <div className="card p-6 text-slate-300">{lang === 'ar' ? 'محتوى مبدئي للصفحات القانونية والتواصل والملف الشخصي.' : 'Content-ready placeholder for legal, contact, and profile content.'}</div>
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
