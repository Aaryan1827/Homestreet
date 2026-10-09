import { useCity } from '../context/CityContext'
import GlassCard from '../components/GlassCard'
import { GitCompare } from 'lucide-react'
import { motion } from 'motion/react'

export default function Compare() {
  const { city } = useCity()

  return (
    <div className="flex flex-col gap-6 p-4" style={{ paddingTop: '80px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-xs font-medium uppercase tracking-widest mb-1"
          style={{ color: 'var(--color-accent)', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
          Discover
        </p>
        <h1 className="text-3xl mb-2"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>
          Compare
        </h1>
        <p style={{ color: 'var(--color-muted)', fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: '14px' }}>
          Best vs worst neighbourhoods in {city.name}. Coming soon.
        </p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }}>
        <GlassCard
          className="flex flex-col items-center justify-center gap-4 p-12"
          style={{ minHeight: '320px', border: '2px dashed var(--color-border)' }}
          id="compare-placeholder"
        >
          <GitCompare size={52} style={{ color: 'var(--color-muted)', opacity: 0.5 }} />
          <div className="text-center">
            <p className="font-semibold mb-1" style={{ color: 'var(--color-ink)', fontFamily: 'Fraunces, Georgia, serif' }}>
              Neighbourhood Comparison
            </p>
            <p className="text-sm" style={{ color: 'var(--color-muted)', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
              Scoring engine coming in Stage 3
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
