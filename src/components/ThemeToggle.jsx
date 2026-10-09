import { useTheme } from '../context/ThemeContext'
import { Sun, Sunset, Moon } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

const ICONS = { day: Sun, evening: Sunset, night: Moon }
const LABELS = { day: 'Day', evening: 'Evening', night: 'Night' }

export default function ThemeToggle({ transparent = false }) {
  const { theme, mode, cycleTheme } = useTheme()
  const Icon = ICONS[theme]
  const [showTip, setShowTip] = useState(false)

  return (
    <div className="relative">
      <motion.button
        id="theme-toggle-btn"
        onClick={cycleTheme}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        whileTap={{ scale: 0.85 }}
        className="flex items-center justify-center rounded-full"
        style={{
          width: '40px',
          height: '40px',
          minWidth: '40px',
          backgroundColor: transparent ? 'rgba(255,255,255,0.18)' : 'var(--color-surface-soft)',
          color: transparent ? '#ffffff' : 'var(--color-primary)',
          backdropFilter: transparent ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: transparent ? 'blur(8px)' : 'none',
          border: transparent ? '1px solid rgba(255,255,255,0.25)' : 'none',
          transition: 'background 300ms, color 300ms',
        }}
        aria-label={`Theme: ${LABELS[theme]}${mode === 'auto' ? ' (Auto)' : ''}. Click to cycle.`}
      >
        <motion.span
          key={theme}
          initial={{ rotate: -20, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: 'backOut' }}
        >
          <Icon size={17} />
        </motion.span>
      </motion.button>

      {/* Tooltip */}
      {showTip && (
        <div
          className="absolute right-0 top-full mt-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none z-50"
          style={{
            backgroundColor: 'var(--color-ink)',
            color: 'var(--color-bg)',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            opacity: 0.92,
          }}
        >
          {LABELS[theme]}{mode === 'auto' ? ' · Auto' : ''}
        </div>
      )}
    </div>
  )
}
