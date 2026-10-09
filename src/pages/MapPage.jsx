import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { renderToString } from 'react-dom/server'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Map as MapIcon, List, Crosshair, Utensils, Bed, Landmark, Trees, ShoppingBag } from 'lucide-react'

import { useCity } from '../context/CityContext'
import { useTheme } from '../context/ThemeContext'
import { cityScore, scoreColor, haversineDistance } from '../utils/scoring'
import PlaceSheet from '../components/PlaceSheet'
import PlaceCard from '../components/PlaceCard'

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

// Component to handle map flyTo when active place changes
function MapController({ activePlace, userLoc }) {
  const map = useMap();
  useEffect(() => {
    if (activePlace) {
      map.flyTo([activePlace.lat, activePlace.lng], 16, { duration: 1.5 });
    }
  }, [activePlace, map]);
  
  useEffect(() => {
    if (userLoc && userLoc.fly) {
      map.flyTo([userLoc.lat, userLoc.lng], 15, { duration: 1.5 });
    }
  }, [userLoc, map]);
  return null;
}

const CHIPS = ['All', 'Food', 'Heritage', 'Hotels', 'Attractions', 'Budget', 'Top rated'];

export default function MapPage() {
  const { city } = useCity();
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  
  const [activePlaceId, setActivePlaceId] = useState(searchParams.get('place'));
  const [userLoc, setUserLoc] = useState(null);

  const activePlace = useMemo(() => city.places.find(p => p.id === activePlaceId), [city.places, activePlaceId]);

  // Sync param changes
  useEffect(() => {
    const p = searchParams.get('place');
    if (p !== activePlaceId) {
      setActivePlaceId(p);
    }
  }, [searchParams]);

  const setPlace = (id) => {
    setActivePlaceId(id);
    if (id) setSearchParams({ place: id });
    else setSearchParams({});
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude, fly: true });
        },
        () => alert('Location access denied or unavailable.'),
        { enableHighAccuracy: true }
      );
    }
  };

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

  return (
    <div className="relative w-full h-[calc(100dvh-60px)] lg:h-[100dvh] flex flex-col pt-[60px]">
      
      {/* ── Top UI Overlay ── */}
      <div className="absolute top-[76px] left-0 right-0 z-[1000] px-4 pointer-events-none flex flex-col gap-3">
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
          <MapController activePlace={activePlace} userLoc={userLoc} />
          
          {userLoc && (
            <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon} />
          )}

          {filteredPlaces.map(place => (
            <Marker 
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createCustomIcon(place)}
              eventHandlers={{ click: () => { setPlace(place.id); setViewMode('map'); } }}
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

      {/* ── Floating Controls ── */}
      <div className="absolute right-4 bottom-24 lg:bottom-10 z-[1000] flex flex-col gap-3 pointer-events-auto">
        <button 
          onClick={handleNearMe}
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

      {/* ── Place Detail Sheet ── */}
      <PlaceSheet place={activePlace} onClose={() => setPlace(null)} />

    </div>
  )
}
