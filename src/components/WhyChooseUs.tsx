import { motion } from 'framer-motion';
import { Award, ShieldCheck, Cpu, Coins, Map, HeartHandshake } from 'lucide-react';

interface ReasonCard {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export default function WhyChooseUs() {
  const reasons: ReasonCard[] = [
    {
      title: 'Trusted Quality',
      desc: 'All batches undergo stringent HPLC analysis and microbiology audits to maintain 100% molecular efficacy.',
      icon: <ShieldCheck className="w-6 h-6 text-teal-600" />
    },
    {
      title: 'Certified Manufacturing',
      desc: 'Our partnered production complexes operate under strict WHO-GMP and ISO certifications.',
      icon: <Award className="w-6 h-6 text-teal-600" />
    },
    {
      title: 'Innovation Driven',
      desc: 'Continually analyzing drug release mechanism research to enhance bioavailability of products.',
      icon: <Cpu className="w-6 h-6 text-teal-600" />
    },
    {
      title: 'Affordable Healthcare',
      desc: 'Optimizing formulation supply chains to deliver cutting-edge medicines at community-accessible pricing.',
      icon: <Coins className="w-6 h-6 text-teal-600" />
    },
    {
      title: 'Nationwide Reach',
      desc: 'Highly organized logistic supply channels delivering products seamlessly across multiple Indian states.',
      icon: <Map className="w-6 h-6 text-teal-600" />
    },
    {
      title: 'Ethical Practices',
      desc: 'Committed to transparent drug detailing, fair clinical advocacy, and compliance with ethical guidelines.',
      icon: <HeartHandshake className="w-6 h-6 text-teal-600" />
    }
  ];

  return (
    <section id="why-choose-us" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal-600 mb-3">Our Edge</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Partner With Ekaksh Pharma?
          </p>
          <div className="w-16 h-1 bg-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200/60 shadow-sm hover:shadow-md hover:border-teal-500/20 hover:bg-white transition-all duration-300 flex items-start gap-5"
            >
              {/* Icon container */}
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                {reason.icon}
              </div>
              
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg tracking-tight mb-2">
                  {reason.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-light">
                  {reason.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
