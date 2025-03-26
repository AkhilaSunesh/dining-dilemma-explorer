
import React, { useState, useEffect, useRef } from 'react';

// Philosopher states
enum PhilosopherState {
  THINKING = 'thinking',
  HUNGRY = 'hungry',
  EATING = 'eating'
}

// Fork states
enum ForkState {
  AVAILABLE = 'available',
  TAKEN = 'taken'
}

interface Philosopher {
  id: number;
  state: PhilosopherState;
  leftFork: number;
  rightFork: number;
  eatCount: number;
}

interface Fork {
  id: number;
  state: ForkState;
  owner: number | null;
}

interface PhilosopherTableProps {
  count?: number;
}

const PhilosopherTable: React.FC<PhilosopherTableProps> = ({ count = 5 }) => {
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [forks, setForks] = useState<Fork[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [algorithm, setAlgorithm] = useState<'naive' | 'resourceHierarchy' | 'arbitrator'>('naive');
  const [isDeadlocked, setIsDeadlocked] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  
  const animationRef = useRef<number | null>(null);
  const waiterPermits = useRef<number>(count - 1); // For arbitrator solution
  
  // Initialize philosophers and forks
  useEffect(() => {
    const initPhilosophers = Array.from({ length: count }, (_, i) => ({
      id: i,
      state: PhilosopherState.THINKING,
      leftFork: i,
      rightFork: (i + 1) % count,
      eatCount: 0
    }));
    
    const initForks = Array.from({ length: count }, (_, i) => ({
      id: i,
      state: ForkState.AVAILABLE,
      owner: null
    }));
    
    setPhilosophers(initPhilosophers);
    setForks(initForks);
    setLog([`Initialized ${count} philosophers and ${count} forks.`]);
  }, [count]);
  
  // Reset simulation
  const resetSimulation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setIsRunning(false);
    setIsDeadlocked(false);
    
    const resetPhilosophers = philosophers.map(p => ({
      ...p,
      state: PhilosopherState.THINKING,
      eatCount: 0
    }));
    
    const resetForks = forks.map(f => ({
      ...f,
      state: ForkState.AVAILABLE,
      owner: null
    }));
    
    setPhilosophers(resetPhilosophers);
    setForks(resetForks);
    waiterPermits.current = count - 1;
    setLog([`Reset simulation. Using ${algorithm} algorithm.`]);
  };
  
  // Naive solution: Philosophers pick up left fork first, then right
  const naiveSolution = () => {
    let newPhilosophers = [...philosophers];
    let newForks = [...forks];
    let newLog: string[] = [];
    let deadlockDetected = false;
    
    // Process each philosopher based on their current state
    newPhilosophers.forEach((philosopher, index) => {
      const { id, state, leftFork, rightFork } = philosopher;
      
      // Random chance of state change or action
      const rand = Math.random();
      
      switch (state) {
        case PhilosopherState.THINKING:
          // Thinking philosopher has a chance to become hungry
          if (rand < 0.1 * speed) {
            newPhilosophers[index] = {
              ...philosopher,
              state: PhilosopherState.HUNGRY
            };
            newLog.push(`Philosopher ${id} is now hungry.`);
          }
          break;
          
        case PhilosopherState.HUNGRY:
          // Hungry philosopher tries to pick up left fork first
          if (newForks[leftFork].state === ForkState.AVAILABLE) {
            // Pick up left fork
            newForks[leftFork] = {
              ...newForks[leftFork],
              state: ForkState.TAKEN,
              owner: id
            };
            newLog.push(`Philosopher ${id} picked up left fork ${leftFork}.`);
            
            // Then try to pick up right fork
            if (newForks[rightFork].state === ForkState.AVAILABLE) {
              // Pick up right fork
              newForks[rightFork] = {
                ...newForks[rightFork],
                state: ForkState.TAKEN,
                owner: id
              };
              newLog.push(`Philosopher ${id} picked up right fork ${rightFork}.`);
              
              // Start eating
              newPhilosophers[index] = {
                ...philosopher,
                state: PhilosopherState.EATING,
                eatCount: philosopher.eatCount + 1
              };
              newLog.push(`Philosopher ${id} is now eating (meal #${philosopher.eatCount + 1}).`);
            }
          }
          break;
          
        case PhilosopherState.EATING:
          // Eating philosopher has a chance to finish and return to thinking
          if (rand < 0.2 * speed) {
            // Put down both forks
            newForks[leftFork] = {
              ...newForks[leftFork],
              state: ForkState.AVAILABLE,
              owner: null
            };
            newForks[rightFork] = {
              ...newForks[rightFork],
              state: ForkState.AVAILABLE,
              owner: null
            };
            
            // Return to thinking
            newPhilosophers[index] = {
              ...philosopher,
              state: PhilosopherState.THINKING
            };
            
            newLog.push(`Philosopher ${id} finished eating and is now thinking.`);
          }
          break;
      }
    });
    
    // Check for potential deadlock
    // If all philosophers are hungry and each has one fork, we have a deadlock
    const hungryWithOneForkCount = newPhilosophers.filter(
      (p, i) => p.state === PhilosopherState.HUNGRY && 
                (newForks[p.leftFork].owner === p.id || newForks[p.rightFork].owner === p.id)
    ).length;
    
    if (hungryWithOneForkCount === count) {
      deadlockDetected = true;
      newLog.push("DEADLOCK DETECTED: All philosophers are hungry and holding one fork!");
    }
    
    setPhilosophers(newPhilosophers);
    setForks(newForks);
    if (newLog.length > 0) {
      setLog(prev => [...prev, ...newLog].slice(-10)); // Keep only the last 10 log entries
    }
    setIsDeadlocked(deadlockDetected);
    
    // Continue animation if no deadlock
    if (!deadlockDetected && isRunning) {
      animationRef.current = requestAnimationFrame(
        () => setTimeout(() => naiveSolution(), 500 / speed)
      );
    } else if (deadlockDetected) {
      setIsRunning(false);
    }
  };
  
  // Resource Hierarchy solution: Philosophers always pick up lower-numbered fork first
  const resourceHierarchySolution = () => {
    let newPhilosophers = [...philosophers];
    let newForks = [...forks];
    let newLog: string[] = [];
    
    // Process each philosopher based on their current state
    newPhilosophers.forEach((philosopher, index) => {
      const { id, state, leftFork, rightFork } = philosopher;
      
      // Determine the lower and higher numbered forks
      const lowerFork = Math.min(leftFork, rightFork);
      const higherFork = Math.max(leftFork, rightFork);
      
      // Random chance of state change or action
      const rand = Math.random();
      
      switch (state) {
        case PhilosopherState.THINKING:
          // Thinking philosopher has a chance to become hungry
          if (rand < 0.1 * speed) {
            newPhilosophers[index] = {
              ...philosopher,
              state: PhilosopherState.HUNGRY
            };
            newLog.push(`Philosopher ${id} is now hungry.`);
          }
          break;
          
        case PhilosopherState.HUNGRY:
          // Hungry philosopher tries to pick up lower numbered fork first
          if (newForks[lowerFork].state === ForkState.AVAILABLE) {
            // Pick up lower fork
            newForks[lowerFork] = {
              ...newForks[lowerFork],
              state: ForkState.TAKEN,
              owner: id
            };
            newLog.push(`Philosopher ${id} picked up lower fork ${lowerFork}.`);
            
            // Then try to pick up higher fork
            if (newForks[higherFork].state === ForkState.AVAILABLE) {
              // Pick up higher fork
              newForks[higherFork] = {
                ...newForks[higherFork],
                state: ForkState.TAKEN,
                owner: id
              };
              newLog.push(`Philosopher ${id} picked up higher fork ${higherFork}.`);
              
              // Start eating
              newPhilosophers[index] = {
                ...philosopher,
                state: PhilosopherState.EATING,
                eatCount: philosopher.eatCount + 1
              };
              newLog.push(`Philosopher ${id} is now eating (meal #${philosopher.eatCount + 1}).`);
            }
          }
          break;
          
        case PhilosopherState.EATING:
          // Eating philosopher has a chance to finish and return to thinking
          if (rand < 0.2 * speed) {
            // Put down both forks
            newForks[lowerFork] = {
              ...newForks[lowerFork],
              state: ForkState.AVAILABLE,
              owner: null
            };
            newForks[higherFork] = {
              ...newForks[higherFork],
              state: ForkState.AVAILABLE,
              owner: null
            };
            
            // Return to thinking
            newPhilosophers[index] = {
              ...philosopher,
              state: PhilosopherState.THINKING
            };
            
            newLog.push(`Philosopher ${id} finished eating and is now thinking.`);
          }
          break;
      }
    });
    
    setPhilosophers(newPhilosophers);
    setForks(newForks);
    if (newLog.length > 0) {
      setLog(prev => [...prev, ...newLog].slice(-10));
    }
    
    // Continue animation
    if (isRunning) {
      animationRef.current = requestAnimationFrame(
        () => setTimeout(() => resourceHierarchySolution(), 500 / speed)
      );
    }
  };
  
  // Arbitrator solution: A waiter ensures at most N-1 philosophers can eat at once
  const arbitratorSolution = () => {
    let newPhilosophers = [...philosophers];
    let newForks = [...forks];
    let newLog: string[] = [];
    let permits = waiterPermits.current;
    
    // Process each philosopher based on their current state
    newPhilosophers.forEach((philosopher, index) => {
      const { id, state, leftFork, rightFork } = philosopher;
      
      // Random chance of state change or action
      const rand = Math.random();
      
      switch (state) {
        case PhilosopherState.THINKING:
          // Thinking philosopher has a chance to become hungry
          if (rand < 0.1 * speed) {
            newPhilosophers[index] = {
              ...philosopher,
              state: PhilosopherState.HUNGRY
            };
            newLog.push(`Philosopher ${id} is now hungry.`);
          }
          break;
          
        case PhilosopherState.HUNGRY:
          // Hungry philosopher needs waiter's permission to eat
          if (permits > 0) {
            // Get permission from waiter
            permits--;
            
            // Pick up left fork
            if (newForks[leftFork].state === ForkState.AVAILABLE) {
              newForks[leftFork] = {
                ...newForks[leftFork],
                state: ForkState.TAKEN,
                owner: id
              };
              newLog.push(`Philosopher ${id} picked up left fork ${leftFork}.`);
              
              // Pick up right fork
              if (newForks[rightFork].state === ForkState.AVAILABLE) {
                newForks[rightFork] = {
                  ...newForks[rightFork],
                  state: ForkState.TAKEN,
                  owner: id
                };
                newLog.push(`Philosopher ${id} picked up right fork ${rightFork}.`);
                
                // Start eating
                newPhilosophers[index] = {
                  ...philosopher,
                  state: PhilosopherState.EATING,
                  eatCount: philosopher.eatCount + 1
                };
                newLog.push(`Philosopher ${id} is now eating (meal #${philosopher.eatCount + 1}).`);
              } else {
                // Couldn't get right fork, so release left fork and waiter permission
                newForks[leftFork] = {
                  ...newForks[leftFork],
                  state: ForkState.AVAILABLE,
                  owner: null
                };
                permits++;
                newLog.push(`Philosopher ${id} couldn't get right fork, released left fork.`);
              }
            } else {
              // Couldn't get left fork, so release waiter permission
              permits++;
            }
          }
          break;
          
        case PhilosopherState.EATING:
          // Eating philosopher has a chance to finish and return to thinking
          if (rand < 0.2 * speed) {
            // Put down both forks
            newForks[leftFork] = {
              ...newForks[leftFork],
              state: ForkState.AVAILABLE,
              owner: null
            };
            newForks[rightFork] = {
              ...newForks[rightFork],
              state: ForkState.AVAILABLE,
              owner: null
            };
            
            // Return waiter permission
            permits++;
            
            // Return to thinking
            newPhilosophers[index] = {
              ...philosopher,
              state: PhilosopherState.THINKING
            };
            
            newLog.push(`Philosopher ${id} finished eating and is now thinking.`);
          }
          break;
      }
    });
    
    waiterPermits.current = permits;
    setPhilosophers(newPhilosophers);
    setForks(newForks);
    if (newLog.length > 0) {
      setLog(prev => [...prev, ...newLog].slice(-10));
    }
    
    // Continue animation
    if (isRunning) {
      animationRef.current = requestAnimationFrame(
        () => setTimeout(() => arbitratorSolution(), 500 / speed)
      );
    }
  };
  
  // Start simulation with selected algorithm
  const startSimulation = () => {
    if (!isRunning) {
      setIsRunning(true);
      setLog(prev => [...prev, `Starting simulation with ${algorithm} algorithm.`]);
      
      // Choose algorithm
      switch (algorithm) {
        case 'naive':
          naiveSolution();
          break;
        case 'resourceHierarchy':
          resourceHierarchySolution();
          break;
        case 'arbitrator':
          arbitratorSolution();
          break;
      }
    }
  };
  
  // Stop simulation
  const stopSimulation = () => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setLog(prev => [...prev, 'Simulation paused.']);
  };
  
  // Calculate positions for philosophers and forks around a circle
  const getPosition = (index: number, total: number, radius: number, isPhilosopher: boolean) => {
    // For forks, offset the angle to place them between philosophers
    const angleOffset = isPhilosopher ? 0 : 0.5;
    const angle = ((index + angleOffset) * 2 * Math.PI) / total;
    
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle)
    };
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return (
    <section id="visualization" className="py-24 px-4 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16 animate-fade-in">
          <h4 className="section-title">Interactive Learning</h4>
          <h2 className="title-medium mb-6 pb-2 subtle-underline inline-block">Visualization</h2>
          <p className="text-lg text-apple-gray max-w-3xl mx-auto">
            See the Dining Philosophers problem in action with this interactive visualization. Experiment with different algorithms and observe how they handle resource allocation and prevent (or cause) deadlocks.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-6 text-apple-black">Simulation Controls</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 text-apple-black">Algorithm</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="algorithm"
                      value="naive"
                      checked={algorithm === 'naive'}
                      onChange={() => setAlgorithm('naive')}
                      className="mr-2"
                    />
                    <span className="text-apple-darkgray">Naive Solution (Deadlock Prone)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="algorithm"
                      value="resourceHierarchy"
                      checked={algorithm === 'resourceHierarchy'}
                      onChange={() => setAlgorithm('resourceHierarchy')}
                      className="mr-2"
                    />
                    <span className="text-apple-darkgray">Resource Hierarchy (Deadlock Free)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="algorithm"
                      value="arbitrator"
                      checked={algorithm === 'arbitrator'}
                      onChange={() => setAlgorithm('arbitrator')}
                      className="mr-2"
                    />
                    <span className="text-apple-darkgray">Arbitrator/Waiter (Deadlock Free)</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-apple-black">Simulation Speed</h4>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={speed}
                  onChange={e => setSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-apple-gray mt-1">
                  <span>Slow</span>
                  <span>Medium</span>
                  <span>Fast</span>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  className={`flex-1 py-2 rounded-md ${
                    isRunning
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-apple-blue text-white hover:bg-blue-600'
                  } transition-colors`}
                  onClick={startSimulation}
                  disabled={isRunning}
                >
                  Start
                </button>
                <button
                  className={`flex-1 py-2 rounded-md ${
                    !isRunning
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  } transition-colors`}
                  onClick={stopSimulation}
                  disabled={!isRunning}
                >
                  Stop
                </button>
                <button
                  className="flex-1 py-2 rounded-md bg-gray-200 text-apple-darkgray hover:bg-gray-300 transition-colors"
                  onClick={resetSimulation}
                >
                  Reset
                </button>
              </div>
              
              {isDeadlocked && (
                <div className="p-4 bg-red-100 text-red-800 rounded-md">
                  <p className="font-semibold">Deadlock Detected!</p>
                  <p className="text-sm mt-1">
                    All philosophers are hungry and holding one fork. None can proceed to eat.
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-apple-black">Activity Log</h4>
                <div className="h-60 overflow-y-auto p-3 bg-gray-50 rounded-md text-sm text-apple-darkgray">
                  {log.map((entry, i) => (
                    <div key={i} className="mb-1">
                      &gt; {entry}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 h-full">
              <h3 className="text-xl font-semibold mb-6 text-apple-black">Visualization</h3>
              
              <div className="relative aspect-square w-full max-w-2xl mx-auto">
                {/* Table */}
                <div className="absolute inset-1/4 rounded-full bg-gray-100 border border-gray-200"></div>
                
                {/* Philosophers */}
                {philosophers.map(philosopher => {
                  const pos = getPosition(philosopher.id, count, 35, true);
                  let stateClass = '';
                  
                  switch (philosopher.state) {
                    case PhilosopherState.THINKING:
                      stateClass = 'bg-blue-500 philosopher-thinking';
                      break;
                    case PhilosopherState.HUNGRY:
                      stateClass = 'bg-yellow-500 philosopher-hungry';
                      break;
                    case PhilosopherState.EATING:
                      stateClass = 'bg-green-500 philosopher-eating';
                      break;
                  }
                  
                  return (
                    <div 
                      key={`philosopher-${philosopher.id}`}
                      className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 ${stateClass}`}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                      <div className="philosopher-aura"></div>
                      <div className="relative z-10">
                        <div>P{philosopher.id}</div>
                        <div className="text-xs">{philosopher.eatCount}</div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Forks */}
                {forks.map(fork => {
                  const pos = getPosition(fork.id, count, 25, false);
                  const taken = fork.state === ForkState.TAKEN;
                  
                  // Calculate rotation angle to point fork toward owner if taken
                  let rotation = 0;
                  if (taken && fork.owner !== null) {
                    const ownerPos = getPosition(fork.owner, count, 35, true);
                    rotation = Math.atan2(ownerPos.y - pos.y, ownerPos.x - pos.x) * (180 / Math.PI);
                  }
                  
                  return (
                    <div 
                      key={`fork-${fork.id}`}
                      className={`absolute w-8 h-2 transform -translate-x-1/2 -translate-y-1/2 ${
                        taken ? 'bg-gray-700' : 'bg-gray-400'
                      }`}
                      style={{ 
                        left: `${pos.x}%`, 
                        top: `${pos.y}%`, 
                        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <span 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white font-bold"
                      >
                        F{fork.id}
                      </span>
                    </div>
                  );
                })}
                
                {/* Lines connecting forks to owners */}
                {forks.filter(f => f.state === ForkState.TAKEN && f.owner !== null).map(fork => {
                  const forkPos = getPosition(fork.id, count, 25, false);
                  const ownerPos = getPosition(fork.owner!, count, 35, true);
                  
                  return (
                    <svg 
                      key={`line-${fork.id}`}
                      className="absolute inset-0 w-full h-full"
                      style={{ zIndex: -1 }}
                    >
                      <line 
                        x1={`${forkPos.x}%`} 
                        y1={`${forkPos.y}%`} 
                        x2={`${ownerPos.x}%`} 
                        y2={`${ownerPos.y}%`} 
                        stroke="rgba(10, 132, 255, 0.3)" 
                        strokeWidth="2"
                      />
                    </svg>
                  );
                })}
              </div>
              
              <div className="mt-8">
                <h4 className="font-semibold mb-3 text-apple-black">Legend</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-apple-darkgray">Thinking</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm text-apple-darkgray">Hungry</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-apple-darkgray">Eating</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
                <strong className="text-apple-blue">Tip:</strong> Watch how different algorithms handle resource allocation. The naive approach may deadlock, while the others ensure deadlock freedom through different mechanisms.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilosopherTable;
