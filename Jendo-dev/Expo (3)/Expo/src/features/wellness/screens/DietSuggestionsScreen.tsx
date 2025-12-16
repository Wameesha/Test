import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../common/components/layout';
import { COLORS } from '../../../config/theme.config';
import { wellnessStyles as styles } from '../components';

const DIET_TIPS = [
  {
    id: '1',
    title: 'Increase Fiber Intake',
    description: 'Add 2-3 servings of vegetables daily',
    completed: true,
  },
  {
    id: '2',
    title: 'Omega-3 Rich Foods',
    description: 'Include salmon, walnuts, or chia seeds',
    completed: true,
  },
  {
    id: '3',
    title: 'Reduce Sugar Intake',
    description: 'Limit processed foods and sugary drinks',
    completed: true,
  },
];

export const DietSuggestionsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.white}>
      <View style={styles.headerWithBack}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diet Suggestions</Text>
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
            <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="apple" size={28} color="#4CAF50" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Diet Suggestions</Text>
              <View style={styles.riskBadge}>
                <View style={[styles.riskDotSmall, { backgroundColor: '#4CAF50' }]} />
                <Text style={[styles.riskTextSmall, { color: '#4CAF50' }]}>Low Risk</Text>
              </View>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            {DIET_TIPS.map((tip) => (
              <View key={tip.id} style={[styles.tipCardColored, { backgroundColor: '#E8F5E9' }]}>
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
