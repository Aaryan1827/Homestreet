import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { renderToString } from 'react-dom/server'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Map as MapIcon, List, Crosshair, Utensils, Bed, Landmark, Trees, ShoppingBag, Navigation, Share2, Footprints, Car, AlertTriangle } from 'lucide-react'

import { useCity } from '../context/CityContext'
import { useTheme } from '../context/ThemeContext'
import { useTime } from '../context/TimeContext'
import { cityScore, scoreColor, haversineDistance } from '../utils/scoring'
import { activeIncidents } from '../utils/safety'
import { fetchRoutes } from '../utils/routing'
import PlaceSheet from '../components/PlaceSheet'
import PlaceCard from '../components/PlaceCard'
import TimeSlider from '../components/TimeSlider'
import GlassCard from '../components/GlassCard'

// Define marker icons mapped by category
const CAT_ICONS = {
  food: Utensils,
  hotels: Bed,
  heritage: Landmark,
  attractions: Trees,
  market: ShoppingBag
}

const createCustomIcon = (place) => {
  const score = cityScore(place);
  const color = score >= 75 ? '#3F9D6B' : score >= 50 ? '#E2A33B' : '#D6453D';
  const cat = place.subcategory === 'market' ? 'market' : place.category;
  const IconComponent = CAT_ICONS[cat] || Landmark;
  
  const html = renderToString(
    <div style={{
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 0 0 2px ${color}, 0 4px 12px rgba(0,0,0,0.2)`,
      color: '#3B2A20',
      transform: 'scale(0.8)', // animated to 1 via CSS class later
    }}>
      <IconComponent size={18} strokeWidth={2.5} />
    </div>
  );

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker', // we'll add a pop-in animation in index.css
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

const userIcon = L.divIcon({
  html: `<div style="width: 20px; height: 20px; background-color: #3B82F6; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4); animation: pulse 2s infinite;"></div>`,
  className: 'user-location-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const createIncidentIcon = (incident) => {
  const isSevere = incident.severity === 3;
  const color = isSevere ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)';
  const pulseClass = isSevere ? 'pulse-severe' : '';
  // size scales slightly with reports: base 24px + 2px per report (max 40)
  const size = Math.min(24 + (incident.reports * 2), 40);
  
  const html = `
    <div class="${pulseClass}" style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      border-radius: 50%;
      box-shadow: 0 0 12px ${color};
      border: 2px solid white;
      transition: all 0.3s ease;
    "></div>
  `;
  return L.divIcon({
    html,
    className: 'incident-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  })
}

const flipCoords = (coords) => coords.map(c => [c[1], c[0]]);

// Component to handle map flyTo when active place changes
function MapController({ activePlace, userLoc, routeData, directionsMode }) {
  const map = useMap();
  useEffect(() => {
    if (activePlace) {
      map.flyTo([activePlace.lat, activePlace.lng], 16, { duration: 1.5 });
    }
  }, [activePlace, map]);
  
  useEffect(() => {
    if (userLoc && userLoc.fly) {
      map.flyTo([userLoc.lat, userLoc.lng], 15, { duration: 1.5 });
      userLoc.fly = false;
    }
  }, [userLoc, map]);

  // Fit bounds to route
  useEffect(() => {
    if (directionsMode && routeData?.fastest?.geometry?.coordinates) {
      const bounds = L.latLngBounds(flipCoords(routeData.fastest.geometry.coordinates));
      map.fitBounds(bounds, { padding: [50, 50], duration: 1 });
    }
  }, [routeData, directionsMode, map]);

  return null;
}

const CHIPS = ['All', 'Food', 'Heritage', 'Hotels', 'Attractions', 'Budget', 'Top rated'];

export default function MapPage() {
  const { city } = useCity();
  const { theme } = useTheme();
  const { hour } = useTime();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [showSafety, setShowSafety] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  
  const [activePlaceId, setActivePlaceId] = useState(searchParams.get('place'));
  const [activeIncident, setActiveIncident] = useState(null);
  const [userLoc, setUserLoc] = useState(null);

  // Directions State
  const [directionsMode, setDirectionsMode] = useState(searchParams.get('dir') || null); // 'foot' | 'driving' | null
  const [routeStartId, setRouteStartId] = useState(searchParams.get('start') || null);
  const [routeEndId, setRouteEndId] = useState(searchParams.get('end') || null);
  const [routeData, setRouteData] = useState(null);
  const [isFetchingRoute, setIsFetchingRoute] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('fastest'); // 'fastest' | 'safer'

  const activePlace = useMemo(() => city.places.find(p => p.id === activePlaceId), [city.places, activePlaceId]);

  // Sync param changes
  useEffect(() => {
    const p = searchParams.get('place');
    if (p !== activePlaceId) {
      setActivePlaceId(p);
    }
  }, [searchParams]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (directionsMode) {
      newParams.set('dir', directionsMode);
      if (routeStartId) newParams.set('start', routeStartId); else newParams.delete('start');
      if (routeEndId) newParams.set('end', routeEndId); else newParams.delete('end');
      newParams.delete('place');
    } else {
      newParams.delete('dir');
      newParams.delete('start');
      newParams.delete('end');
    }
    setSearchParams(newParams);
  }, [directionsMode, routeStartId, routeEndId]);

  const setPlace = (id) => {
    setActivePlaceId(id);
    if (id) setSearchParams({ place: id });
    else setSearchParams({});
  };

  const handleNearMe = (setStart = false) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude, fly: true });
          if (setStart) setRouteStartId('near_me');
        },
        () => alert('Location access denied or unavailable.'),
        { enableHighAccuracy: true }
      );
    }
  };

  const startWalkHome = () => {
    setDirectionsMode('foot');
    if (!userLoc) handleNearMe(true);
    else setRouteStartId('near_me');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Share link copied!');
  };

  // Fetch Routes
  useEffect(() => {
    if (!directionsMode || !routeStartId || !routeEndId) {
      setRouteData(null);
      return;
    }
    
    const startObj = routeStartId === 'near_me' 
      ? (userLoc ? { lat: userLoc.lat, lng: userLoc.lng, name: 'Near Me' } : null) 
      : city.places.find(p => p.id === routeStartId);
    
    const endObj = city.places.find(p => p.id === routeEndId);
    
    if (startObj && endObj) {
      setIsFetchingRoute(true);
      fetchRoutes(startObj, endObj, directionsMode, city.incidents, hour).then(data => {
        setRouteData(data);
        if (data.safer) setSelectedRoute('safer');
        else setSelectedRoute('fastest');
        setIsFetchingRoute(false);
      });
    }
  }, [directionsMode, routeStartId, routeEndId, userLoc, hour, city.incidents]);

  // Filter and process places
  const filteredPlaces = useMemo(() => {
    let list = city.places;
    
    // Chips filter
    if (activeFilter !== 'All') {
      if (activeFilter === 'Budget') list = list.filter(p => p.priceLevel === 1);
      else if (activeFilter === 'Top rated') list = list.filter(p => cityScore(p) >= 80);
      else list = list.filter(p => p.category === activeFilter.toLowerCase());
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.area.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Add distance if userLoc exists
    if (userLoc) {
      list = list.map(p => ({
        ...p,
        distance: haversineDistance(userLoc.lat, userLoc.lng, p.lat, p.lng)
      }));
    }

    return list.sort((a, b) => cityScore(b) - cityScore(a));
  }, [city.places, activeFilter, searchQuery, userLoc]);

  const currentIncidents = useMemo(() => {
    if (!showSafety || !city.incidents) return [];
    return activeIncidents(city.incidents, hour);
  }, [showSafety, city.incidents, hour]);

  return (
    <div className="relative w-full h-[calc(100dvh-60px)] lg:h-[100dvh] flex flex-col pt-[60px]">
      
      {/* ── Top UI Overlay ── */}
      <div className="absolute top-[76px] left-0 right-0 z-[1000] px-4 pointer-events-none flex flex-col gap-3">
        
        {directionsMode ? (
          <GlassCard className="p-3 flex flex-col gap-3 pointer-events-auto shadow-lg relative overflow-hidden">
            {isFetchingRoute && <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500/20"><div className="h-full bg-blue-500 animate-pulse w-1/2"></div></div>}
            <div className="flex items-center gap-2">
               <select value={routeStartId || ''} onChange={e => setRouteStartId(e.target.value)} className="glass-sm px-2 py-2 flex-1 text-sm rounded-md bg-transparent outline-none border border-[var(--glass-border)] text-[var(--color-ink)]">
                  <option value="" disabled className="text-black">Select Start...</option>
                  <option value="near_me" className="text-black">📍 Near Me</option>
                  {city.places.map(p => <option key={p.id} value={p.id} className="text-black">{p.name}</option>)}
               </select>
               <select value={routeEndId || ''} onChange={e => setRouteEndId(e.target.value)} className="glass-sm px-2 py-2 flex-1 text-sm rounded-md bg-transparent outline-none border border-[var(--glass-border)] text-[var(--color-ink)]">
                  <option value="" disabled className="text-black">Select Destination...</option>
                  {city.places.map(p => <option key={p.id} value={p.id} className="text-black">{p.name}</option>)}
               </select>
            </div>
            <div className="flex items-center justify-between px-1">
               <div className="flex gap-2">
                 <button onClick={() => setDirectionsMode('foot')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${directionsMode === 'foot' ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'glass-sm text-[var(--color-ink)]'}`}>
                   <Footprints size={14} /> Walking
                 </button>
                 <button onClick={() => setDirectionsMode('driving')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${directionsMode === 'driving' ? 'bg-[var(--color-ink)] text-[var(--color-bg)]' : 'glass-sm text-[var(--color-ink)]'}`}>
                   <Car size={14} /> Driving
                 </button>
               </div>
               <button onClick={() => setDirectionsMode(null)} className="text-xs text-red-500 hover:text-red-600 font-bold px-2 py-1 uppercase tracking-wider">Close</button>
            </div>
          </GlassCard>
        ) : (
          <>
            {/* Search Bar */}
            <div className="glass rounded-2xl flex items-center px-4 py-3 pointer-events-auto shadow-lg">
              <Search size={18} style={{ color: 'var(--color-muted)' }} />
              <input 
                type="text" 
                placeholder="Search places, areas, tags..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none ml-3 text-sm font-medium"
                style={{ color: 'var(--color-ink)', fontFamily: 'DM Sans, system-ui, sans-serif' }}
              />
            </div>

            {/* Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x-mandatory pointer-events-auto no-scrollbar">
              <button
                onClick={() => setShowSafety(s => !s)}
                className="snap-start shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5"
                style={{
                  backgroundColor: showSafety ? '#EF4444' : 'var(--glass-bg)',
                  color: showSafety ? '#fff' : 'var(--color-ink)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${showSafety ? 'transparent' : 'var(--glass-border)'}`,
                  boxShadow: showSafety ? '0 0 12px rgba(239, 68, 68, 0.5)' : 'var(--glass-shadow)',
                }}
              >
                Safety {showSafety && 'On'}
              </button>
              <div className="w-[1px] h-6 bg-[var(--glass-border)] mx-1 self-center" />
              {CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => setActiveFilter(chip)}
                  className="snap-start shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeFilter === chip ? 'var(--color-primary)' : 'var(--glass-bg)',
                    color: activeFilter === chip ? '#fff' : 'var(--color-ink)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${activeFilter === chip ? 'transparent' : 'var(--glass-border)'}`,
                    boxShadow: activeFilter === chip ? 'var(--glow-primary)' : 'var(--glass-shadow)',
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Map Container ── */}
      <div className="flex-1 w-full relative z-0">
        <MapContainer 
          center={city.center} 
          zoom={city.zoom} 
          zoomControl={false}
          className={`w-full h-full ${theme === 'night' ? 'map-night' : 'map-day'}`}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController activePlace={activePlace} userLoc={userLoc} routeData={routeData} directionsMode={directionsMode} />
          
          {/* Polylines for Directions */}
          {directionsMode && routeData?.fastest && (
            <>
              {/* Draw Fastest Route */}
              <Polyline 
                positions={flipCoords(routeData.fastest.geometry.coordinates)} 
                pathOptions={{ color: '#F97316', weight: selectedRoute === 'fastest' ? 6 : 4, dashArray: '8, 8', opacity: selectedRoute === 'fastest' ? 1 : 0.4 }} 
              />
              {/* Draw Safer Route if it exists */}
              {routeData.safer && (
                <Polyline 
                  positions={flipCoords(routeData.safer.geometry.coordinates)} 
                  pathOptions={{ color: '#10B981', weight: selectedRoute === 'safer' ? 6 : 4, opacity: selectedRoute === 'safer' ? 1 : 0.4 }} 
                />
              )}
            </>
          )}
          
          {userLoc && (
            <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon} />
          )}

          {filteredPlaces.map(place => (
            <Marker 
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createCustomIcon(place)}
              eventHandlers={{ click: () => { setActiveIncident(null); setPlace(place.id); setViewMode('map'); } }}
            />
          ))}

          {currentIncidents.map(inc => (
            <Marker
              key={inc.id}
              position={[inc.lat, inc.lng]}
              icon={createIncidentIcon(inc)}
              eventHandlers={{ click: () => { setPlace(null); setActiveIncident(inc); } }}
            />
          ))}
        </MapContainer>
      </div>

      {/* ── List View Overlay ── */}
      <AnimatePresence>
        {viewMode === 'list' && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-[500] bg-[var(--color-bg)] pt-[150px] pb-[100px] px-4 overflow-y-auto"
          >
            <div className="lg:max-w-xl mx-auto flex flex-col gap-3 pb-8">
              {filteredPlaces.length === 0 ? (
                <div className="text-center mt-10 text-sm" style={{ color: 'var(--color-muted)' }}>
                  No places found matching your filters.
                </div>
              ) : (
                filteredPlaces.map(p => (
                  <PlaceCard key={p.id} place={p} onClick={() => { setPlace(p.id); setViewMode('map'); }} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Controls and Widgets Overlay ── */}
      <div className="absolute left-0 right-0 bottom-24 lg:bottom-10 z-[1000] pointer-events-none flex flex-col justify-end gap-3 px-4">
        
        {directionsMode && routeData && (
          <GlassCard className="p-4 pointer-events-auto flex flex-col gap-3 shadow-2xl mx-auto w-full max-w-sm">
            {!routeData.success && (
              <div className="text-xs font-semibold text-orange-500 flex items-center gap-1.5 mb-1">
                <AlertTriangle size={14} /> Routing service failed. Showing straight line.
              </div>
            )}
            
            <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setSelectedRoute('fastest')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${selectedRoute === 'fastest' ? 'bg-white dark:bg-[#2A2A2A] shadow text-orange-600 dark:text-orange-400' : 'text-[var(--color-muted)]'}`}
              >
                Fastest
              </button>
              {routeData.safer ? (
                <button 
                  onClick={() => setSelectedRoute('safer')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${selectedRoute === 'safer' ? 'bg-white dark:bg-[#2A2A2A] shadow text-green-600 dark:text-green-400' : 'text-[var(--color-muted)]'}`}
                >
                  Safer
                </button>
              ) : (
                <div className="flex-1 py-1.5 text-[10px] text-center text-[var(--color-muted)] self-center font-medium opacity-60">
                  No safer alternative
                </div>
              )}
            </div>

            {(() => {
              const activeR = routeData[selectedRoute];
              if (!activeR) return null;
              const mins = Math.round(activeR.duration / 60);
              const kms = (activeR.distance / 1000).toFixed(1);
              
              let explanation = '';
              if (selectedRoute === 'safer' && routeData.safer) {
                const extraTime = Math.round((routeData.safer.duration - routeData.fastest.duration) / 60);
                const avoided = routeData.fastest.hotspots.length - routeData.safer.hotspots.length;
                explanation = `Safer route is ${extraTime} min longer and avoids ${Math.max(0, avoided)} reported hotspot(s).`;
              } else if (selectedRoute === 'fastest') {
                explanation = `Fastest route. Crosses near ${activeR.hotspots.length} reported incident(s).`;
              }

              return (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>{mins} <span className="text-sm font-medium opacity-70">min</span></div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-muted)' }}>{kms} km</div>
                  </div>
                  <div className="text-xs font-medium" style={{ color: selectedRoute === 'safer' ? '#10B981' : '#F97316' }}>
                    {explanation}
                  </div>
                  
                  {/* Action buttons on route card */}
                  <div className="flex gap-2 mt-2">
                     <button onClick={copyShareLink} className="flex-1 py-2 glass-sm rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 text-[var(--color-ink)] hover:bg-black/5">
                       <Share2 size={14} /> Share Link
                     </button>
                  </div>
                </div>
              );
            })()}
          </GlassCard>
        )}

        <div className="flex items-end justify-between pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto lg:w-72">
            <TimeSlider />
            <AnimatePresence>
              {showSafety && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="glass-sm px-3 py-2 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-1.5 font-medium text-[var(--color-ink)]"><div className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Caution</div>
                  <div className="flex items-center gap-1.5 font-medium text-[var(--color-ink)]"><div className="w-2.5 h-2.5 rounded-full bg-red-500 pulse-severe" /> Avoid</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-3 pointer-events-auto items-end">
            {!directionsMode && (
              <button 
                onClick={startWalkHome}
                className="px-4 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform gap-2 font-bold text-sm"
                style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
              >
                <Footprints size={18} /> Walk me home
              </button>
            )}
            <button 
              onClick={() => handleNearMe()}
              className="w-12 h-12 rounded-full glass flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              style={{ color: 'var(--color-ink)' }}
            >
              <Crosshair size={20} />
            </button>
            <button 
              onClick={() => setViewMode(v => v === 'map' ? 'list' : 'map')}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              style={{ backgroundColor: 'var(--color-ink)', color: 'var(--color-bg)' }}
            >
              {viewMode === 'map' ? <List size={20} /> : <MapIcon size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Place Detail Sheet ── */}
      <PlaceSheet place={activePlace} onClose={() => setPlace(null)} />

      {/* ── Incident Popup ── */}
      <AnimatePresence>
        {activeIncident && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute z-[1050] bottom-[110px] left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-96 pointer-events-auto"
          >
            <GlassCard className="p-4 flex flex-col gap-2 relative shadow-2xl border-t-2" style={{ borderTopColor: activeIncident.severity === 3 ? '#EF4444' : '#F59E0B' }}>
              <button onClick={() => setActiveIncident(null)} className="absolute top-2 right-2 w-8 h-8 rounded-full glass-sm flex items-center justify-center text-[var(--color-ink)]">
                ✕
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-widest" style={{ color: activeIncident.severity === 3 ? '#EF4444' : '#F59E0B' }}>
                  {activeIncident.type.replace('-', ' ')}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full glass-sm text-[var(--color-muted)]">
                  {activeIncident.hourRange[0]}:00 - {activeIncident.hourRange[1]}:00
                </span>
              </div>
              <p className="text-sm font-medium text-[var(--color-ink)]">
                {activeIncident.description}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-[var(--color-muted)] font-medium group relative cursor-help">
                <span className="bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">{activeIncident.reports} community reports (demo)</span>
                {activeIncident.reports >= 5 && (
                  <span className="text-green-600 dark:text-green-400 font-bold px-2 py-1 bg-green-500/10 rounded-md">✓ Verified</span>
                )}
                {activeIncident.reports >= 5 && (
                  <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block bg-black text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                    Incidents with 5+ reports get a verified badge.
                  </div>
                )}
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
