import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Heart, MessageCircle, Share2, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Avatar from '../components/Avatar';
import './CrumbDetail.css';

function timeAgo(dateStr) {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function CrumbDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { crumbs, collectCrumb } = useApp();
  const crumb = crumbs.find((c) => c.id === id);

  if (!crumb) {
    return (
      <div className="detail-not-found">
        <p>Crumb not found</p>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  return (
    <div className="detail-screen">
      <div className="detail-nav">
        <button className="detail-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <span className="detail-nav-title">Crumb</span>
        <button className="detail-share">
          <Share2 size={18} />
        </button>
      </div>

      <div className="detail-content">
        <div className="detail-user">
          <Avatar name={crumb.user.name} size={44} />
          <div className="detail-user-info">
            <span className="detail-user-name">{crumb.user.name}</span>
            <span className="detail-user-meta">
              <Clock size={12} /> {timeAgo(crumb.createdAt)} • <MapPin size={12} /> Nearby
            </span>
          </div>
        </div>

        {crumb.content?.imageUrl && (
          <div className="detail-image">
            <img src={crumb.content.imageUrl} alt="" />
          </div>
        )}

        {crumb.content?.text && (
          <p className="detail-text">{crumb.content.text}</p>
        )}

        <div className="detail-location-card">
          <MapPin size={16} />
          <span>{crumb.location.lat.toFixed(4)}, {crumb.location.lng.toFixed(4)}</span>
          <span className="detail-radius">{Math.round(crumb.radius)}m range</span>
        </div>

        <div className="detail-actions">
          <button className="detail-action">
            <Heart size={20} />
            <span>{crumb.reactions}</span>
          </button>
          <button className="detail-action">
            <MessageCircle size={20} />
            <span>{crumb.comments}</span>
          </button>
          <button className="detail-action">
            <Share2 size={20} />
          </button>
        </div>

        {!crumb.collected ? (
          <button className="detail-collect-btn" onClick={() => collectCrumb(crumb.id)}>
            <Package size={18} />
            Pick Up This Crumb
          </button>
        ) : (
          <div className="detail-collected">
            <Package size={18} />
            Collected
          </div>
        )}
      </div>
    </div>
  );
}
