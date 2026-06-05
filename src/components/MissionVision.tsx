import { motion } from "motion/react";
import { Heart, Eye, ShieldCheck, Users, Star } from "lucide-react";

export default function MissionVision() {
  const values = [
    { name: "Compassion", icon: Heart },
    { name: "Transparency", icon: Eye },
    { name: "Accountability", icon: ShieldCheck },
    { name: "Dignity for All", icon: Users },
    { name: "Service Before Self", icon: Star },
  ];

  return (
    <section className="py-32 px-6 bg-brand-cream relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-brand-maroon rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 mb-32">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-white p-12 lg:p-16 rounded-[4rem] shadow-2xl border border-stone-100 relative group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-maroon/[0.02] rounded-bl-[4rem] -z-10 transition-transform group-hover:scale-110" />
            <div className="w-20 h-20 bg-brand-maroon text-white rounded-3xl flex items-center justify-center mb-10 shadow-xl shadow-brand-maroon/20">
              <Heart size={40} />
            </div>
            <h2 className="text-5xl font-serif mb-8 tracking-tight italic text-brand-maroon">Our Mission</h2>
            <ul className="space-y-6 text-brand-maroon/80 text-xl leading-relaxed">
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-maroon mt-3 shrink-0 shadow-[0_0_10px_rgba(128,0,0,0.5)]" />
                <span>To support children in orphanages and care for elderly in old-age homes.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-maroon mt-3 shrink-0 shadow-[0_0_10px_rgba(128,0,0,0.5)]" />
                <span>To provide financial assistance for medical treatments and education.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-maroon mt-3 shrink-0 shadow-[0_0_10px_rgba(128,0,0,0.5)]" />
                <span>To inspire youth to participate in meaningful social service.</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="bg-stone-900 p-12 lg:p-16 rounded-[4rem] shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-brand-maroon/10 -skew-x-12 translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md text-brand-maroon rounded-3xl flex items-center justify-center mb-10 border border-white/10">
                <Eye size={40} />
              </div>
              <h2 className="text-5xl font-serif mb-8 tracking-tight text-white italic">Our Vision</h2>
              <p className="text-brand-maroon/40 text-xl mb-8 font-serif italic">
                To build a society where:
              </p>
              <ul className="space-y-6 text-stone-300 text-xl leading-relaxed">
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-maroon mt-3 shrink-0 shadow-[0_0_10px_rgba(128,0,0,0.8)]" />
                  <span>No child is deprived of education and no elderly person feels neglected.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-maroon mt-3 shrink-0 shadow-[0_0_10px_rgba(128,0,0,0.8)]" />
                  <span>No individual suffers due to lack of medical support.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-maroon mt-3 shrink-0 shadow-[0_0_10px_rgba(128,0,0,0.8)]" />
                  <span>Communities come together to uplift one another.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-brand-maroon/40 font-bold mb-16 flex items-center gap-4">
              <div className="h-px w-8 bg-brand-maroon/10" />
              Our Core Values
              <div className="h-px w-8 bg-brand-maroon/10" />
            </h3>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            {values.map((value, i) => (
              <motion.div
                key={value.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center gap-6 group"
              >
                <div className="w-20 h-20 rounded-[2rem] border border-brand-maroon/10 bg-white flex items-center justify-center text-brand-maroon/20 group-hover:text-brand-maroon group-hover:border-brand-maroon/20 group-hover:shadow-2xl transition-all duration-500">
                  <value.icon size={32} />
                </div>
                <span className="font-serif text-2xl italic text-brand-maroon/80">{value.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
