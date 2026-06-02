import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, Award, Layers, Scale, LineChart } from 'lucide-react';

interface Objective {
  title: string;
  desc: string;
  icon: React.ReactNode;
  gradient: string;
}

export default function VisionObjectives() {
  const objectives: Objective[] = [
    {
      title: 'Trusted Organization',
      desc: 'Become one of the most trusted pharmaceutical organizations in India through reliable, clean formulations.',
      icon: <ShieldCheck className="w-8 h-8 text-teal-600" />,
      gradient: 'from-teal-500/10 to-teal-600/5'
    },
    {
      title: 'Affordable Innovation',
      desc: 'Provide cutting-edge, innovative healthcare solutions at affordable rates to improve public access.',
      icon: <Sparkles className="w-8 h-8 text-cyan-600" />,
      gradient: 'from-cyan-500/10 to-cyan-600/5'
    },
    {
      title: 'World-Class Quality',
      desc: 'Maintain strict manufacturing and testing procedures to ensure products match global GMP standards.',
      icon: <Award className="w-8 h-8 text-emerald-600" />,
      gradient: 'from-emerald-500/10 to-emerald-600/5'
    },
    {
      title: 'Portfolio Expansion',
      desc: 'Continually expand our range of medicines, capsules, syrups, and neurology supplements.',
      icon: <Layers className="w-8 h-8 text-indigo-600" />,
      gradient: 'from-indigo-500/10 to-indigo-600/5'
    },
    {
      title: 'Ethical Practices',
      desc: 'Establish and reinforce uncompromising ethical standards across all supply chain levels.',
      icon: <Scale className="w-8 h-8 text-rose-600" />,
      gradient: 'from-rose-500/10 to-rose-600/5'
    },
    {
      title: 'Global Scale Growth',
      desc: 'Achieve stable growth parameters comparable to multinational pharmaceutical companies.',
      icon: <LineChart className="w-8 h-8 text-blue-600" />,
      gradient: 'from-blue-500/10 to-blue-600/5'
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section id="vision" className="py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
      {/* Decorative backdrop blobs */}
      <div className="absolute left-[-100px] top-[10%] w-72 h-72 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute right-[-100px] bottom-[10%] w-72 h-72 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal-600 mb-3">Our Outlook</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Vision & Corporate Objectives
          </p>
          <div className="w-16 h-1 bg-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {objectives.map((obj, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group`}
            >
              {/* Background gradient border effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${obj.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              
              <div className="relative z-10">
                {/* Icon Circle */}
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                  {obj.icon}
                </div>
                
                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight mb-3">
                  {obj.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {obj.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
