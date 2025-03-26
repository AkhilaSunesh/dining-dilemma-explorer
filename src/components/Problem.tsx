
import React from 'react';

const Problem: React.FC = () => {
  return (
    <section id="problem" className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16 animate-fade-in">
          <h4 className="section-title">Understanding the Challenge</h4>
          <h2 className="title-medium mb-6 pb-2 subtle-underline inline-block">The Dining Philosophers Problem</h2>
          <p className="text-lg text-apple-gray max-w-3xl mx-auto">
            A fundamental synchronization problem that elegantly demonstrates the challenges in resource allocation and deadlock avoidance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-xl font-semibold mb-4 text-apple-black">The Setup</h3>
            <p className="mb-4 text-apple-darkgray">
              Five philosophers sit at a round table with five forks placed between them. Each philosopher alternates between thinking and eating.
            </p>
            <p className="mb-4 text-apple-darkgray">
              To eat, a philosopher needs two forks - one from their left and one from their right. After eating, they put both forks down and resume thinking.
            </p>
            
            <h3 className="text-xl font-semibold mb-4 mt-8 text-apple-black">The Challenges</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-apple-blue flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">1</div>
                <p className="text-apple-darkgray"><span className="font-semibold">Resource Contention:</span> Two philosophers share each fork, creating competition for resources.</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-apple-blue flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">2</div>
                <p className="text-apple-darkgray"><span className="font-semibold">Deadlock Risk:</span> If all philosophers pick up their left fork simultaneously, none can pick up their right fork, resulting in a deadlock.</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-apple-blue flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">3</div>
                <p className="text-apple-darkgray"><span className="font-semibold">Starvation Possibility:</span> Some philosophers might never get a chance to eat if their neighbors are greedy.</p>
              </li>
            </ul>
          </div>
          
          <div className="order-1 md:order-2 glass-panel p-6 rounded-2xl shadow-lg">
            <div className="aspect-square w-full relative">
              <div className="absolute inset-0 rounded-lg bg-apple-lightgray flex items-center justify-center">
                <div className="relative w-3/4 h-3/4">
                  {/* Table */}
                  <div className="absolute inset-0 rounded-full bg-white border border-gray-200 shadow-sm"></div>
                  
                  {/* Philosophers */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-apple-blue flex items-center justify-center text-white shadow-lg">P0</div>
                  <div className="absolute top-1/3 right-0 translate-x-1/2 w-12 h-12 rounded-full bg-apple-blue flex items-center justify-center text-white shadow-lg">P1</div>
                  <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-12 h-12 rounded-full bg-apple-blue flex items-center justify-center text-white shadow-lg">P2</div>
                  <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-12 h-12 rounded-full bg-apple-blue flex items-center justify-center text-white shadow-lg">P3</div>
                  <div className="absolute top-1/3 left-0 -translate-x-1/2 w-12 h-12 rounded-full bg-apple-blue flex items-center justify-center text-white shadow-lg">P4</div>
                  
                  {/* Forks */}
                  <div className="absolute top-1/8 right-1/4 w-8 h-2 bg-gray-400 rounded-full transform rotate-45 shadow">F0</div>
                  <div className="absolute top-1/4 right-1/8 w-8 h-2 bg-gray-400 rounded-full transform rotate-90 shadow">F1</div>
                  <div className="absolute bottom-1/8 right-1/3 w-8 h-2 bg-gray-400 rounded-full transform rotate-135 shadow">F2</div>
                  <div className="absolute bottom-1/8 left-1/3 w-8 h-2 bg-gray-400 rounded-full transform rotate-45 shadow">F3</div>
                  <div className="absolute top-1/4 left-1/8 w-8 h-2 bg-gray-400 rounded-full transform rotate-90 shadow">F4</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-apple-gray">
              Five philosophers around a table with five forks between them
            </div>
          </div>
        </div>
        
        <div className="mt-16 p-8 glass-panel rounded-2xl">
          <h3 className="text-xl font-semibold mb-4 text-apple-black">Real-world Analogies</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-semibold mb-2 text-apple-black">Database Transactions</h4>
              <p className="text-apple-gray text-sm">
                Multiple processes requesting locks on shared database resources, where improper lock management can lead to deadlocks.
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-semibold mb-2 text-apple-black">Thread Synchronization</h4>
              <p className="text-apple-gray text-sm">
                Concurrent threads in an application competing for system resources like memory, file handles, or network connections.
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-semibold mb-2 text-apple-black">Hardware Resources</h4>
              <p className="text-apple-gray text-sm">
                Multiple processes competing for limited physical resources such as CPU cores, GPU compute units, or I/O channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
