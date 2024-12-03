import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fkcpflewffvqwugdsmvy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrY3BmbGV3ZmZ2cXd1Z2RzbXZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4NDQ3NTksImV4cCI6MjA0ODQyMDc1OX0.SkJxppBZnT3jnQJw0DVvnkJNRsQ8ul4-3oVaVB8mWPM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
