import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import Loader from '../src/components/Loader';

function RootNavigator() {
  const { user, loading } = useAuth();

  // Don't render any route until Firebase has restored the session,
  // otherwise a refresh would flash the login page.
  if (loading) return <Loader />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* Only reachable when logged in. Direct URL access redirects away. */}
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      {/* Only reachable when logged out */}
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}
