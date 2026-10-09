import { scoreColor } from '../utils/scoring'
import { motion } from 'motion/react'

export default function ScoreBars({ scores }) {
  if (!scores) return null;
  const labels = [
    { key: 'safety', name: 'Safety' },
    { key: 'cleanliness', name: 'Cleanliness' },
    { key: 'affordability', name: 'Value' },
    { key: 'rating', name: 'Rating' },
    { key: 'accessibility', name: 'Access' }
  ];

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {labels.map(({ key, name }) => {
        const val = scores[key] || 0;
        return (
          <div key={key} className="flex items-center gap-2 text-[10px] font-medium" style={{ color: 'var(--color-ink)' }}>
            <span className="w-16">{name}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundColor: scoreColor(val) }}
              />
            </div>
            <span className="w-6 text-right font-semibold">{val}</span>
          </div>
        )
      })}
    </div>
  )
}
