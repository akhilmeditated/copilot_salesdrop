import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhfvfnuaxfsoniuwmfcr.supabase.co'; // <-- Put your real Supabase Project URL here.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoZnZmbnVheGZzb25pdXdtZmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODkwOTIsImV4cCI6MjA2ODc2NTA5Mn0.C9TrwAh10mssB3AzUiUgFBvvvRqX-A4PjnggQfPMaxA;' // <-- Put your real Supabase anon/public key here.

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
