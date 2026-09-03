import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';
import { BASE_SERVER_URL } from '../services/api';

export default function AuthScreen({ onAuthSuccess }) {
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
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
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen-wrapper">
      {/* Centered Auth Card in ResumeAI Emerald Green Theme */}
      <div className="auth-card-container">
        
        {/* Top ResumeAI Emerald Icon Badge */}
        <div className="auth-icon-badge">
          <Sparkles style={{ width: '26px', height: '26px', color: '#00f59b' }} />
        </div>

        {/* Title and Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            {mode === 'signup' 
              ? 'Sign up to begin taking AI mock interviews today.' 
              : 'Sign in to access your candidate dashboard and mock interviews.'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', padding: '10px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textAlign: 'center', marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form with borderless bottom-underline inputs matching navbar */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* FULL NAME */}
          {mode === 'signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                FULL NAME
              </label>
              <div className="auth-input-container">
                <User style={{ width: '18px', height: '18px', color: '#00f59b', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: '14px', padding: 0 }}
                />
              </div>
            </div>
          )}

          {/* EMAIL ADDRESS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              EMAIL ADDRESS
            </label>
            <div className="auth-input-container">
              <Mail style={{ width: '18px', height: '18px', color: '#00f59b', flexShrink: 0 }} />
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: '14px', padding: 0 }}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              PASSWORD
            </label>
            <div className="auth-input-container">
              <Lock style={{ width: '18px', height: '18px', color: '#00f59b', flexShrink: 0 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: '14px', padding: 0, fontFamily: 'monospace', letterSpacing: '0.1em' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff style={{ width: '16px', height: '16px', color: '#00f59b' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          {mode === 'signup' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                CONFIRM PASSWORD
              </label>
              <div className="auth-input-container">
                <Lock style={{ width: '18px', height: '18px', color: '#00f59b', flexShrink: 0 }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: '14px', padding: 0, fontFamily: 'monospace', letterSpacing: '0.1em' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff style={{ width: '16px', height: '16px', color: '#00f59b' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button in Neon Emerald Green */}
          <div style={{ marginTop: '12px' }}>
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              <span>{loading ? 'Processing...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}</span>
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          {mode === 'signup' ? (
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                style={{ background: 'transparent', border: 'none', color: '#00f59b', fontWeight: '700', cursor: 'pointer', textDecoration: 'none' }}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                style={{ background: 'transparent', border: 'none', color: '#00f59b', fontWeight: '700', cursor: 'pointer', textDecoration: 'none' }}
              >
                Sign Up
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
