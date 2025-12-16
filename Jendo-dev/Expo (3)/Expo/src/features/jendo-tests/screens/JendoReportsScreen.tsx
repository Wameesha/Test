import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../common/components/layout';
import { EmptyState } from '../../../common/components/ui';
import { COLORS } from '../../../config/theme.config';
import { jendoTestApi, JendoTest } from '../services/jendoTestApi';
import { jendoStyles as styles } from '../components';

type RiskLevel = 'low' | 'moderate' | 'high';

interface JendoTestSummary {
  id: string;
  testDate: string;
  riskLevel: RiskLevel;
  score: number;
}

const getRiskColor = (level: RiskLevel) => {
  switch (level) {
    case 'low': return COLORS.riskLow;
    case 'moderate': return COLORS.riskModerate;
    case 'high': return COLORS.riskHigh;
    default: return COLORS.textSecondary;
  }
};

const getRiskBgColor = (level: RiskLevel) => {
  switch (level) {
    case 'low': return COLORS.riskLowBg;
    case 'moderate': return COLORS.riskModerateBg;
    case 'high': return COLORS.riskHighBg;
    default: return COLORS.surfaceSecondary;
  }
};

const getRiskLabel = (level: RiskLevel) => {
  switch (level) {
    case 'low': return 'Low Risk';
    case 'moderate': return 'Moderate Risk';
    case 'high': return 'High Risk';
    default: return 'Unknown';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const JendoReportsScreen: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [tests, setTests] = useState<JendoTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all Jendo tests (no user filtering)
      console.log('Fetching all Jendo tests...');
      const response = await jendoTestApi.getAllTests();
      console.log('Received tests:', response);
      
      setTests(response);
    } catch (err: any) {
      console.error('Error loading Jendo tests:', err);
      setError(err.message || 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = tests.filter(test => {
    if (searchQuery) {
      const dateStr = new Date(test.testDate).toLocaleDateString();
      return dateStr.toLowerCase().includes(searchQuery.toLowerCase()) || 
             test.score.toString().includes(searchQuery);
    }
    return true;
  });

  const renderTestItem = ({ item }: { item: JendoTest }) => (
    <TouchableOpacity
      onPress={() => router.push(`/jendo-reports/${item.id}`)}
      activeOpacity={0.7}
      style={styles.testCard}
    >
      <View style={styles.testHeader}>
        <Text style={styles.testDate}>{formatDate(item.testDate)}</Text>
        <View style={[styles.riskBadge, { backgroundColor: getRiskBgColor(item.riskLevel) }]}>
          <Text style={[styles.riskText, { color: getRiskColor(item.riskLevel) }]}>
            {getRiskLabel(item.riskLevel)}
          </Text>
        </View>
      </View>
      <View style={styles.testContent}>
        <View style={styles.scoreSection}>
          <Text style={styles.scoreLabel}>Jendo Score</Text>
          <Text style={[styles.scoreValue, { color: getRiskColor(item.riskLevel) }]}>{item.score}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.white}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.avatar} />
        <Text style={styles.headerTitle}>Jendo</Text>
        <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications" size={24} color={COLORS.primary} />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search reports..."
            placeholderTextColor={COLORS.placeholder}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your Jendo tests...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={COLORS.error} />
          <Text style={styles.errorTitle}>Error Loading Tests</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadTests}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredTests}
          renderItem={renderTestItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title="No Reports Found"
              description={tests.length === 0 ? "You haven't taken any Jendo tests yet." : "No test reports match your search criteria."}
            />
          }
        />
      )}
    </ScreenWrapper>
  );
};
