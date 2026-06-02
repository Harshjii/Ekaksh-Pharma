import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2 } from 'lucide-react';
import { getSettings, type WebsiteSettings } from '../services/db';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => {
      setIsSubscribed(false);
    }, 4000);
  };

  const handleCategoryClick = (categoryName: string) => {
    // Dispatch custom event to ProductsSection
    const event = new CustomEvent('ekaksh_filter_category', { detail: categoryName });
    window.dispatchEvent(event);

    // Scroll to products
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8 relative overflow-hidden">
      {/* Visual decorative accents */}
      <div className="absolute right-[-100px] bottom-0 w-80 h-80 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Upper footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          
          {/* Col 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleScrollTo('home')}>
              <img 
                src="/logo.jpg" 
                alt="EKAKSH PHARMA Logo" 
                className="w-9 h-9 rounded-lg object-cover border border-white/10" 
              />
            <div>
                <span className="text-white font-extrabold text-base tracking-wider leading-none block">{settings?.companyName || 'EKAKSH PHARMA'}</span>
                <span className="text-teal-400 font-medium text-[9px] uppercase tracking-[0.2em] mt-0.5 block">{settings?.division || 'Dionysus Division'}</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-light max-w-sm">
              Dedicated to delivering health, trust, and pharmaceutical innovation across India. Established on {settings?.established || '1 January 2025'}. Quality formulations meeting international compliance standards.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-teal-500 transition-all cursor-pointer" aria-label="Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-teal-500 transition-all cursor-pointer" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-teal-500 transition-all cursor-pointer" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest border-l-2 border-teal-500 pl-2">Sitemap</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => handleScrollTo('home')} className="hover:text-teal-400 transition-colors cursor-pointer">Home</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('about')} className="hover:text-teal-400 transition-colors cursor-pointer">About Us</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('products')} className="hover:text-teal-400 transition-colors cursor-pointer">Products</button>
              </li>
              <li>
                <button onClick={() => handleScrollTo('contact')} className="hover:text-teal-400 transition-colors cursor-pointer">Contact</button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest border-l-2 border-teal-500 pl-2">Divisions</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button onClick={() => handleCategoryClick('Tablets')} className="hover:text-teal-400 transition-colors cursor-pointer">Tablets Portfolio</button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Capsules')} className="hover:text-teal-400 transition-colors cursor-pointer">Capsules Range</button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Nutraceuticals')} className="hover:text-teal-400 transition-colors cursor-pointer">Nutraceutical Supports</button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Neurology Products')} className="hover:text-teal-400 transition-colors cursor-pointer">Neurology Division</button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Gastrointestinal Products')} className="hover:text-teal-400 transition-colors cursor-pointer">Gastrointestinal</button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Specialty Healthcare Products')} className="hover:text-teal-400 transition-colors cursor-pointer">Specialty Products</button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest border-l-2 border-teal-500 pl-2">Newsletter</h4>
            <p className="text-slate-400 text-xs font-light leading-relaxed">
              Subscribe to receive therapeutic catalog updates, new molecules notifications, and division reports.
            </p>

            {isSubscribed ? (
              <div className="p-3.5 rounded-xl bg-teal-950/60 border border-teal-800/40 text-teal-300 flex items-center gap-2 text-xs">
                <CheckCircle2 size={16} className="text-teal-400 shrink-0" />
                <span>Successfully subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative mt-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 p-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white transition-colors cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send size={12} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Lower footer: details, copyright */}
        <div className="pt-8 border-t border-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light text-slate-500">
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center md:text-left">
            <span>GSTIN: {settings?.gstNumber || '05CNLPC4830L1ZY'}</span>
            <span>Tel: {settings?.phone || '+91 9389049159'}</span>
            <span className="max-w-xs truncate">Address: {settings?.address || 'Kashipur, Uttarakhand, India'}</span>
          </div>

          <div className="text-center md:text-right">
            <span>&copy; {new Date().getFullYear()} {settings?.companyName || 'EKAKSH PHARMA'}. All Rights Reserved.</span>
            <span className="mx-2">|</span>
            <Link to="/admin" className="hover:text-teal-400 transition-colors">Admin Area</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}
