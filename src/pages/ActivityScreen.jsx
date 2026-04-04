import { MapPin, Heart, UserPlus, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ActivityScreen.css';

function timeAgo(dateStr) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const ICON_MAP = {
  drop: MapPin,
  collect: Package,
  like: Heart,
  friend: UserPlus,
};

const COLOR_MAP = {
  drop: '#6C5CE7',
  collect: '#00b894',
  like: '#e17055',
  friend: '#0984e3',
};

const DEMO_NOTIFICATIONS = [
  { id: 1, type: 'collect', text: 'Alex Rivera picked up your crumb at 5th & Main', time: new Date(Date.now() - 300000).toISOString() },
  { id: 2, type: 'like', text: 'Jordan Lee reacted to your note', time: new Date(Date.now() - 1200000).toISOString() },
  { id: 3, type: 'friend', text: 'Sam Chen started following you', time: new Date(Date.now() - 3600000).toISOString() },
  { id: 4, type: 'collect', text: 'You picked up a crumb from Taylor Kim!', time: new Date(Date.now() - 7200000).toISOString() },
  { id: 5, type: 'drop', text: 'Morgan Yu dropped a crumb near you', time: new Date(Date.now() - 14400000).toISOString() },
  { id: 6, type: 'like', text: 'Alex Rivera reacted to your photo', time: new Date(Date.now() - 28800000).toISOString() },
];

export default function ActivityScreen() {
  const { notifications } = useApp();
  const allNotifs = [...notifications, ...DEMO_NOTIFICATIONS];

  return (
    <div className="activity-screen">
      <div className="activity-header">
        <h1 className="activity-title">Activity</h1>
      </div>

      <div className="activity-list">
        {allNotifs.map((notif) => {
          const Icon = ICON_MAP[notif.type] || MapPin;
          const color = COLOR_MAP[notif.type] || '#6C5CE7';
          return (
            <div key={notif.id} className="activity-item">
              <div className="activity-icon" style={{ background: `${color}18`, color }}>
                <Icon size={16} />
              </div>
              <div className="activity-body">
                <p className="activity-text">{notif.text}</p>
                <span className="activity-time">{timeAgo(notif.time)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
