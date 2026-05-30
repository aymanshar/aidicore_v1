import { Menu, X, HeartHandshake, Globe2 } from 'lucide-react';
import React, { useState } from 'react';
import logo from '../assets/aidicore-logo-concept.svg';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/authService';

type Page = 'home'|'about'|'actions'|'rules'|'impact'|'login'|'signup'|'dashboard'|'record'|'profile'|'admin'|'privacy'|'terms'|'contact';
export function Layout({ page, setPage, children }: { page: Page; setPage: (page: Page) => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false); const { t, lang, setLang, dir } = useLanguage(); const { firebaseUser, isAdmin } = useAuth();
  const nav: { key: Page; label: string }[] = [{key:'home',label:t('home')},{key:'impact',label:t('impact')},{key:'actions',label:t('actions')},{key:'rules',label:t('rules')},{key:'about',label:t('about')}];
  const go = (p: Page) => { setPage(p); setOpen(false); window.scrollTo({ top:0, behavior:'smooth' }); };
  return <div dir={dir} className="min-h-screen bg-[radial-gradient(circle_at_top,#172554_0%,#020617_36%,#020617_100%)]">
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <button onClick={() => go('home')} className="flex items-center gap-3 text-left"><img src={logo} className="h-11 w-11 rounded-2xl"/><span><span className="block text-lg font-extrabold">AidiCore</span><span className="hidden text-xs text-slate-400 sm:block">{t('tagline')}</span></span></button>
        <nav className="hidden items-center gap-2 lg:flex">{nav.map(n => <button key={n.key} onClick={() => go(n.key)} className={`rounded-full px-4 py-2 text-sm font-semibold ${page===n.key?'bg-white text-slate-950':'text-slate-300 hover:bg-white/10'}`}>{n.label}</button>)}</nav>
        <div className="hidden items-center gap-2 lg:flex">
          <button className="btn-soft !px-3 !py-2" onClick={() => setLang(lang==='en'?'ar':'en')}><Globe2 size={16}/>{lang==='en'?'AR':'EN'}</button>
          {firebaseUser ? <><button className="btn-soft !px-4 !py-2" onClick={() => go('dashboard')}>{t('dashboard')}</button>{isAdmin && <button className="btn-soft !px-4 !py-2" onClick={() => go('admin')}>{t('admin')}</button>}<button className="btn-primary !px-4 !py-2" onClick={() => logout()}>{t('logout')}</button></> : <button className="btn-primary !px-4 !py-2" onClick={() => go('login')}>{t('login')}</button>}
        </div>
        <button className="rounded-xl border border-white/10 p-2 lg:hidden" onClick={() => setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      </div>
      {open && <div className="border-t border-white/10 px-4 py-4 lg:hidden">{[...nav, ...(firebaseUser ? [{key:'dashboard' as Page,label:t('dashboard')},{key:'record' as Page,label:t('recordImpact')}] : [{key:'login' as Page,label:t('login')}])].map(n=><button key={n.key} onClick={()=>go(n.key)} className="block w-full rounded-xl px-4 py-3 text-start font-semibold hover:bg-white/10">{n.label}</button>)}<button className="mt-2 block w-full rounded-xl px-4 py-3 text-start font-semibold hover:bg-white/10" onClick={() => setLang(lang==='en'?'ar':'en')}>{lang==='en'?'العربية':'English'}</button></div>}
    </header>
    <main>{children}</main>
    <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-slate-400"><div className="mx-auto max-w-7xl">AidiCore © 2026 — {t('tagline')} · <button onClick={()=>go('privacy')}>Privacy</button> · <button onClick={()=>go('terms')}>Terms</button></div></footer>
  </div>
}
