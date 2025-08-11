```jsx
import React, { useRef, useEffect, useState } from 'react';

const AudioVisualizer = ({ audioRef, isPlaying }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAudioContext = () => {
    if (!audioRef?.current || isInitialized) return;

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioRef.current);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = dataArray;

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  };

  const draw = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    analyser.getByteFrequencyData(dataArray);

    // Clear canvas with dark background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / dataArray.length) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height * 0.8;

      // Create gradient for bars
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      gradient.addColorStop(0, 'rgba(156, 163, 175, 0.8)'); // light gray
      gradient.addColorStop(0.5, 'rgba(156, 163, 175, 0.6)');
      gradient.addColorStop(1, 'rgba(156, 163, 175, 0.3)');

      ctx.fillStyle = gradient;
      
      // Draw bars with rounded tops
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
      
      // Add glow effect
      ctx.shadowColor = 'rgba(156, 163, 175, 0.5)';
      ctx.shadowBlur = 10;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
      
      // Reset shadow
      ctx.shadowBlur = 0;

      x += barWidth + 1;
    }

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    }
  };

  const startVisualization = () => {
    if (!isInitialized) {
      initializeAudioContext();
      return;
    }

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    draw();
  };

  const stopVisualization = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startVisualization();
    } else {
      stopVisualization();
    }

    return () => {
      stopVisualization();
    };
  }, [isPlaying, isInitialized]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-32 rounded-xl overflow-hidden backdrop-blur-md bg-black/20 border border-gray-700/30">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-gray-700/10 backdrop-blur-sm" />
      
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10"
        style={{ width: '100%', height: '100%' }}
      />
      
      {/* Fallback when no audio is playing */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="flex space-x-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gray-600/40 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 40 + 10}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;
```