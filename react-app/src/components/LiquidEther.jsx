import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const LiquidEther = ({ theme = 'gold', intensity = 'medium', children }) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      });
    };

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const themeColors = {
    gold: {
      primary: '#ffd700',
      secondary: '#b8860b',
      accent: '#daa520',
      cyan: '#00d2d3',
      purple: '#6b4f96'
    },
    cyan: {
      primary: '#00d2d3',
      secondary: '#008b8d',
      accent: '#40e0d0',
      cyan: '#ffd700',
      purple: '#6b4f96'
    },
    purple: {
      primary: '#6b4f96',
      secondary: '#4a3269',
      accent: '#8b68a3',
      cyan: '#00d2d3',
      purple: '#ffd700'
    }
  };

  const currentTheme = themeColors[theme];

  const particleCount = intensity === 'high' ? 20 : intensity === 'medium' ? 12 : 6;

  return (
    <div ref={containerRef} className="liquid-ether-bg">
      {/* Mesh Gradient */}
      <div className="liquid-mesh" />
      
      {/* Main Liquid Blobs */}
      <motion.div
        className="liquid-blob liquid-blob-1"
        animate={{
          x: mousePosition.x * 30,
          y: mousePosition.y * 30,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        style={{
          background: `linear-gradient(45deg, ${currentTheme.primary}, ${currentTheme.cyan})`
        }}
      />
      
      <motion.div
        className="liquid-blob liquid-blob-2"
        animate={{
          x: mousePosition.x * -20,
          y: mousePosition.y * -20,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 25 }}
        style={{
          background: `linear-gradient(135deg, ${currentTheme.purple}, ${currentTheme.secondary})`
        }}
      />
      
      <motion.div
        className="liquid-blob liquid-blob-3"
        animate={{
          x: mousePosition.x * 15,
          y: mousePosition.y * -15,
        }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
        style={{
          background: `linear-gradient(225deg, ${currentTheme.accent}, ${currentTheme.cyan})`
        }}
      />

      {/* Morphing Shapes */}
      <div className="liquid-morph absolute top-1/3 right-1/5 animate-morph-shape"
           style={{
             background: `linear-gradient(45deg, ${currentTheme.primary}, ${currentTheme.cyan})`
           }} />
      
      <div className="liquid-morph absolute bottom-2/5 left-1/6 animate-morph-shape"
           style={{
             background: `linear-gradient(135deg, ${currentTheme.purple}, ${currentTheme.secondary})`,
             animationDelay: '-7s'
           }} />

      {/* Floating Particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="liquid-particle"
          style={{
            left: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? currentTheme.primary : currentTheme.cyan,
            animationDelay: `${Math.random() * 20}s`,
            animationDuration: `${8 + Math.random() * 8}s`
          }}
          animate={{
            scale: isVisible ? [1, 1.2, 1] : 1,
            opacity: isVisible ? [0.7, 1, 0.7] : 0.3
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Glowing Orbs */}
      <div className="liquid-orb absolute top-1/5 left-3/4 animate-pulse"
           style={{
             background: `radial-gradient(circle, ${currentTheme.primary} 0%, transparent 70%)`
           }} />
      
      <div className="liquid-orb absolute bottom-1/3 right-1/3"
           style={{
             background: `radial-gradient(circle, ${currentTheme.cyan} 0%, transparent 70%)`,
             animationDelay: '-2s'
           }} />
      
      <div className="liquid-orb absolute top-3/5 left-1/5"
           style={{
             background: `radial-gradient(circle, ${currentTheme.purple} 0%, transparent 70%)`,
             animationDelay: '-4s'
           }} />

      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default LiquidEther;