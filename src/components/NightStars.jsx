import { useMemo } from 'react'

/**
 * NightStars — small twinkling dots rendered only in night mode.
 * Driven by CSS opacity var (--star-opacity) so they fade in/out with theme transition.
 * Position is randomized but seeded so it's stable across renders.
 */
const STAR_COUNT = 28

function seededRandom(seed) {
  // Simple LCG
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

export default function NightStars() {
  const stars = useMemo(() => {
    const rng = seededRandom(42)
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      x: rng() * 100,
      y: rng() * 55, // only in top 55% (sky area)
      size: 1 + rng() * 1.8,
      dur: 1.8 + rng() * 2.4,
      delay: rng() * 2.5,
    }))
  }, [])

  return (
    <>
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--twinkle-dur': `${s.dur}s`,
            '--twinkle-delay': `${s.delay}s`,
          }}
        />
      ))}
    </>
  )
}
