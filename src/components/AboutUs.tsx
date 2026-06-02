import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Microscope, Heart, Calendar } from 'lucide-react';
import { getSettings, type WebsiteSettings } from '../services/db';

export default function AboutUs() {
  const [counts, setCounts] = useState({ products: 0, states: 0, rating: 0 });
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, []);

  useEffect(() => {
    // Simple counter animation trigger
    const duration = 2000;
    const steps = 50;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCounts({
        products: Math.floor((50 / steps) * step),
        states: Math.floor((15 / steps) * step),
        rating: parseFloat(((4.9 / steps) * step).toFixed(1)),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({ products: 50, states: 15, rating: 4.9 });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const timelineEvents = [
    {
      date: settings?.established || '1 January 2025',
      title: 'The Foundation',
      desc: `${settings?.companyName || 'EKAKSH PHARMA'} was established, commencing its journey with a vision of "${settings?.tagline || 'Delivering Health, Trust & Innovation'}".`,
      icon: <Calendar className="w-5 h-5 text-teal-400" />
    },
    {
      date: 'June 2025',
      title: 'Dionysus Pharma Division',
      desc: 'Launched the dedicated Dionysus Pharma division, expanding research into neuropathy, cardiac wellness, and advanced nutraceuticals.',
      icon: <Microscope className="w-5 h-5 text-teal-400" />
    },
    {
      date: 'January 2026',
      title: 'Nationwide Expansion',
      desc: 'Created distribution networks across 15+ states in India, making high-quality, affordable healthcare products widely accessible.',
      icon: <Award className="w-5 h-5 text-teal-400" />
    }
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal-600 mb-3">Who We Are</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Committed to Quality Healthcare Solutions
          </p>
          <div className="w-16 h-1 bg-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Mission & Core Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-slate-900">
              Welcome to {settings?.companyName || 'EKAKSH PHARMA'}
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {settings?.subheading || 'Ekaksh Pharma is committed to providing high-quality pharmaceutical solutions with a strong focus on innovation, healthcare excellence, and customer satisfaction.'}
            </p>
            
            {/* Mission Box */}
            <div className="p-6 rounded-2xl bg-teal-50 border border-teal-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-teal-500/10">
                <Heart size={24} />
              </div>
              <div>
                <h4 className="font-bold text-teal-900 text-lg">Our Mission</h4>
                <p className="text-teal-700/95 font-medium text-sm mt-1 leading-relaxed">
                  Enhance quality of life through safe, effective, and affordable healthcare products.
                </p>
              </div>
            </div>

            {/* Counters Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">{counts.products}+</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Products</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">{counts.states}+</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">States reached</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">{counts.rating}/5.0</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">Doctor Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Premium Interactive Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Timeline Vertical Line */}
            <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-slate-200" />

            <div className="space-y-8">
              {timelineEvents.map((event, index) => (
                <div key={index} className="flex gap-6 relative group">
                  <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 z-10 transition-colors duration-300 group-hover:bg-teal-950 group-hover:border-teal-700 shadow-md">
                    {event.icon}
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow duration-300 flex-grow">
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{event.date}</span>
                    <h4 className="font-extrabold text-slate-900 text-lg mt-1">{event.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2">{event.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtle decorative background circle */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
