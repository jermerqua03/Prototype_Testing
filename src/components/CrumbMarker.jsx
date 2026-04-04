import { MapPin, StickyNote, Image, Video } from 'lucide-react';
import './CrumbMarker.css';

const TYPE_COLORS = { note: '#6C5CE7', image: '#00b894', video: '#e17055' };
const TYPE_ICONS = { note: StickyNote, image: Image, video: Video };

export default function CrumbMarker({ crumb, onClick }) {
  const color = TYPE_COLORS[crumb.type];
  const Icon = TYPE_ICONS[crumb.type];

  return (
    <div className={`crumb-marker ${crumb.collected ? 'collected' : ''}`} onClick={() => onClick?.(crumb)}>
      <div className="crumb-marker-ring" style={{ borderColor: color }}>
        <div className="crumb-marker-inner" style={{ background: color }}>
          <Icon size={14} color="white" />
        </div>
      </div>
      <div className="crumb-marker-pulse" style={{ background: color }} />
    </div>
  );
}
