import React, { useState } from 'react';
import { X, User, Mail, Lock, ArrowRight, Sparkles, CheckCircle2, LogIn, UserPlus } from 'lucide-react';
import { BASE_SERVER_URL } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const userNameToSave = mode === 'signup' 
        ? name.trim() 
        : (email.split('@')[0] || 'Candidate');

      const authData = {
        name: userNameToSave,
        email: email.trim(),
      };

      try {
        const endpoint = mode === 'signup' ? '/api/auth/register' : '/api/auth/login';
        const bodyPayload = mode === 'signup' 
          ? { name: userNameToSave, email: email.trim(), password } 
          : { email: email.trim(), password };

        const res = await fetch(`${BASE_SERVER_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload)
        });

        if (res.ok) {
          const apiData = await res.json();
          authData.name = apiData.name || authData.name;
          authData.id = apiData.id;
          authData.profilePic = apiData.profile_pic;
        }
      } catch (apiErr) {
        console.warn('Backend auth endpoint fallback to local session', apiErr);
      }

      localStorage.setItem('resumeai_user', JSON.stringify(authData));
      onAuthSuccess(authData);
      onClose();
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoName, demoEmail) => {
    const authData = { name: demoName, email: demoEmail };
    localStorage.setItem('resumeai_user', JSON.stringify(authData));
    onAuthSuccess(authData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel glass-panel-glow p-8 space-y-6 border border-emerald-500/40 bg-[#070e1c] shadow-[0_0_50px_rgba(0,245,155,0.25)] rounded-3xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black text-white font-outfit">
            {mode === 'login' ? 'Sign In to ResumeAI' : 'Create Candidate Account'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'login' 
              ? 'Log in to sync your analyzed resume profiles & mock sessions' 
              : 'Sign up to personalize your ATS match metrics & dashboard'}
          </p>
        </div>

        {/* Mode Toggle Switch (Distinct Visual Colors) */}
        <div className="flex bg-[#040811] p-1.5 rounded-2xl border border-white/10 shadow-inner">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? '!bg-[#00f59b] !text-[#050811] shadow-md'
                : '!bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              mode === 'signup'
                ? '!bg-gradient-to-r !from-cyan-500 !to-purple-600 !text-white shadow-md'
                : '!bg-transparent text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs font-semibold text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Form Inputs (No Overlay: Clear Icon + Input Separation) */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Full Name</label>
              <div className="flex items-center bg-[#050912] border border-white/15 rounded-2xl px-4 py-2.5 focus-within:border-cyan-400 shadow-inner transition-all">
                <User className="w-4 h-4 text-cyan-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full !bg-transparent !border-none !p-0 text-xs text-white placeholder-slate-500 focus:!outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-300">Email Address</label>
            <div className="flex items-center bg-[#050912] border border-white/15 rounded-2xl px-4 py-2.5 focus-within:border-[#00f59b] shadow-inner transition-all">
              <Mail className="w-4 h-4 text-emerald-400 mr-3 flex-shrink-0" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full !bg-transparent !border-none !p-0 text-xs text-white placeholder-slate-500 focus:!outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-300">Password</label>
            <div className="flex items-center bg-[#050912] border border-white/15 rounded-2xl px-4 py-2.5 focus-within:border-purple-400 shadow-inner transition-all">
              <Lock className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
              <input
                type="password"
                placeholder="Enter password (min 4 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full !bg-transparent !border-none !p-0 text-xs text-white placeholder-slate-500 focus:!outline-none"
              />
            </div>
          </div>

          {/* Distinct Action Buttons for Login vs Signup */}
          <div className="pt-2">
            {mode === 'login' ? (
              <button
                type="submit"
                disabled={loading}
                className="btn-neon-primary !py-3.5 w-full text-xs font-bold justify-center shadow-[0_0_20px_rgba(0,245,155,0.45)] cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="!bg-gradient-to-r !from-cyan-500 !to-purple-600 hover:!from-cyan-400 hover:!to-purple-500 !text-white !py-3.5 w-full text-xs font-bold justify-center rounded-full shadow-[0_0_20px_rgba(168,85,247,0.45)] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1" />
                <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Demo Preset */}
        <div className="pt-2 border-t border-white/10 text-center space-y-2">
          <span className="text-[11px] text-slate-400">Or quick login with demo profile:</span>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('Siva Kumar', 'siva@resumeai.io')}
              className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-emerald-500/10 text-[#00f59b] border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Siva Kumar
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('Alex Johnson', 'alex@resumeai.io')}
              className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-purple-500/10 text-[#c084fc] border border-purple-500/30 hover:bg-purple-500/20 transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Alex Johnson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
