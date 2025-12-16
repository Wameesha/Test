import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CoreInvestigationsScreen } from '../../../src/features/medical-records/screens';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../src/common/components/layout';
import { COLORS, TYPOGRAPHY, SPACING } from '../../../src/config/theme.config';

const PlaceholderScreen = ({ title }: { title: string }) => {
  const router = useRouter();
  
  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.background}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>Coming soon</Text>
      </View>
    </ScreenWrapper>
  );
};

export default function SubcategoryRoute() {
  const { id, subcategoryId } = useLocalSearchParams();

  if (id === 'diabetes' && subcategoryId === 'core-investigations') {
    return <CoreInvestigationsScreen />;
  }

  const getTitle = () => {
    switch (subcategoryId) {
      case 'core-informations':
        return 'Core Informations';
      case 'treatment-medications':
        return 'Treatment / Medications';
      case 'self-management':
        return 'Self-management';
      case 'urgent-items':
        return 'Urgent Items';
      default:
        return 'Reports';
    }
  };

  return <PlaceholderScreen title={getTitle()} />;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
  },
});
