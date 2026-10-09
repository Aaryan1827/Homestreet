import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useCity } from '../context/CityContext'
import { useCompare } from '../context/CompareContext'
import GlassCard from '../components/GlassCard'
import ScoreBars from '../components/ScoreBars'
import ScoreBadge from '../components/ScoreBadge'
import { Search, X, Trophy, Settings2, RotateCcw } from 'lucide-react'
import { scoreColor } from '../utils/scoring'

// Helper for SVG polar coordinates
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

// 5 dimensions for the radar
const DIMENSIONS = ['safety', 'cleanliness', 'affordability', 'rating', 'accessibility']
const DIM_LABELS = ['Safety', 'Cleanliness', 'Value', 'Rating', 'Access']

// Palette for compared items
const COLORS = ['#3B82F6', '#EF4444', '#10B981']

// SVG Radar Chart Component
function RadarChart({ itemsWithScores }) {
  const size = 300
  const center = size / 2
  const maxRadius = size / 2 - 40 // leave room for labels
  const angleStep = 360 / DIMENSIONS.length

  return (
    <div className="relative w-full flex justify-center py-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Draw background pentagons */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => {
          const r = maxRadius * scale
          const points = DIMENSIONS.map((_, idx) => {
            const p = polarToCartesian(center, center, r, idx * angleStep)
            return `${p.x},${p.y}`
          }).join(' ')
          return (
            <polygon 
              key={i} 
              points={points} 
              fill="none" 
              stroke="var(--color-muted)" 
              strokeOpacity={0.2} 
              strokeWidth="1" 
            />
          )
        })}
        {/* Draw axes */}
        {DIMENSIONS.map((_, idx) => {
          const p = polarToCartesian(center, center, maxRadius, idx * angleStep)
          return (
            <line 
              key={idx} 
              x1={center} y1={center} 
              x2={p.x} y2={p.y} 
              stroke="var(--color-muted)" 
              strokeOpacity={0.2} 
              strokeWidth="1" 
            />
          )
        })}
        {/* Draw labels */}
        {DIMENSIONS.map((_, idx) => {
          const p = polarToCartesian(center, center, maxRadius + 20, idx * angleStep)
          return (
            <text 
              key={idx} 
              x={p.x} y={p.y} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fill="var(--color-ink)"
              fontSize="10"
              fontWeight="bold"
            >
              {DIM_LABELS[idx]}
            </text>
          )
        })}
        {/* Draw item polygons */}
        {itemsWithScores.map((item, itemIdx) => {
          const points = DIMENSIONS.map((dim, idx) => {
            const score = item.scores[dim] || 0
            const r = maxRadius * (score / 100)
            const p = polarToCartesian(center, center, r, idx * angleStep)
            return `${p.x},${p.y}`
          }).join(' ')
          
          return (
            <motion.polygon
              key={item.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: itemIdx * 0.2 }}
              points={points}
              fill={COLORS[itemIdx % COLORS.length]}
              stroke={COLORS[itemIdx % COLORS.length]}
              strokeWidth="2"
              style={{ transformOrigin: `${center}px ${center}px` }}
            />
          )
        })}
      </svg>
    </div>
  )
}

function computeScore(scores, weights) {
  let total = 0
  let weightSum = 0
  DIMENSIONS.forEach(dim => {
    total += (scores[dim] || 0) * weights[dim]
    weightSum += weights[dim]
  })
  return Math.round(total / weightSum)
}

export default function Compare() {
  const { city } = useCity()
  const { compareItems, addCompareItem, removeCompareItem, clearCompare } = useCompare()
  
  const [activeTab, setActiveTab] = useState('place') // 'place' | 'area'
  const [searchQuery, setSearchQuery] = useState('')
  const [showWeights, setShowWeights] = useState(false)
  
  const [weights, setWeights] = useState({
    safety: 1, cleanliness: 1, affordability: 1, rating: 1, accessibility: 1
  })

  // Lookup full items
  const fullItems = useMemo(() => {
    return compareItems.map(ci => {
      if (ci.type === 'place') return city.places.find(p => p.id === ci.id)
      return city.areas.find(a => a.name === ci.id) // areas use name as id in our setup
    }).filter(Boolean)
  }, [compareItems, city])

  // Computed scores with weights
  const itemsWithScores = useMemo(() => {
    return fullItems.map(item => ({
      ...item,
      computedScore: computeScore(item.scores, weights)
    }))
  }, [fullItems, weights])

  // Compute winner
  const winner = useMemo(() => {
    if (itemsWithScores.length < 2) return null
    let best = itemsWithScores[0]
    itemsWithScores.forEach(item => {
      if (item.computedScore > best.computedScore) best = item
    })
    
    // figure out why it won vs second best
    const others = itemsWithScores.filter(i => i !== best)
    const second = others.sort((a, b) => b.computedScore - a.computedScore)[0]
    
    if (best.computedScore === second.computedScore) return null // tie
    
    const winningDims = []
    DIMENSIONS.forEach(dim => {
      if (best.scores[dim] > second.scores[dim]) winningDims.push(DIM_LABELS[DIMENSIONS.indexOf(dim)].toLowerCase())
    })
    
    let reason = ''
    if (winningDims.length > 0) {
      reason = `Wins on ${winningDims.slice(0, 2).join(' and ')}`
    }
    
    return { ...best, reason }
  }, [itemsWithScores])

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    let pool = activeTab === 'place' ? city.places : city.areas
    // Map area to have id same as name if it doesn't
    if (activeTab === 'area') {
      pool = pool.map(a => ({ ...a, id: a.name }))
    }
    return pool.filter(p => !compareItems.find(ci => ci.id === p.id) && p.name.toLowerCase().includes(q)).slice(0, 5)
  }, [searchQuery, activeTab, city, compareItems])

  const handleResetWeights = () => {
    setWeights({ safety: 1, cleanliness: 1, affordability: 1, rating: 1, accessibility: 1 })
  }

  // Best for chips logic
  const getBestFor = (item) => {
    if (itemsWithScores.length < 2) return []
    const bestFor = []
    DIMENSIONS.forEach(dim => {
      let isBest = true
      itemsWithScores.forEach(other => {
        if (other !== item && other.scores[dim] >= item.scores[dim]) isBest = false
      })
      if (isBest) {
        if (dim === 'safety') bestFor.push('Safest')
        if (dim === 'cleanliness') bestFor.push('Cleanest')
        if (dim === 'affordability') bestFor.push('Cheapest')
        if (dim === 'rating') bestFor.push('Highest rated')
        if (dim === 'accessibility') bestFor.push('Most accessible')
      }
    })
    return bestFor
  }

  return (
    <div className="flex flex-col pt-[70px] pb-[100px] px-4 min-h-full">
      <h1 className="text-3xl mb-4" style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>
        Compare
      </h1>
      
      {/* Search and Tabs */}
      <GlassCard className="p-3 mb-6 flex flex-col gap-3 overflow-visible relative z-20">
        <div className="flex gap-2">
          {['place', 'area'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
              className="flex-1 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors"
              style={{
                backgroundColor: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--color-muted)'
              }}
            >
              {tab}s
            </button>
          ))}
        </div>
        
        <div className="relative">
          <div className="flex items-center glass-sm rounded-xl px-3 py-2 border border-[var(--glass-border)]">
            <Search size={16} style={{ color: 'var(--color-muted)' }} />
            <input 
              type="text" 
              placeholder={`Search ${activeTab}s to add...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none ml-2 text-sm text-[var(--color-ink)]"
              disabled={compareItems.length >= 3}
            />
          </div>
          {/* Dropdown results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 glass rounded-xl overflow-hidden shadow-xl border border-[var(--glass-border)]">
              {searchResults.map(res => (
                <div 
                  key={res.id} 
                  className="px-4 py-3 border-b border-[var(--glass-border)] last:border-0 flex justify-between items-center cursor-pointer hover:bg-black/5"
                  onClick={() => { addCompareItem(res); setSearchQuery(''); }}
                >
                  <span className="text-sm font-semibold text-[var(--color-ink)]">{res.name}</span>
                  <span className="text-xs text-[var(--color-primary)]">Add +</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Chips */}
        {fullItems.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {fullItems.map((item, idx) => (
              <div 
                key={item.id} 
                className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full text-xs font-semibold border"
                style={{ 
                  backgroundColor: `${COLORS[idx % COLORS.length]}20`,
                  borderColor: COLORS[idx % COLORS.length],
                  color: 'var(--color-ink)'
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="max-w-[100px] truncate">{item.name}</span>
                <button 
                  onClick={() => removeCompareItem(item.id)}
                  className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-black/10"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {fullItems.length > 0 && (
              <button onClick={clearCompare} className="text-xs text-[var(--color-muted)] underline ml-2">Clear all</button>
            )}
          </div>
        )}
      </GlassCard>

      {/* Empty State */}
      {fullItems.length < 2 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <GitCompare size={48} style={{ color: 'var(--color-muted)', opacity: 0.3 }} className="mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-[var(--color-ink)]">Select items to compare</h3>
          <p className="text-sm text-[var(--color-muted)] mb-6 max-w-xs">
            Add at least two places or areas to see how they stack up across safety, value, and more.
          </p>
          
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button 
              className="glass-sm py-2 px-4 rounded-xl text-sm font-semibold text-[var(--color-ink)] hover:scale-105 transition-transform"
              onClick={() => {
                clearCompare();
                addCompareItem({ id: 'Koregaon Park', name: 'Koregaon Park', category: null }); // Mocking area objects enough for addCompareItem
                addCompareItem({ id: 'Kothrud', name: 'Kothrud', category: null });
              }}
            >
              Compare Koregaon Park vs Kothrud
            </button>
            <button 
              className="glass-sm py-2 px-4 rounded-xl text-sm font-semibold text-[var(--color-ink)] hover:scale-105 transition-transform"
              onClick={() => {
                clearCompare();
                addCompareItem(city.places.find(p => p.id === 'vaishali'));
                addCompareItem(city.places.find(p => p.id === 'kayani-bakery'));
              }}
            >
              Compare Vaishali vs Kayani
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 relative z-10">
          
          {/* Chart Section */}
          <GlassCard className="p-4 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="font-semibold text-sm text-[var(--color-ink)]">Radar Comparison</h3>
              <button 
                onClick={() => setShowWeights(!showWeights)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg glass-sm"
                style={{ color: showWeights ? 'var(--color-primary)' : 'var(--color-muted)' }}
              >
                <Settings2 size={14} /> Weights
              </button>
            </div>
            
            <AnimatePresence>
              {showWeights && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-full overflow-hidden mb-4"
                >
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[var(--color-ink)]">Adjust Importance</span>
                      <button onClick={handleResetWeights} className="text-xs flex items-center gap-1 text-[var(--color-primary)]">
                        <RotateCcw size={12} /> Reset
                      </button>
                    </div>
                    {DIMENSIONS.map((dim, i) => (
                      <div key={dim} className="flex items-center gap-3">
                        <span className="text-[10px] uppercase w-20 text-[var(--color-muted)]">{DIM_LABELS[i]}</span>
                        <input 
                          type="range" 
                          min="0" max="2" step="0.5" 
                          value={weights[dim]}
                          onChange={(e) => setWeights({ ...weights, [dim]: parseFloat(e.target.value) })}
                          className="flex-1 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full appearance-none outline-none"
                        />
                        <span className="text-xs font-semibold w-6 text-right text-[var(--color-ink)]">{weights[dim]}x</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <RadarChart itemsWithScores={itemsWithScores} />
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {itemsWithScores.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--color-ink)]">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {item.name}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Cards Section */}
          <div className="flex gap-4 overflow-x-auto pb-6 snap-x-mandatory no-scrollbar lg:grid lg:grid-cols-3">
            {itemsWithScores.map((item, idx) => {
              const isWinner = winner?.id === item.id;
              const bestFor = getBestFor(item);
              
              return (
                <GlassCard 
                  key={item.id} 
                  className={`snap-center shrink-0 w-[280px] lg:w-auto flex flex-col p-4 gap-4 relative overflow-hidden transition-colors`}
                  style={{ 
                    border: isWinner ? `2px solid var(--color-primary)` : `1px solid var(--glass-border)`,
                    boxShadow: isWinner ? 'var(--glow-primary)' : 'var(--glass-shadow)'
                  }}
                >
                  {isWinner && (
                    <div className="absolute top-0 left-0 right-0 bg-[var(--color-primary)] text-white text-[10px] font-bold text-center py-1 uppercase tracking-widest flex items-center justify-center gap-1">
                      <Trophy size={10} /> Winner Overall
                    </div>
                  )}
                  
                  <div className={`flex justify-between items-start ${isWinner ? 'mt-4' : ''}`}>
                    <div>
                      <h3 className="font-bold text-lg leading-tight" style={{ color: 'var(--color-ink)', fontFamily: 'Fraunces, Georgia, serif' }}>
                        {item.name}
                      </h3>
                      {item.area && <p className="text-xs text-[var(--color-muted)]">{item.area}</p>}
                    </div>
                    <ScoreBadge score={item.computedScore} size="lg" />
                  </div>
                  
                  {isWinner && winner.reason && (
                    <p className="text-xs font-medium text-[var(--color-primary)] -mt-2">
                      {winner.reason}
                    </p>
                  )}

                  <div className="h-[1px] w-full bg-[var(--glass-border)]" />
                  
                  <ScoreBars scores={item.scores} />
                  
                  {(item.priceLevel || item.avgCost) && (
                    <div className="flex gap-3 text-xs font-medium text-[var(--color-ink)]">
                      {item.priceLevel && <span className="text-[var(--color-primary)]">{'₹'.repeat(item.priceLevel)}</span>}
                      {item.avgCost && <span>₹{item.avgCost}</span>}
                    </div>
                  )}
                  
                  {bestFor.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                      {bestFor.map(b => (
                        <span key={b} className="px-2 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${COLORS[idx % COLORS.length]}20`, color: COLORS[idx % COLORS.length] }}>
                          ★ {b}
                        </span>
                      ))}
                    </div>
                  )}
                </GlassCard>
              )
            })}
          </div>
          
        </div>
      )}
    </div>
  )
}
