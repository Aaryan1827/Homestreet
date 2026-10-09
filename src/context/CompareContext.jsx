import { createContext, useContext, useState, useEffect } from 'react'

const CompareContext = createContext()

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const stored = sessionStorage.getItem('homestreet_compare_items')
      return stored ? JSON.parse(stored) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    sessionStorage.setItem('homestreet_compare_items', JSON.stringify(compareItems))
  }, [compareItems])

  const addCompareItem = (item) => {
    setCompareItems(prev => {
      if (prev.find(p => p.id === item.id)) return prev; // Already exists
      if (prev.length >= 3) {
        alert("You can only compare up to 3 items.")
        return prev;
      }
      return [...prev, { id: item.id, type: item.name && item.category ? 'place' : 'area' }]
    })
  }

  const removeCompareItem = (id) => {
    setCompareItems(prev => prev.filter(p => p.id !== id))
  }

  const clearCompare = () => {
    setCompareItems([])
  }

  return (
    <CompareContext.Provider value={{ compareItems, addCompareItem, removeCompareItem, clearCompare }}>
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = useContext(CompareContext)
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider')
  }
  return context
}
