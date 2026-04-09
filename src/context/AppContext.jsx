import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { generateMockCrumbs, MOCK_USER, MOCK_FRIENDS } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const { position, loading: geoLoading } = useGeolocation();
  const [crumbs, setCrumbs] = useState([]);
  const [user] = useState(MOCK_USER);
  const [friends] = useState(MOCK_FRIENDS);
  const [notifications, setNotifications] = useState([]);
  const [collected, setCollected] = useState([]);
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (position) {
      setCrumbs(generateMockCrumbs(position.lat, position.lng));
    }
  }, [position]);

  const dropCrumb = useCallback((crumbData) => {
    const newCrumb = {
      id: `crumb_${Date.now()}`,
      user: { id: user.id, name: user.name, username: user.username, avatar: user.avatar },
      location: position,
      radius: 75,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 3600000).toISOString(),
      collected: false,
      reactions: 0,
      comments: 0,
      ...crumbData,
    };
    setCrumbs((prev) => [newCrumb, ...prev]);
    setNotifications((prev) => [
      { id: Date.now(), type: 'drop', text: 'Crumb dropped!', time: new Date().toISOString() },
      ...prev,
    ]);
    return newCrumb;
  }, [position, user]);

  const collectCrumb = useCallback((crumbId) => {
    setCrumbs((prev) =>
      prev.map((c) => (c.id === crumbId ? { ...c, collected: true } : c))
    );
    setCollected((prev) => [...prev, crumbId]);
    const crumb = crumbs.find((c) => c.id === crumbId);
    if (crumb) {
      setNotifications((prev) => [
        { id: Date.now(), type: 'collect', text: `Picked up a crumb from ${crumb.user.name}!`, time: new Date().toISOString() },
        ...prev,
      ]);
    }
  }, [crumbs]);

  const nearbyCrumbs = crumbs.reduce((acc, c) => {
    if (!position) return acc;
    const dist = getDistance(position.lat, position.lng, c.location.lat, c.location.lng);
    if (dist <= 500) acc.push({ ...c, distance: dist });
    return acc;
  }, []);

  return (
    <AppContext.Provider
      value={{
        position,
        geoLoading,
        crumbs,
        nearbyCrumbs,
        user,
        friends,
        notifications,
        collected,
        dropCrumb,
        collectCrumb,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
