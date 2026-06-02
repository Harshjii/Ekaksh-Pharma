import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroCarousel from '../components/HeroCarousel';
import AboutUs from '../components/AboutUs';
import ProductsSection from '../components/ProductsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import { incrementVisits } from '../services/db';

export default function LandingPage() {
  useEffect(() => {
    // Record page visit on load
    incrementVisits();
    
    // Smooth scroll to element if hash is present in URL
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800">
      <Navbar />
      <HeroCarousel />
      <AboutUs />
      <ProductsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}



