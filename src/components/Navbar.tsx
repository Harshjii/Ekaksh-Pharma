import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldAlert } from 'lucide-react';
import { getSettings, type WebsiteSettings } from '../services/db';

interface NavItem {
  label: string;
  id: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, []);

  const navItems: NavItem[] = [
    { label: 'Home', id: 'home' },
    { label: 'About Us', id: 'about' },
    { label: 'Products', id: 'products' },
    { label: 'Contact', id: 'contact' },
  ];

  // Track scrolling to toggle navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/#' + id);
      // Let the routing happen, then scroll
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-teal-950/85 backdrop-blur-md border-b border-teal-800/30 py-3 shadow-lg' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
            <img 
              src="/logo.png" 
              alt="EKAKSH PHARMA Logo" 
              className="w-10 h-10 rounded-lg object-cover shadow-md border border-white/20" 
            />
            <div>
              <div className="text-white font-bold text-lg tracking-wider leading-none">{settings?.companyName || 'EKAKSH PHARMA'}</div>
              <div className="text-teal-400 font-medium text-[10px] uppercase tracking-[0.25em] mt-0.5">{settings?.division || 'Dionysus Division'}</div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-slate-200 hover:text-teal-300 font-medium text-sm transition-colors duration-200 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-md shadow-teal-600/10 hover:shadow-teal-500/20 hover:scale-102"
            >
              <ShieldAlert size={14} />
              Admin Portal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2 rounded-lg bg-teal-900/60 border border-teal-800/40 text-teal-400 hover:text-teal-300 transition-colors"
              aria-label="Admin Portal"
            >
              <ShieldAlert size={18} />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-x-0 top-[60px] bg-slate-950/95 border-b border-slate-900 shadow-2xl transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-[400px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="px-4 space-y-4 flex flex-col items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="text-slate-300 hover:text-teal-400 font-medium text-base transition-colors duration-150 py-1"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
