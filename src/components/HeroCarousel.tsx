import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowDownRight } from 'lucide-react';
import { getProducts } from '../services/db';

interface CarouselItem {
  name: string;
  category: string;
  image: string;
  bg: string;
  panel: string;
}

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [carouselProducts, setCarouselProducts] = useState<CarouselItem[]>([]);

  // Default fallback data in case loading takes time
  const fallbackCarousel: CarouselItem[] = [
    { name: 'Muconib Tablets', category: 'Nutraceuticals', image: '/muconib_tablets.png', bg: '#0b5a60', panel: '#0f766e' },
    { name: 'Calmeal Plus', category: 'Nutraceuticals', image: '/calmeal_plus.png', bg: '#0d7c57', panel: '#10b981' },
    { name: 'Florek Capsules', category: 'Capsules', image: '/florek_capsules.png', bg: '#08636b', panel: '#0d9488' },
    { name: 'Esperto-Q', category: 'Nutraceuticals', image: '/esperto_q.png', bg: '#172554', panel: '#1e3a8a' },
  ];

  useEffect(() => {
    // Load Settings and Products
    const loadData = async () => {
      try {
        const prods = await getProducts();
        // Take first 4 active products to display in the carousel
        const activeProds = prods.filter(p => p.status === 'active').slice(0, 4);
        if (activeProds.length > 0) {
          const colors = [
            { bg: '#0b5a60', panel: '#0f766e' }, // Muconib (Deep Teal)
            { bg: '#0d7c57', panel: '#10b981' }, // Calmeal (Emerald/Green)
            { bg: '#08636b', panel: '#0d9488' }, // Florek (Teal/Cyan)
            { bg: '#172554', panel: '#1e3a8a' }, // Esperto (Deep Navy/Blue)
          ];
          const mapped = activeProds.map((p, idx) => ({
            name: p.name,
            category: p.category,
            image: p.image,
            bg: colors[idx % colors.length].bg,
            panel: colors[idx % colors.length].panel
          }));
          setCarouselProducts(mapped);
        } else {
          setCarouselProducts(fallbackCarousel);
        }
      } catch (err) {
        console.error("Failed to load settings or carousel products:", err);
        setCarouselProducts(fallbackCarousel);
      }
    };
    loadData();

    // Check screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const items = carouselProducts.length > 0 ? carouselProducts : fallbackCarousel;

  // Preload images
  useEffect(() => {
    if (items.length > 0) {
      items.forEach((item) => {
        const img = new Image();
        img.src = item.image;
      });
    }
  }, [items]);

  // Autoplay slide transition (every 1 second)
  useEffect(() => {
    if (items.length === 0 || isAnimating) return;
    const timer = setInterval(() => {
      navigate('next');
    }, 1000);
    return () => clearInterval(timer);
  }, [activeIndex, isAnimating, items.length]);

  const navigate = (direction: 'next' | 'prev') => {
    if (isAnimating || items.length === 0) return;
    setIsAnimating(true);

    setActiveIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % items.length;
      } else {
        return (prev + items.length - 1) % items.length;
      }
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 650);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Indexes for styling roles
  const centerIndex = activeIndex;
  const leftIndex = (activeIndex + items.length - 1) % items.length;
  const rightIndex = (activeIndex + 1) % items.length;
  const backIndex = (activeIndex + 2) % items.length;

  const getRoleStyles = (i: number) => {
    if (items.length === 0) return {};
    if (i === centerIndex) {
      return {
        transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.55})`,
        filter: 'blur(0px) drop-shadow(0 25px 25px rgba(0,0,0,0.45))',
        opacity: 1,
        zIndex: 20,
        left: '50%',
        height: isMobile ? '55%' : '80%',
        bottom: isMobile ? '24%' : '6%',
      };
    }
    if (i === leftIndex) {
      return {
        transform: 'translateX(-50%) scale(1.05)',
        filter: 'blur(3px) opacity(0.7)',
        opacity: 0.65,
        zIndex: 10,
        left: isMobile ? '15%' : '26%',
        height: isMobile ? '24%' : '44%',
        bottom: isMobile ? '36%' : '20%',
      };
    }
    if (i === rightIndex) {
      return {
        transform: 'translateX(-50%) scale(1.05)',
        filter: 'blur(3px) opacity(0.7)',
        opacity: 0.65,
        zIndex: 10,
        left: isMobile ? '85%' : '74%',
        height: isMobile ? '24%' : '44%',
        bottom: isMobile ? '36%' : '20%',
      };
    }
    if (i === backIndex) {
      return {
        transform: 'translateX(-50%) scale(0.85)',
        filter: 'blur(6px) opacity(0.4)',
        opacity: 0.35,
        zIndex: 5,
        left: '50%',
        height: isMobile ? '20%' : '34%',
        bottom: isMobile ? '40%' : '26%',
      };
    }
    return {};
  };

  const grainSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' opacity='0.05'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E`;

  const currentItem = items[activeIndex] || fallbackCarousel[0];
  const currentBg = currentItem.bg;

  return (
    <div
      id="home"
      style={{
        backgroundColor: currentBg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="relative w-full overflow-hidden min-h-screen pt-20 flex flex-col justify-between"
    >
      {/* 1. Grain overlay */}
      <div
        style={{
          backgroundImage: `url("${grainSvg}")`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
          zIndex: 40,
        }}
        className="absolute inset-0 pointer-events-none opacity-50"
      />

      {/* Background radial gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(15,23,42,0.45)_95%)] pointer-events-none z-1" />

      {/* 4. Interactive 3D Product Carousel */}
      <div style={{ zIndex: 10 }} className="relative w-full h-[400px] sm:h-[480px] md:h-[550px] mt-4 flex items-center justify-center">
        {/* Giant ghost text "HEALTHCARE" */}
        <div
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(70px, 20vw, 290px)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            zIndex: 2,
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-white/5 opacity-100"
        >
          HEALTHCARE
        </div>
        {items.map((item, i) => {
          const roleStyle = getRoleStyles(i);
          const isCenter = i === centerIndex;
          return (
            <div
              key={i}
              className="absolute select-none pointer-events-none"
              style={{
                aspectRatio: '0.9 / 1',
                transition: 'all 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform, filter, opacity, left, bottom, height',
                ...roleStyle,
              }}
            >
              <div className="relative w-full h-full flex flex-col justify-end">
                {/* Visual shadow under active product */}
                {isCenter && (
                  <div className="absolute bottom-[-10px] left-[10%] right-[10%] h-[20px] rounded-full bg-black/45 blur-md" />
                )}
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-full h-[88%] object-contain object-bottom transition-all duration-500 ${isCenter ? 'scale-[1.25] filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)]' : 'scale-[1.05] opacity-80'
                    }`}
                  draggable={false}
                />

                {/* Active product inline name tag */}
                {isCenter && (
                  <div className="absolute bottom-[-45px] left-1/2 -translate-x-1/2 glass-card px-4 py-1.5 rounded-full border border-white/30 text-teal-950 font-bold text-xs uppercase tracking-wider shadow-lg whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Navigation & Status Bar */}
      <div style={{ zIndex: 35 }} className="relative max-w-7xl mx-auto px-6 w-full pb-10 flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Left Side: Product Title Indicator */}
        <div className="text-left text-white max-w-[280px] hidden md:block">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300">Featured Solution</span>
          <h3 className="font-extrabold text-xl tracking-wide uppercase mt-1">{currentItem.name}</h3>
          <p className="text-xs text-slate-300 font-light mt-1.5 leading-relaxed">
            {currentItem.category} Support - Trusted formulation meeting international quality standards.
          </p>
        </div>

        {/* Center: Slider Arrows */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('prev')}
            disabled={isAnimating}
            aria-label="Previous product"
            className="w-14 h-14 flex items-center justify-center rounded-full border border-white/20 bg-slate-900/25 text-white transition-all duration-200 hover:scale-[1.08] hover:bg-white hover:text-teal-950 hover:border-white disabled:opacity-55 cursor-pointer shadow-md"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => navigate('next')}
            disabled={isAnimating}
            aria-label="Next product"
            className="w-14 h-14 flex items-center justify-center rounded-full border border-white/20 bg-slate-900/25 text-white transition-all duration-200 hover:scale-[1.08] hover:bg-white hover:text-teal-950 hover:border-white disabled:opacity-55 cursor-pointer shadow-md"
          >
            <ArrowRight size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Right Side: Discover Shortcut Link */}
        <div>
          <button
            onClick={() => scrollToSection('about')}
            style={{
              fontFamily: "'Anton', sans-serif",
            }}
            className="flex items-center gap-2 text-2xl uppercase text-white hover:text-teal-200 transition-colors duration-200 cursor-pointer group"
          >
            <span>DISCOVER MORE</span>
            <ArrowDownRight className="w-6 h-6 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
}