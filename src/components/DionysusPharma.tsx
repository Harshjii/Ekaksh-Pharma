import { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, Activity, BrainCircuit, Award } from 'lucide-react';

interface GrowthPoint {
  period: string;
  reach: string;
  value: number;
}

export default function DionysusPharma() {
  const [hoveredPoint, setHoveredPoint] = useState<GrowthPoint | null>(null);

  const growthData: GrowthPoint[] = [
    { period: 'Jan 2025', reach: '2 States', value: 15 },
    { period: 'Apr 2025', reach: '5 States', value: 35 },
    { period: 'Jul 2025', reach: '8 States', value: 50 },
    { period: 'Oct 2025', reach: '12 States', value: 72 },
    { period: 'Jan 2026', reach: '15+ States', value: 95 }
  ];

  const highlights = [
    {
      title: 'Neuropathy Specialization',
      desc: 'Formulating complex neuro-pain and nerve regeneration solutions like Eknuron-PN.',
      icon: <BrainCircuit className="w-5 h-5 text-indigo-400" />
    },
    {
      title: 'Cardiac & Antioxidant Wellness',
      desc: 'Developing Coenzyme Q10 and Lycopene molecules like Esperto-Q to safeguard cardiac pathways.',
      icon: <HeartPulse className="w-5 h-5 text-rose-400" />
    },
    {
      title: 'Nutraceutical Support',
      desc: 'Releasing advanced multivitamin compounds like Muconib to boost standard health metrics.',
      icon: <Activity className="w-5 h-5 text-teal-400" />
    }
  ];

  return (
    <section id="dionysus" className="py-24 bg-gradient-to-br from-slate-900 to-teal-950 text-white relative overflow-hidden">
      {/* Decorative Blur Circles */}
      <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
      <div className="absolute left-[-150px] bottom-[-150px] w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal-400 mb-3">Our Core Division</h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            DIONYSUS PHARMA
          </p>
          <div className="w-16 h-1 bg-teal-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Intro & Highlights */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">Strategic Healthcare</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
                Pioneering Specialty Formulations
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mt-4 font-light">
                Dionysus Pharma is a specialized division of Ekaksh Pharma, established to drive excellence in critical therapy segments. We research, test, and manufacture formulations addressing Neuropathy, Cardiology, Orthopedic health, and general Nutraceutical restoration.
              </p>
            </div>

            <div className="space-y-4">
              {highlights.map((hl, idx) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/20 hover:bg-white/8 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/20 flex items-center justify-center shrink-0">
                    {hl.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">{hl.title}</h4>
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed font-light">{hl.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic SVG Growth Chart & Info */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/40 border border-white/10 backdrop-blur-md shadow-2xl space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-white text-lg tracking-tight">Distribution Outreach Growth</h4>
                <p className="text-slate-400 text-xs">Quarterly state representation across India</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/10">
                <Award size={20} />
              </div>
            </div>

            {/* SVG Line Graph */}
            <div className="relative pt-6">
              <svg className="w-full h-48 overflow-visible" viewBox="0 0 500 200">
                {/* Horizontal grid lines */}
                <line x1="0" y1="180" x2="500" y2="180" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                
                {/* X Axis Labels */}
                <text x="10" y="195" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">Jan 25</text>
                <text x="130" y="195" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">Apr 25</text>
                <text x="250" y="195" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">Jul 25</text>
                <text x="370" y="195" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">Oct 25</text>
                <text x="480" y="195" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">Jan 26</text>

                {/* SVG Line path representing the growth values */}
                <motion.path
                  d="M 10 180 Q 130 140 250 110 T 370 70 T 480 30"
                  fill="none"
                  stroke="url(#line-grad)"
                  strokeWidth="3.5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />

                {/* Gradient Definition for the line */}
                <defs>
                  <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#67e8f9" />
                  </linearGradient>
                </defs>

                {/* Interactive Points */}
                {growthData.map((pt, idx) => {
                  // Coordinate calculation mapping values to the chart grid
                  const x = 10 + (idx * (470 / 4));
                  const y = 180 - (pt.value * (160 / 100));
                  return (
                    <g key={idx} className="cursor-pointer">
                      {/* Outer pulse circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r="8"
                        className="fill-teal-400/20 stroke-none animate-ping"
                      />
                      {/* Interactive click point */}
                      <circle
                        cx={x}
                        cy={y}
                        r="5.5"
                        onMouseEnter={() => setHoveredPoint(pt)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className={`fill-slate-950 stroke-2 transition-all duration-150 ${
                          hoveredPoint?.period === pt.period ? 'stroke-cyan-300 r-7' : 'stroke-teal-400'
                        }`}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip Overlay */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 h-8 flex items-center justify-center">
                {hoveredPoint ? (
                  <div className="px-3 py-1.5 rounded-lg bg-teal-500/25 border border-teal-400/30 text-white font-bold text-xs uppercase tracking-wider shadow-lg backdrop-blur-sm animate-fade-in">
                    {hoveredPoint.period}: <span className="text-cyan-300">{hoveredPoint.reach} Reach</span>
                  </div>
                ) : (
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Hover graph nodes to details outreach</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-center">
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold">Division Quality</div>
                <div className="text-xl font-extrabold text-teal-400 mt-1">100% GMP Standard</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-semibold">Outreach Growth</div>
                <div className="text-xl font-extrabold text-cyan-400 mt-1">500% YoY</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
