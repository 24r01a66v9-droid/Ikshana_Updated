import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { createClient } from "@supabase/supabase-js";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads in memory (prevents disk usage on cloud platforms)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
    }
  },
});

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_for_dev";

// Supabase Setup (Mandatory)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("FATAL CONFIG ERROR: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be defined.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Connected to Supabase. SQLite integration has been removed.");

// Helper: Upload file buffer to Supabase Storage
async function uploadToSupabaseStorage(file: Express.Multer.File, bucketName: string = "photos"): Promise<string> {
  const fileExt = path.extname(file.originalname);
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const fileName = `img-${uniqueSuffix}${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    console.error("Supabase Storage Upload Error:", error);
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrl;
}

// Helper: Delete file from Supabase Storage by its public URL
async function deleteFromSupabaseStorage(url: string, bucketName: string = "photos"): Promise<void> {
  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);
    
    if (error) {
      console.error("Supabase Storage Delete Error:", error);
    }
  } catch (e) {
    console.error("Failed to parse/delete file from Supabase Storage:", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());

  // Serve uploaded files as static assets (fallback for local files)
  const uploadsDir = path.join(__dirname, "uploads");
  app.use("/uploads", express.static(uploadsDir));

  // Health check for deployment platforms
  app.get("/health", (req, res) => res.status(200).send("ok"));

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = email === "24r01a66v9@cmrithyderabad.edu.in" ? "admin" : "user";
      
      const { data, error } = await supabase
        .from("users")
        .insert([{ name, email, password: hashedPassword, role }])
        .select();

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: "Email already exists" });
        }
        throw error;
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Registration failed:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) throw error;
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Force admin role for the specific email
      const role = user.email === "24r01a66v9@cmrithyderabad.edu.in" ? "admin" : user.role;

      const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: role }, JWT_SECRET, { expiresIn: "24h" });
      res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
      res.json({ user: { id: user.id, name: user.name, email: user.email, role: role } });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
  });

  // Photos API
  app.get("/api/photos", async (req, res) => {
    const { category, sub_category } = req.query;
    try {
      let query = supabase.from("photos").select("*");
      if (category) query = query.eq("category", category);
      if (sub_category) query = query.eq("sub_category", sub_category);
      
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data);
    } catch (error) {
      console.error("Supabase fetch photos error:", error);
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  app.post("/api/photos", authenticateToken, (req: any, res: any, next: any) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  }, upload.single("file"), async (req: any, res) => {
    const { title, category, sub_category, date, is_featured } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    try {
      // Upload file to Supabase storage bucket named 'photos'
      const fileUrl = await uploadToSupabaseStorage(req.file, "photos");

      // Insert metadata to 'photos' table
      const { data, error } = await supabase.from("photos").insert([{
        url: fileUrl,
        title: title || null,
        category,
        sub_category: sub_category || null,
        date: date || new Date().toLocaleDateString(),
        is_featured: is_featured ? 1 : 0
      }]).select();
      
      if (error) throw error;
      res.json({ success: true, id: data[0].id, url: fileUrl });
    } catch (error: any) {
      console.error("Supabase add photo error:", error);
      res.status(500).json({ error: error.message || "Failed to add photo" });
    }
  });

  app.delete("/api/photos/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    
    try {
      // Fetch photo to get the URL
      const { data: photoData, error: fetchError } = await supabase
        .from("photos")
        .select("url")
        .eq("id", id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete file from storage
      if (photoData && photoData.url) {
        await deleteFromSupabaseStorage(photoData.url, "photos");
      }
      
      // Delete photo from database
      const { error } = await supabase.from("photos").delete().eq("id", id);
      if (error) throw error;
      
      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase delete photo error:", error);
      res.status(500).json({ error: "Failed to delete photo from storage or database" });
    }
  });

  app.patch("/api/photos/:id/feature", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    const { category } = req.body;

    try {
      // Reset all featured in this category
      const { error: resetError } = await supabase
        .from("photos")
        .update({ is_featured: 0 })
        .eq("category", category);
      if (resetError) throw resetError;

      // Set the selected photo to featured
      const { data, error } = await supabase
        .from("photos")
        .update({ is_featured: 1 })
        .eq("id", id)
        .select();
      if (error) throw error;

      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase feature photo error:", error);
      return res.status(500).json({ error: "Failed to feature photo" });
    }
  });

  // Videos API
  app.get("/api/videos", async (req, res) => {
    try {
      const { data, error } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data);
    } catch (error) {
      console.error("Supabase fetch videos error:", error);
      res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.post("/api/videos", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { title, description, url, thumbnail, category, date } = req.body;
    if (!title || !url) return res.status(400).json({ error: "Title and URL are required" });

    try {
      const { data, error } = await supabase.from("videos").insert([{
        title,
        description: description || null,
        url,
        thumbnail: thumbnail || null,
        category: category || "General",
        date: date || new Date().toLocaleDateString()
      }]).select();
      
      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add video error:", error);
      res.status(500).json({ error: "Failed to add video" });
    }
  });

  app.delete("/api/videos/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    try {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase delete video error:", error);
      res.status(500).json({ error: "Failed to delete video" });
    }
  });

  // Sponsors API
  app.get("/api/sponsors", async (req, res) => {
    try {
      const { data, error } = await supabase.from("sponsors").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data || []);
    } catch (error) {
      console.error("Supabase fetch sponsors error:", error);
      res.status(500).json({ error: "Failed to fetch sponsors" });
    }
  });

  app.post("/api/sponsors", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { name, description, logo_url, website_url, type, contact_email, contact_phone } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    try {
      const { data, error } = await supabase.from("sponsors").insert([{
        name,
        description: description || null,
        logo_url: logo_url || null,
        website_url: website_url || null,
        type: type || "sponsor",
        contact_email: contact_email || null,
        contact_phone: contact_phone || null,
      }]).select();

      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add sponsor error:", error);
      res.status(500).json({ error: "Failed to add sponsor" });
    }
  });

  app.delete("/api/sponsors/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    try {
      const { error } = await supabase.from("sponsors").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase delete sponsor error:", error);
      res.status(500).json({ error: "Failed to delete sponsor" });
    }
  });

  // Job Openings API
  app.get("/api/jobs", async (req, res) => {
    try {
      const { data, error } = await supabase.from("job_openings").select("*").eq("is_active", true).order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data || []);
    } catch (error) {
      console.error("Supabase fetch jobs error:", error);
      res.status(500).json({ error: "Failed to fetch job openings" });
    }
  });

  app.post("/api/jobs", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { title, department, description, requirements, location, job_type, contact_email } = req.body;
    if (!title || !description) return res.status(400).json({ error: "Title and description are required" });

    try {
      const { data, error } = await supabase.from("job_openings").insert([{
        title,
        department: department || null,
        description,
        requirements: requirements || null,
        location: location || null,
        job_type: job_type || "volunteer",
        contact_email: contact_email || null,
        is_active: true,
      }]).select();

      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add job error:", error);
      res.status(500).json({ error: "Failed to add job opening" });
    }
  });

  app.delete("/api/jobs/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    try {
      const { error } = await supabase.from("job_openings").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase delete job error:", error);
      res.status(500).json({ error: "Failed to delete job opening" });
    }
  });

  // Reviews API
  app.get("/api/reviews", async (req, res) => {
    try {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return res.json(data);
    } catch (error) {
      console.error("Supabase fetch reviews error:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    const { user_name, rating, comment } = req.body;
    if (!user_name || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const { data, error } = await supabase.from("reviews").insert([{
        user_name,
        rating,
        comment
      }]).select();
      
      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add review error:", error);
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  // Medical Requests API
  app.post("/api/medical-request", async (req, res) => {
    const { patient_name, contact_number, emergency_details, hospital_name, required_amount, documents } = req.body;
    if (!patient_name || !contact_number || !emergency_details) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const { data, error } = await supabase.from("medical_requests").insert([{
        patient_name,
        contact_number,
        emergency_details,
        hospital_name,
        required_amount,
        documents,
        status: 'pending'
      }]).select();
      
      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add medical request error:", error);
      res.status(500).json({ error: "Failed to submit request" });
    }
  });

  app.get("/api/medical-request/:contact", async (req, res) => {
    const { contact } = req.params;

    try {
      const { data, error } = await supabase
        .from("medical_requests")
        .select("*")
        .eq("contact_number", contact)
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (error) throw error;
      if (data && data.length > 0) {
        return res.json(data[0]);
      } else {
        return res.status(404).json({ error: "No request found for this number" });
      }
    } catch (error) {
      console.error("Supabase fetch medical request error:", error);
      res.status(500).json({ error: "Failed to fetch request status" });
    }
  });

  app.get("/api/medical-requests", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("medical_requests")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return res.json(data);
    } catch (error) {
      console.error("Supabase fetch all medical requests error:", error);
      res.status(500).json({ error: "Failed to fetch medical requests" });
    }
  });

  app.delete("/api/medical-request/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;

    try {
      const { error } = await supabase.from("medical_requests").delete().eq("id", id);
      if (error) throw error;
      return res.json({ success: true });
    } catch (error) {
      console.error("Supabase delete medical request error:", error);
      res.status(500).json({ error: "Failed to delete request" });
    }
  });

  app.patch("/api/medical-request/:id", authenticateToken, async (req: any, res) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { id } = req.params;
    const { status, expiry_date } = req.body;

    try {
      const updateFields: any = {};
      if (status !== undefined) updateFields.status = status;
      if (expiry_date !== undefined) updateFields.expiry_date = expiry_date;

      const { data, error } = await supabase
        .from("medical_requests")
        .update(updateFields)
        .eq("id", id)
        .select();
      
      if (error) throw error;
      return res.json({ success: true, data: data[0] });
    } catch (error) {
      console.error("Supabase update medical request error:", error);
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  // RSVP API
  app.post("/api/rsvp", async (req, res) => {
    const { event_id, name, email } = req.body;
    if (!event_id || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    try {
      const { data, error } = await supabase.from("rsvps").insert([{
        event_id,
        name,
        email
      }]).select();
      
      if (error) throw error;
      return res.json({ success: true, id: data[0].id });
    } catch (error) {
      console.error("Supabase add RSVP error:", error);
      res.status(500).json({ error: "Failed to submit RSVP" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
