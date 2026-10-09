import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'motion/react'
import { Home, Map, GitCompare, Flag, Bot } from 'lucide-react'
import { useState } from 'react'

const NAV_ITEMS = [
  { id: 'home', to: '/', label: 'Home', Icon: Home, exact: true },
  { id: 'map', to: '/map', label: 'Map', Icon: Map },
  { id: 'compare', to: '/compare', label: 'Compare', Icon: GitCompare },
  { id: 'report', to: '/report', label: 'Report', Icon: Flag },
  { id: 'assistant', to: '/assistant', label: 'Assistant', Icon: Bot },
]

function NavItem({ item }) {
  const { Icon, label, id, to, exact } = item
  const [tapped, setTapped] = useState(false)

  return (
    <NavLink
      to={to}
      end={exact}
      id={`nav-${id}`}
      className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-2xl flex-1"
      style={({ isActive }) => ({
        color: isActive ? 'var(--color-primary)' : 'var(--color-muted)',
        minHeight: '44px',
      })}
      aria-label={label}
      onPointerDown={() => setTapped(true)}
      onPointerUp={() => setTimeout(() => setTapped(false), 300)}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="nav-pill"
              className="absolute inset-0 rounded-2xl"
              style={{
                backgroundColor: 'var(--color-surface-soft)',
                boxShadow: 'var(--glow-nav-pill)',
                opacity: 0.85,
              }}
              transition={{ type: 'spring', stiffness: 480, damping: 36 }}
            />
          )}

          <motion.span
            className="relative z-10"
            animate={tapped ? { y: [-3, 3, -1, 0] } : { y: 0 }}
            transition={{ duration: 0.32 }}
          >
            <Icon size={19} strokeWidth={isActive ? 2.3 : 1.7} />
          </motion.span>

          <span
            className="relative z-10 text-xs font-medium"
            style={{ fontFamily: 'DM Sans, system-ui, sans-serif', fontSize: '10px' }}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  )
}

export default function BottomNav() {
  return (
    <nav
      id="bottom-nav"
      className="lg:hidden glass fixed z-40"
      style={{
        bottom: 'max(16px, env(safe-area-inset-bottom))',
        left: '16px',
        right: '16px',
        borderRadius: '28px',
        padding: '8px 4px',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
      }}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.id} item={item} />
      ))}
    </nav>
  )
}
