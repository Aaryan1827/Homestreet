/**
 * HeritageSkyline — hand-drawn style SVG skyline for Pune
 * Suggests Shaniwar Wada gateway, Sinhagad fort walls, and a temple spire.
 * Uses CSS variables so it recolors with the theme.
 */
export default function HeritageSkyline() {
  return (
    <svg
      viewBox="0 0 390 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full"
      style={{ display: 'block' }}
    >
      {/* Glow backdrop */}
      <defs>
        <radialGradient id="skyGlow" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="var(--skyline-glow, rgba(242,140,56,0.3))" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        {/* Star pattern for night mode */}
        <pattern id="stars" x="0" y="0" width="30" height="20" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="4" r="0.8" fill="var(--skyline-star, transparent)" />
          <circle cx="20" cy="10" r="0.6" fill="var(--skyline-star, transparent)" />
          <circle cx="12" cy="17" r="0.5" fill="var(--skyline-star, transparent)" />
        </pattern>
      </defs>

      {/* Sky glow / stars background */}
      <rect width="390" height="80" fill="url(#stars)" />
      <rect width="390" height="80" fill="url(#skyGlow)" />

      {/* ===== Sinhagad Fort (left) — crenellated walls ===== */}
      {/* Ground / hill slope */}
      <path d="M0,70 Q30,50 60,55 L60,80 L0,80 Z" fill="var(--skyline-fill)" opacity="0.55" />
      {/* Fort wall */}
      <rect x="5" y="50" width="50" height="22" rx="1" fill="var(--skyline-fill)" opacity="0.75" />
      {/* Battlements */}
      {[5, 13, 21, 29, 37, 45].map((x) => (
        <rect key={x} x={x} y="44" width="6" height="8" rx="1" fill="var(--skyline-fill)" opacity="0.85" />
      ))}
      {/* Tower */}
      <rect x="22" y="36" width="14" height="16" rx="1" fill="var(--skyline-fill)" opacity="0.9" />
      <rect x="24" y="30" width="10" height="8" rx="1" fill="var(--skyline-fill)" />
      {/* Flag */}
      <line x1="29" y1="30" x2="29" y2="20" stroke="var(--skyline-fill)" strokeWidth="1.2" opacity="0.7" />
      <polygon points="29,20 38,23 29,26" fill="var(--color-accent, #F28C38)" opacity="0.9" />

      {/* ===== Rolling hills connecting left to center ===== */}
      <path d="M55,68 Q90,52 120,58 Q140,62 150,60" fill="none" stroke="var(--skyline-fill)" strokeWidth="2" opacity="0.35" />

      {/* ===== Shaniwar Wada Gateway (center) ===== */}
      {/* Main plinth */}
      <rect x="140" y="55" width="110" height="18" rx="2" fill="var(--skyline-fill)" opacity="0.7" />
      {/* Left tower */}
      <rect x="140" y="30" width="20" height="43" rx="2" fill="var(--skyline-fill)" opacity="0.85" />
      {/* Right tower */}
      <rect x="230" y="30" width="20" height="43" rx="2" fill="var(--skyline-fill)" opacity="0.85" />
      {/* Tower tops with battlements */}
      {[140, 148, 156].map((x) => (
        <rect key={x} x={x} y="24" width="6" height="8" rx="1" fill="var(--skyline-fill)" opacity="0.9" />
      ))}
      {[230, 238, 246].map((x) => (
        <rect key={x} x={x} y="24" width="6" height="8" rx="1" fill="var(--skyline-fill)" opacity="0.9" />
      ))}
      {/* Main gateway arch */}
      <path d="M165,73 L165,45 Q195,30 225,45 L225,73 Z" fill="var(--color-bg)" opacity="0.8" />
      {/* Arch detail inner */}
      <path d="M172,73 L172,49 Q195,36 218,49 L218,73 Z" fill="var(--color-bg)" opacity="0.6" />
      {/* Top central pinnacle */}
      <rect x="186" y="14" width="18" height="16" rx="2" fill="var(--skyline-fill)" />
      <polygon points="195,5 202,14 188,14" fill="var(--color-accent, #F28C38)" opacity="0.95" />
      {/* Windows / embrasures on towers */}
      <rect x="145" y="36" width="8" height="10" rx="2" fill="var(--color-bg)" opacity="0.5" />
      <rect x="237" y="36" width="8" height="10" rx="2" fill="var(--color-bg)" opacity="0.5" />

      {/* ===== Temple Spire (right) ===== */}
      <rect x="310" y="45" width="44" height="28" rx="2" fill="var(--skyline-fill)" opacity="0.7" />
      {/* Sikhara layers */}
      <rect x="320" y="35" width="24" height="12" rx="2" fill="var(--skyline-fill)" opacity="0.8" />
      <rect x="326" y="24" width="18" height="13" rx="2" fill="var(--skyline-fill)" opacity="0.85" />
      <rect x="330" y="14" width="10" height="12" rx="2" fill="var(--skyline-fill)" opacity="0.9" />
      {/* Kalash (finial) */}
      <circle cx="335" cy="10" r="4" fill="var(--color-accent, #F28C38)" opacity="0.95" />
      <line x1="335" y1="6" x2="335" y2="2" stroke="var(--color-accent, #F28C38)" strokeWidth="1.5" />
      <circle cx="335" cy="1.5" r="1.5" fill="var(--color-accent, #F28C38)" />
      {/* Temple doorway */}
      <path d="M324,73 L324,56 Q332,50 340,56 L340,73 Z" fill="var(--color-bg)" opacity="0.5" />
      {/* Columns */}
      <rect x="316" y="50" width="4" height="23" rx="1" fill="var(--skyline-fill)" opacity="0.5" />
      <rect x="344" y="50" width="4" height="23" rx="1" fill="var(--skyline-fill)" opacity="0.5" />

      {/* ===== Rolling terrain connecting to right ===== */}
      <path d="M250,66 Q280,56 310,60" fill="none" stroke="var(--skyline-fill)" strokeWidth="2" opacity="0.35" />

      {/* ===== Far right fade ===== */}
      <path d="M354,65 Q370,58 390,62 L390,80 L354,80 Z" fill="var(--skyline-fill)" opacity="0.4" />

      {/* Ground strip */}
      <rect x="0" y="73" width="390" height="7" rx="0" fill="var(--skyline-fill)" opacity="0.25" />
    </svg>
  )
}
