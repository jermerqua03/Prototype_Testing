// Mock data for the Crmbz prototype
const MOCK_USER = {
  id: 'user_1',
  name: 'You',
  username: '@you',
  avatar: null,
  bio: 'Dropping crmbz everywhere ✨',
  stats: { dropped: 24, collected: 67, friends: 12 },
};

const MOCK_FRIENDS = [
  { id: 'user_2', name: 'Alex Rivera', username: '@alexr', avatar: null, online: true },
  { id: 'user_3', name: 'Jordan Lee', username: '@jordanl', avatar: null, online: true },
  { id: 'user_4', name: 'Sam Chen', username: '@samc', avatar: null, online: false },
  { id: 'user_5', name: 'Taylor Kim', username: '@taylork', avatar: null, online: false },
  { id: 'user_6', name: 'Morgan Yu', username: '@morgany', avatar: null, online: true },
];

// Generates crumbs near a given lat/lng
export function generateMockCrumbs(lat, lng) {
  const types = ['note', 'image', 'video'];
  const notes = [
    'Best coffee spot in the neighborhood ☕',
    'Check out this street art!',
    'Hidden gem restaurant around the corner 🍜',
    'Great sunset views from here 🌅',
    'Found this cool little bookshop 📚',
    'Free wifi and good vibes here',
    'Amazing tacos at this food truck 🌮',
    'This park is so peaceful 🌳',
    'Live music tonight at 8pm 🎵',
    'Watch out — construction detour ahead ⚠️',
  ];

  const images = [
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
  ];

  const crumbs = [];
  const allUsers = [MOCK_USER, ...MOCK_FRIENDS];
  const timeOffsets = [5, 15, 30, 45, 60, 120, 180, 300, 720, 1440];

  for (let i = 0; i < 12; i++) {
    const type = types[i % 3];
    const user = allUsers[i % allUsers.length];
    const offsetLat = (Math.random() - 0.5) * 0.008;
    const offsetLng = (Math.random() - 0.5) * 0.008;
    const minutesAgo = timeOffsets[i % timeOffsets.length];

    crumbs.push({
      id: `crumb_${i + 1}`,
      type,
      user: { id: user.id, name: user.name, username: user.username, avatar: user.avatar },
      location: { lat: lat + offsetLat, lng: lng + offsetLng },
      radius: 50 + Math.random() * 100,
      content: type === 'note'
        ? { text: notes[i % notes.length] }
        : type === 'image'
        ? { text: notes[(i + 3) % notes.length], imageUrl: images[i % images.length] }
        : { text: 'Check out this cool video!', videoUrl: null, thumbnail: images[(i + 2) % images.length] },
      createdAt: new Date(Date.now() - minutesAgo * 60000).toISOString(),
      expiresAt: new Date(Date.now() + (24 - minutesAgo / 60) * 3600000).toISOString(),
      collected: i < 4,
      reactions: Math.floor(Math.random() * 15),
      comments: Math.floor(Math.random() * 5),
    });
  }

  return crumbs;
}

export { MOCK_USER, MOCK_FRIENDS };
