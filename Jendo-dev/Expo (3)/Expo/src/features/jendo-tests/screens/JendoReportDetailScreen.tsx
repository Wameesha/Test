import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../common/components/layout';
import { Header, Card, RiskBadge } from '../../../common/components/ui';
import { COLORS } from '../../../config/theme.config';
import { jendoStyles as styles } from '../components';
import { jendoTestApi, JendoTest } from '../services/jendoTestApi';

// Default suggestions based on risk level
const getDefaultSuggestions = (riskLevel: string): string[] => {
  switch (riskLevel.toLowerCase()) {
    case 'low':
      return [
        'Continue regular exercise routine',
        'Maintain balanced diet rich in fruits and vegetables',
        'Keep stress levels managed through relaxation techniques',
        'Schedule next test in 3 months',
      ];
    case 'moderate':
      return [
        'Consider increasing physical activity',
        'Monitor blood pressure regularly',
        'Reduce sodium intake in diet',
        'Consult with a healthcare provider',
        'Schedule follow-up test in 1-2 months',
      ];
    case 'high':
      return [
        'Schedule immediate consultation with a cardiologist',
        'Begin daily blood pressure monitoring',
        'Follow prescribed medication regimen strictly',
        'Implement stress reduction techniques',
        'Avoid strenuous activities until cleared by doctor',
      ];
    default:
      return ['Consult with your healthcare provider for personalized recommendations'];
  }
};

const getDefaultAnalysis = (riskLevel: string, score: number): string => {
  switch (riskLevel.toLowerCase()) {
    case 'low':
      return `Your cardiovascular health is in excellent condition with a score of ${score}. Heart rhythm is normal and blood pressure is within healthy range. Continue maintaining your current lifestyle habits.`;
    case 'moderate':
      return `Your test shows moderate cardiovascular risk indicators with a score of ${score}. Some vital signs require attention. Consider lifestyle modifications and regular monitoring.`;
    case 'high':
      return `Your test results indicate elevated cardiovascular risk with a score of ${score}. Immediate medical attention is recommended to address concerning vital signs.`;
    default:
      return 'Test analysis is being processed. Please consult with your healthcare provider for detailed interpretation.';
  }
};

export const JendoReportDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [test, setTest] = useState<JendoTest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestDetails();
  }, [id]);

  const loadTestDetails = async () => {
    try {
      setLoading(true);
      const testData = await jendoTestApi.getTestById(id as string);
      if (testData) {
        setTest(testData);
      } else {
        Alert.alert('Error', 'Test not found');
        router.back();
      }
    } catch (error: any) {
      console.error('Error loading test details:', error);
      Alert.alert('Error', error.message || 'Failed to load test details');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <ScreenWrapper safeArea padded={false}>
        <Header title="Test Report" showBack />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading test details...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!test) {
    return null;
  }

  const analysis = getDefaultAnalysis(test.riskLevel, test.score);
  const suggestions = getDefaultSuggestions(test.riskLevel);

  return (
    <ScreenWrapper safeArea padded={false}>
      <Header title="Test Report" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.dateLabel}>{formatDate(test.testDate)}</Text>
            <View style={styles.scoreSectionDetail}>
              <Text style={styles.scoreValueLarge}>{test.score}</Text>
              <Text style={styles.scoreLabelLight}>Health Score</Text>
            </View>
            <RiskBadge level={test.riskLevel} size="lg" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vital Signs</Text>
          <View style={styles.vitalsGrid}>
            <Card style={styles.vitalCard}>
              <View style={styles.vitalContent}>
                <Ionicons name="heart" size={28} color={COLORS.heart} />
                <Text style={styles.vitalValue}>{test.heartRate}</Text>
                <Text style={styles.vitalLabel}>Heart Rate (bpm)</Text>
              </View>
            </Card>
            <Card style={styles.vitalCard}>
              <View style={styles.vitalContent}>
                <Ionicons name="pulse" size={28} color={COLORS.primary} />
                <Text style={styles.vitalValue}>
                  {test.bloodPressureSystolic}/{test.bloodPressureDiastolic}
                </Text>
                <Text style={styles.vitalLabel}>Blood Pressure</Text>
              </View>
            </Card>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analysis</Text>
          <Card style={styles.analysisCard}>
            <Text style={styles.analysisText}>{analysis}</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {suggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionItem}>
              <View style={styles.suggestionNumber}>
                <Text style={styles.suggestionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ScreenWrapper>
  );
};
