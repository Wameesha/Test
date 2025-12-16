import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Modal, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../src/common/components/layout';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../src/config/theme.config';

interface Appointment {
  id: string;
  doctor: {
    name: string;
    specialty: string;
    image: string;
  };
  date: string;
  time: string;
  type: string;
  status: string;
  location?: string;
  bookingId: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      image: 'https://randomuser.me/api/portraits/women/32.jpg',
    },
    date: 'Wed, Dec 14, 2024',
    time: '11:00 AM',
    type: 'in-person',
    status: 'upcoming',
    location: 'Trace Expert City, Colombo 10',
    bookingId: 'JND87654321',
  },
  {
    id: '2',
    doctor: {
      name: 'Dr. Michael Chen',
      specialty: 'General Physician',
      image: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    date: 'Thu, Dec 20, 2024',
    time: '2:30 PM',
    type: 'video',
    status: 'upcoming',
    bookingId: 'JND87654322',
  },
  {
    id: '3',
    doctor: {
      name: 'Dr. Emily Roberts',
      specialty: 'Cardiologist',
      image: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
    date: 'Mon, Nov 28, 2024',
    time: '10:00 AM',
    type: 'in-person',
    status: 'completed',
    location: 'Lanka Hospital, Colombo 05',
    bookingId: 'JND87654320',
  },
];

const AVAILABLE_DATES = [
  { date: 'Mon, Dec 16', slots: ['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'] },
  { date: 'Tue, Dec 17', slots: ['10:00 AM', '11:30 AM', '3:00 PM'] },
  { date: 'Wed, Dec 18', slots: ['9:30 AM', '1:00 PM', '3:30 PM', '5:00 PM'] },
  { date: 'Thu, Dec 19', slots: ['10:00 AM', '2:30 PM', '4:00 PM'] },
  { date: 'Fri, Dec 20', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] },
];

export default function AppointmentsScreen() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return 'videocam';
      case 'chat':
        return 'chatbubble';
      default:
        return 'people';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#4CAF50';
      case 'completed':
        return COLORS.textSecondary;
      case 'cancelled':
        return '#F44336';
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#E8F5E9';
      case 'completed':
        return '#F5F5F5';
      case 'cancelled':
        return '#FFEBEE';
      default:
        return '#F5F5F5';
    }
  };

  const handleCancelPress = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleReschedulePress = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedDate(null);
    setSelectedTime(null);
    setRescheduleSuccess(false);
    setShowRescheduleModal(true);
  };

  const confirmCancel = () => {
    if (selectedAppointment) {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: 'cancelled' }
            : apt
        )
      );
    }
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const confirmReschedule = () => {
    if (selectedAppointment && selectedDate && selectedTime) {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === selectedAppointment.id 
            ? { ...apt, date: selectedDate, time: selectedTime }
            : apt
        )
      );
      setRescheduleSuccess(true);
    }
  };

  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setRescheduleSuccess(false);
  };

  const getAvailableSlots = () => {
    const selected = AVAILABLE_DATES.find(d => d.date === selectedDate);
    return selected?.slots || [];
  };

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.white}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Appointments</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          {appointments.filter(apt => apt.status === 'upcoming').map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: appointment.doctor.image }} style={styles.doctorImage} />
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
                  <Text style={styles.doctorSpecialty}>{appointment.doctor.specialty}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(appointment.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.detailText}>{appointment.date} at {appointment.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons name={getTypeIcon(appointment.type) as any} size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.detailText}>
                    {appointment.type === 'in-person' ? 'In-person' : appointment.type === 'video' ? 'Video Call' : 'Chat'} Consultation
                  </Text>
                </View>

                {appointment.location && (
                  <View style={styles.detailRow}>
                    <View style={styles.detailIcon}>
                      <Ionicons name="location-outline" size={16} color={COLORS.primary} />
                    </View>
                    <Text style={styles.detailText}>{appointment.location}</Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="document-text-outline" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.detailText}>Booking ID: {appointment.bookingId}</Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.rescheduleButton}
                  onPress={() => handleReschedulePress(appointment)}
                >
                  <Ionicons name="calendar" size={16} color={COLORS.primary} />
                  <Text style={styles.rescheduleText}>Reschedule</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleCancelPress(appointment)}
                >
                  <Ionicons name="close-circle-outline" size={16} color="#F44336" />
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Past Appointments</Text>
          {appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled').map((appointment) => (
            <View key={appointment.id} style={[styles.appointmentCard, styles.pastCard]}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: appointment.doctor.image }} style={styles.doctorImage} />
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
                  <Text style={styles.doctorSpecialty}>{appointment.doctor.specialty}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(appointment.status) }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                  </View>
                  <Text style={[styles.detailText, styles.pastText]}>{appointment.date} at {appointment.time}</Text>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Ionicons name={getTypeIcon(appointment.type) as any} size={16} color={COLORS.textSecondary} />
                  </View>
                  <Text style={[styles.detailText, styles.pastText]}>
                    {appointment.type === 'in-person' ? 'In-person' : appointment.type === 'video' ? 'Video Call' : 'Chat'} Consultation
                  </Text>
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.bookAgainButton}>
                  <Ionicons name="refresh" size={16} color={COLORS.primary} />
                  <Text style={styles.bookAgainText}>Book Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="alert-circle" size={48} color="#F44336" />
            </View>
            <Text style={styles.modalTitle}>Cancel Appointment?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to cancel your appointment with {selectedAppointment?.doctor.name} on {selectedAppointment?.date}?
            </Text>
            <Text style={styles.modalSubMessage}>
              This action cannot be undone. A cancellation request will be sent.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalSecondaryButton}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalSecondaryButtonText}>Keep Appointment</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalDangerButton}
                onPress={confirmCancel}
              >
                <Text style={styles.modalDangerButtonText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        visible={showRescheduleModal}
        transparent
        animationType="slide"
        onRequestClose={closeRescheduleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rescheduleModalContainer}>
            {!rescheduleSuccess ? (
              <>
                <View style={styles.rescheduleHeader}>
                  <Text style={styles.rescheduleTitle}>Reschedule Appointment</Text>
                  <TouchableOpacity onPress={closeRescheduleModal}>
                    <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                  </TouchableOpacity>
                </View>

                {selectedAppointment && (
                  <View style={styles.currentAppointmentInfo}>
                    <Image source={{ uri: selectedAppointment.doctor.image }} style={styles.smallDoctorImage} />
                    <View style={styles.doctorInfoSmall}>
                      <Text style={styles.doctorNameSmall}>{selectedAppointment.doctor.name}</Text>
                      <Text style={styles.currentDateText}>
                        Current: {selectedAppointment.date} at {selectedAppointment.time}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.rescheduleSection}>
                  <Text style={styles.rescheduleSectionTitle}>Select New Date</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScrollView}>
                    {AVAILABLE_DATES.map((dateOption) => (
                      <TouchableOpacity
                        key={dateOption.date}
                        style={[
                          styles.dateChip,
                          selectedDate === dateOption.date && styles.dateChipActive
                        ]}
                        onPress={() => {
                          setSelectedDate(dateOption.date);
                          setSelectedTime(null);
                        }}
                      >
                        <Text style={[
                          styles.dateChipText,
                          selectedDate === dateOption.date && styles.dateChipTextActive
                        ]}>
                          {dateOption.date}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {selectedDate && (
                  <View style={styles.rescheduleSection}>
                    <Text style={styles.rescheduleSectionTitle}>Select Time Slot</Text>
                    <View style={styles.timeSlotsContainer}>
                      {getAvailableSlots().map((time) => (
                        <TouchableOpacity
                          key={time}
                          style={[
                            styles.timeSlot,
                            selectedTime === time && styles.timeSlotActive
                          ]}
                          onPress={() => setSelectedTime(time)}
                        >
                          <Text style={[
                            styles.timeSlotText,
                            selectedTime === time && styles.timeSlotTextActive
                          ]}>
                            {time}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                <TouchableOpacity 
                  style={[
                    styles.confirmRescheduleButton,
                    (!selectedDate || !selectedTime) && styles.buttonDisabled
                  ]}
                  onPress={confirmReschedule}
                  disabled={!selectedDate || !selectedTime}
                >
                  <Text style={styles.confirmRescheduleButtonText}>Send Reschedule Request</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
                </View>
                <Text style={styles.successTitle}>Request Sent!</Text>
                <Text style={styles.successMessage}>
                  Your reschedule request has been sent to {selectedAppointment?.doctor.name}.
                </Text>
                <Text style={styles.successDetails}>
                  New requested time: {selectedDate} at {selectedTime}
                </Text>
                <TouchableOpacity 
                  style={styles.successButton}
                  onPress={closeRescheduleModal}
                >
                  <Text style={styles.successButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    borderBottomColor: COLORS.borderLight,
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
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  appointmentCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  pastCard: {
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.sm,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  doctorSpecialty: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: SPACING.md,
  },
  detailsContainer: {
    gap: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: '#F3E5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  detailText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textPrimary,
    flex: 1,
  },
  pastText: {
    color: COLORS.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  rescheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    backgroundColor: '#F3E5F5',
    borderRadius: BORDER_RADIUS.md,
  },
  rescheduleText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    backgroundColor: '#FFEBEE',
    borderRadius: BORDER_RADIUS.md,
  },
  cancelText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
    color: '#F44336',
  },
  bookAgainButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    backgroundColor: '#F3E5F5',
    borderRadius: BORDER_RADIUS.md,
  },
  bookAgainText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
  bottomPadding: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIconContainer: {
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  modalSubMessage: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  modalSecondaryButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  modalSecondaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  modalDangerButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    backgroundColor: '#F44336',
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  modalDangerButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  rescheduleModalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  rescheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  rescheduleTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  currentAppointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceSecondary,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
  },
  smallDoctorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  doctorInfoSmall: {
    flex: 1,
  },
  doctorNameSmall: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  currentDateText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rescheduleSection: {
    marginBottom: SPACING.lg,
  },
  rescheduleSectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  dateScrollView: {
    marginHorizontal: -SPACING.xs,
  },
  dateChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.round,
    marginHorizontal: SPACING.xs,
  },
  dateChipActive: {
    backgroundColor: COLORS.primary,
  },
  dateChipText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  dateChipTextActive: {
    color: COLORS.white,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  timeSlot: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: BORDER_RADIUS.md,
  },
  timeSlotActive: {
    backgroundColor: COLORS.primary,
  },
  timeSlotText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  timeSlotTextActive: {
    color: COLORS.white,
  },
  confirmRescheduleButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  confirmRescheduleButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  successContainer: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  successIconContainer: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: SPACING.sm,
  },
  successMessage: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  successDetails: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  successButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
  },
  successButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
