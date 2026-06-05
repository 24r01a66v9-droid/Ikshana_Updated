import { motion } from "motion/react";
import { ArrowRight, Heart, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from "./Logo";

export default function Hero() {
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const response = await fetch("/api/photos?category=hero");
        if (response.ok) {
          const data = await response.json();
          const featured = data.find((p: any) => p.is_featured);
          if (featured) setHeroImage(featured.url);
        }
      } catch (e) {
        console.error("Failed to fetch hero image", e);
      }
    };
    fetchHeroImage();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden">
      {/* Content Side */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-32 relative z-10 bg-[#fffcfc]">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-maroon" />
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex items-center gap-4"
        >
          <Logo className="w-20 h-20" />
          <div>
            <h1 className="text-3xl font-serif font-black tracking-[0.4em] text-brand-maroon leading-none">IKSHANA</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-brand-maroon/40 font-bold mt-1">Foundation</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-brand-maroon text-white rounded-full text-[10px] font-bold tracking-[0.3em] uppercase mb-10 shadow-xl shadow-brand-maroon/20">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            CMRIT Student Led Organization
          </div>
          <h2 className="text-7xl md:text-9xl font-serif font-light leading-[0.85] mb-10 tracking-tighter text-brand-maroon">
            Supporting <br />
            <span className="italic font-medium text-brand-maroon underline underline-offset-8 decoration-brand-maroon/20">Lives,</span> <br />
            Spreading Hope.
          </h2>
          <p className="text-brand-maroon font-serif italic text-3xl mb-12 opacity-90 border-l-8 border-brand-maroon pl-8 leading-tight">
            "your little help + our passion to help = someone's hope"
          </p>
          <p className="text-brand-maroon/70 text-xl mb-14 leading-relaxed font-serif italic">
            Ikshana is a community-driven social service initiative dedicated to supporting those who need it most through compassion and responsibility.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <a href="#contact" className="w-full sm:w-auto px-12 py-6 bg-brand-maroon text-white rounded-2xl font-bold tracking-widest uppercase text-[10px] hover:bg-stone-900 hover:scale-105 transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-brand-maroon/30">
              Join Our Community
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
            </a>
            <a href="#support" className="w-full sm:w-auto px-12 py-6 border-2 border-brand-maroon/20 text-brand-maroon rounded-2xl font-bold tracking-widest uppercase text-[10px] hover:bg-white hover:border-brand-maroon hover:text-brand-maroon transition-all flex items-center justify-center">
              Support Our Cause
            </a>
          </div>
        </motion.div>
      </div>

      {/* Image Side */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex-1 relative hidden lg:block bg-brand-maroon overflow-hidden"
      >
        {heroImage ? (
          <img 
            src={heroImage} 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <>
            <div className="absolute inset-0 maroon-gradient opacity-40 z-10" />
            <div className="absolute inset-0 flex items-center justify-center opacity-10 scale-150 rotate-12">
              <Logo className="w-full h-full text-white" />
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10" />
        
        <div className="absolute bottom-12 left-12 right-12 glass-card p-8 rounded-[2rem] z-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-brand-maroon rounded-full flex items-center justify-center text-white">
              <Heart size={24} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-maroon/40">Impact Milestone</p>
              <p className="text-xl font-serif font-bold text-brand-maroon">500+ Lives Touched</p>
            </div>
          </div>
          <p className="text-sm text-brand-maroon/60 italic">"Seeing the smiles on their faces makes every effort worth it."</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-10 z-30 hidden lg:flex flex-col items-center gap-2"
      >
        <div className="w-px h-24 bg-gradient-to-b from-brand-maroon to-transparent" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-maroon font-bold [writing-mode:vertical-lr]">Scroll</span>
      </motion.div>
    </section>
  );
}
