import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Appointment, Patient, AppointmentStatus, AppointmentType } from '../types';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS } from '../constants';

// --- PATIENTS ---

export const fetchPatients = async (userId: string): Promise<Patient[]> => {
  if (!isSupabaseConfigured()) {
    // Simulate network delay
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_PATIENTS]), 500));
  }

  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('user_id', userId)
    .order('name');

  if (error) {
    console.error('Error fetching patients:', error);
    return [];
  }

  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    phone: p.phone,
    notes: p.notes,
    nextSession: p.created_at
  }));
};

export const createPatient = async (patient: Omit<Patient, 'id'>, userId: string): Promise<Patient | null> => {
  if (!isSupabaseConfigured()) {
    const newPatient: Patient = { 
      ...patient, 
      id: `pat_${Date.now()}`,
      nextSession: new Date().toISOString().split('T')[0]
    };
    // Don't push to MOCK_PATIENTS - let the component handle state
    return new Promise(resolve => setTimeout(() => resolve(newPatient), 500));
  }

  const { data, error } = await supabase
    .from('patients')
    .insert([{
      user_id: userId,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      notes: patient.notes
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating patient:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    notes: data.notes
  };
};

// --- APPOINTMENTS ---

export const fetchAppointments = async (userId: string): Promise<Appointment[]> => {
  if (!isSupabaseConfigured()) {
    return new Promise(resolve => setTimeout(() => resolve([...MOCK_APPOINTMENTS]), 500));
  }

  // Fetch appointments and join with patients to get the name
  const { data, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patients (name)
    `)
    .eq('user_id', userId)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }

  return data.map((a: any) => ({
    id: a.id,
    patientId: a.patient_id,
    patientName: a.patients?.name || 'Unknown Patient',
    date: a.date,
    time: a.time.slice(0, 5), // remove seconds if present
    duration: a.duration,
    type: a.type as AppointmentType,
    status: a.status as AppointmentStatus,
    notes: a.notes,
    summary: a.summary
  }));
};

export const updateAppointment = async (appointment: Appointment): Promise<void> => {
  if (!isSupabaseConfigured()) {
    const index = MOCK_APPOINTMENTS.findIndex(a => a.id === appointment.id);
    if (index !== -1) MOCK_APPOINTMENTS[index] = appointment;
    return;
  }

  const { error } = await supabase
    .from('appointments')
    .update({
      status: appointment.status,
      notes: appointment.notes,
      summary: appointment.summary,
      date: appointment.date,
      time: appointment.time
    })
    .eq('id', appointment.id);

  if (error) console.error('Error updating appointment:', error);
};

export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'patientName'>, userId: string): Promise<Appointment | null> => {
    if (!isSupabaseConfigured()) {
        // Mock logic - find patient name
        const patient = MOCK_PATIENTS.find(p => p.id === appointment.patientId);
        const newAppt: Appointment = {
            id: `apt_${Date.now()}`,
            ...appointment,
            patientName: patient?.name || 'Unknown'
        };
        // Don't push to MOCK_APPOINTMENTS - let the component handle state
        return new Promise(resolve => setTimeout(() => resolve(newAppt), 500));
    }

    const { data, error } = await supabase
    .from('appointments')
    .insert([{
        user_id: userId,
        patient_id: appointment.patientId,
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        type: appointment.type,
        status: 'SCHEDULED'
    }])
    .select(`
        *,
        patients (name)
    `)
    .single();

    if (error) {
        console.error("Error creating appointment", error);
        return null;
    }
    
    return {
        id: data.id,
        patientId: data.patient_id,
        patientName: data.patients?.name || 'Unknown',
        date: data.date,
        time: data.time.slice(0, 5),
        duration: data.duration,
        type: data.type as AppointmentType,
        status: data.status as AppointmentStatus,
        notes: data.notes,
        summary: data.summary
    };
}