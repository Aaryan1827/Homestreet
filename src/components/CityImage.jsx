import { useState } from 'react'

/**
 * CityImage — tries to load a real photo; falls back to themed gradient placeholder.
 * Drop photos in public/images/<cityId>/ and they appear automatically.
 *
 * Props:
 *   src       – image path (e.g. /images/pune/hero.jpg)
 *   alt       – accessible alt text
 *   className – extra classes
 *   style     – inline style overrides
 *   lazy      – boolean, default true (use false for LCP hero)
 *   width     – explicit width (avoids layout shift)
 *   height    – explicit height
 *   cover     – boolean, default true (object-fit: cover)
 */
export default function CityImage({
  src,
  alt = '',
  className = '',
  style = {},
  lazy = true,
  width,
  height,
  cover = true,
  title, // new prop for fallback text
  category, // new prop for fallback icon/color
}) {
  const [failed, setFailed] = useState(false)

  const commonStyle = {
    objectFit: cover ? 'cover' : 'contain',
    width: width ?? '100%',
    height: height ?? '100%',
    display: 'block',
    ...style,
  }

  if (!src || failed) {
    const fallbackTitle = title || alt || 'Homestreet'
    return (
      <div
        className={`city-image-placeholder ${className} flex items-center justify-center`}
        style={{ ...commonStyle, position: 'relative', overflow: 'hidden' }}
        role="img"
        aria-label={alt || title || 'City photo placeholder'}
      >
        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }}
        />
        {/* Subtle radial shading for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.3) 100%)',
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-1 p-2 w-full max-w-full">
          <span
            className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2 px-1"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {fallbackTitle}
          </span>
          <span
            className="text-[9px] uppercase tracking-wider font-semibold line-clamp-1 px-1.5 py-0.5 rounded-full"
            style={{
              color: 'rgba(255,255,255,0.92)',
              backgroundColor: 'rgba(0,0,0,0.28)',
              backdropFilter: 'blur(4px)',
            }}
          >
            {category || 'Image coming soon'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`hero-photo ${className}`}
      style={commonStyle}
      loading={lazy ? 'lazy' : 'eager'}
      width={width}
      height={height}
      onError={() => setFailed(true)}
      decoding="async"
    />
  )
}
