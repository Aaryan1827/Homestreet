import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'
import PageTransition from './PageTransition'
import Home from '../pages/Home'
import MapPage from '../pages/MapPage'
import Compare from '../pages/Compare'
import Report from '../pages/Report'
import Assistant from '../pages/Assistant'

export default function AppShell() {
  const location = useLocation()

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{ backgroundColor: 'var(--color-bg)', transition: 'background-color var(--theme-transition)' }}
    >
      {/* Fixed header — floats above everything */}
      <Header />

      {/* Body layout — no top padding on Home because hero goes full-bleed under header */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop floating sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main
          id="main-content"
          className="flex-1 flex flex-col min-h-0 overflow-y-auto"
          style={{ paddingBottom: '100px' }} /* space for floating bottom nav on mobile */
        >
          {/* Center on wide screens */}
          <div className="lg:max-w-3xl lg:mx-auto lg:w-full flex flex-col flex-1">
            <PageTransition>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/report" element={<Report />} />
                <Route path="/assistant" element={<Assistant />} />
              </Routes>
            </PageTransition>
          </div>
        </main>
      </div>

      {/* Mobile floating glass bottom nav */}
      <BottomNav />
    </div>
  )
}
