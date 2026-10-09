import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import AppShell from './components/AppShell'

export default function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Skip splash if already seen this session
    return !sessionStorage.getItem('homestreet_splash_seen')
  })

  const handleSplashDone = () => {
    sessionStorage.setItem('homestreet_splash_seen', '1')
    setShowSplash(false)
  }

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      {!showSplash && <AppShell />}
    </>
  )
}
