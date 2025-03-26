
import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-12 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-apple-black">The Dining Philosophers</h3>
            <p className="text-apple-gray text-sm mb-4 max-w-md">
              An elegant exploration of synchronization challenges in concurrent systems, beautifully visualized to aid understanding of this classic computer science problem.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com" className="text-apple-gray hover:text-apple-blue transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" className="text-apple-gray hover:text-apple-blue transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" className="text-apple-gray hover:text-apple-blue transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4 text-apple-black uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-apple-gray hover:text-apple-blue transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#problem" className="text-apple-gray hover:text-apple-blue transition-colors text-sm">
                  Problem
                </a>
              </li>
              <li>
                <a href="#solutions" className="text-apple-gray hover:text-apple-blue transition-colors text-sm">
                  Solutions
                </a>
              </li>
              <li>
                <a href="#implementation" className="text-apple-gray hover:text-apple-blue transition-colors text-sm">
                  Implementation
                </a>
              </li>
              <li>
                <a href="#visualization" className="text-apple-gray hover:text-apple-blue transition-colors text-sm">
                  Visualization
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4 text-apple-black uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://en.wikipedia.org/wiki/Dining_philosophers_problem" target="_blank" rel="noopener noreferrer" className="text-apple-gray hover:text-apple-blue transition-colors text-sm">
                  Wikipedia
                </a>
              </li>
              <li>
                <a href="https://www.geeksforgeeks.org/dining-philosopher-problem-using-semaphores/" target="_blank" rel="noopener noreferrer" className="text-apple-gray hover:text-apple-blue transition-colors text-sm">
                  GeeksforGeeks
                </a>
              </li>
              <li>
                <a href="https://www.javatpoint.com/os-dining-philosophers-problem" target="_blank" rel="noopener noreferrer" className="text-apple-gray hover:text-apple-blue transition-colors text-sm">
                  JavaTpoint
                </a>
              </li>
              <li>
                <a href="https://www.cs.cmu.edu/~15213/recitations/dining.pdf" target="_blank" rel="noopener noreferrer" className="text-apple-gray hover:text-apple-blue transition-colors text-sm">
                  CMU CS Lecture
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-apple-gray">
            &copy; {new Date().getFullYear()} Dining Philosophers Visualization. All rights reserved.
          </p>
          <p className="text-xs text-apple-gray mt-2">
            A beautiful, minimalist exploration of a classic concurrency problem.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
