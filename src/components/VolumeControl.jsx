import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const VolumeControl = ({ volume, onVolumeChange, isMuted, onMuteToggle }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateVolume(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateVolume(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateVolume = (e) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onVolumeChange(percent);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const displayVolume = isMuted ? 0 : volume;

  return (
    <div className="flex items-center space-x-3 group">
      {/* Mute/Unmute Button */}
      <button
        onClick={onMuteToggle}
        className="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 
                   hover:bg-white/10 hover:border-white/20 transition-all duration-300
                   text-gray-300 hover:text-white group-hover:shadow-lg"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX size={18} />
        ) : (
          <Volume2 size={18} />
        )}
      </button>

      {/* Volume Slider */}
      <div className="flex items-center space-x-2 min-w-[100px]">
        <div
          ref={sliderRef}
          className="relative w-20 h-2 bg-black/30 rounded-full cursor-pointer
                     backdrop-blur-sm border border-white/10 overflow-hidden
                     hover:border-white/20 transition-all duration-300"
          onMouseDown={handleMouseDown}
        >
          {/* Background Track */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700" />
          
          {/* Volume Fill */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-gray-400 to-gray-300
                       transition-all duration-150 ease-out"
            style={{ width: `${displayVolume * 100}%` }}
          />
          
          {/* Volume Handle */}
          <div
            className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg
                       transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150
                       border-2 border-gray-300 hover:border-white hover:scale-110"
            style={{ left: `${displayVolume * 100}%` }}
          />
          
          {/* Glow Effect */}
          <div
            className="absolute top-1/2 w-6 h-6 bg-white/20 rounded-full
                       transform -translate-y-1/2 -translate-x-1/2 blur-sm
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ left: `${displayVolume * 100}%` }}
          />
        </div>

        {/* Volume Percentage */}
        <span className="text-xs text-gray-400 font-mono min-w-[2rem] text-right">
          {Math.round(displayVolume * 100)}%
        </span>
      </div>
    </div>
  );
};

export default VolumeControl;
