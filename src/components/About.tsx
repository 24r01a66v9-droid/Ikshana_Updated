import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageIcon, Plus, X, Upload, Trash2, Camera, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface AboutPhoto {
  id: string;
  url: string;
  caption: string;
  is_featured: boolean;
}

export default function About() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [photos, setPhotos] = useState<AboutPhoto[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ caption: "", category: "about", file: null as File | null });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/photos?category=about");
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
        const featured = data.find((p: any) => p.is_featured);
        if (featured) setFeaturedImage(featured.url);
      }
    } catch (e) {
      console.error("Failed to fetch about photos", e);
    }
  };

  // Load photos from API on mount
  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto({ ...newPhoto, file: e.target.files[0] });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setNewPhoto({ ...newPhoto, file: e.dataTransfer.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.file) return;

    const formData = new FormData();
    formData.append("file", newPhoto.file);
    formData.append("title", newPhoto.caption || "About Moment");
    formData.append("category", newPhoto.category);
    formData.append("date", new Date().toLocaleDateString());

    try {
      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchPhotos();
        setIsAdding(false);
        setNewPhoto({ caption: "", category: "about", file: null });
      } else {
        const errorData = await response.json();
        alert(`Upload failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (e) {
      console.error("Failed to upload about photo", e);
      alert("An error occurred during upload. Please try again.");
    }
  };

  const featurePhoto = async (id: string) => {
    try {
      const response = await fetch(`/api/photos/${id}/feature`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "about" }),
      });
      if (response.ok) {
        fetchPhotos();
      }
    } catch (e) {
      console.error("Failed to feature photo", e);
    }
  };

  const removePhoto = async (id: string) => {
    try {
      const response = await fetch(`/api/photos/${id}`, { method: "DELETE" });
      if (response.ok) {
        setPhotos(photos.filter(p => p.id !== id));
        if (photos.find(p => p.id === id)?.url === featuredImage) {
          setFeaturedImage(null);
        }
      }
    } catch (e) {
      console.error("Failed to delete about photo", e);
    }
  };

  return (
    <section id="about" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 ${featuredImage ? 'lg:grid-cols-[1.2fr_1fr]' : ''} gap-16 items-center mb-32`}>
          {featuredImage && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl bg-brand-maroon relative group">
                <img 
                  src={featuredImage} 
                  alt="About Featured" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] z-10" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-brand-maroon p-10 rounded-[2.5rem] shadow-2xl hidden lg:block border-8 border-white">
                <p className="font-serif text-3xl italic text-white leading-tight">"Students for students, <br />by students."</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className={!featuredImage ? "max-w-4xl mx-auto" : ""}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-brand-maroon"></div>
              <span className="text-brand-maroon font-bold tracking-[0.2em] uppercase text-[10px]">About Us</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-serif mb-8 tracking-tighter leading-[0.9] text-brand-maroon">Welcome to <br /><span className="italic text-brand-maroon/40">Our Website.</span></h2>
            <div className="space-y-8 text-brand-maroon/80 text-xl leading-relaxed">
              <p className="border-l-4 border-brand-maroon/20 pl-6 italic">
                This image represents our institution and its vibrant environment. We focus on innovation, learning, and growth.
              </p>
              <p>
                Explore our team and discover the passion, creativity, and dedication that drive our vision. We believe in innovation, collaboration, and building meaningful experiences for everyone we serve.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-8">
                <div className="group">
                  <h3 className="text-5xl font-serif text-brand-maroon mb-2 group-hover:translate-x-2 transition-transform origin-left">15+</h3>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-maroon/40">Founding Volunteers</p>
                </div>
                <div className="group">
                  <h3 className="text-5xl font-serif text-brand-maroon mb-2 group-hover:translate-x-2 transition-transform origin-left">2021</h3>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-maroon/40">Year Founded</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* About Archive Section */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-maroon/40">Team Archive</span>
                <div className="h-[1px] w-12 bg-brand-maroon/10"></div>
              </div>
              <h3 className="text-4xl font-serif mb-4 text-brand-maroon">Foundation <span className="italic text-brand-maroon/40">Memories.</span></h3>
              <p className="text-brand-maroon/60">Documenting our journey, team members, and the moments that define our foundation.</p>
            </div>
            
            {isAdmin && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-3 bg-brand-maroon text-white px-8 py-5 rounded-full font-bold tracking-widest uppercase text-[10px] hover:bg-stone-900 transition-all shadow-xl shadow-brand-maroon/20 self-start md:self-auto"
              >
                <Camera size={16} />
                Add Team Photo
              </button>
            )}
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-stone-100 border border-stone-100"
                  >
                    <img 
                      src={photo.url} 
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <p className="text-white font-serif text-sm mb-4 leading-tight">{photo.caption}</p>
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => featurePhoto(photo.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${photo.is_featured ? 'bg-brand-maroon text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-brand-maroon'}`}
                            title="Set as Main Image"
                          >
                            <Star size={16} fill={photo.is_featured ? "currentColor" : "none"} />
                          </button>
                          <button 
                            onClick={() => removePhoto(photo.id)}
                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-brand-maroon transition-colors"
                            title="Remove from archive"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-stone-900/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] p-12 shadow-2xl"
            >
              <button 
                onClick={() => setIsAdding(false)}
                className="absolute top-8 right-8 text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-10">
                <span className="text-brand-red font-bold tracking-widest uppercase text-[10px] mb-2 block">Foundation Archive</span>
                <h3 className="text-4xl font-serif">Add Team Photo</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Section</label>
                  <div className="flex gap-3">
                    {[
                      { id: "about", label: "About Archive" },
                      { id: "hero", label: "Hero Main" }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewPhoto({ ...newPhoto, category: cat.id })}
                        className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                          newPhoto.category === cat.id 
                            ? "bg-brand-maroon text-white shadow-lg shadow-brand-maroon/20" 
                            : "bg-stone-50 text-stone-400 hover:bg-stone-100"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">Caption</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., Founding team meeting, 2021"
                    className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all font-serif"
                    value={newPhoto.caption}
                    onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })}
                  />
                </div>

                <div 
                  className={`relative border-2 border-dashed rounded-[2.5rem] p-10 transition-all flex flex-col items-center justify-center text-center group ${
                    dragActive ? "border-brand-red bg-brand-red/5" : "border-stone-100 bg-stone-50 hover:bg-stone-100/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {newPhoto.file ? (
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden mb-6 shadow-xl border-4 border-white">
                        <img 
                          src={URL.createObjectURL(newPhoto.file)} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-stone-900 font-serif text-xs mb-2">{newPhoto.file.name}</p>
                      <button 
                        type="button"
                        onClick={() => setNewPhoto({ ...newPhoto, file: null })}
                        className="text-brand-red text-[10px] font-bold uppercase tracking-widest hover:underline"
                      >
                        Replace Image
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-stone-300 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload size={20} />
                      </div>
                      <p className="text-stone-500 text-xs mb-2 font-serif">
                        Drop a team memory here
                      </p>
                      <p className="text-stone-400 text-[10px] uppercase tracking-widest">
                        or <span className="text-brand-red font-bold cursor-pointer">browse files</span>
                      </p>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleFileChange}
                      />
                    </>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={!newPhoto.file}
                  className="w-full bg-stone-900 text-white py-6 rounded-2xl font-bold tracking-[0.2em] uppercase text-[10px] hover:bg-brand-red transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  Save to Archive
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
