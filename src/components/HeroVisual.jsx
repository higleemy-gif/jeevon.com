/**
 * Soft lifestyle illustration for the hero.
 *
 * Self-contained SVG so the page looks complete with zero assets and zero
 * network calls. To swap in real photography, replace the whole <svg> with:
 *   <img src="/hero.jpg" alt="" className="size-full object-cover" />
 */
export default function HeroVisual({ className = '' }) {
  return (
    <svg
      viewBox="0 0 520 600"
      className={className}
      role="img"
      aria-label="Skincare bottles and botanicals arranged on a soft background"
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#f8e8e1" />
          <stop offset="55%" stopColor="#f5f1ea" />
          <stop offset="100%" stopColor="#e3eadf" />
        </linearGradient>
        <linearGradient id="hero-bottle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6e8a6c" />
          <stop offset="100%" stopColor="#455b44" />
        </linearGradient>
        <linearGradient id="hero-jar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e4b6a5" />
          <stop offset="100%" stopColor="#c4796a" />
        </linearGradient>
      </defs>

      {/* Backdrop */}
      <rect width="520" height="600" fill="url(#hero-bg)" />
      <circle cx="372" cy="150" r="118" fill="#fcfaf7" opacity="0.5" />
      <circle cx="120" cy="470" r="96" fill="#fcfaf7" opacity="0.35" />

      {/* Botanical sprigs */}
      <g stroke="#577256" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5">
        <path d="M88 300c0-70 34-120 92-150" />
        <path d="M118 262c-22-10-34-30-34-54 26 2 44 18 50 42" />
        <path d="M150 222c-16-18-20-40-12-62 22 12 32 32 28 56" />
      </g>
      <g stroke="#8aa585" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.45">
        <path d="M452 520c0-58-24-100-66-128" />
        <path d="M426 452c20-6 32-22 34-44-22 0-38 12-44 32" />
      </g>

      {/* Counter line */}
      <path d="M40 470h440" stroke="#d9cfbf" strokeWidth="2" opacity="0.7" />

      {/* Tall dropper bottle */}
      <g>
        <rect x="196" y="236" width="104" height="234" rx="28" fill="url(#hero-bottle)" />
        <rect x="228" y="190" width="40" height="48" rx="8" fill="#2b382a" />
        <rect x="218" y="168" width="60" height="26" rx="13" fill="#2b382a" />
        <rect x="216" y="300" width="64" height="112" rx="10" fill="#fcfaf7" opacity="0.9" />
        <path
          d="M232 332h32M232 352h24M232 372h30"
          stroke="#577256"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* highlight */}
        <rect x="208" y="256" width="12" height="150" rx="6" fill="#fcfaf7" opacity="0.18" />
      </g>

      {/* Short cream jar */}
      <g>
        <rect x="316" y="346" width="118" height="124" rx="30" fill="url(#hero-jar)" />
        <rect x="306" y="316" width="138" height="36" rx="16" fill="#8f4f42" />
        <rect x="338" y="382" width="74" height="54" rx="10" fill="#fcfaf7" opacity="0.9" />
        <path d="M356 404h38M356 420h26" stroke="#c4796a" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* Small supplement bottle */}
      <g>
        <rect x="88" y="376" width="80" height="94" rx="20" fill="#a8bfa3" />
        <rect x="112" y="352" width="32" height="26" rx="6" fill="#455b44" />
        <rect x="104" y="402" width="48" height="42" rx="8" fill="#fcfaf7" opacity="0.9" />
        <circle cx="120" cy="418" r="6" fill="#6e8a6c" />
        <circle cx="136" cy="418" r="6" fill="#6e8a6c" />
        <path d="M114 434h28" stroke="#6e8a6c" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Soft shadows */}
      <g opacity="0.12" fill="#2b382a">
        <ellipse cx="248" cy="474" rx="62" ry="8" />
        <ellipse cx="375" cy="474" rx="66" ry="8" />
        <ellipse cx="128" cy="474" rx="46" ry="7" />
      </g>
    </svg>
  )
}
