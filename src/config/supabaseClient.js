import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://kcrysvykbjluawyrcvni.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcnlzdnlrYmpsdWF3eXJjdm5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzY4MDM1NDMsImV4cCI6MTk5MjM3OTU0M30.ZCoFsjzhGKSAXdS7IiiUtdAqiQk4C26gs0EFkUQHzKU'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;