import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, AlertTriangle, ShieldCheck, Home } from 'lucide-react';
import { loginAdmin, checkAdminAuth } from '../services/db';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already authenticated, redirect to /admin immediately
  useEffect(() => {
    const unsub = checkAdminAuth((user) => {
      if (user) {
        navigate('/admin');
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await loginAdmin(email, password);
      if (success) {
        navigate('/admin');
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const grainSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' opacity='0.04'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E`;

  return (
    <div
      style={{
        backgroundImage: `url("${grainSvg}")`,
        backgroundSize: '200px 200px',
      }}
      className="min-h-screen bg-slate-950 flex flex-col justify-start md:justify-center items-center py-8 px-4 sm:px-6 relative overflow-y-auto"
    >
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Desktop/Tablet Back Button (>= 768px) */}
      <Link
        to="/"
        className="hidden md:flex absolute top-8 left-8 z-30 mt-[env(safe-area-inset-top)] ml-[env(safe-area-inset-left)] items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors p-3 cursor-pointer"
      >
        <Home size={16} />
        Back to Site
      </Link>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        
        {/* Mobile/Tablet Back Button (< 768px) */}
        <Link
          to="/"
          className="md:hidden flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider mb-6 cursor-pointer self-start pl-1"
        >
          <Home size={14} />
          Back to Site
        </Link>
        
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8 w-full">
          <img 
            src="/logo.png" 
            alt="EKAKSH PHARMA Logo" 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover mx-auto mb-3 sm:mb-4 shadow-lg shadow-teal-500/10 border border-white/20" 
          />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">EKAKSH PHARMA</h1>
          <p className="text-teal-400 font-semibold text-[10px] sm:text-xs uppercase tracking-[0.2em] mt-1">
            Admin Administration Control
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md">
          <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-400" />
            Secure Login
          </h2>
          <p className="text-slate-400 text-xs mb-4 sm:mb-6 font-light">
            Enter credentials to manage products, settings, and read incoming messages.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="admin@ekakshpharma.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                />
                <Mail size={16} className="absolute left-4 top-3.5 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-200"
                />
                <KeyRound size={16} className="absolute left-4 top-3.5 text-slate-500" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 animate-shake">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-200 shadow-md shadow-teal-600/10 hover:shadow-teal-500/25 flex items-center justify-center cursor-pointer disabled:opacity-55 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Authenticate Admin'
              )}
            </button>
          </form>


        </div>

      </div>
    </div>
  );
}
