import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../src/common/components/layout';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../../src/config/theme.config';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM',
  '10:30 AM', '11:00 AM', '11:30 AM',
  '2:00 PM', '2:30 PM', '3:00 PM',
  '3:30 PM', '4:00 PM', '4:30 PM',
];

type ConsultationType = 'in-person' | 'video' | 'chat';

export default function BookAppointmentRoute() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [consultationType, setConsultationType] = useState<ConsultationType>('in-person');
  const [selectedDate, setSelectedDate] = useState<number>(2);
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM');

  const dates = [
    { day: 'Mon', date: 12 },
    { day: 'Tue', date: 13 },
    { day: 'Wed', date: 14 },
    { day: 'Thu', date: 15 },
  ];

  const getConsultationLabel = () => {
    switch (consultationType) {
      case 'in-person': return 'In-person';
      case 'video': return 'Video consultation';
      case 'chat': return 'Chat consultation';
    }
  };

  const handleContinue = () => {
    router.push(`/doctors/${id}/confirm?type=${consultationType}`);
  };

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.white}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
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
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Consultation Type</Text>
        
        <TouchableOpacity 
          style={[styles.typeCard, consultationType === 'in-person' && styles.typeCardActive]}
          onPress={() => setConsultationType('in-person')}
        >
          <View style={[styles.typeIcon, { backgroundColor: consultationType === 'in-person' ? '#F3E5F5' : '#F5F5F5' }]}>
            <Ionicons name="person" size={20} color={consultationType === 'in-person' ? COLORS.primary : COLORS.textSecondary} />
          </View>
          <View style={styles.typeContent}>
            <Text style={styles.typeTitle}>In-person</Text>
            <Text style={styles.typeDescription}>Visit clinic</Text>
          </View>
          <View style={[styles.radioOuter, consultationType === 'in-person' && styles.radioOuterActive]}>
            {consultationType === 'in-person' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeCard, consultationType === 'video' && styles.typeCardActive]}
          onPress={() => setConsultationType('video')}
        >
          <View style={[styles.typeIcon, { backgroundColor: consultationType === 'video' ? '#F3E5F5' : '#F5F5F5' }]}>
            <Ionicons name="videocam" size={20} color={consultationType === 'video' ? COLORS.primary : COLORS.textSecondary} />
          </View>
          <View style={styles.typeContent}>
            <Text style={styles.typeTitle}>Video</Text>
            <Text style={styles.typeDescription}>Online consultation</Text>
          </View>
          <View style={[styles.radioOuter, consultationType === 'video' && styles.radioOuterActive]}>
            {consultationType === 'video' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.typeCard, consultationType === 'chat' && styles.typeCardActive]}
          onPress={() => setConsultationType('chat')}
        >
          <View style={[styles.typeIcon, { backgroundColor: consultationType === 'chat' ? '#F3E5F5' : '#F5F5F5' }]}>
            <Ionicons name="chatbubble" size={20} color={consultationType === 'chat' ? COLORS.primary : COLORS.textSecondary} />
          </View>
          <View style={styles.typeContent}>
            <Text style={styles.typeTitle}>Chat</Text>
            <Text style={styles.typeDescription}>Text consultation</Text>
          </View>
          <View style={[styles.radioOuter, consultationType === 'chat' && styles.radioOuterActive]}>
            {consultationType === 'chat' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.datesContainer}>
          {dates.map((d, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dateCard, selectedDate === index && styles.dateCardActive]}
              onPress={() => setSelectedDate(index)}
            >
              <Text style={[styles.dateDay, selectedDate === index && styles.dateDayActive]}>{d.day}</Text>
              <Text style={[styles.dateNum, selectedDate === index && styles.dateNumActive]}>{d.date}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Available Times</Text>
        <View style={styles.timeSlotsGrid}>
          {TIME_SLOTS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeSlot, selectedTime === time && styles.timeSlotActive]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Appointment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>Wed, Dec 14</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{selectedTime}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Type</Text>
            <Text style={styles.summaryValue}>{getConsultationLabel()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>30 minutes</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E5',
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
  },
  typeCardActive: {
    borderColor: COLORS.primary,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  typeContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  typeDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  datesContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  dateCard: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  dateCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateDay: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dateDayActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  dateNum: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  dateNumActive: {
    color: COLORS.white,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  timeSlot: {
    width: '31%',
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  timeSlotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  timeTextActive: {
    color: COLORS.white,
  },
  summaryCard: {
    backgroundColor: '#F7F7F9',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  continueButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
