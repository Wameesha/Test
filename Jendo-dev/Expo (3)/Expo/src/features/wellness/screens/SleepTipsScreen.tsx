import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../common/components/layout';
import { COLORS } from '../../../config/theme.config';
import { wellnessStyles as styles } from '../components';

const SLEEP_TIPS = [
  {
    id: '1',
    title: 'Sleep Schedule',
    description: 'Maintain consistent bedtime and wake time',
    completed: true,
  },
  {
    id: '2',
    title: 'Screen Time Limit',
    description: 'Avoid screens 1 hour before bedtime',
    completed: true,
  },
  {
    id: '3',
    title: 'Sleep Environment',
    description: 'Keep bedroom cool, dark, and quiet',
    completed: true,
  },
];

export const SleepTipsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.white}>
      <View style={styles.headerWithBack}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Tips</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications" size={24} color={COLORS.primary} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentPadded}
      >
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="moon" size={28} color="#2196F3" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Sleep Tips</Text>
              <View style={styles.riskBadge}>
                <View style={[styles.riskDotSmall, { backgroundColor: '#4CAF50' }]} />
                <Text style={[styles.riskTextSmall, { color: '#4CAF50' }]}>Low Risk</Text>
              </View>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            {SLEEP_TIPS.map((tip) => (
              <View key={tip.id} style={[styles.tipCardColored, { backgroundColor: '#E3F2FD' }]}>
                <View style={styles.checkIcon}>
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                </View>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};
