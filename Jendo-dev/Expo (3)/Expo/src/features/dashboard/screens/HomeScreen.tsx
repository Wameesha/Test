import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../common/components/layout';
import { COLORS } from '../../../config/theme.config';
import { dashboardStyles as styles } from '../components';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const router = useRouter();

  const dashboardData = {
    userName: 'Sarah',
    profileComplete: 70,
    riskLevel: 'Low',
    lastTestDate: 'Nov 18, 2024',
    scoreHistory: [
      { date: 'Oct 15', value: 78 },
      { date: 'Oct 22', value: 82 },
      { date: 'Oct 29', value: 80 },
      { date: 'Nov 5', value: 85 },
      { date: 'Nov 12', value: 88 },
      { date: 'Nov 18', value: 90 },
    ],
    scoreTrend: '+2.3%',
    healthOverview: {
      bloodPressure: { value: '120/80', status: 'Normal', trend: 'up' },
      hbA1c: { value: '6.8%', status: 'Monitor', trend: 'warning' },
      bmi: { value: '23.5', status: 'Normal', trend: 'check' },
      lastVisit: { value: '2 months', status: 'ago' },
    },
    notificationCount: 3,
  };

  const getChartPath = () => {
    const values = dashboardData.scoreHistory.map(d => d.value);
    const minVal = Math.min(...values) - 5;
    const maxVal = Math.max(...values) + 5;
    const chartWidth = width - 80;
    const chartHeight = 80;

    return values.map((val, idx) => {
      const x = (idx / (values.length - 1)) * chartWidth;
      const y = chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
      return { x, y, value: val };
    });
  };

  const chartPoints = getChartPath();

  return (
    <ScreenWrapper safeArea padded={false} backgroundColor={COLORS.background}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.avatar} />
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications" size={24} color={COLORS.primary} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{dashboardData.notificationCount}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hello, {dashboardData.userName}</Text>
          <Text style={styles.subtitle}>Here is your cardiovascular health summary</Text>
        </View>

        <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/profile/personal')}>
          <View style={styles.profileCardRow}>
            <View style={styles.profileIconContainer}>
              <Ionicons name="person" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.profileText}>Profile {dashboardData.profileComplete}% Completed</Text>
          </View>
          <View style={styles.profileProgressRow}>
            <View style={styles.profileProgressBg}>
              <View style={[styles.profileProgress, { width: `${dashboardData.profileComplete}%` }]} />
            </View>
            <Text style={styles.completeNowText}>Complete Now</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.riskCard}>
          <View style={styles.riskCardContent}>
            <View style={styles.riskCardLeft}>
              <Text style={styles.riskCardTitle}>Jendo Risk Level</Text>
              <View style={styles.riskLevelRow}>
                <Text style={styles.riskLevelText}>{dashboardData.riskLevel}</Text>
                <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.lastTestLabel}>Last Test Date</Text>
              <Text style={styles.lastTestDate}>{dashboardData.lastTestDate}</Text>
            </View>
            <View style={styles.riskCardRight}>
              <View style={styles.heartIconContainer}>
                <Ionicons name="heart" size={24} color={COLORS.white} />
              </View>
              <View style={styles.miniChart}>
                <View style={[styles.miniChartBar, { height: 15 }]} />
                <View style={[styles.miniChartBar, { height: 25 }]} />
                <View style={[styles.miniChartBar, { height: 35 }]} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Text style={styles.statsTitle}>Jendo Score History</Text>
              <View style={styles.trendBadge}>
                <Ionicons name="trending-up" size={14} color="#4CAF50" />
                <Text style={styles.trendText}>{dashboardData.scoreTrend}</Text>
              </View>
            </View>
            <View style={styles.chartContainer}>
              <View style={styles.chartYAxis}>
                <Text style={styles.chartYLabel}>90</Text>
                <Text style={styles.chartYLabel}>80</Text>
                <Text style={styles.chartYLabel}>70</Text>
              </View>
              <View style={styles.chartArea}>
                <View style={styles.chartLine}>
                  {chartPoints.map((point, index) => (
                    <React.Fragment key={index}>
                      <View
                        style={[
                          styles.chartDot,
                          { left: point.x - 4, bottom: (point.value - 70) * 4 },
                          index === chartPoints.length - 1 && styles.chartDotActive,
                        ]}
                      />
                      {index < chartPoints.length - 1 && (
                        <View
                          style={[
                            styles.chartConnector,
                            {
                              left: point.x,
                              bottom: (point.value - 70) * 4,
                              width: chartPoints[index + 1].x - point.x,
                              transform: [{ rotate: `${Math.atan2((chartPoints[index + 1].value - point.value) * 4, chartPoints[index + 1].x - point.x) * -1}rad` }],
                            },
                          ]}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </View>
                <View style={styles.chartLabels}>
                  {dashboardData.scoreHistory.map((item, index) => (
                    <Text key={index} style={styles.chartLabel}>{item.date}</Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Health Overview</Text>
          <View style={styles.healthGrid}>
            <View style={styles.healthItem}>
              <View style={styles.healthItemHeader}>
                <Ionicons name="heart-outline" size={16} color={COLORS.primary} />
                <Text style={styles.healthLabel}>Blood Pressure</Text>
              </View>
              <Text style={styles.healthValue}>{dashboardData.healthOverview.bloodPressure.value}</Text>
              <View style={styles.healthStatus}>
                <Ionicons name="arrow-up" size={12} color="#4CAF50" />
                <Text style={[styles.healthStatusText, { color: '#4CAF50' }]}>{dashboardData.healthOverview.bloodPressure.status}</Text>
              </View>
            </View>

            <View style={styles.healthItem}>
              <View style={styles.healthItemHeader}>
                <Ionicons name="water-outline" size={16} color={COLORS.primary} />
                <Text style={styles.healthLabel}>HbA1c</Text>
              </View>
              <Text style={styles.healthValue}>{dashboardData.healthOverview.hbA1c.value}</Text>
              <View style={styles.healthStatus}>
                <Ionicons name="warning" size={12} color="#FF9800" />
                <Text style={[styles.healthStatusText, { color: '#FF9800' }]}>{dashboardData.healthOverview.hbA1c.status}</Text>
              </View>
            </View>

            <View style={styles.healthItem}>
              <View style={styles.healthItemHeader}>
                <Ionicons name="body-outline" size={16} color={COLORS.primary} />
                <Text style={styles.healthLabel}>BMI</Text>
              </View>
              <Text style={styles.healthValue}>{dashboardData.healthOverview.bmi.value}</Text>
              <View style={styles.healthStatus}>
                <Ionicons name="checkmark" size={12} color="#4CAF50" />
                <Text style={[styles.healthStatusText, { color: '#4CAF50' }]}>{dashboardData.healthOverview.bmi.status}</Text>
              </View>
            </View>

            <View style={styles.healthItem}>
              <View style={styles.healthItemHeader}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                <Text style={styles.healthLabel}>Last Visit</Text>
              </View>
              <Text style={styles.healthValue}>{dashboardData.healthOverview.lastVisit.value}</Text>
              <Text style={styles.healthStatusTextGray}>{dashboardData.healthOverview.lastVisit.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.reminderCard}>
          <View style={styles.reminderContent}>
            <View style={styles.reminderIcon}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.reminderText}>
              <Text style={styles.reminderTitle}>Test Reminder</Text>
              <Text style={styles.reminderSubtitle}>You haven't done your Jendo test recently.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.chatButton} onPress={() => router.push('/wellness/chatbot')}>
            <Ionicons name="chatbubble-ellipses" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWrapper>
  );
};
