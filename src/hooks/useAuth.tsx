import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import type { AppUser } from '../types';
import { getAppUser, listenToAuth } from '../services/authService';

type AuthContextValue = { firebaseUser: User | null; appUser: AppUser | null; loading: boolean; isAdmin: boolean };
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null); const [appUser, setAppUser] = useState<AppUser | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => listenToAuth(async (user) => { setFirebaseUser(user); setAppUser(user ? await getAppUser(user.uid) : null); setLoading(false); }), []);
  const isAdmin = ['admin','moderator','super_admin'].includes(appUser?.role || '');
  return <AuthContext.Provider value={{ firebaseUser, appUser, loading, isAdmin }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used inside AuthProvider'); return ctx; }
