import { User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export type Role = 'admin' | 'user';

/**
 * Creates users/{uid} on first login (role "user") or refreshes profile fields.
 * Role is never written after creation, so admins are promoted manually in the
 * Firebase console (Firestore rules block self-promotion).
 */
export async function upsertUser(user: User): Promise<Role> {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    await updateDoc(ref, {
      name: user.displayName ?? '',
      photoURL: user.photoURL ?? '',
      lastLoginAt: serverTimestamp(),
    });
    return snap.data().role === 'admin' ? 'admin' : 'user';
  }

  await setDoc(ref, {
    email: user.email,
    name: user.displayName ?? '',
    photoURL: user.photoURL ?? '',
    role: 'user',
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });
  return 'user';
}
