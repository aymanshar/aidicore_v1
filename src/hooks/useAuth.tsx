import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import type { AppUser } from '../types';
import { getAppUser, listenToAuth } from '../services/authService';

type AuthContextValue = {
  firebaseUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!firebaseUser) {
      setAppUser(null);
      return;
    }
    setAppUser(await getAppUser(firebaseUser.uid));
  }, [firebaseUser]);

  useEffect(() => {
    return listenToAuth(async (user) => {
      setFirebaseUser(user);
      setAppUser(user ? await getAppUser(user.uid) : null);
      setLoading(false);
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const role = appUser?.role || 'user';
    const isModerator = ['moderator', 'admin', 'super_admin'].includes(role);
    const isAdmin = ['admin', 'super_admin'].includes(role);
    return { firebaseUser, appUser, loading, isAdmin, isModerator, refreshUser };
  }, [firebaseUser, appUser, loading, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
