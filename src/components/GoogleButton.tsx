import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, space } from '../theme';

type Props = { onPress: () => void; loading?: boolean; disabled?: boolean };

export default function GoogleButton({ onPress, loading, disabled }: Props) {
  const off = loading || disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel="Login with Google"
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, off && styles.off]}
    >
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : (
        <View style={styles.row}>
          <View style={styles.g}>
            <Text style={styles.gText}>G</Text>
          </View>
          <Text style={styles.label}>Login with Google</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: colors.bg },
  off: { opacity: 0.7 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space(1.5) },
  g: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gText: { color: colors.accent, fontWeight: '800', fontSize: 14 },
  label: { color: colors.ink, fontSize: 16, fontWeight: '600' },
});
