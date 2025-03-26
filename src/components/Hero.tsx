
import React, { useEffect, useRef } from 'react';

const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasSize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();
    
    // Define philosophers and forks
    const numPhilosophers = 5;
    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.6;
    
    type Position = { x: number, y: number };
    
    const philosopherPositions: Position[] = [];
    const forkPositions: Position[] = [];
    
    // Calculate positions
    for (let i = 0; i < numPhilosophers; i++) {
      const angle = (i * 2 * Math.PI) / numPhilosophers;
      philosopherPositions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
      
      const forkAngle = ((i + 0.5) * 2 * Math.PI) / numPhilosophers;
      forkPositions.push({
        x: centerX + radius * 0.7 * Math.cos(forkAngle),
        y: centerY + radius * 0.7 * Math.sin(forkAngle)
      });
    }
    
    // Animation state
    const state = {
      philosophers: Array(numPhilosophers).fill('thinking'),
      forkOwners: Array(numPhilosophers).fill(null),
      animationFrame: 0
    };
    
    const drawTable = () => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
      ctx.fillStyle = '#F5F5F7';
      ctx.fill();
      ctx.strokeStyle = '#E5E5E7';
      ctx.lineWidth = 2;
      ctx.stroke();
    };
    
    const drawPhilosopher = (x: number, y: number, state: string, index: number) => {
      // Draw aura based on state
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, 2 * Math.PI);
      
      if (state === 'thinking') {
        ctx.fillStyle = 'rgba(255, 236, 179, 0.3)';
      } else if (state === 'hungry') {
        ctx.fillStyle = 'rgba(255, 205, 210, 0.3)';
      } else if (state === 'eating') {
        ctx.fillStyle = 'rgba(200, 230, 201, 0.3)';
      }
      
      ctx.fill();
      
      // Draw philosopher
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = '#0A84FF';
      ctx.fill();
      
      // Add philosopher number
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`P${index}`, x, y);
    };
    
    const drawFork = (x: number, y: number, owner: number | null, index: number) => {
      const length = 20;
      const width = 3;
      
      // Calculate rotation angle based on position from center
      const angleToCenter = Math.atan2(centerY - y, centerX - x);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angleToCenter);
      
      // Draw handle
      ctx.beginPath();
      ctx.rect(-length/2, -width/2, length, width);
      ctx.fillStyle = '#86868B';
      ctx.fill();
      
      // Draw prongs
      ctx.beginPath();
      ctx.moveTo(length/2, -width);
      ctx.lineTo(length/2 + 8, -width - 4);
      ctx.lineTo(length/2 + 8, width + 4);
      ctx.lineTo(length/2, width);
      ctx.fillStyle = '#CCCCCC';
      ctx.fill();
      
      // Add fork number
      ctx.fillStyle = '#333333';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`F${index}`, 0, 0);
      
      ctx.restore();
      
      // If fork is owned, draw a line to the owner
      if (owner !== null) {
        const philosopherPos = philosopherPositions[owner];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(philosopherPos.x, philosopherPos.y);
        ctx.strokeStyle = 'rgba(10, 132, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };
    
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      
      // Draw table
      drawTable();
      
      // Randomly change philosopher states
      if (state.animationFrame % 60 === 0) {
        const philosopherToChange = Math.floor(Math.random() * numPhilosophers);
        
        if (state.philosophers[philosopherToChange] === 'thinking') {
          state.philosophers[philosopherToChange] = 'hungry';
        } else if (state.philosophers[philosopherToChange] === 'hungry') {
          // Check if forks are available
          const leftFork = philosopherToChange;
          const rightFork = (philosopherToChange + 1) % numPhilosophers;
          
          if (state.forkOwners[leftFork] === null && state.forkOwners[rightFork] === null) {
            state.philosophers[philosopherToChange] = 'eating';
            state.forkOwners[leftFork] = philosopherToChange;
            state.forkOwners[rightFork] = philosopherToChange;
          }
        } else if (state.philosophers[philosopherToChange] === 'eating') {
          state.philosophers[philosopherToChange] = 'thinking';
          
          // Release forks
          const leftFork = philosopherToChange;
          const rightFork = (philosopherToChange + 1) % numPhilosophers;
          
          state.forkOwners[leftFork] = null;
          state.forkOwners[rightFork] = null;
        }
      }
      
      // Draw philosophers and forks
      philosopherPositions.forEach((pos, i) => {
        drawPhilosopher(pos.x, pos.y, state.philosophers[i], i);
      });
      
      forkPositions.forEach((pos, i) => {
        drawFork(pos.x, pos.y, state.forkOwners[i], i);
      });
      
      state.animationFrame++;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);
  
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      <div className="relative z-10 text-center max-w-3xl animate-fade-in">
        <h4 className="section-title mb-4">Operating Systems Synchronization</h4>
        <h1 className="title-large mb-6">The Dining Philosophers</h1>
        <p className="text-lg text-apple-darkgray mb-8 max-w-2xl mx-auto">
          Exploring a classic problem in concurrent programming that illustrates the challenges of resource allocation and deadlock prevention.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a 
            href="#problem" 
            className="px-6 py-3 rounded-full bg-apple-blue text-white font-semibold hover:bg-blue-600 transition-colors"
          >
            Explore the Problem
          </a>
          <a 
            href="#visualization" 
            className="px-6 py-3 rounded-full bg-white border border-gray-200 text-apple-black font-semibold hover:bg-gray-50 transition-colors"
          >
            Interactive Visualization
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-pulse-subtle">
        <div className="w-6 h-10 border-2 border-apple-darkgray rounded-full flex justify-center">
          <div className="w-1 h-3 bg-apple-darkgray rounded-full mt-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
