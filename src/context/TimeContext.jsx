import { createContext, useContext, useState, useEffect } from 'react'

const TimeContext = createContext(null)

export function TimeProvider({ children }) {
  const [isLive, setIsLive] = useState(true)
  const [hour, setHour] = useState(() => new Date().getHours() + new Date().getMinutes() / 60)

  useEffect(() => {
    if (!isLive) return
    const tick = () => {
      const d = new Date()
      setHour(d.getHours() + d.getMinutes() / 60)
    }
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [isLive])

  const setManualHour = (h) => {
    setIsLive(false)
    setHour(h)
  }

  const setLive = () => {
    setIsLive(true)
    const d = new Date()
    setHour(d.getHours() + d.getMinutes() / 60)
  }

  return (
    <TimeContext.Provider value={{ hour, isLive, setManualHour, setLive }}>
      {children}
    </TimeContext.Provider>
  )
}

export function useTime() {
  const ctx = useContext(TimeContext)
  if (!ctx) throw new Error('useTime must be used within a TimeProvider')
  return ctx
}
