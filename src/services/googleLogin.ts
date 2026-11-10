// Native (Android / iOS) Google sign-in using expo-auth-session.
// The web version lives in googleLogin.web.ts; Metro picks the right file.
import { useEffect, useState } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin(onError: (message: string) => void) {
  const [busy, setBusy] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    selectAccount: true,
  });

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success') {
      const idToken = response.params.id_token;
      signInWithCredential(auth, GoogleAuthProvider.credential(idToken))
        .catch(() => onError('Sign-in failed. Please try again.'))
        .finally(() => setBusy(false));
    } else {
      setBusy(false);
      if (response.type === 'error') onError('Sign-in failed. Please try again.');
    }
  }, [response]);

  const signIn = async () => {
    setBusy(true);
    try {
      await promptAsync();
    } catch {
      setBusy(false);
      onError('Could not open Google sign-in.');
    }
  };

  return { signIn, busy, ready: !!request };
}
