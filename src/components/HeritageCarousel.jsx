import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react'
import CityImage from './CityImage'
import GlassCard from './GlassCard'
import CarouselControls from './CarouselControls'

const CARD_W = 260
const CARD_H = 380

/**
 * HeritageCarousel
 * Props: items = city.heritage array
 */
export default function HeritageCarousel({ items }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [expanded, setExpanded] = useState(null)
  const scrollRef = useRef(null)

  const scrollToIdx = useCallback(
    (idx) => {
      const clamped = Math.max(0, Math.min(items.length - 1, idx))
      setActiveIdx(clamped)
      const el = scrollRef.current
      if (!el) return
      const cardEl = el.children[clamped]
      if (!cardEl) return
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    },
    [items.length]
  )

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const center = el.scrollLeft + el.offsetWidth / 2
    let closest = 0
    let minDist = Infinity
    Array.from(el.children).forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(center - childCenter)
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    })
    setActiveIdx(closest)
  }, [])

  if (!items || items.length === 0) return null

  return (
    <section aria-label="Heritage sites carousel" className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <h2
          className="text-xl"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}
        >
          Heritage
        </h2>
        <CarouselControls 
          scrollRef={scrollRef} 
          itemsCount={items.length} 
          activeIdx={activeIdx} 
          onScrollTo={scrollToIdx} 
        />
      </div>

      {/* Scroll track */}
      <div
        ref={scrollRef}
        className="snap-x-mandatory flex gap-4 px-4 overflow-x-auto pb-4"
        onScroll={handleScroll}
        role="list"
        aria-label="Heritage sites"
      >
        {/* Leading spacer for centering first card */}
        <div className="shrink-0 w-[calc(50vw-130px)] lg:hidden" />

        {items.map((item, i) => {
          const isActive = i === activeIdx
          return (
            <motion.div
              key={item.id}
              layoutId={`heritage-card-${item.id}`}
              className="snap-center shrink-0 cursor-pointer"
              style={{
                width: CARD_W,
                height: CARD_H,
                borderRadius: '24px',
                overflow: 'hidden',
                position: 'relative',
              }}
              animate={{
                scale: isActive ? 1 : 0.88,
                opacity: isActive ? 1 : 0.72,
                rotateY: isActive ? 0 : i < activeIdx ? 6 : -6,
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              onClick={() => {
                if (isActive) setExpanded(item)
                else scrollToIdx(i)
              }}
              role="listitem"
              aria-label={item.name}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (isActive) setExpanded(item)
                  else scrollToIdx(i)
                }
              }}
            >
              {/* Full-bleed photo */}
              <CityImage
                src={item.image}
                alt={item.name}
                title={item.name}
                category="Heritage"
                lazy={i > 1}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
                }}
              />

              {/* Heritage chip */}
              <div
                className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                }}
              >
                Heritage
              </div>

              {/* Bottom info panel */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  className="text-base font-semibold mb-1"
                  style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'white' }}
                >
                  {item.name}
                </h3>
                <p
                  className="text-xs leading-relaxed line-clamp-2"
                  style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
                >
                  {item.description}
                </p>
              </div>

              {/* Tap to expand hint on active */}
              {isActive && (
                <div
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  aria-hidden="true"
                >
                  <span className="text-white text-xs">↗</span>
                </div>
              )}
            </motion.div>
          )
        })}

        {/* Trailing spacer */}
        <div className="shrink-0 w-[calc(50vw-130px)] lg:hidden" />
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-1">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIdx(i)}
            className="rounded-full transition-all"
            style={{
              width: i === activeIdx ? '20px' : '6px',
              height: '6px',
              backgroundColor: i === activeIdx ? 'var(--color-primary)' : 'var(--color-muted)',
              opacity: i === activeIdx ? 1 : 0.4,
            }}
            aria-label={`Go to item ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Expanded detail overlay ── */}
      <AnimatePresence>
        {expanded && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-50"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(null)}
            />

            {/* Detail card — shared layout with carousel card */}
            <motion.div
              key={`expanded-${expanded.id}`}
              layoutId={`heritage-card-${expanded.id}`}
              className="fixed z-60 overflow-hidden"
              style={{
                borderRadius: '28px',
                width: 'min(440px, calc(100vw - 24px))',
                maxHeight: 'min(620px, calc(100dvh - 40px))',
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                zIndex: 60,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              {/* Photo */}
              <div className="relative" style={{ height: '280px' }}>
                <CityImage
                  src={expanded.image}
                  alt={expanded.name}
                  title={expanded.name}
                  category="Heritage"
                  lazy={false}
                  style={{ width: '100%', height: '100%' }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
                />
                <h3
                  className="absolute bottom-4 left-4 right-4 text-2xl"
                  style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'white', fontWeight: 700 }}
                >
                  {expanded.name}
                </h3>
              </div>

              {/* Info panel */}
              <div
                className="p-5 flex flex-col gap-3 overflow-y-auto"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  maxHeight: '320px',
                }}
              >
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-accent)' }}
                >
                  Heritage Site
                </div>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-muted)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
                >
                  {expanded.history || expanded.description}
                </p>

                <div className="flex gap-3 pt-2">
                  <motion.button
                    id={`view-map-${expanded.id}`}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-full text-sm font-semibold glow-primary"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                    }}
                    onClick={() => setExpanded(null)}
                  >
                    <MapPin size={15} />
                    View on Map
                  </motion.button>

                  <motion.button
                    id={`close-heritage-${expanded.id}`}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: 'var(--color-surface-soft)',
                      color: 'var(--color-ink)',
                      fontFamily: 'DM Sans, system-ui, sans-serif',
                    }}
                    onClick={() => setExpanded(null)}
                  >
                    <X size={15} />
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
