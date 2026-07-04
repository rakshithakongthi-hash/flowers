import React, { useRef } from 'react';
import Camera from './Camera';
import BloomEffect from './BloomEffect';
import { useHandTracking } from '../hooks/useHandTracking';
import { Loader2, AlertCircle, Camera as CameraIcon } from 'lucide-react';

const HandTracker = () => {
  const videoRef = useRef(null);
  
  const { 
    isLoaded, 
    error, 
    permissionGranted, 
    gesture, 
    landmarks 
  } = useHandTracking(videoRef);

  return (
    <div className="tracker-container">
      {/* Background styling is handled by tracker-container in CSS */}
      <Camera ref={videoRef} />
      
      {error && (
        <div className="overlay-message error">
          <AlertCircle size={48} />
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}

      {!permissionGranted && !error && (
        <div className="overlay-message waiting">
          <CameraIcon size={48} />
          <h2>Camera Access Required</h2>
          <p>Please allow camera access to interact with the AntiGravity experience.</p>
        </div>
      )}

      {permissionGranted && !isLoaded && !error && (
        <div className="overlay-message loading">
          <Loader2 className="spinner" size={48} />
          <h2>Initializing AI Model</h2>
          <p>Loading MediaPipe Hand Landmarker...</p>
        </div>
      )}

      <BloomEffect 
        isLoaded={isLoaded}
        landmarks={landmarks}
        gesture={gesture}
      />
    </div>
  );
};

export default HandTracker;
