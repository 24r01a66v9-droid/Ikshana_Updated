const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// 1. Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be defined in your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function registerUploads() {
  console.log("Scanning uploads/ directory...");
  const uploadsDir = path.join(__dirname, 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.error("Error: uploads directory not found at " + uploadsDir);
    process.exit(1);
  }

  const files = fs.readdirSync(uploadsDir).filter(f => f.startsWith('img-'));
  console.log(`Found ${files.length} local files.`);

  // Categories to distribute them into for testing/display
  const categories = ['gallery', 'about', 'gallery', 'gallery']; 
  const subCategories = ['Community', 'Team', 'Initiative', 'Event'];

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const dbUrl = `/uploads/${fileName}`;

    try {
      // Check if already registered
      const { data: existing, error: checkError } = await supabase
        .from('photos')
        .select('id')
        .eq('url', dbUrl)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        console.log(`[${i+1}/${files.length}] ${fileName} is already registered. Skipping.`);
        continue;
      }

      console.log(`[${i+1}/${files.length}] Registering ${fileName} in Supabase photos table...`);

      // Assign categories
      const category = categories[i % categories.length];
      const subCategory = subCategories[i % subCategories.length];
      
      const { error: insertError } = await supabase.from('photos').insert([{
        url: dbUrl,
        title: `Ikshana Moment ${i+1}`,
        category: category,
        sub_category: subCategory,
        is_featured: i === 1 ? 1 : 0, // Set one as featured
        date: new Date().toLocaleDateString(),
        created_at: new Date().toISOString()
      }]);

      if (insertError) {
        console.error(`Failed to register ${fileName}:`, insertError.message);
      } else {
        console.log(`Successfully registered ${fileName} (${category}/${subCategory}).`);
      }
    } catch (err) {
      console.error(`Error processing ${fileName}:`, err.message);
    }
  }

  console.log("Local uploads registration complete!");
}

registerUploads();
