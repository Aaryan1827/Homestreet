import { useState, useEffect, useMemo } from 'react'
import { useCity } from '../context/CityContext'
import GlassCard from '../components/GlassCard'
import { Flag, Newspaper, AlertTriangle, RefreshCw, ExternalLink, MapPin, Map as MapIcon, Image as ImageIcon, Mic } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { fetchCityNews, detectWarning, getRelativeTime } from '../utils/news'
import { useNavigate } from 'react-router-dom'

function NewsTab() {
  const { city } = useCity()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState('All')

  const loadNews = async (force = false) => {
    if (force) setRefreshing(true)
    else setLoading(true)
    setError(false)
    try {
      const data = await fetchCityNews(city, force)
      setArticles(data || [])
    } catch (err) {
      console.error(err)
      setError(true)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadNews()
  }, [city])

  const processedArticles = useMemo(() => {
    return articles.map(a => ({
      ...a,
      warning: detectWarning(a, city)
    }))
  }, [articles, city])

  const filteredArticles = useMemo(() => {
    if (filter === 'All') return processedArticles
    if (filter === 'Warnings only') return processedArticles.filter(a => a.warning)
    return processedArticles // Add more advanced filtering here later if needed
  }, [processedArticles, filter])

  const activeWarnings = processedArticles.filter(a => a.warning)
  const hasSample = processedArticles.some(a => a.isSample)

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1,2,3].map(i => (
          <GlassCard key={i} className="p-4 flex flex-col gap-3 opacity-50 animate-pulse">
            <div className="h-4 bg-gray-400/20 rounded w-3/4"></div>
            <div className="h-3 bg-gray-400/20 rounded w-1/2"></div>
            <div className="h-10 bg-gray-400/20 rounded w-full mt-2"></div>
          </GlassCard>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <GlassCard className="p-8 text-center flex flex-col items-center gap-2 border-red-500/30 border-2">
        <AlertTriangle className="text-red-500 mb-2" size={32} />
        <h3 className="font-bold text-[var(--color-ink)]">Failed to load news</h3>
        <p className="text-sm text-[var(--color-muted)]">Could not fetch updates for {city.name}.</p>
        <button onClick={() => loadNews(true)} className="mt-4 px-4 py-2 glass-sm rounded-lg font-bold text-sm flex items-center gap-2">
          <RefreshCw size={16} /> Try Again
        </button>
      </GlassCard>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Warnings only'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'glass-sm text-[var(--color-ink)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button onClick={() => loadNews(true)} disabled={refreshing} className={`p-2 rounded-full glass-sm ${refreshing ? 'opacity-50' : ''}`}>
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} style={{ color: 'var(--color-ink)' }} />
        </button>
      </div>

      {hasSample && (
        <div className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-3 py-2 rounded-lg font-medium flex items-center gap-2">
          <AlertTriangle size={14} /> Live news unavailable, showing sample stories.
        </div>
      )}

      {activeWarnings.length > 0 && filter === 'All' && (
        <GlassCard className="p-4 border-l-4 border-orange-500 bg-orange-500/5">
          <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold mb-1">
            <AlertTriangle size={18} />
            <span>{activeWarnings.length} active warnings in the last 24h</span>
          </div>
          <p className="text-sm text-[var(--color-muted)] font-medium">
            Stay cautious in affected areas.
          </p>
        </GlassCard>
      )}

      <div className="flex flex-col gap-3">
        {filteredArticles.length === 0 ? (
          <div className="text-center p-8 text-sm text-[var(--color-muted)]">No articles found.</div>
        ) : (
          filteredArticles.map((article, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <GlassCard className="p-4 flex flex-col gap-2">
                <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--color-ink)' }}>{article.title}</h3>
                
                {article.warning && (
                  <div 
                    className="mt-1 p-2 rounded-lg flex flex-col gap-2"
                    style={{ 
                      backgroundColor: article.warning.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : article.warning.severity === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                      borderLeft: `3px solid ${article.warning.severity === 'high' ? '#EF4444' : article.warning.severity === 'medium' ? '#F59E0B' : '#EAB308'}`
                    }}
                    title="Auto-detected from the headline"
                  >
                    <div className="flex items-start gap-1.5">
                      <AlertTriangle size={14} className={`mt-0.5 ${article.warning.severity === 'high' ? 'text-red-500 pulse-severe' : article.warning.severity === 'medium' ? 'text-orange-500' : 'text-yellow-500'}`} />
                      <div className="flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: article.warning.severity === 'high' ? '#EF4444' : article.warning.severity === 'medium' ? '#F59E0B' : '#EAB308' }}>
                          Affected Area: {article.warning.areas.length > 0 ? article.warning.areas.join(', ') : city.name}
                        </span>
                        <div className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>
                          Issue: {article.warning.issue}
                        </div>
                      </div>
                    </div>
                    {article.warning.areas.length > 0 && (
                      <button 
                        onClick={() => navigate(`/map?search=${encodeURIComponent(article.warning.areas[0])}`)} 
                        className="self-start text-[10px] font-bold px-2 py-1 bg-black/5 dark:bg-white/5 rounded flex items-center gap-1 hover:bg-black/10 dark:hover:bg-white/10"
                        style={{ color: 'var(--color-ink)' }}
                      >
                        <MapIcon size={12} /> Show on map
                      </button>
                    )}
                  </div>
                )}
                
                <p className="text-xs opacity-80 line-clamp-2 mt-1" style={{ color: 'var(--color-ink)' }}>{article.summary}</p>
                
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--glass-border)]">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase" style={{ color: 'var(--color-muted)' }}>
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>{getRelativeTime(article.pubDate)}</span>
                  </div>
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                    Read full <ExternalLink size={12} />
                  </a>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

function ReportForm() {
  const [category, setCategory] = useState('Traffic')
  return (
    <GlassCard className="p-4 flex flex-col gap-4 pb-20">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-muted)' }}>Issue Category</label>
        <div className="flex flex-wrap gap-2">
          {['Traffic', 'Road damage', 'Safety', 'Waterlogging', 'Other'].map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                category === c ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'glass-sm text-[var(--color-ink)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-muted)' }}>Location</label>
        <div className="flex gap-2">
          <input type="text" placeholder="Enter area or landmark" className="flex-1 glass-sm rounded-lg px-3 py-2 text-sm outline-none border border-[var(--glass-border)] bg-transparent text-[var(--color-ink)]" />
          <button className="px-3 py-2 glass-sm rounded-lg text-[var(--color-ink)] flex items-center justify-center hover:bg-black/5" title="Use my location">
            <MapPin size={18} />
          </button>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--color-muted)' }}>Description</label>
        <textarea rows="3" placeholder="Describe the issue briefly..." className="w-full glass-sm rounded-lg px-3 py-2 text-sm outline-none border border-[var(--glass-border)] bg-transparent text-[var(--color-ink)] resize-none"></textarea>
      </div>

      <div className="flex gap-2">
        <button disabled className="flex-1 py-2 glass-sm rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 text-[var(--color-muted)] opacity-50 cursor-not-allowed border border-[var(--glass-border)]">
          <ImageIcon size={14} /> Photo (Soon)
        </button>
        <button disabled className="flex-1 py-2 glass-sm rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 text-[var(--color-muted)] opacity-50 cursor-not-allowed border border-[var(--glass-border)]">
          <Mic size={14} /> Voice (Soon)
        </button>
      </div>

      <button className="w-full py-3 rounded-xl font-bold text-sm mt-2 transition-transform hover:scale-[1.02]" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
        Submit Report
      </button>
    </GlassCard>
  )
}

export default function Report() {
  const { city } = useCity()
  const [activeTab, setActiveTab] = useState('News')

  return (
    <div className="flex flex-col gap-4 p-4" style={{ paddingTop: '80px', minHeight: '100dvh' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-xs font-medium uppercase tracking-widest mb-1"
          style={{ color: 'var(--color-accent)', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
          Updates & Community
        </p>
        <h1 className="text-3xl mb-4"
          style={{ fontFamily: 'Fraunces, Georgia, serif', color: 'var(--color-ink)' }}>
          City Pulse
        </h1>
        
        {/* Tabs */}
        <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl w-full mb-4">
          <button 
            onClick={() => setActiveTab('News')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'News' ? 'bg-white dark:bg-[#2A2A2A] shadow text-[var(--color-ink)]' : 'text-[var(--color-muted)]'}`}
          >
            City News
          </button>
          <button 
            onClick={() => setActiveTab('Report')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'Report' ? 'bg-white dark:bg-[#2A2A2A] shadow text-[var(--color-ink)]' : 'text-[var(--color-muted)]'}`}
          >
            Report Issue
          </button>
        </div>
      </motion.div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'News' ? <NewsTab /> : <ReportForm />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
