import React from 'react';

export default function Logo({ size = 'md', showBadge = false }) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className="flex items-center gap-2.5 select-none group">
      {/* Modern Geometric AI Emblem */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center flex-shrink-0`}>
        {/* Glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#00f59b] to-[#38bdf8] opacity-30 blur-sm group-hover:opacity-60 transition-opacity"></div>
        
        {/* Inner SVG Emblem */}
        <div className="relative w-full h-full rounded-xl bg-[#080f1e] border border-white/15 flex items-center justify-center shadow-lg overflow-hidden p-1.5">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="logoNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f59b" />
                <stop offset="60%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>

            {/* Stylized Futuristic Resume / Neural Node Graphic */}
            <path
              d="M8 8C8 5.79086 9.79086 4 12 4H20L28 12V28C28 30.2091 26.2091 32 24 32H12C9.79086 32 8 30.2091 8 28V8Z"
              stroke="url(#logoNeonGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Folded page corner */}
            <path
              d="M20 4V12H28"
              stroke="url(#logoNeonGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* AI Spark Lines */}
            <path
              d="M13 18H23"
              stroke="#00f59b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M13 23H19"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Spark node */}
            <circle cx="23" cy="23" r="2" fill="#00f59b" />
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex items-center gap-2">
        <span className="text-lg font-black tracking-tight text-white font-outfit">
          Resume<span className="text-[#00f59b]">AI</span>
        </span>

        {showBadge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-[#00f59b] border border-emerald-500/30">
            2.0
          </span>
        )}
      </div>
    </div>
  );
}
