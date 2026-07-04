import React from 'react';
import HandTracker from './components/HandTracker';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AntiGravity</h1>
        <p>Interactive MediaPipe Hand Gesture Experience</p>
      </header>
      
      <main className="app-main">
        <HandTracker />
      </main>
    </div>
  );
}

export default App;
