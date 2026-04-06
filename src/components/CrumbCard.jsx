import { StickyNote, Image, Video, Clock, Heart, MessageCircle } from 'lucide-react';
import Avatar from './Avatar';
import './CrumbCard.css';

function timeAgo(dateStr) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TYPE_ICONS = { note: StickyNote, image: Image, video: Video };
const TYPE_COLORS = { note: '#6C5CE7', image: '#00b894', video: '#e17055' };

export default function CrumbCard({ crumb, onTap, compact = false, isOwn = false }) {
  const TypeIcon = TYPE_ICONS[crumb.type];

  return (
    <div className={`crumb-card ${compact ? 'compact' : ''} ${crumb.collected ? 'collected' : ''} ${isOwn ? 'own' : ''}`} onClick={() => onTap?.(crumb)}>
      <div className="crumb-card-header">
        <Avatar name={crumb.user.name} size={compact ? 28 : 36} />
        <div className="crumb-card-meta">
          <span className="crumb-card-name">{crumb.user.name}</span>
          <span className="crumb-card-time">
            <Clock size={11} /> {timeAgo(crumb.createdAt)}
          </span>
        </div>
        <div className="crumb-type-badge" style={{ background: `${TYPE_COLORS[crumb.type]}20`, color: TYPE_COLORS[crumb.type] }}>
          <TypeIcon size={14} />
        </div>
      </div>

      {crumb.content?.imageUrl && !compact && (
        <div className="crumb-card-image">
          <img src={crumb.content.imageUrl} alt="" loading="lazy" />
        </div>
      )}

      {crumb.content?.text && (
        <p className="crumb-card-text">{crumb.content.text}</p>
      )}

      <div className="crumb-card-footer">
        <button className="crumb-stat">
          <Heart size={14} /> <span>{crumb.reactions}</span>
        </button>
        <button className="crumb-stat">
          <MessageCircle size={14} /> <span>{crumb.comments}</span>
        </button>
        {isOwn && <span className="crumb-mine-badge">Mine</span>}
        {crumb.collected && <span className="crumb-collected-badge">Collected</span>}
      </div>
    </div>
  );
}
