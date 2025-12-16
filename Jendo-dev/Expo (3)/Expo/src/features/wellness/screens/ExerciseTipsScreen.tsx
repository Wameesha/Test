import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../common/components/layout';
import { COLORS } from '../../../config/theme.config';
import { wellnessStyles as styles } from '../components';

const EXERCISE_TIPS = [
  {
    id: '1',
    title: 'Cardio Workout',
    description: '30 minutes moderate activity, 5 days/week',
  },
  {
    id: '2',
    title: 'Strength Training',
    description: '2-3 sessions per week focusing on major muscle groups',
  },
  {
    id: '3',
    title: 'Daily Walking',
    description: 'Aim for 8,000-10,000 steps daily',
  },
];

export const ExerciseTipsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.white}>
      <View style={styles.headerWithBack}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Tips</Text>
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
            <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
              <MaterialCommunityIcons name="dumbbell" size={28} color="#FF9800" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Exercise Tips</Text>
              <View style={styles.riskBadge}>
                <View style={[styles.riskDotSmall, { backgroundColor: '#FF9800' }]} />
                <Text style={[styles.riskTextSmall, { color: '#FF9800' }]}>Medium Risk</Text>
              </View>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            {EXERCISE_TIPS.map((tip) => (
              <View key={tip.id} style={[styles.tipCardColored, { backgroundColor: '#FFF8E1', borderWidth: 1, borderColor: '#FFE082' }]}>
                <View style={styles.warningIcon}>
                  <Ionicons name="warning" size={20} color="#FF9800" />
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
