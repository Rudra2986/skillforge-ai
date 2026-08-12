import React from 'react';

export default function SkillForgeLogo({ className = "w-8 h-8", withGlow = true }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {withGlow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-cyan-400/20 blur-[5px] opacity-70 pointer-events-none"></div>
      )}
      
      <svg 
        viewBox="0 0 36 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md select-none"
      >
        {/* Background rounded container */}
        <rect width="36" height="36" rx="10" fill="url(#brandBg)" />
        <rect x="0.75" y="0.75" width="34.5" height="34.5" rx="9.25" stroke="url(#brandBorder)" strokeWidth="1.5" strokeOpacity="0.6" />

        {/* Forge / Anvil Geometric Crest */}
        <path 
          d="M8 14C8 13.17 8.67 12.5 9.5 12.5H26.5C27.33 12.5 28 13.17 28 14C28 14.83 27.33 15.5 26.5 15.5H24.2L21.6 22.7C21.2 23.8 20.1 24.5 19 24.5H17C15.9 24.5 14.8 23.8 14.4 22.7L11.8 15.5H9.5C8.67 15.5 8 14.83 8 14Z" 
          fill="url(#forgeGrad)"
        />

        {/* Cyber Foundation Base Bar */}
        <path 
          d="M12 26H24C24.55 26 25 26.45 25 27C25 27.55 24.55 28 24 28H12C11.45 28 11 27.55 11 27C11 26.45 11.45 26 12 26Z" 
          fill="#38BDF8"
          fillOpacity="0.85"
        />

        {/* AI Spark Crest */}
        <path 
          d="M18 6.5L19.4 10.2L23.1 11.6L19.4 13L18 16.7L16.6 13L12.9 11.6L16.6 10.2L18 6.5Z" 
          fill="url(#sparkGrad)"
        />

        {/* Dynamic Center Node (Gradient diamond accent) */}
        <polygon points="18,17 19.5,18.5 18,20 16.5,18.5" fill="#38BDF8" />

        <defs>
          {/* Background Gradient */}
          <linearGradient id="brandBg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F172A" />
            <stop offset="1" stopColor="#020617" />
          </linearGradient>

          {/* Border Gradient */}
          <linearGradient id="brandBorder" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.5" stopColor="#818CF8" />
            <stop offset="1" stopColor="#C084FC" />
          </linearGradient>

          {/* Anvil Gradient */}
          <linearGradient id="forgeGrad" x1="8" y1="12.5" x2="28" y2="24.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="0.5" stopColor="#6366F1" />
            <stop offset="1" stopColor="#9333EA" />
          </linearGradient>

          {/* Spark Gradient */}
          <linearGradient id="sparkGrad" x1="12.9" y1="6.5" x2="23.1" y2="16.7" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.5" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
