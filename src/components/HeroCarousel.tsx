import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowDownRight } from 'lucide-react';

interface CarouselItem {
  name: string;
  category: string;
  image: string;
  bg: string;
  panel: string;
}

// Static carousel — 4 fixed images from /public folder, no Firebase
const carouselItems: CarouselItem[] = [
  { name: 'Calmeal Plus',    category: 'Nutraceuticals', image: '/calmeal_plus.png',    bg: '#0d7c57', panel: '#10b981' },
  { name: 'Eknuron PN',      category: 'Nutraceuticals', image: '/eknuron_pn.png',      bg: '#172554', panel: '#1e3a8a' },
  { name: 'Esperto-Q',       category: 'Nutraceuticals', image: '/esperto_q.png',       bg: '#08636b', panel: '#0d9488' },
  { name: 'Muconib Tablets', category: 'Nutraceuticals', image: '/muconib_tablets.png', bg: '#0b5a60', panel: '#0f766e' },
];

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload images from public folder
  useEffect(() => {
    carouselItems.forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }, []);

  // Autoplay — advance every 3 seconds
  useEffect(() => {
    if (isAnimating) return;
    const timer = setInterval(() => goTo('next'), 3000);
    return () => clearInterval(timer);
  }, [activeIndex, isAnimating]);

  const goTo = (direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) =>
      direction === 'next'
        ? (prev + 1) % carouselItems.length
        : (prev + carouselItems.length - 1) % carouselItems.length
    );
    setTimeout(() => setIsAnimating(false), 650);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const len = carouselItems.length;
  const centerIndex = activeIndex;
  const leftIndex   = (activeIndex + len - 1) % len;
  const rightIndex  = (activeIndex + 1)       % len;
  const backIndex   = (activeIndex + 2)        % len;

  const getRoleStyles = (i: number): React.CSSProperties => {
    if (i === centerIndex) return {
      transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.55})`,
      filter:  'blur(0px) drop-shadow(0 25px 25px rgba(0,0,0,0.45))',
      opacity: 1,
      zIndex:  20,
      left:    '50%',
      height:  isMobile ? '55%' : '80%',
      bottom:  isMobile ? '24%' : '6%',
    };
    if (i === leftIndex) return {
      transform: 'translateX(-50%) scale(1.05)',
      filter:  'blur(3px) opacity(0.7)',
      opacity: 0.65,
      zIndex:  10,
      left:    isMobile ? '15%' : '26%',
      height:  isMobile ? '24%' : '44%',
      bottom:  isMobile ? '36%' : '20%',
    };
    if (i === rightIndex) return {
      transform: 'translateX(-50%) scale(1.05)',
      filter:  'blur(3px) opacity(0.7)',
      opacity: 0.65,
      zIndex:  10,
      left:    isMobile ? '85%' : '74%',
      height:  isMobile ? '24%' : '44%',
      bottom:  isMobile ? '36%' : '20%',
    };
    if (i === backIndex) return {
      transform: 'translateX(-50%) scale(0.85)',
      filter:  'blur(6px) opacity(0.4)',
      opacity: 0.35,
      zIndex:  5,
      left:    '50%',
      height:  isMobile ? '20%' : '34%',
      bottom:  isMobile ? '40%' : '26%',
    };
    return {};
  };

  const grainSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' opacity='0.05'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E`;

  const currentItem = carouselItems[activeIndex];

  return (
    <div
      id="home"
      style={{
        backgroundColor: currentItem.bg,
        transition: 'background-color 650ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="relative w-full overflow-hidden min-h-screen pt-20 flex flex-col justify-between"
    >
      {/* Grain overlay */}
      <div
        style={{
          backgroundImage: `url("${grainSvg}")`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
          zIndex: 40,
        }}
        className="absolute inset-0 pointer-events-none opacity-50"
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(15,23,42,0.45)_95%)] pointer-events-none z-[1]" />

      {/* Product stage */}
      <div
        style={{ zIndex: 10 }}
        className="relative w-full h-[400px] sm:h-[480px] md:h-[550px] mt-4 flex items-center justify-center"
      >
        {/* Ghost watermark */}
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
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none text-white/5"
        >
          HEALTHCARE
        </div>

        {carouselItems.map((item, i) => {
          const isCenter = i === centerIndex;
          return (
            <div
              key={i}
              className="absolute select-none pointer-events-none"
              style={{
                aspectRatio: '0.9 / 1',
                transition: 'all 650ms cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform, filter, opacity, left, bottom, height',
                ...getRoleStyles(i),
              }}
            >
              <div className="relative w-full h-full flex flex-col justify-end">
                {isCenter && (
                  <div className="absolute bottom-[-10px] left-[10%] right-[10%] h-[20px] rounded-full bg-black/45 blur-md" />
                )}
                <img
                  src={item.image}
                  alt={item.name}
                  className={`w-full h-[88%] object-contain object-bottom transition-all duration-500 ${
                    isCenter
                      ? 'scale-[1.25] drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)]'
                      : 'scale-[1.05] opacity-80'
                  }`}
                  draggable={false}
                />
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

      {/* Navigation bar */}
      <div
        style={{ zIndex: 35 }}
        className="relative max-w-7xl mx-auto px-6 w-full pb-10 flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        {/* Left: product label */}
        <div className="text-left text-white max-w-[280px] hidden md:block">
          <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300">
            Featured Solution
          </span>
          <h3 className="font-extrabold text-xl tracking-wide uppercase mt-1">
            {currentItem.name}
          </h3>
          <p className="text-xs text-slate-300 font-light mt-1.5 leading-relaxed">
            {currentItem.category} Support — Trusted formulation meeting international quality standards.
          </p>
        </div>

        {/* Center: arrow controls */}
        <div className="flex gap-4">
          <button
            onClick={() => goTo('prev')}
            disabled={isAnimating}
            aria-label="Previous product"
            className="w-14 h-14 flex items-center justify-center rounded-full border border-white/20 bg-slate-900/25 text-white transition-all duration-200 hover:scale-[1.08] hover:bg-white hover:text-teal-950 hover:border-white disabled:opacity-55 cursor-pointer shadow-md"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => goTo('next')}
            disabled={isAnimating}
            aria-label="Next product"
            className="w-14 h-14 flex items-center justify-center rounded-full border border-white/20 bg-slate-900/25 text-white transition-all duration-200 hover:scale-[1.08] hover:bg-white hover:text-teal-950 hover:border-white disabled:opacity-55 cursor-pointer shadow-md"
          >
            <ArrowRight size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Right: discover link */}
        <button
          onClick={() => scrollToSection('about')}
          style={{ fontFamily: "'Anton', sans-serif" }}
          className="flex items-center gap-2 text-2xl uppercase text-white hover:text-teal-200 transition-colors duration-200 cursor-pointer group"
        >
          <span>DISCOVER MORE</span>
          <ArrowDownRight
            className="w-6 h-6 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
            strokeWidth={2.5}
          />
        </button>
      </div>
    </div>
  );
}