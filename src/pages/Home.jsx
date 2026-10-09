import { useRef } from 'react'
import { motion } from 'motion/react'
import { useCity } from '../context/CityContext'
import { useTheme } from '../context/ThemeContext'
import CityHero from '../components/CityHero'
import GlassCard from '../components/GlassCard'
import HeritageCarousel from '../components/HeritageCarousel'
import { Sunrise, Star, Moon, Compass, Shield, TrendingUp } from 'lucide-react'

/* ── Mood copy ── */
const MOOD = {
  day: {
    icon: Sunrise,
    label: 'Morning',
    copy: (city) =>
      `Morning in ${city.name}. The city is waking up — chai stalls and morning walkers are out.`,
  },
  evening: {
    icon: Star,
    label: 'Golden Hour',
    copy: (city) =>
      `Golden hour in ${city.name}. Streets are glowing, the light is perfect, and the air smells like summer dust.`,
  },
  night: {
    icon: Moon,
    label: 'Night',
    copy: (city) =>
      `Night in ${city.name}. The lights are on — stay aware and stay safe as you explore.`,
  },
}

/* ── Staggered fade-up ── */
const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.48, ease: [0.2, 0, 0.2, 1], delay },
})

export default function Home() {
  const { city } = useCity()
  const { theme } = useTheme()
  const mood = MOOD[theme]
  const MoodIcon = mood.icon
  const contentRef = useRef(null)

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>

      {/* ════ HERO ════ */}
      <CityHero onExploreClick={scrollToContent} />

      {/* ════ CONTENT — overlapping hero by 40px ════ */}
      <div
        ref={contentRef}
        className="flex flex-col gap-6 px-4 relative"
        style={{ marginTop: '-40px', paddingBottom: '24px' }}
      >

        {/* ── City Mood GlassCard — overlaps hero ── */}
        <motion.div {...FADE_UP(0.05)}>
          <GlassCard
            id="city-mood-card"
            className="flex items-start gap-4 p-5"
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
              style={{ backgroundColor: 'var(--color-surface-soft)' }}
            >
              <MoodIcon size={22} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <h2
                className="text-lg font-semibold leading-tight"
                style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}
              >
                {mood.label} in {city.name}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-muted)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
              >
                {mood.copy(city)}
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Heritage Carousel ── */}
        <motion.div {...FADE_UP(0.12)}>
          <HeritageCarousel items={city.heritage} />
        </motion.div>

        {/* ── Quick actions row ── */}
        <motion.div {...FADE_UP(0.18)} className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4 flex flex-col gap-2" id="safety-quick-card">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-safe)', opacity: 0.15 + 0.85, /* show bg */ boxShadow: 'none' }}
            >
              <Shield size={20} style={{ color: 'var(--color-safe)' }} />
            </div>
            <h3
              className="text-sm font-semibold"
              style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}
            >
              Safety
            </h3>
            <p
              className="text-xs"
              style={{ color: 'var(--color-muted)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
            >
              Neighbourhood scores coming soon
            </p>
          </GlassCard>

          <GlassCard className="p-4 flex flex-col gap-2" id="insights-quick-card">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(var(--shadow-color) / 0.08)' }}
            >
              <TrendingUp size={20} style={{ color: 'var(--color-accent)' }} />
            </div>
            <h3
              className="text-sm font-semibold"
              style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}
            >
              Insights
            </h3>
            <p
              className="text-xs"
              style={{ color: 'var(--color-muted)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
            >
              City stats &amp; traffic coming soon
            </p>
          </GlassCard>
        </motion.div>

        {/* ── Explore CTA card ── */}
        <motion.div {...FADE_UP(0.24)}>
          <div
            id="explore-cta-card"
            className="rounded-card p-5 flex items-start gap-4"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              borderRadius: '24px',
              boxShadow: 'var(--glow-primary)',
            }}
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            >
              <Compass size={22} color="white" />
            </div>
            <div className="flex flex-col gap-1">
              <h2
                className="text-lg font-semibold"
                style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'white' }}
              >
                Explore {city.name}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
              >
                Compare neighbourhoods, discover heritage, and get smart city insights.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Photo credits footer ── */}
        {city.photoCredits && city.photoCredits.length > 0 && (
          <motion.footer
            {...FADE_UP(0.30)}
            className="text-center pb-2"
          >
            <p
              className="text-xs"
              style={{ color: 'var(--color-muted)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
            >
              Photo credits:{' '}
              {city.photoCredits.map((c, i) => (
                <span key={i}>
                  {c.label} © {c.credit}
                  {i < city.photoCredits.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
          </motion.footer>
        )}
      </div>
    </div>
  )
}
