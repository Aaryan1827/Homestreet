import { useCity } from '../context/CityContext'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

export default function CitySelector({ transparent = false }) {
  const { city, cities, setCity } = useCity()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        id="city-selector-btn"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors"
        style={{
          backgroundColor: transparent ? 'rgba(255,255,255,0.18)' : 'var(--color-surface-soft)',
          color: transparent ? '#ffffff' : 'var(--color-ink)',
          backdropFilter: transparent ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: transparent ? 'blur(8px)' : 'none',
          border: transparent ? '1px solid rgba(255,255,255,0.22)' : 'none',
          minHeight: '40px',
          whiteSpace: 'nowrap',
          transition: 'background 300ms',
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <MapPin size={13} style={{ color: transparent ? 'rgba(255,255,255,0.8)' : 'var(--color-primary)' }} />
        <span>{city.name}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={13} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Select city"
            className="absolute right-0 mt-2 w-52 rounded-card overflow-hidden z-50"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--glass-shadow)',
            }}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
          >
            {cities.map((c) => (
              <li
                key={c.id}
                role="option"
                aria-selected={c.id === city.id}
                aria-disabled={c.comingSoon}
              >
                <button
                  className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-left"
                  style={{
                    color: c.comingSoon ? 'var(--color-muted)' : 'var(--color-ink)',
                    backgroundColor: c.id === city.id ? 'var(--color-surface-soft)' : 'transparent',
                    cursor: c.comingSoon ? 'not-allowed' : 'pointer',
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                  }}
                  disabled={c.comingSoon}
                  onClick={() => {
                    if (!c.comingSoon) { setCity(c.id); setOpen(false) }
                  }}
                >
                  <span className="font-medium">{c.name}</span>
                  {c.comingSoon ? (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ backgroundColor: 'var(--color-surface-soft)', color: 'var(--color-accent)' }}
                    >
                      Soon
                    </span>
                  ) : c.id === city.id ? (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                  ) : null}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
