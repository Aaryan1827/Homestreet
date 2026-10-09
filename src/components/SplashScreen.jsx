import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'

/**
 * HomesteetLogo — House + road SVG for the splash screen
 */
function HomestreetLogo() {
  return (
    <svg
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="80"
      aria-label="Homestreet logo"
    >
      {/* Road / path below the house */}
      <rect x="30" y="54" width="20" height="26" rx="3" fill="var(--color-accent)" opacity="0.9" />
      {/* Road center line */}
      <rect x="38.5" y="57" width="3" height="6" rx="1" fill="var(--color-bg)" opacity="0.7" />
      <rect x="38.5" y="66" width="3" height="6" rx="1" fill="var(--color-bg)" opacity="0.7" />

      {/* House walls */}
      <rect x="18" y="40" width="44" height="24" rx="3" fill="var(--color-primary)" />

      {/* Roof */}
      <polygon points="14,42 40,14 66,42" fill="var(--color-accent)" />
      {/* Roof ridge highlight */}
      <line x1="40" y1="14" x2="40" y2="42" stroke="var(--color-bg)" strokeWidth="1.5" opacity="0.4" />

      {/* Door */}
      <rect x="33" y="50" width="14" height="14" rx="2" fill="var(--color-bg)" opacity="0.85" />
      {/* Door knob */}
      <circle cx="44" cy="58" r="1.5" fill="var(--color-accent)" />

      {/* Windows */}
      <rect x="20" y="44" width="10" height="8" rx="2" fill="var(--color-bg)" opacity="0.7" />
      <rect x="50" y="44" width="10" height="8" rx="2" fill="var(--color-bg)" opacity="0.7" />

      {/* Chimney */}
      <rect x="50" y="22" width="7" height="12" rx="2" fill="var(--color-primary)" />
    </svg>
  )
}

export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      // Give exit animation time, then call onDone
      setTimeout(onDone, 500)
    }, 1500)
    return () => clearTimeout(timer)
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
          style={{ backgroundColor: 'var(--color-bg)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <HomestreetLogo />

            <h1
              className="text-4xl font-display text-primary tracking-tight"
              style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-primary)' }}
            >
              Homestreet
            </h1>

            <p
              className="text-sm font-body"
              style={{ color: 'var(--color-muted)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
            >
              Every street feels like home.
            </p>
          </motion.div>

          {/* Loading dots */}
          <motion.div
            className="flex gap-1.5 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
