import { useState, useEffect } from 'react';
import LiquidEther from './components/LiquidEther';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import VFX from './components/VFX';
import Technical from './components/Technical';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'vfx', 'technical'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      <LiquidEther theme="gold" intensity="medium">
        <Navigation activeSection={activeSection} />
        <Hero />
        <About />
        <VFX />
        <Technical />
      </LiquidEther>
    </div>
  );
}

export default App;