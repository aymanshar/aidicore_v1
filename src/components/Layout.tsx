import { Globe2, HeartHandshake, Menu, X } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import logo from '../assets/aidicore-logo-concept.svg';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../i18n/LanguageContext';
import { logout } from '../services/authService';
import type { Page } from '../App';

export function Layout({ page, setPage, children }: { page: Page; setPage: (page: Page) => void; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { t, lang, setLang, dir } = useLanguage();
  const { firebaseUser, isAdmin } = useAuth();

  const nav: { key: Page; label: string }[] = [
    { key: 'home', label: t('home') },
    { key: 'impact', label: t('impact') },
    { key: 'actions', label: t('actions') },
    { key: 'rules', label: t('rules') },
    { key: 'about', label: t('about') },
  ];

  const accountNav: { key: Page; label: string }[] = firebaseUser
    ? [
        { key: 'dashboard', label: t('dashboard') },
        { key: 'record', label: t('recordImpact') },
        ...(isAdmin ? [{ key: 'admin' as Page, label: t('admin') }] : []),
      ]
    : [{ key: 'login', label: t('login') }];

  const go = (target: Page) => {
    setPage(target);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    go('home');
  };

  return (
    <div dir={dir} className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,#172554_0%,#020617_36%,#020617_100%)]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button onClick={() => go('home')} className="flex min-w-0 items-center gap-3 text-left">
            <img src={logo} className="h-11 w-11 shrink-0 rounded-2xl" alt="AidiCore" />
            <span className="min-w-0">
              <span className="block text-lg font-extrabold leading-5 text-white">AidiCore</span>
              <span className="hidden truncate text-xs text-slate-400 sm:block">{t('tagline')}</span>
            </span>
          </button>

          <nav className="hidden items-center gap-2 lg:flex">
            {nav.map((item) => (
              <button key={item.key} onClick={() => go(item.key)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${page === item.key ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <button className="btn-soft !px-3 !py-2" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
              <Globe2 size={16} />
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            {firebaseUser ? (
              <>
                <button className="btn-soft !px-4 !py-2" onClick={() => go('dashboard')}>{t('dashboard')}</button>
                <button className="btn-primary !px-4 !py-2" onClick={() => go('record')}>{t('recordImpact')}</button>
                {isAdmin && <button className="btn-soft !px-4 !py-2" onClick={() => go('admin')}>{t('admin')}</button>}
                <button className="btn-ghost !px-4 !py-2" onClick={handleLogout}>{t('logout')}</button>
              </>
            ) : (
              <button className="btn-primary !px-4 !py-2" onClick={() => go('login')}>{t('login')}</button>
            )}
          </div>

          <button className="rounded-xl border border-white/10 p-2 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open && (
          <div className="border-t border-white/10 px-4 py-4 lg:hidden">
            {[...nav, ...accountNav].map((item) => (
              <button key={item.key} onClick={() => go(item.key)} className={`block w-full rounded-xl px-4 py-3 text-start font-semibold transition ${page === item.key ? 'bg-white text-slate-950' : 'hover:bg-white/10'}`}>
                {item.label}
              </button>
            ))}
            <button className="mt-2 block w-full rounded-xl px-4 py-3 text-start font-semibold hover:bg-white/10" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            {firebaseUser && (
              <button className="mt-2 block w-full rounded-xl px-4 py-3 text-start font-semibold text-red-200 hover:bg-red-500/10" onClick={handleLogout}>
                {t('logout')}
              </button>
            )}
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 px-4 py-10 text-sm text-slate-400">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.1fr_.9fr_.9fr]">
          <div>
            <div className="flex items-center gap-3 text-white">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-emerald-300"><HeartHandshake /></div>
              <div>
                <div className="text-lg font-extrabold">AidiCore</div>
                <div className="text-xs text-slate-400">{t('tagline')}</div>
              </div>
            </div>
            <p className="mt-4 max-w-md leading-7">
              {lang === 'ar' ? 'منصة أثر مجتمعي خصوصية-أولًا، مصممة لإظهار الخير بأمان وبدون تفاخر.' : 'A privacy-first community impact platform designed to make good visible safely, without turning kindness into competition.'}
            </p>
          </div>
          <FooterLinks title={lang === 'ar' ? 'المنصة' : 'Platform'} items={nav} go={go} />
          <FooterLinks title={lang === 'ar' ? 'القانون والتواصل' : 'Legal & Contact'} items={[{ key: 'privacy', label: 'Privacy' }, { key: 'terms', label: 'Terms' }, { key: 'contact', label: 'Contact' }]} go={go} />
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-xs">AidiCore © 2026 — Version 1.1.0 Design System Upgrade</div>
      </footer>
    </div>
  );
}

function FooterLinks({ title, items, go }: { title: string; items: { key: Page; label: string }[]; go: (page: Page) => void }) {
  return (
    <div>
      <h3 className="font-bold text-white">{title}</h3>
      <div className="mt-4 grid gap-2">
        {items.map((item) => (
          <button key={item.key} onClick={() => go(item.key)} className="w-fit text-start text-slate-400 hover:text-white">
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
