import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import CitySelector from './CitySelector'
import ThemeToggle from './ThemeToggle'

/**
 * Header — transparent over the hero, gets glass blur when scrolled.
 * Fixed positioning so it floats over the hero image.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      id="app-header"
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 safe-top"
      style={{
        minHeight: '60px',
        background: scrolled
          ? 'var(--glass-bg)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px) saturate(140%)' : 'none',
        borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
        transition: 'background var(--theme-transition), backdrop-filter 300ms, border-color 300ms',
      }}
      aria-label="App header"
    >
      {/* Wordmark */}
      <div className="flex items-center gap-2 min-w-0">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none">
          <polygon
            points="12,3 22,12 19,12 19,21 5,21 5,12 2,12"
            fill={scrolled ? 'var(--color-primary)' : '#ffffff'}
          />
          <rect x="9" y="15" width="6" height="6" fill={scrolled ? 'var(--color-bg)' : 'rgba(255,255,255,0.2)'} />
          <rect x="9" y="13" width="6" height="3" rx="1" fill={scrolled ? 'var(--color-accent)' : 'rgba(255,255,255,0.5)'} />
        </svg>
        <span
          className="text-xl tracking-tight whitespace-nowrap"
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontWeight: 700,
            color: scrolled ? 'var(--color-primary)' : '#ffffff',
            letterSpacing: '-0.02em',
            textShadow: scrolled ? 'none' : '0 1px 8px rgba(0,0,0,0.4)',
            transition: 'color 300ms',
          }}
        >
          Homestreet
        </span>
      </div>

      {/* Right controls — never clipped */}
      <div
        className="flex items-center gap-2 shrink-0 ml-2"
        style={{ color: scrolled ? 'var(--color-ink)' : '#ffffff' }}
      >
        <CitySelector transparent={!scrolled} />
        <ThemeToggle transparent={!scrolled} />
      </div>
    </motion.header>
  )
}
