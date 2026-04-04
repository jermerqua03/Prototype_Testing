import { User } from 'lucide-react';
import './Avatar.css';

export default function Avatar({ name, size = 40, color }) {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const colors = ['#6C5CE7', '#00b894', '#e17055', '#fdcb6e', '#0984e3', '#d63031', '#00cec9'];
  const bg = color || colors[name ? name.charCodeAt(0) % colors.length : 0];

  return (
    <div className="avatar" style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}
