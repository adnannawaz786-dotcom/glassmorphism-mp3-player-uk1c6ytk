// Sample audio tracks data for demo
export const sampleTracks = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Synthwave Collective",
    album: "Neon Nights",
    duration: "3:42",
    durationSeconds: 222,
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with actual audio files
    coverArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center",
    genre: "Synthwave",
    year: 2023
  },
  {
    id: 2,
    title: "Digital Horizon",
    artist: "Cyber Echo",
    album: "Future Pulse",
    duration: "4:15",
    durationSeconds: 255,
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with actual audio files
    coverArt: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop&crop=center",
    genre: "Electronic",
    year: 2023
  },
  {
    id: 3,
    title: "Neon Lights",
    artist: "RetroWave",
    album: "City Nights",
    duration: "3:28",
    durationSeconds: 208,
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with actual audio files
    coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop&crop=center",
    genre: "Synthpop",
    year: 2023
  },
  {
    id: 4,
    title: "Electric Dreams",
    artist: "Neon Pulse",
    album: "Synthetic Love",
    duration: "5:03",
    durationSeconds: 303,
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with actual audio files
    coverArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center",
    genre: "Synthwave",
    year: 2023
  },
  {
    id: 5,
    title: "Cosmic Journey",
    artist: "Space Synth",
    album: "Galactic Waves",
    duration: "6:21",
    durationSeconds: 381,
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with actual audio files
    coverArt: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=300&fit=crop&crop=center",
    genre: "Ambient",
    year: 2023
  },
  {
    id: 6,
    title: "Dark Matter",
    artist: "Void Echoes",
    album: "Deep Space",
    duration: "4:44",
    durationSeconds: 284,
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - replace with actual audio files
    coverArt: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center",
    genre: "Dark Ambient",
    year: 2023
  }
];

// Default track for initial load
export const defaultTrack = sampleTracks[0];

// Utility function to format duration from seconds
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Utility function to get track by ID
export const getTrackById = (id) => {
  return sampleTracks.find(track => track.id === id);
};

// Utility function to get next track
export const getNextTrack = (currentId) => {
  const currentIndex = sampleTracks.findIndex(track => track.id === currentId);
  const nextIndex = (currentIndex + 1) % sampleTracks.length;
  return sampleTracks[nextIndex];
};

// Utility function to get previous track
export const getPreviousTrack = (currentId) => {
  const currentIndex = sampleTracks.findIndex(track => track.id === currentId);
  const previousIndex = currentIndex === 0 ? sampleTracks.length - 1 : currentIndex - 1;
  return sampleTracks[previousIndex];
};

// Shuffle function for random playback
export const shuffleTracks = (tracks = sampleTracks) => {
  const shuffled = [...tracks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
