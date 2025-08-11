```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'one', 'all'
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Sample playlist - in a real app, this would come from props or context
  const playlist = [
    {
      id: 1,
      title: "Sample Track 1",
      artist: "Unknown Artist",
      duration: "3:45",
      src: "/audio/sample1.mp3" // You'll need to add actual audio files
    },
    {
      id: 2,
      title: "Sample Track 2",
      artist: "Unknown Artist",
      duration: "4:12",
      src: "/audio/sample2.mp3"
    },
    {
      id: 3,
      title: "Sample Track 3",
      artist: "Unknown Artist",
      duration: "2:58",
      src: "/audio/sample3.mp3"
    }
  ];

  const currentSong = playlist[currentTrack];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrack]);

  const handleTrackEnd = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all' || currentTrack < playlist.length - 1) {
      nextTrack();
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (isShuffled) {
      const randomTrack = Math.floor(Math.random() * playlist.length);
      setCurrentTrack(randomTrack);
    } else {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
  };

  const previousTrack = () => {
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.src}
        volume={volume}
        onError={() => console.log('Audio failed to load')}
      />

      {/* Main Player Card */}
      <div className="backdrop-blur-xl bg-black/20 border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
        {/* Album Art / Visualizer */}
        <div className="relative mb-8">
          <div className="w-64 h-64 mx-auto rounded-2xl backdrop-blur-lg bg-gray-900/30 border border-gray-700/50 overflow-hidden">
            <AudioVisualizer 
              audioRef={audioRef} 
              isPlaying={isPlaying}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 truncate">
            {currentSong.title}
          </h2>
          <p className="text-gray-400 text-lg truncate">
            {currentSong.artist}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div 
            ref={progressRef}
            className="relative h-2 bg-gray-800/50 rounded-full cursor-pointer backdrop-blur-sm"
            onClick={handleProgressChange}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-300 to-gray-500 rounded-full transition-all duration-100"
              style={{ width: `${progressPercentage}%` }}
            />
            <div 
              className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-100"
              style={{ left: `calc(${progressPercentage}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <button
            onClick={toggleShuffle}
            className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isShuffled 
                ? 'bg-gray-600/50 text-white' 
                : 'bg-gray-800/30 text-gray-400 hover:text-white hover:bg-gray-700/40'
            }`}
          >
            <Shuffle size={20} />
          </button>

          <button
            onClick={previousTrack}
            className="p-3 rounded-full bg-gray-800/30 text-gray-300 hover:text-white hover:bg-gray-700/40 backdrop-blur-sm transition-all duration-200"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlay}
            className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-gray-600/30"
          >
            {isPlaying ? <Pause size={32} /> : <Play size={32} />}
          </button>

          <button
            onClick={nextTrack}
            className="p-3 rounded-full bg-gray-800/30 text-gray-300 hover:text-white hover:bg-gray-700/40 backdrop-blur-sm transition-all duration-200"
          >
            <SkipForward size={24} />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-3 rounded-full backdrop-blur-sm transition-all duration-200 relative ${
              repeatMode !== 'off' 
                ? 'bg-gray-600/50 text-white' 
                : 'bg-gray-800/30 text-gray-400 hover:text-white hover:bg-gray-700/40'
            }`}
          >
            <Repeat size={20} />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                1
              </span>
            )}
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-4">
          <Volume2 size={20} className="text-gray-400" />
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-800/50 rounded-full appearance-none cursor-pointer backdrop-blur-sm slider"
            />
          </div>
          <span className="text-gray-400 text-sm min-w-[3rem]">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default MusicPlayer;
```