import React from 'react';
import ParticleSystem from './ParticleSystem';

const BloomEffect = ({ landmarks, gesture, isLoaded }) => {
  if (!isLoaded) return null;

  return (
    <div className="bloom-effect-container">
      <ParticleSystem 
        landmarks={landmarks} 
        gesture={gesture} 
      />
      
      {/* UI overlay to show the current gesture */}
      <div className="gesture-indicator">
        {gesture === 'none' ? 'Waiting for gesture...' : `Active Gesture: ${gesture.replace('_', ' ').toUpperCase()}`}
      </div>
    </div>
  );
};

export default BloomEffect;
