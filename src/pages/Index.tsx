
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Solutions from '../components/Solutions';
import Implementation from '../components/Implementation';
import PhilosopherTable from '../components/PhilosopherTable';
import Footer from '../components/Footer';

const Index = () => {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId || '');
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Account for fixed navbar
            behavior: 'smooth'
          });
          
          // Update URL without scrolling
          history.pushState(null, '', target.getAttribute('href') || '');
        }
      }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <Solutions />
      <Implementation />
      <PhilosopherTable />
      <Footer />
    </div>
  );
};

export default Index;
