import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/common/components/layout';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/config/theme.config';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  suffix?: string;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  value, 
  onChangeText, 
  editable,
  keyboardType = 'default',
  suffix
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        editable && styles.inputContainerEditing
      ]}>
        <TextInput
          style={[
            styles.input, 
            !editable && styles.inputDisabled,
            isFocused && styles.inputFocused
          ]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={COLORS.primary}
          cursorColor={COLORS.primary}
        />
        {suffix && <Text style={[styles.suffix, isFocused && styles.suffixFocused]}>{suffix}</Text>}
        {editable && !suffix && (
          <MaterialCommunityIcons 
            name="pencil" 
            size={18} 
            color={isFocused ? COLORS.primary : COLORS.textMuted} 
          />
        )}
      </View>
    </View>
  );
};

export default function PersonalInfoScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    dateOfBirth: 'March 15, 1990',
    email: 'sarah.johnson@email.com',
    gender: 'Female',
    address: 'Kurunegala',
    nationality: 'Sinhala',
    weight: '65',
    height: '168',
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    router.back();
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <ScreenWrapper safeArea backgroundColor={COLORS.white}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
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
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Personal Details</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditToggle}
            >
              <Ionicons name={isEditing ? "checkmark" : "pencil"} size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <FormInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text) => setFormData({...formData, fullName: text})}
            editable={isEditing}
          />

          <FormInput
            label="Phone"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
            editable={isEditing}
            keyboardType="phone-pad"
          />

          <FormInput
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChangeText={(text) => setFormData({...formData, dateOfBirth: text})}
            editable={isEditing}
          />

          <FormInput
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
            editable={isEditing}
            keyboardType="email-address"
          />

          <FormInput
            label="Gender"
            value={formData.gender}
            onChangeText={(text) => setFormData({...formData, gender: text})}
            editable={isEditing}
          />

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <FormInput
                label="Weight"
                value={formData.weight}
                onChangeText={(text) => setFormData({...formData, weight: text})}
                editable={isEditing}
                keyboardType="numeric"
                suffix="kg"
              />
            </View>
            <View style={styles.halfInput}>
              <FormInput
                label="Height"
                value={formData.height}
                onChangeText={(text) => setFormData({...formData, height: text})}
                editable={isEditing}
                keyboardType="numeric"
                suffix="cm"
              />
            </View>
          </View>

          <FormInput
            label="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
            editable={isEditing}
          />

          <FormInput
            label="Nationality"
            value={formData.nationality}
            onChangeText={(text) => setFormData({...formData, nationality: text})}
            editable={isEditing}
          />
        </View>

        {isEditing ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.backToProfileButton} onPress={() => router.back()}>
            <Text style={styles.backToProfileText}>Back to Profile</Text>
          </TouchableOpacity>
        )}
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
  mainCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  editButton: {
    marginLeft: 'auto',
    padding: SPACING.xs,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfInput: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
  },
  inputContainerEditing: {
    borderBottomColor: COLORS.border,
  },
  inputContainerFocused: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  inputFocused: {
    color: COLORS.primary,
  },
  inputDisabled: {
    color: COLORS.textPrimary,
  },
  suffix: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  suffixFocused: {
    color: COLORS.primary,
  },
  backToProfileButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  backToProfileText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.textSecondary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: '600',
    color: COLORS.white,
  },
});
