import { createClient } from '@supabase/supabase-js';

// Función auxiliar para leer variables de entorno de forma segura
const getEnv = (key: string) => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {
    console.warn('Environment access error:', e);
  }
  return undefined;
};

// CONFIGURACIÓN DE CREDENCIALES
// 1. Intenta leer variables de entorno (Vercel/Local).
// 2. Si no existen, usa las credenciales fijas que proporcionaste para que funcione directo.
const SUPABASE_URL = getEnv('VITE_SUPABASE_URL') || 'https://jaeuvfczaztghvzfamzv.supabase.co';
const SUPABASE_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_fRII6gHmwYme5BiQJ7QjPg_P968auzX';

// Bandera para saber si tenemos configuración válida (diferente de placeholders vacíos)
export const isConfigured = !!(SUPABASE_URL && SUPABASE_KEY);

// Inicialización del cliente Supabase
export const supabase = createClient(
  SUPABASE_URL, 
  SUPABASE_KEY
);