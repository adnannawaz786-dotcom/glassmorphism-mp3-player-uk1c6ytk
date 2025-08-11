```jsx
import React from 'react';
import { Music } from 'lucide-react';

const TrackInfo = ({ 
  title = "No Track Selected", 
  artist = "Unknown Artist", 
  album = "Unknown Album",
  albumArt = null,
  isPlaying = false 
}) => {
  return (
    <div className="flex items-center space-x-4 p-6">
      {/* Album Art */}
      <div className="relative flex-shrink-0">
        <div className="w-20 h-20 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10 overflow-hidden shadow-lg">
          {albumArt ? (
            <img 
              src={albumArt} 
              alt={`${album} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Subtle glow effect when playing */}
        {isPlaying && (
          <div className="absolute inset-0 rounded-xl bg-white/5 animate-pulse" />
        )}
      </div>

      {/* Track Details */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-semibold text-white truncate mb-1">
          {title}
        </h2>
        <p className="text-gray-300 text-sm truncate mb-1">
          {artist}
        </p>
        <p className="text-gray-400 text-xs truncate">
          {album}
        </p>
      </div>

      {/* Playing indicator */}
      {isPlaying && (
        <div className="flex-shrink-0">
          <div className="flex items-center space-x-1">
            <div className="w-1 h-4 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-6 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackInfo;
```