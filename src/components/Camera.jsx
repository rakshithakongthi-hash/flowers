import React, { forwardRef } from 'react';

const Camera = forwardRef((props, ref) => {
  return (
    <div className="camera-container">
      <video
        ref={ref}
        className="webcam-video"
        playsInline
        muted
        autoPlay
      />
      {/* Overlay to give it a futuristic dark glass feel */}
      <div className="camera-overlay"></div>
    </div>
  );
});

Camera.displayName = 'Camera';

export default Camera;
