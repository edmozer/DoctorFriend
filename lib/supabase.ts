import { createClient } from '@supabase/supabase-js';

// Publishable key (ex-anon key) - segura para frontend
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yvucifjzjjsncltbyyke.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_QPxLC9J57WALjb-zUJ5u3g_4-5p42CO';

// Inicializa o cliente Supabase-js com a publishable key
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Função para verificar se está configurado
export const isSupabaseConfigured = () => !!SUPABASE_URL && !!SUPABASE_PUBLISHABLE_KEY;