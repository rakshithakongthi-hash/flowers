import React, { useRef, useEffect } from 'react';

class Particle {
  constructor(x, y, color, type = 'particle') {
    this.x = x;
    this.y = y;
    this.color = color;
    this.type = type; // 'particle' or 'petal'
    
    this.life = 1.0;
    this.decay = Math.random() * 0.02 + 0.01;
    
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * (type === 'petal' ? 1.5 : 2.5);
    
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = type === 'petal' ? (Math.random() * 10 + 10) : (Math.random() * 3 + 2);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    if (this.type === 'particle') {
      this.vy -= 0.05; // float up slightly
    }
  }

  draw(ctx) {
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    
    if (this.type === 'petal') {
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.size, this.size / 2, this.life * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
}

const ParticleSystem = ({ landmarks, gesture, videoWidth = 1280, videoHeight = 720 }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      // For this demo, we match the internal resolution to the assumed video size
      // CSS will handle the responsive scaling
      canvas.width = videoWidth;
      canvas.height = videoHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      // Soft clear for trailing effect
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      // Spawn new particles based on gesture
      if (landmarks && landmarks.length > 0) {
        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];
        
        // Canvas coordinates (Note: CSS scaleX(-1) handles the mirror flip)
        const ix = indexTip.x * canvas.width;
        const iy = indexTip.y * canvas.height;
        const tx = thumbTip.x * canvas.width;
        const ty = thumbTip.y * canvas.height;

        if (gesture === 'pinch') {
          // Bloom between thumb and index
          const mx = (ix + tx) / 2;
          const my = (iy + ty) / 2;
          
          for (let i = 0; i < 3; i++) {
            particlesRef.current.push(new Particle(mx, my, '#ff79c6', 'petal'));
            particlesRef.current.push(new Particle(mx, my, '#bd93f9', 'particle'));
          }
        } else if (gesture === 'pointing') {
          // Trail from index finger
          for (let i = 0; i < 2; i++) {
            particlesRef.current.push(new Particle(ix, iy, '#8be9fd', 'particle'));
          }
        } else if (gesture === 'open_palm') {
          // Gentle glow around fingertips
          [4, 8, 12, 16, 20].forEach(idx => {
            if (Math.random() > 0.8) {
              const pt = landmarks[idx];
              particlesRef.current.push(new Particle(pt.x * canvas.width, pt.y * canvas.height, '#50fa7b', 'particle'));
            }
          });
        }
      }

      // Update and draw
      particlesRef.current.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      // Remove dead particles
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [landmarks, gesture, videoWidth, videoHeight]);

  return (
    <canvas 
      ref={canvasRef} 
      className="particle-canvas"
    />
  );
};

export default ParticleSystem;
