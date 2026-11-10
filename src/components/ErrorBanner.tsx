import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, space } from '../theme';

export default function ErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.box} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: colors.dangerSoft,
    borderColor: '#F4B7B0',
    borderWidth: 1,
    borderRadius: radius.sm,
    padding: space(1.5),
    marginBottom: space(2),
  },
  text: { color: colors.danger, fontSize: 14, lineHeight: 20 },
});
