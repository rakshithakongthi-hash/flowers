import { useState, useEffect, useRef } from 'react';
import { initializeHandLandmarker } from '../utils/mediapipe';
import { detectGesture } from '../utils/gestures';

export const useHandTracking = (videoRef) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [gesture, setGesture] = useState('none');
  const [landmarks, setLandmarks] = useState([]);
  
  const landmarkerRef = useRef(null);
  const requestRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);

  // Smooth the landmarks slightly to reduce jitter
  const smoothedLandmarksRef = useRef([]);

  const lerp = (start, end, factor = 0.5) => {
    return start + (end - start) * factor;
  };

  const smoothLandmarks = (newLandmarks) => {
    if (smoothedLandmarksRef.current.length === 0 || smoothedLandmarksRef.current.length !== newLandmarks.length) {
      smoothedLandmarksRef.current = newLandmarks;
      return newLandmarks;
    }

    const smoothed = newLandmarks.map((point, index) => {
      const prev = smoothedLandmarksRef.current[index];
      return {
        x: lerp(prev.x, point.x),
        y: lerp(prev.y, point.y),
        z: lerp(prev.z, point.z)
      };
    });

    smoothedLandmarksRef.current = smoothed;
    return smoothed;
  };

  useEffect(() => {
    let stream = null;

    const setupCameraAndModel = async () => {
      try {
        // 1. Initialize Model
        landmarkerRef.current = await initializeHandLandmarker();
        setIsLoaded(true);

        // 2. Request Camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, facingMode: "user" }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermissionGranted(true);
          
          videoRef.current.onloadeddata = () => {
            videoRef.current.play();
            predictWebcam();
          };
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message || "Failed to access webcam or load model");
      }
    };

    const predictWebcam = () => {
      if (!videoRef.current || !landmarkerRef.current) return;

      const startTimeMs = performance.now();
      if (lastVideoTimeRef.current !== videoRef.current.currentTime) {
        lastVideoTimeRef.current = videoRef.current.currentTime;
        const results = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);
        
        if (results.landmarks && results.landmarks.length > 0) {
          // Use the first hand detected for simplicity, could map over all hands
          const firstHandLandmarks = results.landmarks[0];
          const smoothed = smoothLandmarks(firstHandLandmarks);
          
          setLandmarks(smoothed);
          setGesture(detectGesture(smoothed));
        } else {
          setLandmarks([]);
          setGesture('none');
          smoothedLandmarksRef.current = [];
        }
      }
      
      requestRef.current = requestAnimationFrame(predictWebcam);
    };

    setupCameraAndModel();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoRef]);

  return { isLoaded, error, permissionGranted, gesture, landmarks };
};
