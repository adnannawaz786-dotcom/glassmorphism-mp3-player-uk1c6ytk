```jsx
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const PlaybackControls = ({ 
  isPlaying, 
  onPlayPause, 
  onPrevious, 
  onNext, 
  volume, 
  onVolumeChange,
  disabled = false 
}) => {
  return (
    <div className="flex items-center justify-center space-x-6 p-6">
      {/* Previous Track Button */}
      <button
        onClick={onPrevious}
        disabled={disabled}
        className="group relative p-3 rounded-full bg-black/20 backdrop-blur-sm border border-gray-700/30 hover:bg-black/30 hover:border-gray-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SkipBack 
          size={20} 
          className="text-gray-300 group-hover:text-white transition-colors duration-300" 
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600/20 to-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={onPlayPause}
        disabled={disabled}
        className="group relative p-4 rounded-full bg-black/30 backdrop-blur-md border border-gray-600/40 hover:bg-black/40 hover:border-gray-500/60 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPlaying ? (
          <Pause 
            size={28} 
            className="text-gray-200 group-hover:text-white transition-colors duration-300" 
          />
        ) : (
          <Play 
            size={28} 
            className="text-gray-200 group-hover:text-white transition-colors duration-300 ml-1" 
          />
        )}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-500/20 to-gray-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Next Track Button */}
      <button
        onClick={onNext}
        disabled={disabled}
        className="group relative p-3 rounded-full bg-black/20 backdrop-blur-sm border border-gray-700/30 hover:bg-black/30 hover:border-gray-600/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <SkipForward 
          size={20} 
          className="text-gray-300 group-hover:text-white transition-colors duration-300" 
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600/20 to-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      {/* Volume Control */}
      <div className="flex items-center space-x-3 ml-8">
        <Volume2 size={18} className="text-gray-400" />
        <div className="relative w-20">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-1 bg-gray-700/50 rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #9ca3af 0%, #9ca3af ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
            }}
          />
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: linear-gradient(135deg, #f3f4f6, #d1d5db);
              cursor: pointer;
              border: 2px solid #6b7280;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              transition: all 0.2s ease;
            }
            
            .slider::-webkit-slider-thumb:hover {
              transform: scale(1.1);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
            }
            
            .slider::-moz-range-thumb {
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: linear-gradient(135deg, #f3f4f6, #d1d5db);
              cursor: pointer;
              border: 2px solid #6b7280;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              transition: all 0.2s ease;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;
```