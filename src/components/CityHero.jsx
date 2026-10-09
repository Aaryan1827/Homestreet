import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useCity } from '../context/CityContext'
import { useTheme } from '../context/ThemeContext'
import CityImage from './CityImage'
import NightStars from './NightStars'
import { Compass } from 'lucide-react'

/**
 * CityHero — full-bleed photographic hero with:
 * - Ken Burns zoom (20s, CSS animation)
 * - Parallax on scroll (transform only)
 * - Theme-driven photo filter + gradient overlay
 * - Twinkling stars (night mode)
 * - Large Fraunces city title + tagline
 * - Glass "Start Exploring" CTA pill
 */
export default function CityHero({ onExploreClick }) {
  const { city } = useCity()
  const { theme } = useTheme()
  const heroRef = useRef(null)

  const { scrollY } = useScroll()
  // Parallax: move image up at half scroll speed
  const imageY = useTransform(scrollY, [0, 400], [0, -60])

  return (
    <section
      ref={heroRef}
      id="city-hero"
      className="relative overflow-hidden"
      style={{ height: 'clamp(60vh, 65vh, 75vh)' }}
      aria-label={`${city.name} hero`}
    >
      {/* ── Photo / Placeholder ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, willChange: 'transform' }}
      >
        <CityImage
          src={city.heroImage}
          alt={`${city.name} city landscape`}
          lazy={false}
          className="ken-burns"
          style={{ width: '100%', height: '108%', marginTop: '-4%' }}
        />
      </motion.div>

      {/* ── Night twinkling stars ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <NightStars />
      </div>

      {/* ── Gradient overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--hero-overlay)', transition: 'background var(--theme-transition)' }}
      />

      {/* ── Dark base for readability at all themes ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.30) 100%)',
        }}
      />

      {/* ── Hero text ── */}
      <div className="absolute inset-0 flex flex-col justify-end px-5 pb-10 lg:px-12 lg:pb-14">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1], delay: 0.1 }}
        >
          <p
            className="text-xs font-medium uppercase tracking-widest mb-2"
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontFamily: 'DM Sans, system-ui, sans-serif',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}
          >
            Exploring
          </p>

          <h1
            className="leading-none mb-2"
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontWeight: 700,
              fontSize: 'clamp(52px, 13vw, 96px)',
              color: '#ffffff',
              textShadow: '0 2px 24px rgba(0,0,0,0.45)',
              letterSpacing: '-0.03em',
            }}
          >
            {city.name}
          </h1>

          <p
            className="mb-6"
            style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(14px, 3.5vw, 18px)',
              color: 'rgba(255,255,255,0.82)',
              textShadow: '0 1px 6px rgba(0,0,0,0.4)',
              maxWidth: '320px',
            }}
          >
            {city.tagline}
          </p>

          {/* High contrast CTA pill */}
          <motion.button
            id="hero-explore-btn"
            onClick={onExploreClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex items-center gap-2 px-5 py-3 shadow-lg"
            style={{
              display: 'inline-flex',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              color: '#ffffff',
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              border: 'none',
              outline: 'none',
              borderRadius: '999px',
              boxShadow: 'var(--glow-primary), 0 4px 12px rgba(0,0,0,0.3)',
            }}
            aria-label="Start exploring the city"
          >
            <Compass size={18} />
            Start Exploring
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
