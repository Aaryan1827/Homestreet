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
        className={`city-image-placeholder ${className}`}
        style={commonStyle}
        role="img"
        aria-label={alt || 'City photo placeholder'}
      />
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
