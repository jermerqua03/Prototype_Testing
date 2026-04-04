import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Map, Compass, Plus, Bell, User } from 'lucide-react';
import MapScreen from './pages/MapScreen';
import FeedScreen from './pages/FeedScreen';
import DropScreen from './pages/DropScreen';
import ActivityScreen from './pages/ActivityScreen';
import ProfileScreen from './pages/ProfileScreen';
import CrumbDetail from './pages/CrumbDetail';
import './App.css';

const NAV_ITEMS = [
  { path: '/', icon: Map, label: 'Map' },
  { path: '/feed', icon: Compass, label: 'Feed' },
  { path: '/drop', icon: Plus, label: 'Drop', isAction: true },
  { path: '/activity', icon: Bell, label: 'Activity' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNav = location.pathname.startsWith('/crumb/');

  return (
    <div className="app-shell">
      <div className="app-content">
        <Routes>
          <Route path="/" element={<MapScreen />} />
          <Route path="/feed" element={<FeedScreen />} />
          <Route path="/drop" element={<DropScreen />} />
          <Route path="/activity" element={<ActivityScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/crumb/:id" element={<CrumbDetail />} />
        </Routes>
      </div>

      {!hideNav && (
        <nav className="bottom-nav">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`nav-item ${active ? 'active' : ''} ${item.isAction ? 'nav-action' : ''}`}
                onClick={() => navigate(item.path)}
              >
                {item.isAction ? (
                  <div className="nav-action-btn">
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                ) : (
                  <>
                    <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                    <span className="nav-label">{item.label}</span>
                  </>
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
