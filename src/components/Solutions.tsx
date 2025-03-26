
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const solutions = [
  {
    id: 'semaphore',
    name: 'Semaphore-based Solution',
    description: 'Uses counting semaphores to represent forks and control access to them.',
    details: 'Each fork is represented by a binary semaphore, and philosophers must acquire both left and right fork semaphores before eating. This simple approach is intuitive but prone to deadlocks if all philosophers pick up their left fork simultaneously.',
    pros: ['Simple to understand and implement', 'Low overhead', 'Works well when contention is low'],
    cons: ['Prone to deadlocks', 'No guarantee of fairness', 'Starvation is possible'],
    efficiency: 'Medium',
    complexity: 'Low',
    deadlockFree: false
  },
  {
    id: 'mutex',
    name: 'Resource Hierarchy Solution',
    description: 'Assigns a total ordering to resources to prevent circular wait.',
    details: 'Each fork is assigned a unique number, and philosophers must pick up the lower-numbered fork first. This breaks the circular wait condition and prevents deadlocks, but doesn\'t guarantee fairness or prevent starvation.',
    pros: ['Prevents deadlocks', 'Relatively simple to implement', 'No additional resources needed'],
    cons: ['Can lead to starvation', 'Uneven resource utilization', 'Not all philosophers are treated equally'],
    efficiency: 'Medium-High',
    complexity: 'Medium',
    deadlockFree: true
  },
  {
    id: 'monitor',
    name: 'Chandys/Misra Solution',
    description: 'A distributed, message-passing solution with asymmetric fork access.',
    details: 'Forks can be clean or dirty. A philosopher with a dirty fork must relinquish it when requested. This ensures no deadlocks and guarantees that a hungry philosopher will eventually eat, preventing starvation.',
    pros: ['Deadlock-free', 'Starvation-free', 'Works in distributed systems', 'Maximum concurrency'],
    cons: ['Complex implementation', 'Higher overhead due to message passing', 'Requires state tracking for each fork'],
    efficiency: 'High',
    complexity: 'High',
    deadlockFree: true
  },
  {
    id: 'waiter',
    name: 'Arbitrator (Waiter) Solution',
    description: 'Introduces a central arbitrator to control resource allocation.',
    details: 'A waiter (or arbitrator) controls which philosophers can pick up forks. Only four philosophers are allowed to attempt eating at any time, which prevents the circular wait condition. This solution is simple and effective but adds a centralized bottleneck.',
    pros: ['Simple to understand', 'Deadlock-free', 'Relatively fair'],
    cons: ['Introduces a bottleneck', 'Reduces concurrency', 'Central point of failure'],
    efficiency: 'Medium',
    complexity: 'Medium',
    deadlockFree: true
  }
];

const Solutions: React.FC = () => {
  const [activeSolution, setActiveSolution] = useState('semaphore');
  
  const currentSolution = solutions.find(s => s.id === activeSolution);
  
  return (
    <section id="solutions" className="py-24 px-4 bg-gray-50">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16 animate-fade-in">
          <h4 className="section-title">Resolving the Dilemma</h4>
          <h2 className="title-medium mb-6 pb-2 subtle-underline inline-block">Solution Approaches</h2>
          <p className="text-lg text-apple-gray max-w-3xl mx-auto">
            Multiple strategies have been developed to solve the Dining Philosophers problem, each with different trade-offs and characteristics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 h-full">
              <h3 className="text-xl font-semibold mb-6 text-apple-black">Select a Solution</h3>
              <div className="space-y-4">
                {solutions.map(solution => (
                  <button
                    key={solution.id}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                      activeSolution === solution.id 
                        ? 'bg-apple-blue text-white shadow-md' 
                        : 'bg-gray-50 text-apple-darkgray hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveSolution(solution.id)}
                  >
                    <div className="font-medium">{solution.name}</div>
                    <div className={`text-sm mt-1 ${
                      activeSolution === solution.id ? 'text-blue-100' : 'text-apple-gray'
                    }`}>
                      {solution.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {currentSolution && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 h-full">
                <h3 className="text-xl font-semibold mb-2 text-apple-black">{currentSolution.name}</h3>
                <div className="mb-6 inline-block px-3 py-1 rounded-full text-xs font-medium bg-apple-lightgray text-apple-darkgray">
                  {currentSolution.deadlockFree ? 'Deadlock-free' : 'Deadlock-prone'}
                </div>
                
                <p className="text-apple-darkgray mb-6">
                  {currentSolution.details}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-apple-black">Advantages</h4>
                    <ul className="space-y-2">
                      {currentSolution.pros.map((pro, index) => (
                        <li key={index} className="flex">
                          <Check className="mr-2 text-green-500 flex-shrink-0" size={20} />
                          <span className="text-apple-darkgray text-sm">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-apple-black">Disadvantages</h4>
                    <ul className="space-y-2">
                      {currentSolution.cons.map((con, index) => (
                        <li key={index} className="flex">
                          <X className="mr-2 text-red-500 flex-shrink-0" size={20} />
                          <span className="text-apple-darkgray text-sm">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-apple-black">Complexity</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-apple-blue h-2.5 rounded-full" 
                          style={{ 
                            width: currentSolution.complexity === 'Low' ? '33%' : 
                                  currentSolution.complexity === 'Medium' ? '66%' : '100%' 
                          }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm text-apple-darkgray">
                        {currentSolution.complexity}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-apple-black">Efficiency</h4>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-apple-blue h-2.5 rounded-full" 
                          style={{ 
                            width: currentSolution.efficiency === 'Low' ? '33%' : 
                                  currentSolution.efficiency === 'Medium' ? '50%' :
                                  currentSolution.efficiency === 'Medium-High' ? '75%' : '100%' 
                          }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm text-apple-darkgray">
                        {currentSolution.efficiency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="text-xl font-semibold mb-6 text-apple-black">Comparing Solutions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-apple-black">Solution</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-apple-black">Deadlock-Free</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-apple-black">Starvation-Free</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-apple-black">Complexity</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-apple-black">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {solutions.map((solution, index) => (
                  <tr key={solution.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-apple-darkgray">{solution.name}</td>
                    <td className="px-4 py-3 text-center">
                      {solution.deadlockFree ? 
                        <Check className="inline text-green-500" size={20} /> : 
                        <X className="inline text-red-500" size={20} />
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {solution.id === 'monitor' || solution.id === 'waiter' ? 
                        <Check className="inline text-green-500" size={20} /> : 
                        <X className="inline text-red-500" size={20} />
                      }
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-apple-darkgray">{solution.complexity}</td>
                    <td className="px-4 py-3 text-center text-sm text-apple-darkgray">{solution.efficiency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg text-sm text-apple-darkgray">
            <strong className="text-apple-blue">Recommendation:</strong> The Chandys/Misra solution is theoretically the most robust, offering both deadlock and starvation freedom with maximum concurrency. However, for practical implementations, the Resource Hierarchy (mutex-based) solution offers a good balance of simplicity and deadlock prevention. The Arbitrator solution is a good middle ground for systems where a centralized controller is acceptable.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solutions;
