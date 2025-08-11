```jsx
import React, { useRef, useEffect } from 'react';

const ProgressBar = ({ 
  currentTime = 0, 
  duration = 0, 
  onSeek, 
  className = '' 
}) => {
  const progressRef = useRef(null);
  const isDragging = useRef(false);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!duration || isNaN(duration) || isNaN(currentTime)) return 0;
    return Math.min((currentTime / duration) * 100, 100);
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    handleSeek(e);
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      handleSeek(e);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleSeek = (e) => {
    if (!progressRef.current || !onSeek) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;

    onSeek(newTime);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging.current) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* Time Display */}
      <div className="flex justify-between items-center mb-2 text-sm text-gray-300">
        <span className="font-mono">{formatTime(currentTime)}</span>
        <span className="font-mono">{formatTime(duration)}</span>
      </div>

      {/* Progress Bar Container */}
      <div
        ref={progressRef}
        className="relative w-full h-2 cursor-pointer group"
        onMouseDown={handleMouseDown}
      >
        {/* Background Track */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-full border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-full" />
        </div>

        {/* Progress Fill */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-400 to-gray-300 rounded-full transition-all duration-150 ease-out"
          style={{ width: `${getProgress()}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-full" />
        </div>

        {/* Progress Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out"
          style={{ 
            left: `${getProgress()}%`, 
            transform: 'translateX(-50%) translateY(-50%)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="absolute inset-0.5 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full" />
        </div>
      </div>

      {/* Progress Percentage (Hidden by default, can be shown for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mt-1 opacity-50">
          {getProgress().toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
```