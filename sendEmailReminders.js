// sendEmailReminders.js
// Envia lembretes de consulta por e-mail usando SendGrid

import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
import sgMail from '@sendgrid/mail';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM; // e.g. "sua@empresa.com"

sgMail.setApiKey(SENDGRID_API_KEY);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Mocks diretos para teste
const MOCK_PATIENTS = [
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

const MOCK_APPOINTMENTS = [
  {
    id: 'apt_1',
    patientId: 'pat_1',
    patientName: 'John Doe',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 50,
    type: 'ONLINE',
    status: 'SCHEDULED',
    notes: ''
  },
  {
    id: 'apt_2',
    patientId: 'pat_2',
    patientName: 'Sarah Smith',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    duration: 50,
    type: 'IN_PERSON',
    status: 'CONFIRMED',
    notes: ''
  },
  {
    id: 'apt_3',
    patientId: 'pat_3',
    patientName: 'Michael Brown',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:00',
    duration: 50,
    type: 'ONLINE',
    status: 'SCHEDULED',
    notes: ''
  }
];

function buildEmail(patient_name, date, time) {
  return {
    subject: 'Lembrete de Consulta',
    text: `Olá ${patient_name}, este é um lembrete da sua consulta agendada para ${date} às ${time}. Qualquer dúvida, estou à disposição!`,
    html: `<p>Olá <b>${patient_name}</b>, este é um lembrete da sua consulta agendada para <b>${date}</b> às <b>${time}</b>.<br>Qualquer dúvida, estou à disposição!</p>`
  };
}

async function sendEmailReminders() {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  // Buscar agendamentos da semana
  const { data, error } = await supabase
    .from('appointments')
    .select('id, patient_id, date, time');
  if (error) {
    console.error('Supabase error:', error);
    return;
  }
  for (const apt of data) {
    // Buscar paciente
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('name, email')
      .eq('id', apt.patient_id)
      .single();
    if (patientError || !patientData) continue;
    const patient_name = patientData.name || '';
    const email = patientData.email || '';
    if (!email || !patient_name) continue;
    const emailContent = buildEmail(patient_name, apt.date, apt.time);
    const msg = {
      to: email,
      from: EMAIL_FROM,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html
    };
    try {
      await sgMail.send(msg);
      console.log(`Email sent to ${patient_name} (${email})`);
    } catch (err) {
      console.error(`SendGrid error for ${email}:`, err.message);
    }
  }
}

// Função para enviar mensagem de teste sobre um appointment mock
async function sendTestAppointmentEmail() {
  // Seleciona o primeiro appointment mock
  const apt = MOCK_APPOINTMENTS[0];
  const patient = MOCK_PATIENTS.find(p => p.id === apt.patientId);
  if (!patient) {
    console.error('Paciente não encontrado para o appointment de teste.');
    return;
  }
  
  // Envia para o próprio remetente para garantir entrega no teste (evita erro de trial com email fake)
  const testEmail = EMAIL_FROM; 
  
  const emailContent = buildEmail(patient.name, apt.date, apt.time);
  const msg = {
    to: testEmail, 
    from: EMAIL_FROM,
    subject: '[TESTE MOCK] ' + emailContent.subject,
    text: emailContent.text,
    html: emailContent.html
  };
  try {
    await sgMail.send(msg);
    console.log(`Email de teste enviado para ${patient.name} (${testEmail})`);
  } catch (err) {
    console.error(`SendGrid error (teste) para ${testEmail}:`, err.message);
  }
}

// Executar teste
sendTestAppointmentEmail();

// Executar produção (comentado para evitar envio em massa durante teste)
// sendEmailReminders();
