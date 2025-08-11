```jsx
import React from 'react';
import { Play, Pause, Music } from 'lucide-react';

const Playlist = ({ 
  tracks, 
  currentTrack, 
  isPlaying, 
  onTrackSelect,
  className = "" 
}) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
            <Music className="w-5 h-5 text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold text-white">Playlist</h2>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            
            return (
              <div
                key={track.id}
                onClick={() => onTrackSelect(track)}
                className={`
                  group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border
                  ${isCurrentTrack 
                    ? 'bg-white/15 border-white/20 shadow-lg' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                  }
                  backdrop-blur-sm
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Play/Pause Button */}
                  <div className="relative flex-shrink-0">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${isCurrentTrack 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/10 text-gray-400 group-hover:bg-white/15 group-hover:text-white'
                      }
                    `}>
                      {isCurrentTrack && isPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 ml-0.5" />
                      )}
                    </div>
                    
                    {/* Playing indicator */}
                    {isCurrentTrack && isPlaying && (
                      <div className="absolute -inset-1 rounded-full border-2 border-white/30 animate-pulse" />
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`
                      font-medium truncate transition-colors duration-300
                      ${isCurrentTrack ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                    `}>
                      {track.title}
                    </h3>
                    <p className={`
                      text-sm truncate transition-colors duration-300
                      ${isCurrentTrack ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'}
                    `}>
                      {track.artist}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className={`
                    text-sm font-mono transition-colors duration-300
                    ${isCurrentTrack ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-400'}
                  `}>
                    {formatDuration(track.duration)}
                  </div>
                </div>

                {/* Progress bar for current track */}
                {isCurrentTrack && (
                  <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-white/60 to-white/40 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(track.currentTime / track.duration) * 100 || 0}%` 
                      }}
                    />
                  </div>
                )}

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {tracks.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No tracks in playlist</p>
            <p className="text-gray-500 text-sm mt-2">Add some music to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;
```