import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qjhanbplwojrcljzkpbb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqaGFuYnBsd29qcmNsanprcGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTY3MTUsImV4cCI6MjA4NzUzMjcxNX0.c7GlXWBMbFBpaLtzBnhg8XiEDIKsj16ohrruqxKfAxg';

export const supabase = createClient(supabaseUrl, supabaseKey);