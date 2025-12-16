import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../src/common/components/layout';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../../src/config/theme.config';

type ConsultationType = 'in-person' | 'video' | 'chat';

const getConsultationData = (type: ConsultationType) => {
  switch (type) {
    case 'video':
      return {
        title: 'Video Consultation',
        icon: 'videocam' as const,
        description: 'Connect with healthcare professionals through secure video calls. Get medical advice, prescriptions, and follow-up care from the comfort of your home.',
        duration: '15 minutes',
        fee: '$45.00',
        buttonText: 'Continue to Booking',
        prepareItems: [
          { text: 'Stable internet connection', required: true },
          { text: 'Quiet environment', required: true },
          { text: 'Medical history documents', required: false },
        ],
        notice: "You'll receive a confirmation email with the video call link 30 minutes before your appointment.",
      };
    case 'chat':
      return {
        title: 'Chat Consultation',
        icon: 'chatbubble' as const,
        description: 'Connect with healthcare professionals through secure chats. Get medical advice, prescriptions, and follow-up care from the comfort of your home.',
        duration: '15 minutes',
        fee: '$45.00',
        buttonText: 'Confirm Appointment',
        prepareItems: [
          { text: 'Stable internet connection', required: true },
          { text: 'Quiet environment', required: true },
          { text: 'Medical history documents', required: false },
        ],
        notice: "You'll receive a confirmation email with the chat link 30 minutes before your appointment.",
      };
    case 'in-person':
    default:
      return {
        title: 'In-person Consultation',
        icon: 'people' as const,
        description: 'Connect with your doctor for a face-to-face visit at the clinic. Receive physical examinations, direct evaluation, prescriptions, and personalized treatment plans.',
        duration: '20 minutes',
        fee: '$50.00',
        location: 'Trace Expert City, Colombo 10',
        buttonText: 'Confirm Appointment',
        prepareItems: [
          { text: 'National ID or passport', required: true },
          { text: 'Previous medical records', required: true },
          { text: 'Current prescriptions or medication list', required: true },
          { text: 'Appointment confirmation', required: true },
        ],
        additionalNotes: [
          'Please arrive 10 minutes early.',
          'Rescheduling allowed up to 2 hours before.',
          'Emergency cases should visit nearest hospital.',
        ],
        notice: 'You will receive a confirmation email with your appointment details after booking.',
      };
  }
};

export default function ConfirmAppointmentRoute() {
  const { id, type } = useLocalSearchParams();
  const router = useRouter();
  const consultationType = (type as ConsultationType) || 'in-person';
  const data = getConsultationData(consultationType);

  const handleConfirm = () => {
    router.push(`/doctors/${id}/payment?type=${consultationType}` as any);
  };

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.white}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.title}</Text>
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
        <View style={styles.mainCard}>
          <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
            {consultationType === 'in-person' ? (
              <MaterialCommunityIcons name="account-group" size={28} color={COLORS.primary} />
            ) : (
              <Ionicons name={data.icon} size={28} color={COLORS.primary} />
            )}
          </View>
          
          <Text style={styles.cardTitle}>{data.title}</Text>
          <Text style={styles.cardDescription}>{data.description}</Text>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{data.duration}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="cash-outline" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Consultation Fee</Text>
                <Text style={styles.detailValue}>{data.fee}</Text>
              </View>
            </View>

            {data.location && (
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{data.location}</Text>
                </View>
              </View>
            )}

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>Wed, Dec 14, 11.00 AM</Text>
              </View>
            </View>
          </View>

          <View style={styles.prepareSection}>
            <View style={styles.prepareTitleRow}>
              <Ionicons name="clipboard-outline" size={18} color={COLORS.textPrimary} />
              <Text style={styles.prepareTitle}>What you need to prepare</Text>
            </View>
            {data.prepareItems.map((item, index) => (
              <View key={index} style={styles.prepareItem}>
                <Ionicons 
                  name={item.required ? "checkmark-circle" : "checkmark-circle-outline"} 
                  size={18} 
                  color={item.required ? COLORS.primary : COLORS.textSecondary} 
                />
                <Text style={[styles.prepareText, !item.required && styles.prepareTextOptional]}>
                  {item.text}{!item.required && ' (optional)'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {data.additionalNotes && (
          <View style={styles.additionalNotesCard}>
            <View style={styles.additionalNotesTitleRow}>
              <Ionicons name="information-circle" size={20} color={COLORS.primary} />
              <Text style={styles.additionalNotesTitle}>Additional Notes</Text>
            </View>
            {data.additionalNotes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <View style={styles.noteDot} />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.noticeCard}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.noticeText}>{data.notice}</Text>
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>{data.buttonText}</Text>
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
    flex: 1,
    textAlign: 'center',
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
  mainCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  cardDescription: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  detailsSection: {
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  prepareSection: {
    backgroundColor: '#F7F7F9',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  prepareTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  prepareTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  prepareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  prepareText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
  },
  prepareTextOptional: {
    color: COLORS.textSecondary,
  },
  additionalNotesCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  additionalNotesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  additionalNotesTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  noteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textSecondary,
    marginTop: 6,
  },
  noteText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  noticeText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
