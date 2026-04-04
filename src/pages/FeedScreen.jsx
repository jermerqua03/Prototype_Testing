import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, StickyNote, Image, Video, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CrumbCard from '../components/CrumbCard';
import './FeedScreen.css';

const FILTERS = [
  { key: 'all', label: 'All', icon: Compass },
  { key: 'note', label: 'Notes', icon: StickyNote },
  { key: 'image', label: 'Photos', icon: Image },
  { key: 'video', label: 'Videos', icon: Video },
];

export default function FeedScreen() {
  const { nearbyCrumbs } = useApp();
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filtered = filter === 'all'
    ? nearbyCrumbs
    : nearbyCrumbs.filter((c) => c.type === filter);

  return (
    <div className="feed-screen">
      <div className="feed-header">
        <h1 className="feed-title">Nearby</h1>
        <p className="feed-subtitle">{nearbyCrumbs.length} crumbs within range</p>
      </div>

      <div className="feed-filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`feed-filter ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            <f.icon size={14} />
            {f.label}
          </button>
        ))}
      </div>

      <div className="feed-list">
        {filtered.length === 0 ? (
          <div className="feed-empty">
            <Compass size={40} strokeWidth={1.2} />
            <p>No crumbs nearby</p>
            <span>Explore to find crumbs dropped by others</span>
          </div>
        ) : (
          filtered.map((crumb) => (
            <CrumbCard
              key={crumb.id}
              crumb={crumb}
              onTap={() => navigate(`/crumb/${crumb.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
}
