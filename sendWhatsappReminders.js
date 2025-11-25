// Doctor Friend - WhatsApp Reminder Automation
// Run manually: node sendWhatsappReminders.js
// Or schedule with cron for automation

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';
dotenv.config();

// ENV: configure in .env file
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM; // e.g. whatsapp:+14155238886

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const client = twilio(TWILIO_SID, TWILIO_TOKEN);

// Helper: format WhatsApp number
function formatWhatsapp(phone) {
  // Remove non-digits
  let num = phone.replace(/\D/g, '');
  // Se for Brasil e tem 13 dígitos (ex: 55 + DDD + 9 + número)
  if (num.startsWith('55') && num.length === 13) {
    // Remove o '9' após o DDD
    num = '55' + num.slice(2, 4) + num.slice(5);
  }
  // Se não começa com 55, adiciona
  if (!num.startsWith('55')) num = '55' + num;
  return `whatsapp:+${num}`;
}

// Helper: build reminder message
function buildMessage(patient_name, date, time) {
  return `Olá ${patient_name}, este é um lembrete da sua consulta agendada para ${date} às ${time}. Qualquer dúvida, estou à disposição!`;
}

async function sendReminders() {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const todayStr = now.toISOString().split('T')[0];
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  // Query all appointments in the next 7 days
  const { data, error } = await supabase
    .from('appointments')
    .select('id, patient_id, date, time');

  if (error) {
    console.error('Supabase error:', error);
    return;
  }
  console.log('Supabase data:', JSON.stringify(data, null, 2));

  for (const apt of data) {
    // Buscar paciente pelo patient_id
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('name, phone')
      .eq('id', apt.patient_id)
      .single();
    if (patientError || !patientData) continue;
    const patient_name = patientData.name || '';
    const phone = patientData.phone || '';
    if (!phone || !patient_name) continue;
    if (patient_name.toLowerCase().includes('edmozer')) {
      const to = formatWhatsapp(phone);
      const msg = buildMessage(patient_name, apt.date, apt.time);
      try {
        const res = await client.messages.create({
          from: TWILIO_WHATSAPP_FROM,
          to,
          body: msg
        });
        console.log(`Reminder sent to ${patient_name} (${to}): ${res.status}`);
      } catch (err) {
        console.error(`Twilio error for ${to}:`, err.message);
      }
    }
  }
}

sendReminders();
