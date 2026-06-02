import { motion } from 'framer-motion';
import { BadgeCheck, Smile, Lightbulb, Shield, HeartPulse } from 'lucide-react';

interface ValueCard {
  title: string;
  desc: string;
  icon: React.ReactNode;
  colorClass: string;
}

export default function CoreValues() {
  const values: ValueCard[] = [
    {
      title: 'Quality Assurance',
      desc: 'Strict adherence to global pharmaceutical testing parameters. We deliver absolute chemical and biological safety.',
      icon: <BadgeCheck className="w-7 h-7" />,
      colorClass: 'text-teal-500 bg-teal-500/10 border-teal-500/20'
    },
    {
      title: 'Customer Satisfaction',
      desc: 'Fulfilling consumer and healthcare practitioner requirements through constant communication and reliability.',
      icon: <Smile className="w-7 h-7" />,
      colorClass: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'Innovation',
      desc: 'Encouraging advanced synthesis methodologies to create state-of-the-art tablets, capsules, and therapeutic support.',
      icon: <Lightbulb className="w-7 h-7" />,
      colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Integrity',
      desc: 'Enforcing transparent business operations, fair pricing, and compliance with all central drug control regulations.',
      icon: <Shield className="w-7 h-7" />,
      colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      title: 'Healthcare Excellence',
      desc: 'Advocating for high quality, safe, and effective patient formulations to raise baseline community wellness standards.',
      icon: <HeartPulse className="w-7 h-7" />,
      colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
    }
  ];

  return (
    <section id="values" className="py-24 bg-gradient-to-br from-teal-950 to-slate-900 text-white relative overflow-hidden">
      {/* Decorative floating grids/patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute left-1/3 top-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal-400 mb-3">Our Foundation</h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Corporate Core Values
          </p>
          <div className="w-16 h-1 bg-teal-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Dynamic Display Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl flex flex-col justify-between hover:border-teal-500/40 hover:bg-white/10 transition-all duration-300 group"
            >
              <div>
                {/* Icon box with customized borders */}
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110 ${val.colorClass}`}>
                  {val.icon}
                </div>

                <h3 className="font-extrabold text-xl tracking-tight mb-4 text-white group-hover:text-teal-300 transition-colors duration-200">
                  {val.title}
                </h3>
                
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  {val.desc}
                </p>
              </div>

              {/* Bottom decorative bar */}
              <div className="w-8 h-0.5 bg-white/20 mt-8 rounded-full group-hover:bg-teal-400 group-hover:w-full transition-all duration-300" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
