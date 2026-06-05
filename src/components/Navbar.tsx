import { motion } from "motion/react";
import { Users, Calendar, Info, Mail, Heart, LifeBuoy, Star, ImageIcon, LogIn, LogOut, User, Video } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModals from "./AuthModals";

import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const navItems = [
    { name: "About", icon: Info, href: "#about" },
    { name: "Events", icon: Calendar, href: "#events" },
    { name: "Gallery", icon: ImageIcon, href: "#gallery" },
    { name: "Seek Help", icon: LifeBuoy, href: "#seek-help" },
    { name: "Reviews", icon: Star, href: "#reviews" },
  ];

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl border border-stone-200 rounded-3xl px-8 py-4 flex items-center justify-between shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-maroon opacity-50 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-4">
            <Logo className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="font-serif font-black tracking-[0.3em] text-xl hidden sm:block leading-none text-brand-maroon">IKSHANA</span>
              <span className="text-[8px] uppercase tracking-[0.4em] text-brand-maroon/40 font-bold hidden sm:block">Foundation</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                className="text-brand-maroon/60 hover:text-brand-maroon transition-colors text-sm font-medium flex items-center gap-1 group"
              >
                <item.icon size={16} className="sm:hidden" />
                <span className="hidden sm:inline relative">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-maroon transition-all group-hover:w-full"></span>
                </span>
              </a>
            ))}

            <div className="h-6 w-px bg-brand-maroon/10 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-brand-maroon/60 text-sm font-medium">
                  <User size={16} className="text-brand-maroon" />
                  <div className="flex flex-col">
                    <span>{user.name.split(' ')[0]}</span>
                    {user.role === 'admin' && (
                      <span className="text-[7px] font-bold uppercase tracking-widest bg-brand-maroon text-white px-1.5 py-0.5 rounded-full leading-none mt-0.5">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => logout()}
                  className="text-brand-maroon/60 hover:text-brand-maroon transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleAuthClick('login')}
                  className="text-brand-maroon/60 hover:text-brand-maroon transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <LogIn size={16} />
                  <span className="hidden sm:inline">Login</span>
                </button>
                <button 
                  onClick={() => handleAuthClick('register')}
                  className="bg-brand-maroon text-white px-6 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-stone-900 transition-all hidden sm:block shadow-lg shadow-brand-maroon/20"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </nav>

      <AuthModals 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </>
  );
}
