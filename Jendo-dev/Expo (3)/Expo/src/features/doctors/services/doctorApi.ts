import { Doctor, DoctorSummary, DoctorSpecialty, Appointment, TimeSlot, AppointmentType } from '../../../types/models';
import { httpClient } from '../../../infrastructure/api';
import { ENDPOINTS } from '../../../config/api.config';

const DUMMY_DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Sarah Johnson',
    specialty: 'cardiologist',
    hospital: 'National Hospital, Colombo',
    experience: 15,
    rating: 4.9,
    reviewCount: 234,
    imageUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
    about: 'Dr. Sarah Johnson is a highly experienced cardiologist with over 15 years of expertise in treating cardiovascular diseases.',
    qualifications: ['MBBS', 'MD Cardiology', 'FACC'],
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    consultationFee: 3500,
    isAvailable: true,
    phone: '+94 11 234 5678',
    email: 'dr.johnson@hospital.com',
  },
  {
    id: 'doc-002',
    name: 'Dr. Michael Chen',
    specialty: 'endocrinologist',
    hospital: 'Lanka Hospitals',
    experience: 12,
    rating: 4.8,
    reviewCount: 189,
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    about: 'Dr. Michael Chen is an expert endocrinologist focusing on diabetes management and thyroid disorders.',
    qualifications: ['MBBS', 'MD Internal Medicine', 'DM Endocrinology'],
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    consultationFee: 3000,
    isAvailable: true,
    phone: '+94 11 345 6789',
    email: 'dr.chen@lankahospitals.com',
  },
  {
    id: 'doc-003',
    name: 'Dr. Amanda Williams',
    specialty: 'general',
    hospital: 'Asiri Medical Hospital',
    experience: 8,
    rating: 4.7,
    reviewCount: 156,
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    about: 'Dr. Amanda Williams is a dedicated general practitioner with expertise in preventive medicine.',
    qualifications: ['MBBS', 'MRCGP'],
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    consultationFee: 2000,
    isAvailable: true,
    phone: '+94 11 456 7890',
    email: 'dr.williams@asiri.com',
  },
  {
    id: 'doc-004',
    name: 'Dr. Robert Lee',
    specialty: 'neurologist',
    hospital: 'Nawaloka Hospital',
    experience: 20,
    rating: 4.9,
    reviewCount: 312,
    imageUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
    about: 'Dr. Robert Lee is a renowned neurologist with two decades of experience in treating complex neurological conditions.',
    qualifications: ['MBBS', 'MD Neurology', 'Fellowship in Movement Disorders'],
    availableDays: ['Monday', 'Thursday'],
    consultationFee: 4000,
    isAvailable: true,
    phone: '+94 11 567 8901',
    email: 'dr.lee@nawaloka.com',
  },
  {
    id: 'doc-005',
    name: 'Dr. Priya Sharma',
    specialty: 'cardiologist',
    hospital: 'Durdans Hospital',
    experience: 10,
    rating: 4.6,
    reviewCount: 145,
    imageUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
    about: 'Dr. Priya Sharma is a cardiac specialist focusing on interventional cardiology.',
    qualifications: ['MBBS', 'MD Cardiology', 'DM Interventional Cardiology'],
    availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    consultationFee: 3500,
    isAvailable: false,
    phone: '+94 11 678 9012',
    email: 'dr.sharma@durdans.com',
  },
];

const DUMMY_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    userId: 'user-001',
    doctorId: 'doc-001',
    doctor: {
      id: 'doc-001',
      name: 'Dr. Sarah Johnson',
      specialty: 'cardiologist',
      hospital: 'National Hospital, Colombo',
      rating: 4.9,
      imageUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
      isAvailable: true,
    },
    date: '2024-12-10',
    time: '10:30',
    type: 'video',
    status: 'scheduled',
    notes: 'Follow-up consultation for heart health monitoring',
    createdAt: '2024-11-20T14:00:00Z',
  },
];

// Backend response types
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

interface PaginationResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface DoctorBackendDto {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  email?: string;
  phone?: string;
  qualifications?: string;
  imageUrl?: string;
  address?: string;
  isAvailable?: boolean;
  availableDays?: string;
  consultationFees?: Array<{
    id: number;
    feeType: string;
    amount: number;
    currency: string;
  }>;
}

// Map backend DTO to frontend Doctor model
const mapBackendDoctorToDoctor = (backendDoctor: DoctorBackendDto): Doctor => {
  // Parse qualifications string to array
  const qualifications = backendDoctor.qualifications 
    ? backendDoctor.qualifications.split(',').map(q => q.trim())
    : [];
  
  // Parse available days string to array
  const availableDays = backendDoctor.availableDays
    ? backendDoctor.availableDays.split(',').map(d => d.trim())
    : [];
  
  // Get consultation fee (use first fee if available)
  const consultationFee = backendDoctor.consultationFees && backendDoctor.consultationFees.length > 0
    ? Number(backendDoctor.consultationFees[0].amount)
    : 0;

  return {
    id: String(backendDoctor.id),
    name: backendDoctor.name,
    specialty: mapBackendSpecialtyToFrontend(backendDoctor.specialty),
    hospital: backendDoctor.hospital,
    experience: 0, // Not provided by backend, using default
    rating: 4.5, // Not provided by backend, using default
    reviewCount: 0, // Not provided by backend, using default
    imageUrl: backendDoctor.imageUrl,
    about: '', // Not provided by backend
    qualifications,
    availableDays,
    consultationFee,
    isAvailable: backendDoctor.isAvailable ?? true,
    phone: backendDoctor.phone,
    email: backendDoctor.email,
  };
};

const mapBackendDoctorToSummary = (backendDoctor: DoctorBackendDto): DoctorSummary => {
  return {
    id: String(backendDoctor.id),
    name: backendDoctor.name,
    specialty: mapBackendSpecialtyToFrontend(backendDoctor.specialty),
    hospital: backendDoctor.hospital,
    rating: 4.5, // Default rating
    imageUrl: backendDoctor.imageUrl,
    isAvailable: backendDoctor.isAvailable ?? true,
  };
};

// Map backend specialty string to frontend DoctorSpecialty type
const mapBackendSpecialtyToFrontend = (specialty: string): DoctorSpecialty => {
  const normalized = specialty.toLowerCase().trim();
  
  // Map common variations
  const specialtyMap: Record<string, DoctorSpecialty> = {
    'cardiology': 'cardiologist',
    'cardiologist': 'cardiologist',
    'neurology': 'neurologist',
    'neurologist': 'neurologist',
    'dermatology': 'dermatologist',
    'dermatologist': 'dermatologist',
    'pediatrics': 'pediatrician',
    'pediatrician': 'pediatrician',
    'orthopedics': 'orthopedic',
    'orthopedic': 'orthopedic',
    'gynecology': 'gynecologist',
    'gynecologist': 'gynecologist',
    'ophthalmology': 'ophthalmologist',
    'ophthalmologist': 'ophthalmologist',
    'psychiatry': 'psychiatrist',
    'psychiatrist': 'psychiatrist',
    'endocrinology': 'endocrinologist',
    'endocrinologist': 'endocrinologist',
    'general': 'general',
    'general practitioner': 'general',
  };
  
  return specialtyMap[normalized] || 'general';
};

export const doctorApi = {
  getAllDoctors: async (page: number = 0, size: number = 10): Promise<{ doctors: DoctorSummary[]; totalPages: number; totalElements: number }> => {
    try {
      // REAL API
      const response = await httpClient.get<ApiResponse<PaginationResponse<DoctorBackendDto>>>(
        `${ENDPOINTS.DOCTORS.LIST}?page=${page}&size=${size}`
      );
      
      return {
        doctors: response.data.content.map(mapBackendDoctorToSummary),
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
      };
    } catch (error) {
      console.error('Error fetching doctors:', error);
      // Fallback to dummy data on error
      return {
        doctors: DUMMY_DOCTORS.map(doc => ({
          id: doc.id,
          name: doc.name,
          specialty: doc.specialty,
          hospital: doc.hospital,
          rating: doc.rating,
          imageUrl: doc.imageUrl,
          isAvailable: doc.isAvailable,
        })),
        totalPages: 1,
        totalElements: DUMMY_DOCTORS.length,
      };
    }
  },

  getDoctorById: async (id: string): Promise<Doctor | null> => {
    try {
      // REAL API
      console.log('API Call: Getting doctor by ID:', id);
      console.log('API Endpoint:', ENDPOINTS.DOCTORS.DETAIL(id));
      
      const response = await httpClient.get<ApiResponse<DoctorBackendDto>>(
        ENDPOINTS.DOCTORS.DETAIL(id)
      );
      
      console.log('API Response:', JSON.stringify(response, null, 2));
      
      const mappedDoctor = mapBackendDoctorToDoctor(response.data);
      console.log('Mapped Doctor:', JSON.stringify(mappedDoctor, null, 2));
      
      return mappedDoctor;
    } catch (error: any) {
      console.error('Error fetching doctor by ID:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      
      // Fallback to dummy data
      const dummyDoctor = DUMMY_DOCTORS.find(doc => doc.id === id);
      console.log('Falling back to dummy doctor:', dummyDoctor?.name || 'Not found');
      return dummyDoctor || null;
    }
  },

  getDoctorsBySpecialty: async (specialty: DoctorSpecialty, page: number = 0, size: number = 10): Promise<{ doctors: DoctorSummary[]; totalPages: number }> => {
    try {
      // REAL API
      const response = await httpClient.get<ApiResponse<PaginationResponse<DoctorBackendDto>>>(
        `${ENDPOINTS.DOCTORS.BY_SPECIALTY(specialty)}?page=${page}&size=${size}`
      );
      return {
        doctors: response.data.content.map(mapBackendDoctorToSummary),
        totalPages: response.data.totalPages,
      };
    } catch (error) {
      console.error('Error fetching doctors by specialty:', error);
      // Fallback to dummy data
      const filtered = DUMMY_DOCTORS
        .filter(doc => doc.specialty === specialty)
        .map(doc => ({ id: doc.id, name: doc.name, specialty: doc.specialty, hospital: doc.hospital, rating: doc.rating, imageUrl: doc.imageUrl, isAvailable: doc.isAvailable }));
      return { doctors: filtered, totalPages: 1 };
    }
  },

  searchDoctors: async (query: string): Promise<DoctorSummary[]> => {
    // REAL API - Uncomment when backend is ready
    // return httpClient.get<DoctorSummary[]>(`${ENDPOINTS.DOCTORS.SEARCH}?q=${encodeURIComponent(query)}`);

    // DUMMY DATA - Comment out when connecting to backend
    await new Promise(resolve => setTimeout(resolve, 500));
    const lowercaseQuery = query.toLowerCase();
    return DUMMY_DOCTORS
      .filter(doc => doc.name.toLowerCase().includes(lowercaseQuery) || doc.specialty.toLowerCase().includes(lowercaseQuery) || doc.hospital.toLowerCase().includes(lowercaseQuery))
      .map(doc => ({ id: doc.id, name: doc.name, specialty: doc.specialty, hospital: doc.hospital, rating: doc.rating, imageUrl: doc.imageUrl, isAvailable: doc.isAvailable }));
  },

  getAvailableSlots: async (doctorId: string, date: string): Promise<TimeSlot[]> => {
    // REAL API - Uncomment when backend is ready
    // return httpClient.get<TimeSlot[]>(ENDPOINTS.DOCTORS.AVAILABLE_SLOTS(doctorId, date));

    // DUMMY DATA - Comment out when connecting to backend
    await new Promise(resolve => setTimeout(resolve, 400));
    return [
      { time: '09:00', isAvailable: true },
      { time: '09:30', isAvailable: false },
      { time: '10:00', isAvailable: true },
      { time: '10:30', isAvailable: true },
      { time: '11:00', isAvailable: false },
      { time: '11:30', isAvailable: true },
      { time: '14:00', isAvailable: true },
      { time: '14:30', isAvailable: true },
      { time: '15:00', isAvailable: false },
      { time: '15:30', isAvailable: true },
      { time: '16:00', isAvailable: true },
    ];
  },

  getAppointments: async (): Promise<Appointment[]> => {
    // REAL API - Uncomment when backend is ready
    // return httpClient.get<Appointment[]>(ENDPOINTS.APPOINTMENTS.LIST);

    // DUMMY DATA - Comment out when connecting to backend
    await new Promise(resolve => setTimeout(resolve, 700));
    return DUMMY_APPOINTMENTS;
  },

  getAppointmentById: async (id: string): Promise<Appointment | null> => {
    // REAL API - Uncomment when backend is ready
    // return httpClient.get<Appointment>(ENDPOINTS.APPOINTMENTS.DETAIL(id));

    // DUMMY DATA - Comment out when connecting to backend
    await new Promise(resolve => setTimeout(resolve, 400));
    return DUMMY_APPOINTMENTS.find(apt => apt.id === id) || null;
  },

  bookAppointment: async (data: { doctorId: string; date: string; time: string; type: AppointmentType; notes?: string }): Promise<Appointment> => {
    // REAL API - Uncomment when backend is ready
    // return httpClient.post<Appointment>(ENDPOINTS.APPOINTMENTS.CREATE, data);

    // DUMMY DATA - Comment out when connecting to backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    const doctor = DUMMY_DOCTORS.find(d => d.id === data.doctorId);
    if (!doctor) throw new Error('Doctor not found');
    return {
      id: `apt-${Date.now()}`,
      userId: 'user-001',
      doctorId: data.doctorId,
      doctor: { id: doctor.id, name: doctor.name, specialty: doctor.specialty, hospital: doctor.hospital, rating: doctor.rating, imageUrl: doctor.imageUrl, isAvailable: doctor.isAvailable },
      date: data.date,
      time: data.time,
      type: data.type,
      status: 'scheduled',
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };
  },

  updateAppointment: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    // REAL API - Uncomment when backend is ready
    // return httpClient.put<Appointment>(ENDPOINTS.APPOINTMENTS.UPDATE(id), data);

    // DUMMY DATA - Comment out when connecting to backend
    await new Promise(resolve => setTimeout(resolve, 800));
    const existing = DUMMY_APPOINTMENTS.find(apt => apt.id === id);
    if (!existing) throw new Error('Appointment not found');
    return { ...existing, ...data };
  },

  cancelAppointment: async (id: string): Promise<void> => {
    // REAL API - Uncomment when backend is ready
    // return httpClient.post<void>(ENDPOINTS.APPOINTMENTS.CANCEL(id));

    // DUMMY DATA - Comment out when connecting to backend
    await new Promise(resolve => setTimeout(resolve, 500));
  },

  deleteAppointment: async (id: string): Promise<void> => {
    // REAL API - Uncomment when backend is ready
    // return httpClient.delete<void>(ENDPOINTS.APPOINTMENTS.DELETE(id));

    // DUMMY DATA - Comment out when connecting to backend
    await new Promise(resolve => setTimeout(resolve, 500));
  },
};
