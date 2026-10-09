import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import CityImage from './CityImage'
import ScoreBadge from './ScoreBadge'
import { cityScore } from '../utils/scoring'
import GlassCard from './GlassCard'

export default function PlaceCard({ place, onClick }) {
  const navigate = useNavigate();
  const cScore = cityScore(place);
  const price = '₹'.repeat(place.priceLevel || 1);

  const handleClick = () => {
    if (onClick) onClick();
    else navigate(`/map?place=${place.id}`);
  };

  return (
    <GlassCard 
      as={motion.div}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="flex items-center gap-3 p-3 cursor-pointer overflow-hidden"
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
        <CityImage src={place.image} alt={place.name} title={place.name} category={place.subcategory || place.category} />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <h4 className="font-semibold text-sm truncate" style={{ color: 'var(--color-ink)', fontFamily: 'Fraunces, Georgia, serif' }}>
          {place.name}
        </h4>
        <div className="flex items-center gap-1.5 text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
          <span className="capitalize">{place.subcategory || place.category}</span>
          <span>•</span>
          <span className="truncate">{place.area}</span>
        </div>
        <div className="flex items-center gap-2 text-xs mt-1 font-medium" style={{ color: 'var(--color-ink)' }}>
          <span style={{ color: 'var(--color-primary)' }}>{price}</span>
        </div>
      </div>
      <div className="shrink-0">
        <ScoreBadge score={cScore} size="sm" />
      </div>
    </GlassCard>
  )
}
