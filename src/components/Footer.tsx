import { Instagram, Twitter, Linkedin, Github } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="contact" className="bg-brand-maroon text-white py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center gap-6 mb-10">
              <div className="p-3 bg-white rounded-2xl shadow-2xl">
                <Logo className="w-12 h-12" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-black tracking-[0.3em] text-4xl leading-none">IKSHANA</span>
                <span className="text-[10px] uppercase tracking-[0.5em] text-white/60 font-bold mt-1">Foundation</span>
              </div>
            </div>
            <p className="text-white/70 max-w-md mb-12 leading-relaxed text-xl italic font-serif">
              "Fostering a community of leaders, creators, and change-makers. Dedicated to building a better tomorrow through student-led innovation and compassion."
            </p>
            <div className="flex gap-6">
              {[
                { icon: Instagram, href: "https://www.instagram.com/ikshana_official/" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/ikshana-foundation/" },
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white hover:text-brand-maroon hover:scale-110 transition-all duration-500 group"
                >
                  <social.icon size={24} className="group-hover:rotate-12 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-2xl mb-10 italic text-white underline underline-offset-8 decoration-white/20">Quick Links</h4>
            <ul className="space-y-6 text-white/60 font-bold uppercase tracking-widest text-[10px]">
              <li><a href="#about" className="hover:text-white transition-colors flex items-center gap-3 group"><div className="w-0 group-hover:w-6 h-[1px] bg-white transition-all"></div> About Us</a></li>
              <li><a href="#events" className="hover:text-white transition-colors flex items-center gap-3 group"><div className="w-0 group-hover:w-6 h-[1px] bg-white transition-all"></div> Events</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors flex items-center gap-3 group"><div className="w-0 group-hover:w-6 h-[1px] bg-white transition-all"></div> Gallery</a></li>
              <li><a href="#seek-help" className="hover:text-white transition-colors flex items-center gap-3 group"><div className="w-0 group-hover:w-6 h-[1px] bg-white transition-all"></div> Seek Help</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors flex items-center gap-3 group"><div className="w-0 group-hover:w-6 h-[1px] bg-white transition-all"></div> Reviews</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-2xl mb-10 italic text-white underline underline-offset-8 decoration-white/20">Contact</h4>
            <ul className="space-y-8">
              <li className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Location</span>
                <span className="text-xl font-serif italic">Hyderabad, Telangana</span>
              </li>
              <li className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Email</span>
                <span className="text-xl font-serif italic">contact@ikshana.foundation</span>
              </li>
              <li className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/40">Social</span>
                <div className="flex gap-6 mt-2">
                  <a href="https://www.instagram.com/ikshana_official/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                    <Instagram size={24} />
                  </a>
                  <a href="https://www.linkedin.com/company/ikshana-foundation/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                    <Linkedin size={24} />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">
          <p>© 2026 Ikshana Foundation | Crafted with Passion</p>
          <div className="flex gap-16">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
