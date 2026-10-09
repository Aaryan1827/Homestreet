/**
 * Calculate the overall city score based on weighted sub-scores.
 * Default weights: safety (30%), cleanliness (20%), affordability (20%), rating (20%), accessibility (10%)
 */
export function cityScore(place, weights = { safety: 0.3, cleanliness: 0.2, affordability: 0.2, rating: 0.2, accessibility: 0.1 }) {
  if (!place || !place.scores) return 0;
  
  const { safety = 0, cleanliness = 0, affordability = 0, rating = 0, accessibility = 0 } = place.scores;
  
  const score = (
    safety * weights.safety +
    cleanliness * weights.cleanliness +
    affordability * weights.affordability +
    rating * weights.rating +
    accessibility * weights.accessibility
  );
  
  return Math.round(score);
}

/**
 * Returns the CSS variable name for the score color.
 * >= 75 is green (safe)
 * 50-74 is amber (caution)
 * < 50 is red (danger)
 */
export function scoreColor(score) {
  if (score >= 75) return 'var(--color-safe)';
  if (score >= 50) return 'var(--color-caution)';
  return 'var(--color-danger)';
}

/**
 * Calculate distance in km between two lat/lng coordinates using the Haversine formula.
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
