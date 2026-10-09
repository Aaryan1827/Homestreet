import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { GitCompare } from 'lucide-react'

export default function CompareTray() {
  const { compareItems, clearCompare } = useCompare()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {compareItems.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-[110px] left-1/2 -translate-x-1/2 z-[500] glass px-4 py-2 rounded-full shadow-lg flex items-center gap-3 w-[max-content]"
          style={{ borderColor: 'var(--color-primary)' }}
        >
          <div className="flex -space-x-2">
            {compareItems.map((_, i) => (
              <div 
                key={i} 
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>
            {compareItems.length} selected
          </span>
          <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
          <button 
            onClick={() => navigate('/compare')}
            className="text-sm font-bold text-white px-3 py-1.5 rounded-full hover:scale-105 transition-transform"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Compare
          </button>
          <button 
            onClick={clearCompare}
            className="text-xs font-medium underline ml-1 hover:opacity-80"
            style={{ color: 'var(--color-muted)' }}
          >
            Clear
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
