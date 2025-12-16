import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ScreenWrapper } from '../../../src/common/components/layout';
import { Header, Card } from '../../../src/common/components/ui';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../src/config/theme.config';

export default function RecordDetailRoute() {
  const { id } = useLocalSearchParams();

  return (
    <ScreenWrapper safeArea>
      <Header title="Record Details" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.title}>Record #{id}</Text>
          <Text style={styles.description}>
            Record details will be displayed here.
          </Text>
        </Card>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: SPACING.md,
  },
  card: {
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
  },
});
