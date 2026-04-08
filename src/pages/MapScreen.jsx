import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, Layers, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CrumbCard from '../components/CrumbCard';
import './MapScreen.css';

function UserLocationMarker({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], 16, { animate: true });
    }
  }, []);

  if (!position) return null;

  const icon = L.divIcon({
    className: 'user-marker',
    html: `<div class="user-marker-dot"><div class="user-marker-pulse"></div></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <>
      <Circle
        center={[position.lat, position.lng]}
        radius={100}
        pathOptions={{
          color: '#6C5CE7',
          fillColor: '#6C5CE7',
          fillOpacity: 0.08,
          weight: 1,
          opacity: 0.3,
        }}
      />
      <Marker position={[position.lat, position.lng]} icon={icon} />
    </>
  );
}

function CrumbMarkers({ crumbs, onSelect }) {
  return crumbs.map((crumb) => {
    const color = crumb.type === 'note' ? '#6C5CE7' : crumb.type === 'image' ? '#00b894' : '#e17055';
    const icon = L.divIcon({
      className: 'crumb-map-marker',
      html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center">
          <div style="width:32px;height:32px;border-radius:50%;border:2px solid ${color};background:var(--bg-secondary, #1a1a1a);display:flex;align-items:center;justify-content:center;position:relative;z-index:2">
            <div style="width:22px;height:22px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                ${crumb.type === 'note' ? '<path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/>' : crumb.type === 'image' ? '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>' : '<polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/>'}
              </svg>
            </div>
          </div>
          ${!crumb.collected ? `<div style="position:absolute;width:32px;height:32px;border-radius:50%;background:${color};opacity:0.25;animation:ripple 2.5s ease-out infinite;z-index:1"></div>` : ''}
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    return (
      <Marker
        key={crumb.id}
        position={[crumb.location.lat, crumb.location.lng]}
        icon={icon}
        eventHandlers={{ click: () => onSelect(crumb) }}
      />
    );
  });
}

function RecenterButton({ position }) {
  const map = useMap();
  return (
    <button
      className="map-btn recenter-btn"
      onClick={() => position && map.setView([position.lat, position.lng], 16, { animate: true })}
    >
      <Crosshair size={18} />
    </button>
  );
}

export default function MapScreen() {
  const { position, geoLoading, nearbyCrumbs, theme } = useApp();
  const [selectedCrumb, setSelectedCrumb] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const navigate = useNavigate();

  if (geoLoading || !position) {
    return (
      <div className="map-loading">
        <div className="map-loading-spinner" />
        <p>Finding your location...</p>
      </div>
    );
  }

  return (
    <div className="map-screen">
      <div className="map-header">
        <div className="map-brand">
          <h1 className="map-logo">crmbz</h1>
          <p className="map-subtitle">Digital meets physical</p>
        </div>
        <span className="map-count">{nearbyCrumbs.filter((c) => !c.collected).length} nearby</span>
      </div>

      <MapContainer
        center={[position.lat, position.lng]}
        zoom={16}
        className="map-container"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url={`https://{s}.basemaps.cartocdn.com/${theme === 'light' ? 'light_all' : 'dark_all'}/{z}/{x}/{y}{r}.png`}
        />
        <UserLocationMarker position={position} />
        <CrumbMarkers crumbs={nearbyCrumbs} onSelect={(c) => { setSelectedCrumb(c); setSheetOpen(true); }} />
        <RecenterButton position={position} />
      </MapContainer>

      {/* Nearby crumbs bottom sheet */}
      <div className={`map-sheet ${sheetOpen ? 'open' : ''}`}>
        <button className="sheet-handle" onClick={() => setSheetOpen(!sheetOpen)}>
          <div className="sheet-grip" />
          <span>{nearbyCrumbs.length} crumbs nearby</span>
          <ChevronUp size={18} className={sheetOpen ? 'flipped' : ''} />
        </button>
        <div className="sheet-content">
          {selectedCrumb ? (
            <CrumbCard crumb={selectedCrumb} onTap={() => navigate(`/crumb/${selectedCrumb.id}`)} />
          ) : (
            nearbyCrumbs.slice(0, 5).map((c) => (
              <CrumbCard key={c.id} crumb={c} compact onTap={() => { setSelectedCrumb(c); }} />
            ))
          )}
          {selectedCrumb && (
            <button className="sheet-back" onClick={() => setSelectedCrumb(null)}>
              ← Show all nearby
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
