import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useGoogleLogin } from '../src/services/googleLogin';
import GoogleButton from '../src/components/GoogleButton';
import ErrorBanner from '../src/components/ErrorBanner';
import { ALLOWED_DOMAIN } from '../src/utils/domain';
import { colors, radius, space } from '../src/theme';

export default function LoginScreen() {
  const { error, setError } = useAuth();
  const { signIn, busy, ready } = useGoogleLogin((msg) => setError(msg));

  const onPress = () => {
    setError(null);
    signIn();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>HB+</Text>
          </View>
          <Text style={styles.title}>Sign in to your workspace</Text>
          <Text style={styles.subtitle}>
            Use your @{ALLOWED_DOMAIN} Google account. Other accounts can't sign in.
          </Text>

          {error ? <ErrorBanner message={error} /> : null}

          <GoogleButton onPress={onPress} loading={busy} disabled={!ready} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: space(3) },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space(4),
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space(3),
  },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 20, letterSpacing: 0.5 },
  title: { fontSize: 24, fontWeight: '700', color: colors.ink, marginBottom: space(1) },
  subtitle: { fontSize: 15, lineHeight: 22, color: colors.muted, marginBottom: space(3) },
});
