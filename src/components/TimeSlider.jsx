import { useTime } from '../context/TimeContext'
import { Sun, Moon, Sunrise, Sunset, Play } from 'lucide-react'

export default function TimeSlider({ className = '' }) {
  const { hour, isLive, setManualHour, setLive } = useTime()

  // Icon based on hour
  const getIcon = () => {
    if (hour >= 6 && hour < 17) return <Sun size={18} className="text-orange-500" />
    if (hour >= 17 && hour < 19) return <Sunset size={18} className="text-orange-600" />
    if (hour >= 19 || hour < 5) return <Moon size={18} className="text-indigo-400" />
    return <Sunrise size={18} className="text-yellow-500" />
  }

  // Format hour (e.g., "14:30")
  const formatTime = (h) => {
    const hh = Math.floor(h)
    const mm = Math.floor((h - hh) * 60)
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`
  }

  return (
    <div className={`glass px-4 py-3 rounded-2xl flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-[var(--color-ink)] font-['DM_Sans',_system-ui,_sans-serif]">
          {getIcon()}
          <span>{formatTime(hour)}</span>
        </div>
        {!isLive && (
          <button 
            onClick={setLive}
            className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md glass-sm text-[var(--color-primary)] hover:scale-105 transition-transform"
          >
            <Play size={12} /> Live
          </button>
        )}
      </div>
      
      <input 
        type="range"
        min="0"
        max="23.99"
        step="0.25"
        value={hour}
        onChange={(e) => setManualHour(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none outline-none bg-gray-300 dark:bg-gray-600"
      />
    </div>
  )
}
