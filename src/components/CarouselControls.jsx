import { useState, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CarouselControls({ scrollRef, itemsCount, activeIdx, onScrollTo }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
      // Handle window resize
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    }
  }, [scrollRef, checkScroll]);

  const handlePrev = () => {
    if (onScrollTo && activeIdx !== undefined) {
      onScrollTo(Math.max(0, activeIdx - 1));
    } else if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth * 0.8, behavior: 'smooth' });
    }
  }

  const handleNext = () => {
    if (onScrollTo && activeIdx !== undefined) {
      onScrollTo(Math.min(itemsCount - 1, activeIdx + 1));
    } else if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth * 0.8, behavior: 'smooth' });
    }
  }

  return (
    <div className="flex gap-2">
      <motion.button
        onClick={handlePrev}
        whileTap={{ scale: 0.88 }}
        disabled={!canScrollLeft && (activeIdx === undefined || activeIdx === 0)}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity"
        style={{
          backgroundColor: 'var(--color-surface-soft)',
          color: 'var(--color-ink)',
          opacity: (!canScrollLeft && (activeIdx === undefined || activeIdx === 0)) ? 0.35 : 1,
        }}
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </motion.button>
      <motion.button
        onClick={handleNext}
        whileTap={{ scale: 0.88 }}
        disabled={!canScrollRight && (activeIdx === undefined || activeIdx === itemsCount - 1)}
        className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity"
        style={{
          backgroundColor: 'var(--color-surface-soft)',
          color: 'var(--color-ink)',
          opacity: (!canScrollRight && (activeIdx === undefined || activeIdx === itemsCount - 1)) ? 0.35 : 1,
        }}
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </motion.button>
    </div>
  )
}
