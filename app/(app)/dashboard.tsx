import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { colors, radius, space } from '../../src/theme';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const initial = (user.name || user.email).charAt(0).toUpperCase();

  const onLogout = async () => {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profile}>
            {user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
            )}
            <View style={styles.flex}>
              <Text style={styles.name} numberOfLines={1}>{user.name}</Text>
              <Text style={styles.email} numberOfLines={1}>{user.email}</Text>
            </View>
          </View>
          <View style={[styles.badge, isAdmin && styles.badgeAdmin]}>
            <Text style={[styles.badgeText, isAdmin && styles.badgeTextAdmin]}>
              {isAdmin ? 'Admin' : 'User'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.h1}>Welcome back, {(user.name || user.email).split(/[ @]/)[0]}</Text>
          <Text style={styles.p}>
            You're signed in with your official account. This page is only visible to verified
            team members.
          </Text>
        </View>

        {isAdmin ? (
          <View style={[styles.card, styles.adminCard]}>
            <Text style={styles.h2}>Admin panel</Text>
            <Text style={styles.p}>
              You have admin access. Admins can read all user profiles (enforced by Firestore rules).
            </Text>
          </View>
        ) : null}

        <Pressable
          onPress={onLogout}
          disabled={signingOut}
          accessibilityRole="button"
          style={({ pressed }) => [styles.logout, pressed && { opacity: 0.8 }, signingOut && { opacity: 0.6 }]}
        >
          <Text style={styles.logoutText}>{signingOut ? 'Logging out…' : 'Logout'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, alignItems: 'center', padding: space(3) },
  container: { width: '100%', maxWidth: 720, gap: space(2) },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space(2),
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space(2),
  },
  profile: { flexDirection: 'row', alignItems: 'center', gap: space(1.5), flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 18 },
  name: { fontSize: 16, fontWeight: '600', color: colors.ink },
  email: { fontSize: 13, color: colors.muted },
  badge: { paddingHorizontal: space(1.5), paddingVertical: space(0.5), borderRadius: 999, backgroundColor: colors.bg },
  badgeAdmin: { backgroundColor: colors.accentSoft },
  badgeText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  badgeTextAdmin: { color: colors.accent },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space(3),
  },
  adminCard: { borderColor: colors.accent },
  h1: { fontSize: 22, fontWeight: '700', color: colors.ink, marginBottom: space(1) },
  h2: { fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: space(1) },
  p: { fontSize: 15, lineHeight: 22, color: colors.muted },
  logout: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space(1),
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
