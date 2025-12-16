import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../common/components/layout';
import { COLORS } from '../../../config/theme.config';
import { wellnessStyles as styles } from '../components';

const STRESS_TIPS = [
  {
    id: '1',
    title: 'Daily Meditation',
    description: 'Practice 10-15 minutes of mindfulness daily',
  },
  {
    id: '2',
    title: 'Breathing Exercises',
    description: 'Try 4-7-8 breathing technique during stress',
  },
  {
    id: '3',
    title: 'Social Connection',
    description: 'Spend quality time with family and friends',
  },
];

export const StressManagementScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.white}>
      <View style={styles.headerWithBack}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stress Management</Text>
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
            <View style={[styles.iconContainer, { backgroundColor: '#FCE4EC' }]}>
              <MaterialCommunityIcons name="heart-pulse" size={28} color="#E91E63" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Stress Management</Text>
              <View style={styles.riskBadge}>
                <View style={[styles.riskDotSmall, { backgroundColor: '#E53935' }]} />
                <Text style={[styles.riskTextSmall, { color: '#E53935' }]}>High Risk</Text>
              </View>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            {STRESS_TIPS.map((tip) => (
              <View key={tip.id} style={[styles.tipCardColored, { backgroundColor: '#FFEBEE' }]}>
                <View style={styles.alertIcon}>
                  <Ionicons name="alert-circle" size={22} color="#E53935" />
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
