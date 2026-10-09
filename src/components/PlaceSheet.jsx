import { motion, AnimatePresence } from 'motion/react'
import { MapPin, Navigation, Clock, Sun, X, Star } from 'lucide-react'
import CityImage from './CityImage'
import ScoreBadge from './ScoreBadge'
import ScoreBars from './ScoreBars'
import { cityScore, scoreColor } from '../utils/scoring'

export default function PlaceSheet({ place, onClose }) {
  if (!place) return null;

  const cScore = cityScore(place);
  const price = '₹'.repeat(place.priceLevel || 1);

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        key="place-sheet"
        initial={{ y: '100%', opacity: 0.5 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-[1000] lg:left-auto lg:right-4 lg:bottom-4 lg:w-96 glass rounded-t-3xl lg:rounded-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: '85dvh' }}
      >
        {/* Drag Handle (Mobile) */}
        <div className="w-full flex justify-center py-3 lg:hidden" onClick={onClose}>
          <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-muted)', opacity: 0.5 }} />
        </div>

        {/* Close Button (Desktop) */}
        <button 
          onClick={onClose}
          className="hidden lg:flex absolute top-4 right-4 w-8 h-8 rounded-full items-center justify-center z-10 glass-sm"
          style={{ color: 'var(--color-ink)' }}
        >
          <X size={16} />
        </button>

        <div className="flex-1 overflow-y-auto pb-safe">
          {/* Header Image */}
          <div className="w-full h-48 relative shrink-0 rounded-t-3xl lg:rounded-t-3xl overflow-hidden">
            <CityImage src={place.image} alt={place.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <div className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-2" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
                  <span className="capitalize">{place.subcategory || place.category}</span>
                </div>
                <h2 className="text-2xl font-bold text-white leading-tight" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
                  {place.name}
                </h2>
                <p className="text-sm text-white/90 flex items-center gap-1 mt-1 font-medium">
                  <MapPin size={14} /> {place.area}
                  {place.distance && ` • ${place.distance.toFixed(1)} km`}
                </p>
              </div>
              <ScoreBadge score={cScore} size="lg" />
            </div>
          </div>

          <div className="p-5 flex flex-col gap-6">
            {/* Quick Info */}
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-ink)' }}>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{price}</span>
                <span style={{ color: 'var(--color-muted)' }}>• ₹{place.avgCost}</span>
              </div>
              {place.openHours && (
                <div className="flex items-center gap-1.5">
                  <Clock size={15} style={{ color: 'var(--color-muted)' }} />
                  <span>{place.openHours}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>
              {place.description}
            </p>

            {/* Scores */}
            <div>
              <h3 className="text-base font-bold mb-3" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>
                Scores
              </h3>
              <ScoreBars scores={place.scores} />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDirections}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white shadow-lg"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Navigation size={18} />
                Directions
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold opacity-50 cursor-not-allowed"
                style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-ink)' }}
              >
                <Star size={18} />
                Compare
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
