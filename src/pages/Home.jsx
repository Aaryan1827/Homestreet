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
import { Sunrise, Star, Moon, Compass, Sparkles, MapPin, ShieldAlert, Camera, ChevronDown, ExternalLink } from 'lucide-react'
import { cityScore } from '../utils/scoring'
import CarouselControls from '../components/CarouselControls'
import TimeSlider from '../components/TimeSlider'
import { useTime } from '../context/TimeContext'
import { activeIncidents } from '../utils/safety'
import { fetchCityNews, detectWarning } from '../utils/news'
import { useState, useEffect } from 'react'

function TasteOfPune({ dishes }) {
  const scrollRef = useRef(null)
  
  return (
    <motion.section {...FADE_UP(0.18)} className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>
          Taste of Pune
        </h2>
        <CarouselControls scrollRef={scrollRef} itemsCount={dishes.length} />
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x-mandatory pb-4 no-scrollbar">
        {dishes.map((dish, idx) => (
          <div key={dish.id} className={idx === 0 ? "ml-1" : ""}>
            <DishCard dish={dish} />
          </div>
        ))}
      </div>
    </motion.section>
  )
}

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

function SafetyPulse({ city, hour }) {
  if (!city.incidents) return null
  const active = activeIncidents(city.incidents, hour)
  
  if (active.length === 0) {
    return (
      <GlassCard className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/10 text-green-500">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>Safety Pulse</h3>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-0.5">Quiet right now. 0 active incidents.</p>
        </div>
      </GlassCard>
    )
  }

  // Count incidents by area (mock logic based on rough areas if we have lat/lng or just overall)
  // For simplicity, we just say: N active incidents
  const maxSeverity = Math.max(...active.map(i => i.severity))
  const color = maxSeverity === 3 ? 'text-red-500 bg-red-500/10' : 'text-orange-500 bg-orange-500/10'

  return (
    <GlassCard className="p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <ShieldAlert size={20} />
      </div>
      <div>
        <h3 className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>Safety Pulse</h3>
        <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-muted)' }}>
          <span className={maxSeverity === 3 ? 'text-red-500' : 'text-orange-500'}>{active.length} incident{active.length > 1 ? 's' : ''}</span> reported across the city. Stay aware.
        </p>
      </div>
    </GlassCard>
  )
}

function TrafficAlerts({ city, navigate }) {
  const [warnings, setWarnings] = useState([])
  
  useEffect(() => {
    fetchCityNews(city, false).then(data => {
      const w = data.map(a => ({...a, warning: detectWarning(a, city)})).filter(a => a.warning);
      setWarnings(w.slice(0, 3));
    }).catch(() => {})
  }, [city])

  if (warnings.length === 0) return null;

  return (
    <motion.section {...FADE_UP(0.11)} className="flex flex-col gap-3 cursor-pointer" onClick={() => navigate('/report')}>
      <div className="flex items-center gap-2 px-1 text-orange-600 dark:text-orange-400">
        <ShieldAlert size={18} />
        <h2 className="text-sm font-bold uppercase tracking-wider">Traffic & Road Alerts</h2>
      </div>
      <div className="flex flex-col gap-2">
        {warnings.map((w, i) => (
          <GlassCard key={i} className="p-3 border-l-4 bg-orange-500/5 hover:bg-orange-500/10 transition-colors" style={{ borderLeftColor: w.warning.severity === 'high' ? '#EF4444' : w.warning.severity === 'medium' ? '#F59E0B' : '#EAB308' }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-bold line-clamp-2" style={{ color: 'var(--color-ink)' }}>{w.title}</p>
                 <p className="text-[10px] font-semibold uppercase mt-1 tracking-wider" style={{ color: w.warning.severity === 'high' ? '#EF4444' : w.warning.severity === 'medium' ? '#F59E0B' : '#EAB308' }}>
                   AFFECTED AREA: {w.warning.areas.length > 0 ? w.warning.areas.join(', ') : city.name} ({w.warning.issue})
                 </p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.section>
  )
}

export default function Home() {
  const { city } = useCity()
  const { theme } = useTheme()
  const { hour } = useTime()
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

        {/* Time Slider */}
        <motion.div {...FADE_UP(0.08)}>
          <TimeSlider />
        </motion.div>

        {/* Safety Pulse */}
        <motion.div {...FADE_UP(0.10)}>
          <SafetyPulse city={city} hour={hour} />
        </motion.div>

        {/* Traffic Alerts */}
        <TrafficAlerts city={city} navigate={navigate} />

        {/* Heritage Carousel */}
        <motion.div {...FADE_UP(0.12)}>
          <HeritageCarousel items={city.heritage} />
        </motion.div>

        {/* Taste of Pune */}
        {city.dishes && city.dishes.length > 0 && (
          <TasteOfPune dishes={city.dishes} />
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

        {/* Photo credits collapsible section */}
        <PhotoCreditsSection credits={city.photoCredits} />
      </div>
    </div>
  )
}

function PhotoCreditsSection({ credits }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!credits || credits.length === 0) return null

  return (
    <motion.footer {...FADE_UP(0.42)} className="pb-3">
      <div
        className="rounded-2xl transition-all duration-300 overflow-hidden"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          aria-expanded={isOpen}
          aria-controls="photo-credits-content"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{
                backgroundColor: 'var(--color-surface-soft)',
                color: 'var(--color-primary)',
              }}
            >
              <Camera size={15} />
            </div>
            <div className="flex flex-col">
              <span
                className="text-xs font-semibold tracking-wide"
                style={{ color: 'var(--color-ink)' }}
              >
                Photo credits ({credits.length})
              </span>
              <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                Freely licensed images from Wikimedia Commons & Flickr
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 ml-2"
            style={{ color: 'var(--color-muted)' }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </button>

        {isOpen && (
          <div
            id="photo-credits-content"
            className="px-4 pb-4 pt-1 border-t flex flex-col gap-2 text-xs"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {credits.map((c, i) => (
                <div
                  key={c.file || i}
                  className="p-2.5 rounded-xl flex items-start justify-between gap-2"
                  style={{
                    backgroundColor: 'var(--color-surface-soft)',
                  }}
                >
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span
                      className="font-medium text-xs truncate"
                      style={{ color: 'var(--color-ink)' }}
                      title={c.title}
                    >
                      {c.title}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>
                      By <strong className="font-medium">{c.author}</strong> • <span className="opacity-90">{c.license}</span>
                    </span>
                  </div>
                  {c.source && (
                    <a
                      href={c.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 p-1 rounded-md transition-opacity hover:opacity-100 opacity-60"
                      style={{ color: 'var(--color-primary)' }}
                      title="View original image source"
                      aria-label={`Source for ${c.title}`}
                    >
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.footer>
  )
}
