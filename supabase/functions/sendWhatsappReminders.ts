// Supabase Edge Function: WhatsApp Reminder Automation
// Deploy with: supabase functions deploy sendWhatsappReminders
// Call via HTTP or external scheduler

import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

// Twilio REST API endpoint
const TWILIO_API = "https://api.twilio.com/2010-04-01/Accounts/";

serve(async (req) => {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID")!;
  const TWILIO_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN")!;
  const TWILIO_WHATSAPP_FROM = Deno.env.get("TWILIO_WHATSAPP_FROM")!;

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Helper: format WhatsApp number
  function formatWhatsapp(phone: string) {
    let num = phone.replace(/\D/g, "");
    if (!num.startsWith("55")) num = "55" + num;
    return `whatsapp:+${num}`;
  }

  function buildMessage(patientName: string, date: string, time: string) {
    return `Olá ${patientName}, este é um lembrete da sua consulta agendada para ${date} às ${time}. Qualquer dúvida, estou à disposição!`;
  }

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const hourDate = oneHourLater.toISOString().split("T")[0];
  const hourTime = oneHourLater.toTimeString().slice(0, 5);
  const dayDate = oneDayLater.toISOString().split("T")[0];
  const dayTime = oneDayLater.toTimeString().slice(0, 5);

  // Query appointments for 1 hour and 1 day ahead
  const { data, error } = await supabase
    .from("appointments")
    .select("id, patientId, patientName, date, time, patients(phone)")
    .in("date", [hourDate, dayDate]);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  let sent = [];
  for (const apt of data ?? []) {
    if (
      (apt.date === hourDate && apt.time === hourTime) ||
      (apt.date === dayDate && apt.time === dayTime)
    ) {
      let phone = "";
      if (Array.isArray(apt.patients) && apt.patients.length > 0) {
        phone = apt.patients[0].phone || "";
      } else if (apt.patients?.phone) {
        phone = apt.patients.phone;
      }
      if (!phone) continue;
      const to = formatWhatsapp(phone);
      const msg = buildMessage(apt.patientName, apt.date, apt.time);
      // Send WhatsApp via Twilio REST API
      const res = await fetch(
        `${TWILIO_API}${TWILIO_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization":
              "Basic " + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            From: TWILIO_WHATSAPP_FROM,
            To: to,
            Body: msg,
          }),
        }
      );
      const result = await res.json();
      sent.push({ patient: apt.patientName, to, status: result.status });
    }
  }

  return new Response(JSON.stringify({ sent }), { status: 200 });
});
