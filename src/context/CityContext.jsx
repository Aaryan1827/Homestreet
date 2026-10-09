import { createContext, useContext, useState, useCallback } from 'react'
import { cities, DEFAULT_CITY_ID, getCityById } from '../cities'

const CityContext = createContext(null)

export function CityProvider({ children }) {
  const [cityId, setCityId] = useState(() => {
    return localStorage.getItem('homestreet_city') || DEFAULT_CITY_ID
  })

  const city = getCityById(cityId) || getCityById(DEFAULT_CITY_ID)

  const setCity = useCallback((id) => {
    const found = getCityById(id)
    if (found && !found.comingSoon) {
      setCityId(id)
      localStorage.setItem('homestreet_city', id)
    }
  }, [])

  return (
    <CityContext.Provider value={{ city, cityId, setCity, cities }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  const ctx = useContext(CityContext)
  if (!ctx) throw new Error('useCity must be used within a CityProvider')
  return ctx
}
