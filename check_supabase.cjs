require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be defined in your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
  const tables = ['users', 'photos', 'videos', 'reviews', 'medical_requests', 'rsvps'];
  console.log("Checking records in Supabase tables...");
  
  for (const table of tables) {
    try {
      const { data, count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.log(`Table ${table}: Error - ${error.message}`);
      } else {
        console.log(`Table ${table}: ${count} rows`);
      }
    } catch (e) {
      console.log(`Table ${table}: Exception - ${e.message}`);
    }
  }
}

checkSupabase();
