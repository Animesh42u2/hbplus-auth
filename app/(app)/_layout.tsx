import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AppLayout() {
  const { user } = useAuth();
  // Second line of defence in case the guard in the root layout is bypassed.
  if (!user) return <Redirect href="/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
