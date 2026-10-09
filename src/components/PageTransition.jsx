import { motion, AnimatePresence } from 'motion/react'
import { useLocation } from 'react-router-dom'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

const pageTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
}

/**
 * Wraps page content in an AnimatePresence-aware motion.div.
 * Usage: wrap each <Route element> with <PageTransition>.
 */
export default function PageTransition({ children }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="flex-1 min-h-0"
        style={{ willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
