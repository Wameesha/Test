import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../common/components/layout';
import { COLORS } from '../../../config/theme.config';
import { medicalRecordsStyles as styles } from '../components';

const REPORT_CATEGORIES = [
  { id: 'diabetes', name: 'Diabetes', icon: 'water', iconType: 'ionicons', color: COLORS.primary },
  { id: 'cardiovascular', name: 'Cardiovascular', icon: 'heart', iconType: 'ionicons', color: COLORS.primary },
  { id: 'pregnancy', name: 'Pregnancy', icon: 'human-pregnant', iconType: 'material-community', color: COLORS.primary },
  { id: 'blood-tests', name: 'Blood Tests', icon: 'flask', iconType: 'ionicons', color: COLORS.primary },
  { id: 'radiology', name: 'Radiology', icon: 'x-ray', iconType: 'fontawesome5', color: COLORS.primary },
  { id: 'dermatology', name: 'Dermatology', icon: 'hand-left', iconType: 'ionicons', color: COLORS.primary },
  { id: 'neurology', name: 'Neurology', icon: 'brain', iconType: 'fontawesome5', color: COLORS.primary },
];

const RECENT_ACTIVITY = [
  { id: '1', title: 'Blood Sugar Report', time: 'Added 2 hours ago', icon: 'document-text', bgColor: '#FFE4E4' },
];

export const MyReportsScreen: React.FC = () => {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/my-reports/${categoryId}` as any);
  };

  const renderIcon = (category: typeof REPORT_CATEGORIES[0]) => {
    const iconSize = 28;
    const iconColor = category.color;

    switch (category.iconType) {
      case 'material-community':
        return <MaterialCommunityIcons name={category.icon as any} size={iconSize} color={iconColor} />;
      case 'fontawesome5':
        return <FontAwesome5 name={category.icon as any} size={iconSize} color={iconColor} />;
      default:
        return <Ionicons name={category.icon as any} size={iconSize} color={iconColor} />;
    }
  };

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.background}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="finger-print" size={24} color={COLORS.primary} />
          </View>
        </View>
        <Text style={styles.headerTitle}>My Reports</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/notifications' as any)}
        >
          <Ionicons name="notifications" size={24} color={COLORS.primary} />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoriesGrid}>
          {REPORT_CATEGORIES.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                index === REPORT_CATEGORIES.length - 1 && REPORT_CATEGORIES.length % 2 !== 0 && styles.singleCard
              ]}
              onPress={() => handleCategoryPress(category.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                {renderIcon(category)}
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Activity</Text>
          {RECENT_ACTIVITY.map(activity => (
            <TouchableOpacity key={activity.id} style={styles.activityCard} activeOpacity={0.7}>
              <View style={[styles.activityIcon, { backgroundColor: activity.bgColor }]}>
                <Ionicons name={activity.icon as any} size={20} color={COLORS.primary} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};
