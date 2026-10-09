import { useCity } from '../context/CityContext'
import GlassCard from '../components/GlassCard'
import { Map } from 'lucide-react'
import { motion } from 'motion/react'

export default function MapPage() {
  const { city } = useCity()

  return (
    <div className="flex flex-col gap-6 p-4" style={{ paddingTop: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xs font-medium uppercase tracking-widest mb-1"
          style={{ color: 'var(--color-accent)', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
          Navigate
        </p>
        <h1 className="text-3xl mb-2"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>
          Map
        </h1>
        <p style={{ color: 'var(--color-muted)', fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: '14px' }}>
          Interactive map of {city.name} — heritage sites, safety scores, and city insights. Coming in Stage 2.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.4 }}
      >
        <GlassCard
          className="flex flex-col items-center justify-center gap-4 p-12"
          style={{ minHeight: '320px', border: '2px dashed var(--color-border)' }}
          id="map-placeholder"
        >
          <Map size={52} style={{ color: 'var(--color-muted)', opacity: 0.5 }} />
          <div className="text-center">
            <p className="font-semibold mb-1"
              style={{ color: 'var(--color-ink)', fontFamily: 'Fraunces, Georgia, serif' }}>
              Leaflet Map
            </p>
            <p className="text-sm" style={{ color: 'var(--color-muted)', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
              Center: {city.center[0].toFixed(4)}, {city.center[1].toFixed(4)}
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
