import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { Star, Quote, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function Reviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserName(user.name);
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: userName, rating, comment }),
      });
      if (response.ok) {
        setUserName("");
        setComment("");
        setRating(5);
        fetchReviews();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reviews" className="py-32 px-6 bg-brand-cream relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-maroon/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-brand-maroon font-bold tracking-[0.3em] uppercase text-[10px] mb-2">Testimonials</span>
            <h2 className="text-6xl md:text-7xl font-serif tracking-tighter text-brand-maroon">Community <span className="italic text-brand-maroon/40">Voices.</span></h2>
            <div className="h-[1px] w-24 bg-brand-maroon/20 mt-4"></div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-2xl sticky top-32 border border-brand-maroon/5"
            >
              <h3 className="text-3xl font-serif mb-8 text-brand-maroon">Share your <br /><span className="italic text-brand-maroon/40">Experience.</span></h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-maroon/40">Your Name</label>
                  <input 
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    type="text" 
                    className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all font-serif text-brand-maroon placeholder:text-brand-maroon/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-maroon/40">Rating</label>
                  <div className="flex gap-3 bg-stone-50 p-4 rounded-2xl justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`transition-all transform hover:scale-125 ${rating >= star ? "text-brand-maroon" : "text-brand-maroon/10"}`}
                      >
                        <Star size={24} fill={rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-maroon/40">Comment</label>
                  <textarea 
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all resize-none font-serif text-brand-maroon placeholder:text-brand-maroon/20"
                  />
                </div>
                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-brand-maroon text-white rounded-2xl font-bold tracking-widest uppercase text-[10px] flex items-center justify-center gap-3 hover:bg-stone-900 transition-all disabled:opacity-50 shadow-xl shadow-brand-maroon/20"
                >
                  <Send size={16} />
                  {loading ? "Posting..." : "Post Review"}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-8">
              {reviews.length > 0 ? (
                reviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-10 rounded-[3rem] relative shadow-sm hover:shadow-2xl transition-all duration-500 border border-brand-maroon/5 group"
                  >
                    <Quote className="absolute top-8 right-10 text-brand-maroon/5 w-16 h-16 group-hover:text-brand-maroon/10 transition-colors" />
                    <div className="flex gap-1.5 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className={i < review.rating ? "text-brand-maroon" : "text-brand-maroon/5"} 
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <p className="text-brand-maroon/70 mb-8 italic text-lg leading-relaxed relative z-10">"{review.comment}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-brand-maroon text-white rounded-full flex items-center justify-center font-serif font-bold text-xl shadow-lg shadow-brand-maroon/20">
                        {review.user_name[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-brand-maroon">{review.user_name}</h4>
                        <p className="text-[10px] text-brand-maroon/30 uppercase tracking-widest font-bold">
                          {new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center py-32 bg-white rounded-[4rem] border border-dashed border-brand-maroon/10">
                  <div className="w-20 h-20 bg-brand-maroon/5 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-maroon/20">
                    <Star size={40} />
                  </div>
                  <p className="text-brand-maroon/40 font-serif italic text-xl">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
