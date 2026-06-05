import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Video, Plus, X, Trash2, Play, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface VideoItem {
  id: number;
  title: string;
  description: string | null;
  url: string;
  thumbnail: string | null;
  category: string | null;
  date: string | null;
}

function getEmbedUrl(url: string): string {
  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }
  if (url.includes("youtube.com/embed/")) return url;
  return url;
}

export default function Videos() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    url: "",
    category: "Event",
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (response.ok) setVideos(await response.json());
    } catch (e) {
      console.error("Failed to fetch videos", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.url || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newVideo,
          date: new Date().toLocaleDateString(),
        }),
      });

      if (response.ok) {
        await fetchVideos();
        setIsAdding(false);
        setNewVideo({ title: "", description: "", url: "", category: "Event" });
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add video");
      }
    } catch (e) {
      console.error("Failed to add video", e);
    } finally {
      setLoading(false);
    }
  };

  const removeVideo = async (id: number) => {
    if (!confirm("Delete this video?")) return;
    try {
      const response = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (response.ok) {
        setVideos(videos.filter((v) => v.id !== id));
        if (selectedVideo?.id === id) setSelectedVideo(null);
      }
    } catch (e) {
      console.error("Failed to delete video", e);
    }
  };

  return (
    <section id="videos" className="py-32 px-6 bg-[#fffcfc] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-full bg-brand-maroon/[0.02] -skew-x-12" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-24">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-6 mb-8"
            >
              <div className="h-[2px] w-16 bg-brand-maroon" />
              <span className="text-brand-maroon font-bold tracking-[0.4em] uppercase text-[10px]">Visual Stories</span>
            </motion.div>
            <h2 className="text-7xl md:text-9xl font-serif leading-[0.85] tracking-tighter text-brand-maroon">
              Our <br />
              <span className="italic underline underline-offset-8 decoration-brand-maroon/10">Videos.</span>
            </h2>
            <p className="text-brand-maroon/60 text-xl max-w-md leading-relaxed font-serif italic mt-10">
              "Watch our journey unfold — from community drives to celebrations that bring hope and change."
            </p>
          </div>

          {isAdmin && (
            <div className="flex justify-start lg:justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-4 bg-brand-maroon text-white px-10 py-5 rounded-2xl font-bold tracking-widest uppercase text-[10px] hover:bg-stone-900 transition-all shadow-2xl shadow-brand-maroon/30"
              >
                <Plus size={18} />
                Add Video
              </motion.button>
            </div>
          )}
        </div>

        {videos.length === 0 ? (
          <div className="aspect-[21/9] flex flex-col items-center justify-center border border-brand-maroon/10 rounded-[4rem] bg-stone-50/30">
            <Video size={48} className="text-brand-maroon/20 mb-6" />
            <h3 className="text-2xl font-serif text-brand-maroon mb-2">No videos yet</h3>
            <p className="text-brand-maroon/40 font-serif italic">Event highlights and stories will appear here.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 hover:shadow-2xl transition-all duration-500"
              >
                <button
                  onClick={() => setSelectedVideo(video)}
                  className="w-full aspect-video relative overflow-hidden bg-stone-900"
                >
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-brand-maroon/10 flex items-center justify-center">
                      <Video size={40} className="text-brand-maroon/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-brand-maroon/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-brand-maroon shadow-xl">
                      <Play size={24} className="ml-1" />
                    </div>
                  </div>
                </button>
                <div className="p-8">
                  {video.category && (
                    <span className="px-3 py-1 bg-brand-maroon/5 text-brand-maroon text-[9px] font-bold uppercase tracking-widest rounded-full">
                      {video.category}
                    </span>
                  )}
                  <h3 className="text-xl font-serif text-brand-maroon mt-4 leading-tight">{video.title}</h3>
                  {video.description && (
                    <p className="text-brand-maroon/50 text-sm mt-2 line-clamp-2">{video.description}</p>
                  )}
                </div>
                {isAdmin && (
                  <button
                    onClick={() => removeVideo(video.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 text-brand-maroon rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-900 hover:text-white shadow-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-stone-900/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-5xl bg-white rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <div className="p-6 flex justify-between items-center border-b border-stone-100">
                <h3 className="text-2xl font-serif text-brand-maroon">{selectedVideo.title}</h3>
                <button onClick={() => setSelectedVideo(null)} className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-brand-maroon">
                  <X size={20} />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={getEmbedUrl(selectedVideo.url)}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {selectedVideo.description && (
                <div className="p-8">
                  <p className="text-brand-maroon/70 font-serif italic">{selectedVideo.description}</p>
                  <a href={selectedVideo.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-brand-maroon hover:underline">
                    <ExternalLink size={14} /> Open Original
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Video Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-stone-900/90 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl">
              <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900"><X size={20} /></button>
              <h3 className="text-3xl font-serif text-brand-maroon mb-8">Add Video</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Title</label>
                  <input required type="text" value={newVideo.title} onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })} className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-brand-maroon font-serif" placeholder="Video title" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">YouTube URL</label>
                  <input required type="url" value={newVideo.url} onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })} className="w-full border-b border-stone-200 py-3 focus:outline-none focus:border-brand-maroon" placeholder="https://youtube.com/watch?v=..." />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Description</label>
                  <textarea value={newVideo.description} onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })} className="w-full border border-stone-200 rounded-2xl p-4 focus:outline-none focus:border-brand-maroon resize-none h-24" placeholder="Brief description..." />
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Event", "Awareness", "Community", "Highlights"].map((cat) => (
                    <button key={cat} type="button" onClick={() => setNewVideo({ ...newVideo, category: cat })} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${newVideo.category === cat ? "bg-brand-maroon text-white" : "bg-stone-50 text-stone-400"}`}>
                      {cat}
                    </button>
                  ))}
                </div>
                <button type="submit" disabled={loading} className="w-full bg-brand-maroon text-white py-4 rounded-2xl font-bold tracking-widest uppercase text-[10px] hover:bg-stone-900 transition-all disabled:opacity-50">
                  {loading ? "Adding..." : "Publish Video"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
