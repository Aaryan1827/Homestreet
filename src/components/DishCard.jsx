import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import CityImage from './CityImage'
import GlassCard from './GlassCard'
import { MapPin } from 'lucide-react'

export default function DishCard({ dish }) {
  const navigate = useNavigate();

  return (
    <GlassCard className="snap-center shrink-0 w-[240px] flex flex-col p-3 gap-3">
      <div className="w-full h-32 rounded-xl overflow-hidden relative">
        <CityImage src={dish.image} alt={dish.name} title={dish.name} category="Dish" />
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="font-semibold text-base" style={{ color: 'var(--color-ink)', fontFamily: 'Fraunces, Georgia, serif' }}>
          {dish.name}
        </h4>
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--color-muted)' }}>
          {dish.description}
        </p>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(`/map?place=${dish.whereToTry}`)}
        className="mt-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold"
        style={{
          backgroundColor: 'var(--color-surface-soft)',
          color: 'var(--color-primary)'
        }}
      >
        <MapPin size={14} />
        Try it here
      </motion.button>
    </GlassCard>
  )
}
