export type ViewState = 'dashboard' | 'patients' | 'calendar';

export enum UserRole {
  ADMIN = 'ADMIN',
  PSYCHOLOGIST = 'PSYCHOLOGIST',
  PATIENT = 'PATIENT'
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum AppointmentType {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON'
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  nextSession?: string; // ISO Date string
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string; // Denormalized for simpler frontend display
  date: string; // ISO Date string YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  summary?: string;
}
