import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.SUPABASE_URL 
const SUPABSE_KEY = process.env.SUPABASE_KEY


const supabase = createClient(SUPABASE_URL! , SUPABSE_KEY!)

export default supabase