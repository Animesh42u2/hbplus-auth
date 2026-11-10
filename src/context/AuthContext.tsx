import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { DOMAIN_ERROR, isAllowedEmail } from '../utils/domain';
import { Role, upsertUser } from '../services/users';

export type AppUser = {
  uid: string;
  email: string;
  name: string;
  photoURL: string | null;
  role: Role;
};

type AuthState = {
  user: AppUser | null;
  loading: boolean; // true until the first auth state is resolved
  error: string | null;
  setError: (message: string | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Single source of truth: Firebase auth state. Tokens are stored and
    // refreshed by the Firebase SDK, so the app never handles raw tokens.
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Domain gate (layer 2). Layer 3 is firestore.rules.
      if (!isAllowedEmail(fbUser.email) || !fbUser.emailVerified) {
        await signOut(auth);
        setUser(null);
        setError(DOMAIN_ERROR);
        setLoading(false);
        return;
      }

      try {
        const role = await upsertUser(fbUser);
        setError(null);
        setUser({
          uid: fbUser.uid,
          email: fbUser.email!,
          name: fbUser.displayName ?? fbUser.email!.split('@')[0],
          photoURL: fbUser.photoURL,
          role,
        });
      } catch {
        await signOut(auth);
        setUser(null);
        setError('Could not load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, setError, logout }),
    [user, loading, error, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
