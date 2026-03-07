import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iewdlztbjqqqvbivnofp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlld2RsenRianFxcXZiaXZub2ZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMjQxOTgsImV4cCI6MjA4NzkwMDE5OH0.b0HQlcxYQXZXD213ZRsc_h2gLhz7y616_8IlboA12Mw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Importante para fluxos de confirmação de e-mail
    storage: window.localStorage // Força o uso do localStorage do navegador
  }
});