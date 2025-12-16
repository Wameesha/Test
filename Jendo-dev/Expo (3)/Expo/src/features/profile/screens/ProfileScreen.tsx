import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenWrapper } from '../../../common/components/layout';
import { COLORS } from '../../../config/theme.config';
import { profileStyles as styles } from '../components';
import { useAuth } from '../../../providers/AuthProvider';

const DUMMY_USER = {
  name: 'Sarah Johnson',
  membershipType: 'Premium Member',
  email: 'sarah.johnson@email.com',
  profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  healthParams: {
    height: { value: '5\'6"', metric: '168 cm' },
    weight: { value: '65 kg', metric: '143 lbs' },
    bmi: { value: '23.0', status: 'Normal' },
  },
};

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Clear JWT token from AsyncStorage
      await AsyncStorage.removeItem('jwtToken');
      // Call logout from AuthProvider to clear other auth data
      await logout();
      // Navigate to login screen
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ScreenWrapper safeArea padded={false} backgroundColor={COLORS.white}>
      <View style={styles.header}>
        <Image source={{ uri: DUMMY_USER.profileImage }} style={styles.avatar} />
        <Text style={styles.headerTitle}>Profile</Text>
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: DUMMY_USER.profileImage }} style={styles.profileAvatar} />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{DUMMY_USER.name}</Text>
          <Text style={styles.membershipType}>{DUMMY_USER.membershipType}</Text>
          <Text style={styles.userEmail}>{DUMMY_USER.email}</Text>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={18} color={COLORS.textPrimary} />
            <Text style={styles.sectionTitle}>Personal Details</Text>
          </View>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/personal')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="key-variant" size={20} color={COLORS.primary} />
              <Text style={styles.menuItemText}>Change Details</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed" size={18} color={COLORS.textPrimary} />
            <Text style={styles.sectionTitle}>Security</Text>
          </View>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/password')}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons name="key-variant" size={20} color={COLORS.primary} />
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="heart-pulse" size={18} color={COLORS.textPrimary} />
            <Text style={styles.sectionTitle}>Health Parameters</Text>
          </View>
          <View style={styles.healthParamsContainer}>
            <View style={styles.healthParamCard}>
              <View style={[styles.healthParamIcon, { backgroundColor: '#FCE4EC' }]}>
                <MaterialCommunityIcons name="human-male-height" size={20} color="#E91E63" />
              </View>
              <Text style={styles.healthParamLabel}>Height</Text>
              <Text style={styles.healthParamValue}>{DUMMY_USER.healthParams.height.value}</Text>
              <Text style={styles.healthParamMetric}>{DUMMY_USER.healthParams.height.metric}</Text>
            </View>
            <View style={styles.healthParamCard}>
              <View style={[styles.healthParamIcon, { backgroundColor: '#F3E5F5' }]}>
                <MaterialCommunityIcons name="scale-bathroom" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.healthParamLabel}>Weight</Text>
              <Text style={styles.healthParamValue}>{DUMMY_USER.healthParams.weight.value}</Text>
              <Text style={styles.healthParamMetric}>{DUMMY_USER.healthParams.weight.metric}</Text>
            </View>
            <View style={styles.healthParamCard}>
              <View style={[styles.healthParamIcon, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="chart-donut" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.healthParamLabel}>BMI</Text>
              <Text style={styles.healthParamValue}>{DUMMY_USER.healthParams.bmi.value}</Text>
              <Text style={[styles.healthParamStatus, { color: '#4CAF50' }]}>{DUMMY_USER.healthParams.bmi.status}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.primary} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWrapper>
  );
};
