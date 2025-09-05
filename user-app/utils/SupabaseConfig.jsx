import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export  const supabase = createClient('https://synlughnsmgzbkgelmdm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bmx1Z2huc21nemJrZ2VsbWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MjA2MDcsImV4cCI6MjA1Njk5NjYwN30.8egqbbvOc8M4VEsag7ANbmwnOKb6R0OL_kKgRDPW-5c')
