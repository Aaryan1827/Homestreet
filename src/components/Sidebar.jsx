import { NavLink } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home, Map, GitCompare, Flag, Bot } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'home', to: '/', label: 'Home', Icon: Home, exact: true },
  { id: 'map', to: '/map', label: 'Map', Icon: Map },
  { id: 'compare', to: '/compare', label: 'Compare', Icon: GitCompare },
  { id: 'report', to: '/report', label: 'Report', Icon: Flag },
  { id: 'assistant', to: '/assistant', label: 'Assistant', Icon: Bot },
]

export default function Sidebar() {
  return (
    <aside
      id="sidebar"
      className="hidden lg:flex flex-col shrink-0"
      style={{
        width: '240px',
        position: 'sticky',
        top: '76px', // below fixed header
        height: 'calc(100dvh - 92px)',
        padding: '0 12px 12px',
        alignSelf: 'flex-start',
      }}
      aria-label="Sidebar navigation"
    >
      {/* Floating glass panel */}
      <div
        className="glass flex flex-col flex-1 overflow-y-auto"
        style={{ borderRadius: '24px', padding: '8px' }}
      >
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, to, label, Icon, exact }) => (
            <NavLink
              key={id}
              to={to}
              end={exact}
              id={`sidebar-nav-${id}`}
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-primary)' : 'var(--color-ink)',
                fontWeight: isActive ? 600 : 400,
                fontFamily: 'DM Sans, system-ui, sans-serif',
                fontSize: '14px',
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        backgroundColor: 'var(--color-surface-soft)',
                        boxShadow: 'var(--glow-nav-pill)',
                        opacity: 0.85,
                      }}
                      transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                    />
                  )}
                  <span className="relative z-10">
                    <Icon size={18} strokeWidth={isActive ? 2.2 : 1.7} />
                  </span>
                  <span className="relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}
