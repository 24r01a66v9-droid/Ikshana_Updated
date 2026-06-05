const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Database = require('better-sqlite3');
const { createClient } = require('@supabase/supabase-js');

// 1. Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: SUPABASE_URL and SUPABASE_ANON_KEY must be defined in your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Open SQLite Database
const dbPath = path.join(__dirname, 'ikshana.db');
if (!fs.existsSync(dbPath)) {
  console.error("Error: ikshana.db SQLite file not found at " + dbPath);
  process.exit(1);
}
const db = new Database(dbPath);

function getMimeType(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'gif') return 'image/gif';
  return 'application/octet-stream';
}

async function migrateAll() {
  console.log("Starting migration to Supabase...");

  // --- Migrate Users ---
  try {
    const users = db.prepare("SELECT name, email, password, role, created_at FROM users").all();
    console.log(`Found ${users.length} users to migrate.`);
    if (users.length > 0) {
      const { error } = await supabase.from('users').insert(users);
      if (error) {
        console.warn("Warning migrating users (some may already exist):", error.message);
      } else {
        console.log("Users migrated successfully.");
      }
    }
  } catch (e) {
    console.error("Error migrating users:", e.message);
  }

  // --- Migrate Videos ---
  try {
    const videos = db.prepare("SELECT title, description, url, thumbnail, category, date, created_at FROM videos").all();
    console.log(`Found ${videos.length} videos to migrate.`);
    if (videos.length > 0) {
      const { error } = await supabase.from('videos').insert(videos);
      if (error) throw error;
      console.log("Videos migrated successfully.");
    }
  } catch (e) {
    console.error("Error migrating videos:", e.message);
  }

  // --- Migrate Reviews ---
  try {
    const reviews = db.prepare("SELECT user_name, rating, comment, created_at FROM reviews").all();
    console.log(`Found ${reviews.length} reviews to migrate.`);
    if (reviews.length > 0) {
      const { error } = await supabase.from('reviews').insert(reviews);
      if (error) throw error;
      console.log("Reviews migrated successfully.");
    }
  } catch (e) {
    console.error("Error migrating reviews:", e.message);
  }

  // --- Migrate RSVPs ---
  try {
    const rsvps = db.prepare("SELECT event_id, name, email, created_at FROM rsvps").all();
    console.log(`Found ${rsvps.length} RSVPs to migrate.`);
    if (rsvps.length > 0) {
      const { error } = await supabase.from('rsvps').insert(rsvps);
      if (error) throw error;
      console.log("RSVPs migrated successfully.");
    }
  } catch (e) {
    console.error("Error migrating RSVPs:", e.message);
  }

  // --- Migrate Medical Requests ---
  try {
    const requests = db.prepare("SELECT patient_name, contact_number, emergency_details, hospital_name, required_amount, documents, status, expiry_date, created_at FROM medical_requests").all();
    console.log(`Found ${requests.length} medical requests to migrate.`);
    if (requests.length > 0) {
      const { error } = await supabase.from('medical_requests').insert(requests);
      if (error) throw error;
      console.log("Medical requests migrated successfully.");
    }
  } catch (e) {
    console.error("Error migrating medical requests:", e.message);
  }

  // --- Migrate Photos and Upload Files to Storage ---
  try {
    const photos = db.prepare("SELECT url, title, category, sub_category, is_featured, date, created_at FROM photos").all();
    console.log(`Found ${photos.length} photos in SQLite to migrate.`);
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      let finalUrl = photo.url;

      // If URL is a local path (starts with /uploads/), upload it to Supabase Storage
      if (photo.url.startsWith('/uploads/')) {
        const fileName = photo.url.replace('/uploads/', '');
        const localFilePath = path.join(__dirname, 'uploads', fileName);

        if (fs.existsSync(localFilePath)) {
          console.log(`Uploading ${fileName} to Supabase Storage bucket 'photos'...`);
          const fileBuffer = fs.readFileSync(localFilePath);
          const mimeType = getMimeType(fileName);

          const { data, error } = await supabase.storage
            .from('photos')
            .upload(fileName, fileBuffer, {
              contentType: mimeType,
              upsert: true
            });

          if (error) {
            console.error(`Failed to upload ${fileName} to storage:`, error.message);
            continue; // Skip database record if file upload fails
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('photos')
            .getPublicUrl(fileName);
          
          finalUrl = publicUrl;
          console.log(`Uploaded! Public URL: ${finalUrl}`);
        } else {
          console.warn(`Local file ${localFilePath} not found on disk. Skipping file upload.`);
        }
      }

      // Insert photo record into database
      const { error } = await supabase.from('photos').insert([{
        url: finalUrl,
        title: photo.title,
        category: photo.category,
        sub_category: photo.sub_category,
        is_featured: photo.is_featured,
        date: photo.date,
        created_at: photo.created_at
      }]);

      if (error) {
        console.error(`Failed to insert database record for ${photo.title}:`, error.message);
      } else {
        console.log(`Photo record for "${photo.title}" migrated successfully.`);
      }
    }
  } catch (e) {
    console.error("Error migrating photos:", e.message);
  }

  console.log("Migration complete!");
  db.close();
}

migrateAll();
