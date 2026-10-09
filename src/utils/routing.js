import { activeIncidents } from './safety';
import { haversineDistance } from './scoring';

function fetchWithTimeout(url, options = {}, timeout = 8000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ]);
}

export async function fetchRoutes(start, end, mode = 'foot', incidents = [], hour = 12) {
  const osrmMode = mode === 'driving' ? 'driving' : 'foot';
  const url = `https://router.project-osrm.org/route/v1/${osrmMode}/${start.lng},${start.lat};${end.lng},${end.lat}?alternatives=true&overview=full&geometries=geojson`;

  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error('OSRM API failed');
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No routes found');
    }

    const active = activeIncidents(incidents, hour);

    const routesWithRisk = data.routes.map(r => {
      let risk = 0;
      let hotspots = new Set();
      const coords = r.geometry.coordinates;
      // sample every 2nd point to avoid missing short distance incidents
      for (let i = 0; i < coords.length; i += 2) {
        const [lng, lat] = coords[i];
        active.forEach(inc => {
          const dist = haversineDistance(lat, lng, inc.lat, inc.lng);
          if (dist <= 0.15) { // 150m
            if (!hotspots.has(inc.id)) {
              risk += inc.severity;
              hotspots.add(inc.id);
            }
          }
        });
      }
      return {
        ...r,
        risk,
        hotspots: Array.from(hotspots)
      };
    });

    routesWithRisk.sort((a, b) => a.duration - b.duration);
    const fastest = routesWithRisk[0];
    
    // Safer route = lowest risk among alternatives
    const safer = routesWithRisk.reduce((best, current) => {
      if (current.risk < best.risk) return current;
      if (current.risk === best.risk && current.duration < best.duration) return current;
      return best;
    }, fastest);

    return {
      success: true,
      fastest,
      safer: safer.risk < fastest.risk ? safer : null,
      hotspots: Array.from(new Set([...fastest.hotspots, ...(safer && safer.risk < fastest.risk ? safer.hotspots : [])]))
    };

  } catch (error) {
    console.error('Routing failed:', error);
    // Fallback: straight line
    return {
      success: false,
      fastest: {
        geometry: { coordinates: [[start.lng, start.lat], [end.lng, end.lat]] },
        distance: haversineDistance(start.lat, start.lng, end.lat, end.lng) * 1000,
        duration: (haversineDistance(start.lat, start.lng, end.lat, end.lng) * 1000) / (mode === 'driving' ? 10 : 1.4), // roughly 36km/h or 5km/h
        risk: 0,
        hotspots: []
      },
      safer: null,
      hotspots: []
    };
  }
}
