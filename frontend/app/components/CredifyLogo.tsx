"use client";

export default function CredifyLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 190 48"
      fill="none"
      className={className || "h-9 w-auto object-contain transition-transform duration-300 hover:scale-105"}
    >
      <defs>
        {/* Metallic Gold Gradient for Emblem Icon */}
        <linearGradient id="credifyGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE599" />
          <stop offset="45%" stopColor="#F5C542" />
          <stop offset="100%" stopColor="#C59B27" />
        </linearGradient>
        
        {/* Inner Gold Glow */}
        <linearGradient id="innerGlow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#FFF5D6" />
        </linearGradient>

        {/* Drop Shadow for Icon Depth */}
        <filter id="iconGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F5C542" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Premium Gold Emblem Icon */}
      <g filter="url(#iconGlow)">
        {/* Outer Shield Diamond Frame */}
        <path
          d="M 22 7 L 35 15 L 35 31 L 22 39 L 9 31 L 9 15 Z"
          stroke="url(#credifyGold)"
          strokeWidth="2.2"
          fill="none"
          strokeLinejoin="round"
        />
        
        {/* Interlocking Arc forming stylized C */}
        <path
          d="M 27 16 C 18 16 15 21 15 23 C 15 25 18 30 27 30"
          stroke="url(#credifyGold)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Upward Growth Core Node */}
        <circle cx="23" cy="23" r="2.8" fill="url(#innerGlow)" />
        
        {/* Top Spark Accent */}
        <path d="M 22 6 L 22 9" stroke="#FFF5D6" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Wordmark: Adaptable Color for Light & Dark Mode */}
      <text
        x="44"
        y="30"
        fontFamily="'Manrope', 'Inter', sans-serif"
        fontWeight="800"
        fontSize="21"
        letterSpacing="0.06em"
        fill="currentColor"
        className="text-[var(--text-main)] transition-colors duration-300"
      >
        CREDIFY
      </text>
    </svg>
  );
}
