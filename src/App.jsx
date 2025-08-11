import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { cn } from '../lib/utils';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [audioData, setAudioData] = useState(new Array(64).fill(0));
  
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize audio visualization
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaElementSource(audioRef.current);
        
        source.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        analyserRef.current.fftSize = 128;
      } catch (error) {
        console.log('Audio context not supported');
      }
    }
  }, [currentTrack]);

  // Audio visualization animation
  const updateVisualization = () => {
    if (analyserRef.current && isPlaying) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      setAudioData([...dataArray]);
    }
    animationRef.current = requestAnimationFrame(updateVisualization);
  };

  useEffect(() => {
    if (isPlaying) {
      updateVisualization();
    } else {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setCurrentTrack({
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: url
      });
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = value[0];
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

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Player Container */}
        <div className="backdrop-blur-xl bg-gray-900/30 border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
          
          {/* Upload Section */}
          {!currentTrack && (
            <div className="text-center mb-8">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="bg-gray-800/50 border-gray-600/50 text-gray-200 hover:bg-gray-700/50 hover:border-gray-500/50 backdrop-blur-sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload MP3
              </Button>
            </div>
          )}

          {/* Track Info */}
          {currentTrack && (
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl mx-auto mb-4 backdrop-blur-sm border border-gray-600/30 flex items-center justify-center">
                <Volume2 className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-100 mb-2">{currentTrack.name}</h2>
              <p className="text-gray-400 text-sm">Unknown Artist</p>
            </div>
          )}

          {/* Audio Visualizer */}
          {currentTrack && (
            <div className="mb-8">
              <div className="flex items-end justify-center space-x-1 h-24 bg-gray-900/20 rounded-xl p-4 backdrop-blur-sm border border-gray-700/30">
                {audioData.slice(0, 32).map((value, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-t from-gray-600 to-gray-400 rounded-full transition-all duration-75 ease-out"
                    style={{
                      width: '6px',
                      height: `${Math.max(4, (value / 255) * 64)}px`,
                      opacity: isPlaying ? 0.8 : 0.3
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {currentTrack && (
            <div className="mb-6">
              <Slider
                value={[currentTime]}
                onValueChange={handleSeek}
                max={duration || 100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
              disabled={!currentTrack}
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={togglePlayPause}
              size="icon"
              className={cn(
                "w-14 h-14 rounded-full backdrop-blur-sm border border-gray-600/50",
                currentTrack 
                  ? "bg-gray-700/50 hover:bg-gray-600/50 text-gray-200" 
                  : "bg-gray-800/30 text-gray-500 cursor-not-allowed"
              )}
              disabled={!currentTrack}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
              disabled={!currentTrack}
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Volume Control */}
          {currentTrack && (
            <div className="flex items-center space-x-3">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.1}
                className="flex-1"
              />
            </div>
          )}

          {/* Upload New Track */}
          {currentTrack && (
            <div className="mt-6 text-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                className="text-gray-400 hover:text-gray-200 text-sm"
              >
                Upload New Track
              </Button>
            </div>
          )}
        </div>

        {/* Audio Element */}
        {currentTrack && (
          <audio
            ref={audioRef}
            src={currentTrack.url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
