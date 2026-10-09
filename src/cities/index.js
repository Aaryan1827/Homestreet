import pune from './pune'
import mumbai from './mumbai'

/** Registry of all cities. To add a city, create a new file and import it here. */
export const cities = [pune, mumbai]

/** Default city id */
export const DEFAULT_CITY_ID = 'pune'

/**
 * Get a city config by id.
 * @param {string} id
 * @returns {import('./pune').default | undefined}
 */
export function getCityById(id) {
  return cities.find((c) => c.id === id)
}
