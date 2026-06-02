import { Pill, Activity, Droplets, Syringe, Brain, ShieldCheck, Crosshair, Sparkles } from 'lucide-react';

interface CategoryCard {
  name: string;
  countName: string;
  desc: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
}

export default function ProductCategories() {
  const categories: CategoryCard[] = [
    {
      name: 'Tablets',
      countName: 'Tablets',
      desc: 'Oral solid dosage formulations with high bioavailability, precise active content, and excellent shelf stability.',
      icon: <Pill className="w-6 h-6" />,
      colorClass: 'text-sky-500',
      bgClass: 'bg-sky-50 border-sky-100 hover:border-sky-300'
    },
    {
      name: 'Capsules',
      countName: 'Capsules',
      desc: 'Hard and soft gelatin encapsulation designs protecting delicate compound structures and optimizing digestion rates.',
      icon: <Activity className="w-6 h-6" />,
      colorClass: 'text-indigo-500',
      bgClass: 'bg-indigo-50 border-indigo-100 hover:border-indigo-300'
    },
    {
      name: 'Syrups',
      countName: 'Syrups',
      desc: 'Carefully flavored oral liquid formulations, suspensions, and pediatric remedies manufactured in aseptic settings.',
      icon: <Droplets className="w-6 h-6" />,
      colorClass: 'text-teal-500',
      bgClass: 'bg-teal-50 border-teal-100 hover:border-teal-300'
    },
    {
      name: 'Injections',
      countName: 'Injections',
      desc: 'Sterile liquid vials and ampoules formulated to maintain absolute safety and achieve fast systemic delivery.',
      icon: <Syringe className="w-6 h-6" />,
      colorClass: 'text-rose-500',
      bgClass: 'bg-rose-50 border-rose-100 hover:border-rose-300'
    },
    {
      name: 'Nutraceuticals',
      countName: 'Nutraceuticals',
      desc: 'Enriched minerals, antioxidant capsules, and neuropathy support designed to fill daily dietary deficiencies.',
      icon: <Sparkles className="w-6 h-6" />,
      colorClass: 'text-amber-500',
      bgClass: 'bg-amber-50 border-amber-100 hover:border-amber-300'
    },
    {
      name: 'Neurology Products',
      countName: 'Neurology Products',
      desc: 'Targeted neurological pain relief, nerve regenerative compounds, and central nervous support formulations.',
      icon: <Brain className="w-6 h-6" />,
      colorClass: 'text-purple-500',
      bgClass: 'bg-purple-50 border-purple-100 hover:border-purple-300'
    },
    {
      name: 'Gastrointestinal Products',
      countName: 'Gastrointestinal Products',
      desc: 'Multi-strain probiotic capsules and antacid syrups to optimize stomach acidity and microflora health.',
      icon: <ShieldCheck className="w-6 h-6" />,
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300'
    },
    {
      name: 'Specialty Healthcare Products',
      countName: 'Specialty Healthcare Products',
      desc: 'Elite targeted formulations specializing in critical metabolic and custom clinical requirements.',
      icon: <Crosshair className="w-6 h-6" />,
      colorClass: 'text-cyan-500',
      bgClass: 'bg-cyan-50 border-cyan-100 hover:border-cyan-300'
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    // Dispatch custom event to ProductsSection
    const event = new CustomEvent('ekaksh_filter_category', { detail: categoryName });
    window.dispatchEvent(event);

    // Scroll to products section
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal-600 mb-3">Our Portfolio</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Key Product Divisions
          </p>
          <div className="w-16 h-1 bg-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => handleCategoryClick(cat.countName)}
              className={`p-6 rounded-2xl border bg-white flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md ${cat.bgClass}`}
            >
              <div>
                {/* Icon box */}
                <div className={`w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm ${cat.colorClass}`}>
                  {cat.icon}
                </div>
                
                <h3 className="font-extrabold text-slate-900 text-lg tracking-tight mb-2">
                  {cat.name}
                </h3>
                
                <p className="text-slate-500 text-xs leading-relaxed mb-6 font-light">
                  {cat.desc}
                </p>
              </div>

              {/* Action shortcut text */}
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-wider group">
                <span>View Products</span>
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
