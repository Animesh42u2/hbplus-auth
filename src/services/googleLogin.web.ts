// Web Google sign-in using Firebase popup flow.
import { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import { ALLOWED_DOMAIN } from '../utils/domain';

export function useGoogleLogin(onError: (message: string) => void) {
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    setBusy(true);
    try {
      const provider = new GoogleAuthProvider();
      // "hd" only filters Google's account picker (UX hint). It is NOT security;
      // the real checks are in AuthContext and firestore.rules.
      // It is skipped for gmail.com because Google rejects hd=gmail.com.
      provider.setCustomParameters({
        prompt: 'select_account',
        ...(ALLOWED_DOMAIN !== 'gmail.com' ? { hd: ALLOWED_DOMAIN } : {}),
      });
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      if (e?.code !== 'auth/popup-closed-by-user' && e?.code !== 'auth/cancelled-popup-request') {
        onError('Sign-in failed. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  return { signIn, busy, ready: true };
}
