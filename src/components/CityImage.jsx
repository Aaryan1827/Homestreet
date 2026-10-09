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
    return (
      <div
        className={`city-image-placeholder ${className} flex items-center justify-center p-4`}
        style={{ ...commonStyle, position: 'relative', overflow: 'hidden' }}
        role="img"
        aria-label={alt || 'City photo placeholder'}
      >
        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        {title && (
          <div className="relative z-10 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-xl font-bold opacity-80" style={{ color: 'var(--color-ink)', fontFamily: 'Fraunces, Georgia, serif', textShadow: '0 2px 8px rgba(255,255,255,0.4)' }}>
              {title}
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold opacity-60" style={{ color: 'var(--color-ink)' }}>
              {category || 'Image coming soon'}
            </span>
          </div>
        )}
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
