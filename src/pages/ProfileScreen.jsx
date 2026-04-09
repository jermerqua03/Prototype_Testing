import { Settings, MapPin, Package, Users, ChevronRight, LogOut, Sun, Moon, Pencil } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import './ProfileScreen.css';

export default function ProfileScreen() {
  const { user, friends, collected, crumbs, theme, toggleTheme } = useApp();
  const droppedCount = crumbs.filter((c) => c.user.id === user.id).length;

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <h1 className="profile-heading">Profile</h1>
        <button className="profile-settings">
          <Settings size={20} />
        </button>
      </div>

      <div className="profile-card">
        <button className="profile-avatar-wrap">
          <Avatar name={user.name} size={64} />
          <span className="profile-avatar-edit">
            <Pencil size={12} />
          </span>
        </button>
        <div className="profile-info">
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-username">{user.username}</p>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <MapPin size={18} />
          <span className="stat-value">{user.stats.dropped + droppedCount}</span>
          <span className="stat-label">Dropped</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <Package size={18} />
          <span className="stat-value">{user.stats.collected + collected.length}</span>
          <span className="stat-label">Collected</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <Users size={18} />
          <span className="stat-value">{friends.length}</span>
          <span className="stat-label">Friends</span>
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-header">Friends</h3>
        <div className="friends-row">
          {friends.slice(0, 5).map((f) => (
            <div key={f.id} className="friend-bubble">
              <div className="friend-avatar-wrap">
                <Avatar name={f.name} size={46} />
                {f.online && <div className="friend-online" />}
              </div>
              <span className="friend-fname">{f.name.split(' ')[0]}</span>
            </div>
          ))}
          <div className="friend-bubble friend-more">
            <div className="friend-more-circle">+{Math.max(0, friends.length - 5)}</div>
            <span className="friend-fname">More</span>
          </div>
        </div>
      </div>

      <div className="profile-menu">
        {[
          { icon: MapPin, label: 'My Crumbs', detail: `${user.stats.dropped + droppedCount}` },
          { icon: Package, label: 'Collected', detail: `${user.stats.collected + collected.length}` },
          { icon: Users, label: 'Manage Friends', detail: `${friends.length}` },
          { icon: Settings, label: 'Settings', detail: '' },
        ].map((item) => (
          <button key={item.label} className="menu-item">
            <item.icon size={18} />
            <span className="menu-label">{item.label}</span>
            {item.detail && <span className="menu-detail">{item.detail}</span>}
            <ChevronRight size={16} className="menu-arrow" />
          </button>
        ))}
        <button className="menu-item" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          <span className="menu-label">Appearance</span>
          <span className="menu-detail">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          <ChevronRight size={16} className="menu-arrow" />
        </button>
      </div>

      <button className="logout-btn">
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
}
