export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: string;
  nationality?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthParameters {
  height?: number;
  weight?: number;
  bmi?: number;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface UserProfile extends User {
  healthParameters?: HealthParameters;
  riskLevel?: 'low' | 'moderate' | 'high';
  lastTestDate?: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}
