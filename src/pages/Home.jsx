import { useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useCity } from '../context/CityContext'
import { useTheme } from '../context/ThemeContext'
import CityHero from '../components/CityHero'
import GlassCard from '../components/GlassCard'
import HeritageCarousel from '../components/HeritageCarousel'
import DishCard from '../components/DishCard'
import PlaceCard from '../components/PlaceCard'
import { Sunrise, Star, Moon, Compass, Sparkles, MapPin, Calendar } from 'lucide-react'
import { cityScore } from '../utils/scoring'

const MOOD = {
  day: {
    icon: Sunrise,
    label: 'Morning',
    copy: (city) => `Morning in ${city.name}. The city is waking up — chai stalls and morning walkers are out.`,
  },
  evening: {
    icon: Star,
    label: 'Golden Hour',
    copy: (city) => `Golden hour in ${city.name}. Streets are glowing, the light is perfect, and the air smells like summer dust.`,
  },
  night: {
    icon: Moon,
    label: 'Night',
    copy: (city) => `Night in ${city.name}. The lights are on — stay aware and stay safe as you explore.`,
  },
}

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.48, ease: [0.2, 0, 0.2, 1], delay },
})

export default function Home() {
  const { city } = useCity()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const mood = MOOD[theme]
  const MoodIcon = mood.icon
  const contentRef = useRef(null)

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // Derived data
  const topFood = useMemo(() => city.places.filter(p => p.category === 'food').slice(0, 3), [city.places]);
  const topRated = useMemo(() => [...city.places].sort((a, b) => cityScore(b) - cityScore(a)).slice(0, 3), [city.places]);
  const budgetPicks = useMemo(() => city.places.filter(p => p.priceLevel === 1).slice(0, 3), [city.places]);

  return (
    <div className="flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <CityHero onExploreClick={scrollToContent} />

      <div
        ref={contentRef}
        className="flex flex-col gap-8 px-4 relative"
        style={{ marginTop: '-16px', paddingBottom: '24px' }}
      >
        {/* Mood Card */}
        <motion.div {...FADE_UP(0.05)}>
          <GlassCard id="city-mood-card" className="flex items-start gap-4 p-5">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
              <MoodIcon size={22} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <h2 className="text-lg font-semibold leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>
                {mood.label} in {city.name}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                {mood.copy(city)}
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Heritage Carousel */}
        <motion.div {...FADE_UP(0.12)}>
          <HeritageCarousel items={city.heritage} />
        </motion.div>

        {/* Taste of Pune */}
        {city.dishes && city.dishes.length > 0 && (
          <motion.section {...FADE_UP(0.18)} className="flex flex-col gap-3">
            <h2 className="text-xl px-1" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>
              Taste of {city.name}
            </h2>
            <div className="flex gap-4 overflow-x-auto snap-x-mandatory pb-4 no-scrollbar">
              {city.dishes.map((dish, idx) => (
                <div key={dish.id} className={idx === 0 ? "ml-1" : ""}>
                  <DishCard dish={dish} />
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Eat like a local */}
        {topFood.length > 0 && (
          <motion.section {...FADE_UP(0.24)} className="flex flex-col gap-3">
            <h2 className="text-xl px-1" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>
              Eat like a local
            </h2>
            <div className="flex flex-col gap-3">
              {topFood.map(place => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Mini Cards Grid */}
        <motion.div {...FADE_UP(0.30)} className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4 flex flex-col gap-3 cursor-pointer" onClick={() => navigate('/map')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(var(--shadow-color) / 0.08)' }}>
              <Sparkles size={20} style={{ color: 'var(--color-accent)' }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>Top Rated</h3>
              <div className="flex flex-col gap-1 text-[11px]" style={{ color: 'var(--color-muted)' }}>
                {topRated.map(p => <span key={p.id} className="truncate">{p.name}</span>)}
              </div>
            </div>
          </GlassCard>

          <div className="flex flex-col gap-3">
            <GlassCard className="p-4 flex-1 flex flex-col gap-2 cursor-pointer" onClick={() => navigate('/map')}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>Budget Picks</h3>
              <div className="flex flex-col gap-1 text-[11px]" style={{ color: 'var(--color-muted)' }}>
                {budgetPicks.slice(0, 2).map(p => <span key={p.id} className="truncate">{p.name}</span>)}
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex-1 flex flex-col gap-2 cursor-pointer" onClick={() => navigate('/map')}>
              <h3 className="text-sm font-semibold" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>Culture & Fest</h3>
              <div className="flex flex-col gap-1 text-[11px]" style={{ color: 'var(--color-muted)' }}>
                {city.culture?.festivals?.slice(0, 2).map(f => <span key={f.name} className="truncate">{f.name}</span>)}
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Explore CTA */}
        <motion.div {...FADE_UP(0.36)}>
          <div
            className="rounded-card p-5 flex items-start gap-4 cursor-pointer"
            onClick={() => navigate('/map')}
            style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              borderRadius: '24px',
              boxShadow: 'var(--glow-primary)',
            }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}>
              <Compass size={22} color="white" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'white' }}>
                Open Map
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                View all places, heritage sites, and navigate {city.name}.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        {city.photoCredits && city.photoCredits.length > 0 && (
          <motion.footer {...FADE_UP(0.42)} className="text-center pb-2">
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              Photo credits: {city.photoCredits.map((c, i) => (
                <span key={i}>{c.label} © {c.credit}{i < city.photoCredits.length - 1 ? ' · ' : ''}</span>
              ))}
            </p>
          </motion.footer>
        )}
      </div>
    </div>
  )
}
