import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudioVisualizer = (audioElement, isPlaying) => {
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [dataArray, setDataArray] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize Web Audio API
  const initializeAudio = useCallback(async () => {
    if (!audioElement || isInitialized) return;

    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = context.createAnalyser();
      
      // Configure analyser
      analyserNode.fftSize = 256;
      analyserNode.smoothingTimeConstant = 0.8;
      
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArr = new Uint8Array(bufferLength);

      // Create source if it doesn't exist
      if (!sourceRef.current) {
        sourceRef.current = context.createMediaElementSource(audioElement);
      }

      // Connect nodes
      sourceRef.current.connect(analyserNode);
      analyserNode.connect(context.destination);

      setAudioContext(context);
      setAnalyser(analyserNode);
      setDataArray(dataArr);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  }, [audioElement, isInitialized]);

  // Get frequency data for visualization
  const getFrequencyData = useCallback(() => {
    if (!analyser || !dataArray) return null;
    
    analyser.getByteFrequencyData(dataArray);
    return Array.from(dataArray);
  }, [analyser, dataArray]);

  // Get time domain data for waveform
  const getTimeDomainData = useCallback(() => {
    if (!analyser || !dataArray) return null;
    
    analyser.getByteTimeDomainData(dataArray);
    return Array.from(dataArray);
  }, [analyser, dataArray]);

  // Resume audio context if suspended
  const resumeAudioContext = useCallback(async () => {
    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
      } catch (error) {
        console.error('Error resuming audio context:', error);
      }
    }
  }, [audioContext]);

  // Start visualization animation
  const startVisualization = useCallback((callback) => {
    if (!callback || animationRef.current) return;

    const animate = () => {
      const frequencyData = getFrequencyData();
      const timeDomainData = getTimeDomainData();
      
      if (frequencyData && timeDomainData) {
        callback({
          frequency: frequencyData,
          timeDomain: timeDomainData,
          bufferLength: dataArray?.length || 0
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  }, [getFrequencyData, getTimeDomainData, dataArray]);

  // Stop visualization animation
  const stopVisualization = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Get average frequency for reactive elements
  const getAverageFrequency = useCallback(() => {
    const frequencyData = getFrequencyData();
    if (!frequencyData) return 0;

    const sum = frequencyData.reduce((acc, val) => acc + val, 0);
    return sum / frequencyData.length;
  }, [getFrequencyData]);

  // Get bass frequencies (low end)
  const getBassFrequency = useCallback(() => {
    const frequencyData = getFrequencyData();
    if (!frequencyData) return 0;

    // Take first 10% of frequency data (bass range)
    const bassRange = Math.floor(frequencyData.length * 0.1);
    const bassData = frequencyData.slice(0, bassRange);
    const sum = bassData.reduce((acc, val) => acc + val, 0);
    return sum / bassData.length;
  }, [getFrequencyData]);

  // Get treble frequencies (high end)
  const getTrebleFrequency = useCallback(() => {
    const frequencyData = getFrequencyData();
    if (!frequencyData) return 0;

    // Take last 30% of frequency data (treble range)
    const trebleStart = Math.floor(frequencyData.length * 0.7);
    const trebleData = frequencyData.slice(trebleStart);
    const sum = trebleData.reduce((acc, val) => acc + val, 0);
    return sum / trebleData.length;
  }, [getFrequencyData]);

  // Initialize when audio element is available
  useEffect(() => {
    if (audioElement && !isInitialized) {
      initializeAudio();
    }
  }, [audioElement, initializeAudio, isInitialized]);

  // Handle play/pause state
  useEffect(() => {
    if (isPlaying) {
      resumeAudioContext();
    }
  }, [isPlaying, resumeAudioContext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVisualization();
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [audioContext, stopVisualization]);

  return {
    isInitialized,
    getFrequencyData,
    getTimeDomainData,
    getAverageFrequency,
    getBassFrequency,
    getTrebleFrequency,
    startVisualization,
    stopVisualization,
    resumeAudioContext,
    bufferLength: dataArray?.length || 0
  };
};
