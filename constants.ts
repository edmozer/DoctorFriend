import { Appointment, AppointmentStatus, AppointmentType, Patient, UserRole } from './types';

export const CURRENT_USER = {
  id: 'psy_1',
  name: 'Dr. Alice Rivera',
  email: 'alice@companionpsi.com',
  role: UserRole.PSYCHOLOGIST
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat_1',
    name: 'John Doe',
    email: 'john.d@example.com',
    phone: '+1 555 0101',
    notes: 'Anxiety related to work performance.',
    nextSession: '2023-10-27'
  },
  {
    id: 'pat_2',
    name: 'Sarah Smith',
    email: 'sarah.s@example.com',
    phone: '+1 555 0102',
    notes: 'Processing childhood trauma.',
    nextSession: '2023-10-28'
  },
  {
    id: 'pat_3',
    name: 'Michael Brown',
    email: 'm.brown@example.com',
    phone: '+1 555 0103',
    notes: 'Relationship counseling.',
    nextSession: '2023-10-29'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_1',
    patientId: 'pat_1',
    patientName: 'John Doe',
    date: new Date().toISOString().split('T')[0], // Today
    time: '10:00',
    duration: 50,
    type: AppointmentType.ONLINE,
    status: AppointmentStatus.SCHEDULED,
    notes: ''
  },
  {
    id: 'apt_2',
    patientId: 'pat_2',
    patientName: 'Sarah Smith',
    date: new Date().toISOString().split('T')[0], // Today
    time: '14:00',
    duration: 50,
    type: AppointmentType.IN_PERSON,
    status: AppointmentStatus.CONFIRMED,
    notes: ''
  },
  {
    id: 'apt_3',
    patientId: 'pat_3',
    patientName: 'Michael Brown',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    time: '11:00',
    duration: 50,
    type: AppointmentType.ONLINE,
    status: AppointmentStatus.SCHEDULED,
    notes: ''
  }
];