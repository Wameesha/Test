import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../common/components/layout';
import { EmptyState } from '../../../common/components/ui';
import { COLORS } from '../../../config/theme.config';
import { Notification, NotificationType } from '../../../types/models';
import { notificationsStyles as styles } from '../components';

const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    userId: 'user-001',
    type: 'test_reminder',
    title: 'Time for Your Jendo Test',
    message: 'It has been 2 weeks since your last test. Regular monitoring helps track your heart health.',
    isRead: false,
    createdAt: '2024-12-04T09:00:00Z',
  },
  {
    id: 'notif-002',
    userId: 'user-001',
    type: 'appointment_reminder',
    title: 'Upcoming Appointment',
    message: 'Reminder: You have an appointment with Dr. Sarah Johnson tomorrow at 10:30 AM.',
    isRead: false,
    createdAt: '2024-12-03T18:00:00Z',
  },
  {
    id: 'notif-003',
    userId: 'user-001',
    type: 'wellness_tip',
    title: 'Daily Wellness Tip',
    message: 'Try to include at least 5 servings of fruits and vegetables in your diet today.',
    isRead: true,
    createdAt: '2024-12-03T08:00:00Z',
  },
  {
    id: 'notif-004',
    userId: 'user-001',
    type: 'risk_alert',
    title: 'Risk Level Improved!',
    message: 'Great news! Your cardiovascular risk level has improved from Moderate to Low.',
    isRead: true,
    createdAt: '2024-11-28T09:30:00Z',
  },
  {
    id: 'notif-005',
    userId: 'user-001',
    type: 'learning_update',
    title: 'New Learning Material',
    message: 'Check out our new video: "Beginner Cardio Workout" - Perfect for heart health!',
    isRead: true,
    createdAt: '2024-11-25T10:00:00Z',
  },
  {
    id: 'notif-006',
    userId: 'user-001',
    type: 'doctor_recommendation',
    title: 'Doctor Recommendation',
    message: 'Based on your results, we recommend scheduling a consultation with a cardiologist.',
    isRead: true,
    createdAt: '2024-11-20T14:00:00Z',
  },
];

const getNotificationIcon = (type: NotificationType): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'risk_alert': return 'trending-up-outline';
    case 'test_reminder': return 'pulse-outline';
    case 'appointment_reminder': return 'calendar-outline';
    case 'wellness_tip': return 'heart-outline';
    case 'doctor_recommendation': return 'medkit-outline';
    case 'learning_update': return 'book-outline';
    default: return 'notifications-outline';
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const NotificationsScreen: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.7}
      style={styles.notificationCard}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getNotificationIcon(item.type)} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.white}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.bellContainer}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
        </View>
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="No Notifications"
            description="You're all caught up! Check back later for updates."
          />
        }
      />
    </ScreenWrapper>
  );
};
