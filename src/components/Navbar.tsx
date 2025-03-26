
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#" className="text-apple-black font-bold text-xl">
            Dining Philosophers
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#problem" className="text-apple-black hover:text-apple-blue transition-colors">
              Problem
            </a>
            <a href="#solutions" className="text-apple-black hover:text-apple-blue transition-colors">
              Solutions
            </a>
            <a href="#implementation" className="text-apple-black hover:text-apple-blue transition-colors">
              Implementation
            </a>
            <a href="#visualization" className="text-apple-black hover:text-apple-blue transition-colors">
              Visualization
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-apple-black focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        mobileMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white/90 backdrop-blur-lg px-6 py-4 space-y-4">
          <a 
            href="#problem" 
            className="block text-apple-black hover:text-apple-blue transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Problem
          </a>
          <a 
            href="#solutions" 
            className="block text-apple-black hover:text-apple-blue transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Solutions
          </a>
          <a 
            href="#implementation" 
            className="block text-apple-black hover:text-apple-blue transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Implementation
          </a>
          <a 
            href="#visualization" 
            className="block text-apple-black hover:text-apple-blue transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Visualization
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
