/**
 * Audio utility functions and helpers for the glassmorphism MP3 player
 */

// Format time in seconds to MM:SS format
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Convert file size to human readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Extract metadata from audio file
export const extractAudioMetadata = (file) => {
  return new Promise((resolve) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      const metadata = {
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        duration: audio.duration,
        size: file.size,
        type: file.type,
        url: url
      };
      resolve(metadata);
    });
    
    audio.addEventListener('error', () => {
      resolve({
        name: file.name.replace(/\.[^/.]+$/, ''),
        duration: 0,
        size: file.size,
        type: file.type,
        url: url
      });
    });
    
    audio.src = url;
  });
};

// Validate if file is a supported audio format
export const isValidAudioFile = (file) => {
  const supportedTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/m4a'
  ];
  
  return supportedTypes.includes(file.type) || 
         file.name.toLowerCase().match(/\.(mp3|wav|ogg|aac|m4a)$/);
};

// Create audio context for visualization
export const createAudioContext = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

// Setup audio analyzer for visualization
export const setupAudioAnalyzer = (audioElement, audioContext) => {
  const source = audioContext.createMediaElementSource(audioElement);
  const analyzer = audioContext.createAnalyser();
  
  // Configure analyzer
  analyzer.fftSize = 256;
  analyzer.smoothingTimeConstant = 0.8;
  
  // Connect nodes
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);
  
  return analyzer;
};

// Get frequency data for visualization
export const getFrequencyData = (analyzer) => {
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyzer.getByteFrequencyData(dataArray);
  return dataArray;
};

// Normalize frequency data for visualization
export const normalizeFrequencyData = (dataArray, maxBars = 64) => {
  const step = Math.floor(dataArray.length / maxBars);
  const normalizedData = [];
  
  for (let i = 0; i < maxBars; i++) {
    let sum = 0;
    const start = i * step;
    const end = Math.min(start + step, dataArray.length);
    
    for (let j = start; j < end; j++) {
      sum += dataArray[j];
    }
    
    const average = sum / (end - start);
    normalizedData.push(Math.min(average / 255, 1)); // Normalize to 0-1
  }
  
  return normalizedData;
};

// Calculate volume level from frequency data
export const calculateVolumeLevel = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return 0;
  
  const sum = dataArray.reduce((acc, value) => acc + value, 0);
  const average = sum / dataArray.length;
  return Math.min(average / 255, 1); // Normalize to 0-1
};

// Generate playlist from multiple files
export const createPlaylist = async (files) => {
  const validFiles = Array.from(files).filter(isValidAudioFile);
  const playlist = [];
  
  for (let i = 0; i < validFiles.length; i++) {
    const metadata = await extractAudioMetadata(validFiles[i]);
    playlist.push({
      id: `track-${i}-${Date.now()}`,
      ...metadata,
      index: i
    });
  }
  
  return playlist;
};

// Shuffle array (for shuffle mode)
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get next track index based on play mode
export const getNextTrackIndex = (currentIndex, playlistLength, mode = 'normal', shuffledIndices = null) => {
  if (playlistLength === 0) return -1;
  
  switch (mode) {
    case 'repeat-one':
      return currentIndex;
    case 'shuffle':
      if (shuffledIndices && shuffledIndices.length > 0) {
        const currentShuffleIndex = shuffledIndices.indexOf(currentIndex);
        const nextShuffleIndex = (currentShuffleIndex + 1) % shuffledIndices.length;
        return shuffledIndices[nextShuffleIndex];
      }
      return Math.floor(Math.random() * playlistLength);
    case 'repeat-all':
      return (currentIndex + 1) % playlistLength;
    default:
      return currentIndex + 1 < playlistLength ? currentIndex + 1 : -1;
  }
};

// Get previous track index based on play mode
export const getPreviousTrackIndex = (currentIndex, playlistLength, mode = 'normal', shuffledIndices = null) => {
  if (playlistLength === 0) return -1;
  
  switch (mode) {
    case 'repeat-one':
      return currentIndex;
    case 'shuffle':
      if (shuffledIndices && shuffledIndices.length > 0) {
        const currentShuffleIndex = shuffledIndices.indexOf(currentIndex);
        const prevShuffleIndex = currentShuffleIndex - 1 < 0 ? shuffledIndices.length - 1 : currentShuffleIndex - 1;
        return shuffledIndices[prevShuffleIndex];
      }
      return Math.floor(Math.random() * playlistLength);
    case 'repeat-all':
      return currentIndex - 1 < 0 ? playlistLength - 1 : currentIndex - 1;
    default:
      return currentIndex - 1 >= 0 ? currentIndex - 1 : -1;
  }
};

// Cleanup audio URLs to prevent memory leaks
export const cleanupAudioUrls = (playlist) => {
  playlist.forEach(track => {
    if (track.url && track.url.startsWith('blob:')) {
      URL.revokeObjectURL(track.url);
    }
  });
};

// Local storage helpers for player state
export const savePlayerState = (state) => {
  try {
    localStorage.setItem('mp3-player-state', JSON.stringify({
      volume: state.volume,
      mode: state.mode,
      currentTrackIndex: state.currentTrackIndex,
      currentTime: state.currentTime
    }));
  } catch (error) {
    console.warn('Failed to save player state:', error);
  }
};

export const loadPlayerState = () => {
  try {
    const saved = localStorage.getItem('mp3-player-state');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to load player state:', error);
    return null;
  }
};
