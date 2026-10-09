// Helper for calculating distance between two lat/lng coordinates in meters
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180; // φ, λ in radians
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // in metres
}

// Check if an incident is active at the given hour
function isIncidentActive(incident, hour) {
  const [start, end] = incident.hourRange
  if (start < end) {
    return hour >= start && hour <= end
  } else {
    // wraps around midnight
    return hour >= start || hour <= end
  }
}

export function activeIncidents(incidents, hour) {
  if (!incidents) return []
  return incidents.filter(inc => isIncidentActive(inc, hour))
}

export function incidentsNear(place, incidents, hour, radiusMeters = 1000) {
  const active = activeIncidents(incidents, hour)
  return active.filter(inc => {
    const dist = getDistanceMeters(place.lat, place.lng, inc.lat, inc.lng)
    return dist <= radiusMeters
  })
}

// Compute safety score 0-100 and a label for a place right now
export function safetyNow(place, incidents, hour) {
  const baseScore = place.scores?.safety || 80
  
  const nearby = incidentsNear(place, incidents, hour, 1500)
  
  if (nearby.length === 0) {
    return { score: baseScore, label: 'Safe', reason: 'No active incidents reported nearby.' }
  }
  
  let penalty = 0
  let maxSeverity = 0
  
  nearby.forEach(inc => {
    penalty += inc.severity * 5 + (inc.reports >= 5 ? 5 : 0)
    if (inc.severity > maxSeverity) maxSeverity = inc.severity
  })
  
  const finalScore = Math.max(10, baseScore - penalty)
  
  let label = 'Safe'
  if (finalScore < 50 || maxSeverity === 3) label = 'Avoid at this hour'
  else if (finalScore < 75 || maxSeverity === 2) label = 'Be careful'
  
  return { 
    score: finalScore, 
    label, 
    reason: `${nearby.length} incident${nearby.length > 1 ? 's' : ''} reported nearby at this hour.`
  }
}
