import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StickyNote, Image, Video, MapPin, Clock, Send, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './DropScreen.css';

const TYPES = [
  { key: 'note', label: 'Note', icon: StickyNote, color: '#6C5CE7' },
  { key: 'image', label: 'Photo', icon: Image, color: '#00b894' },
  { key: 'video', label: 'Video', icon: Video, color: '#e17055' },
];

const EXPIRE_OPTIONS = [
  { label: '1h', value: 1 },
  { label: '6h', value: 6 },
  { label: '24h', value: 24 },
  { label: '7d', value: 168 },
];

export default function DropScreen() {
  const { position, dropCrumb } = useApp();
  const navigate = useNavigate();
  const [type, setType] = useState('note');
  const [text, setText] = useState('');
  const [expiry, setExpiry] = useState(24);
  const [visibility, setVisibility] = useState('friends');
  const [dropped, setDropped] = useState(false);

  const handleDrop = () => {
    if (!text.trim()) return;
    dropCrumb({
      type,
      content: { text: text.trim() },
    });
    setDropped(true);
    setTimeout(() => navigate('/'), 1500);
  };

  if (dropped) {
    return (
      <div className="drop-success">
        <div className="drop-success-icon">
          <MapPin size={32} />
        </div>
        <h2>Crumb Dropped!</h2>
        <p>Friends within range will be able to pick it up</p>
      </div>
    );
  }

  return (
    <div className="drop-screen">
      <div className="drop-header">
        <h1 className="drop-title">Drop a Crumb</h1>
        <button className="drop-close" onClick={() => navigate(-1)}>
          <X size={20} />
        </button>
      </div>

      {/* Type Selector */}
      <div className="drop-types">
        {TYPES.map((t) => (
          <button
            key={t.key}
            className={`drop-type ${type === t.key ? 'active' : ''}`}
            onClick={() => setType(t.key)}
            style={type === t.key ? { borderColor: t.color, background: `${t.color}15` } : {}}
          >
            <t.icon size={20} color={type === t.key ? t.color : undefined} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content Input */}
      <div className="drop-input-wrap">
        <textarea
          className="drop-input"
          placeholder={type === 'note' ? 'Write your note...' : 'Add a caption...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={500}
          rows={4}
        />
        <span className="drop-char-count">{text.length}/500</span>
      </div>

      {type !== 'note' && (
        <button className="drop-media-btn">
          {type === 'image' ? <Image size={20} /> : <Video size={20} />}
          <span>Tap to add {type === 'image' ? 'photo' : 'video'}</span>
        </button>
      )}

      {/* Location indicator */}
      <div className="drop-location">
        <MapPin size={16} />
        <span>
          {position
            ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
            : 'Getting location...'}
        </span>
      </div>

      {/* Expiry */}
      <div className="drop-section">
        <label className="drop-label">
          <Clock size={14} /> Expires in
        </label>
        <div className="drop-options">
          {EXPIRE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`drop-option ${expiry === opt.value ? 'active' : ''}`}
              onClick={() => setExpiry(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visibility */}
      <div className="drop-section">
        <label className="drop-label">Visibility</label>
        <div className="drop-options">
          {['friends', 'everyone'].map((v) => (
            <button
              key={v}
              className={`drop-option ${visibility === v ? 'active' : ''}`}
              onClick={() => setVisibility(v)}
            >
              {v === 'friends' ? 'Friends Only' : 'Everyone'}
            </button>
          ))}
        </div>
      </div>

      {/* Drop Button */}
      <button className="drop-btn" onClick={handleDrop} disabled={!text.trim()}>
        <Send size={18} />
        Drop Crumb
      </button>
    </div>
  );
}
