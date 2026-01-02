import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function SpaceAnimation() {
  // Simple creative art collection with SVG designs
  const artCollection = [
    {
      name: 'Sunrise',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90" cy="90" r="40" fill="white" />
          <line x1="90" y1="20" x2="90" y2="0" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="90" y1="160" x2="90" y2="180" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="20" y1="90" x2="0" y2="90" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="160" y1="90" x2="180" y2="90" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="35" y1="35" x2="20" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="145" y1="35" x2="160" y2="20" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="35" y1="145" x2="20" y2="160" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="145" y1="145" x2="160" y2="160" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Growing Plant',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 180 L90 80" stroke="white" strokeWidth="4" strokeLinecap="round"/>
          <ellipse cx="70" cy="70" rx="25" ry="35" fill="white"/>
          <ellipse cx="110" cy="70" rx="25" ry="35" fill="white"/>
          <ellipse cx="60" cy="100" rx="20" ry="28" fill="white"/>
          <ellipse cx="120" cy="100" rx="20" ry="28" fill="white"/>
          <rect x="75" y="170" width="30" height="10" rx="2" fill="white"/>
        </svg>
      )
    },
    {
      name: 'Mountain Peak',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 160 L90 20 L170 160 Z" fill="white"/>
          <path d="M90 20 L120 80 L90 60 L60 80 Z" fill="black"/>
          <circle cx="140" cy="50" r="15" fill="white"/>
        </svg>
      )
    },
    {
      name: 'Ocean Wave',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 90 Q 45 60, 90 90 T 180 90" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M0 110 Q 45 80, 90 110 T 180 110" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M0 130 Q 45 100, 90 130 T 180 130" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <circle cx="150" cy="40" r="3" fill="white"/>
          <circle cx="130" cy="50" r="2" fill="white"/>
          <circle cx="160" cy="55" r="2" fill="white"/>
        </svg>
      )
    },
    {
      name: 'Shooting Star',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 40 L100 70 L130 80 L100 90 L90 120 L80 90 L50 80 L80 70 Z" fill="white"/>
          <line x1="40" y1="90" x2="10" y2="100" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="100" x2="20" y2="115" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <line x1="45" y1="80" x2="15" y2="85" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Coffee Cup',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 70 L50 130 Q 50 150, 70 150 L110 150 Q 130 150, 130 130 L130 70 Z" fill="white" stroke="white" strokeWidth="3"/>
          <path d="M130 90 L150 90 Q 160 90, 160 100 L160 110 Q 160 120, 150 120 L130 120" stroke="white" strokeWidth="3" fill="none"/>
          <path d="M60 50 Q 70 30, 80 50" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M100 50 Q 110 30, 120 50" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Book',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="50" width="100" height="90" fill="white" stroke="white" strokeWidth="3"/>
          <path d="M90 50 L90 140" stroke="black" strokeWidth="2"/>
          <line x1="60" y1="80" x2="80" y2="80" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          <line x1="60" y1="100" x2="80" y2="100" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          <line x1="100" y1="80" x2="120" y2="80" stroke="black" strokeWidth="2" strokeLinecap="round"/>
          <line x1="100" y1="100" x2="120" y2="100" stroke="black" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Light Bulb',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90" cy="70" r="35" fill="white"/>
          <rect x="75" y="105" width="30" height="15" fill="white"/>
          <rect x="70" y="120" width="40" height="8" rx="4" fill="white"/>
          <rect x="80" y="128" width="20" height="15" fill="white"/>
          <line x1="90" y1="25" x2="90" y2="10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="40" x2="40" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <line x1="130" y1="40" x2="140" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Hourglass',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 30 L120 30 L120 50 L90 90 L120 130 L120 150 L60 150 L60 130 L90 90 L60 50 Z" fill="white" stroke="white" strokeWidth="3"/>
          <rect x="55" y="20" width="70" height="10" rx="2" fill="white"/>
          <rect x="55" y="150" width="70" height="10" rx="2" fill="white"/>
          <path d="M75 40 L105 40 L90 70 Z" fill="black"/>
        </svg>
      )
    },
    {
      name: 'Compass',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90" cy="90" r="50" stroke="white" strokeWidth="3" fill="none"/>
          <path d="M90 50 L100 90 L90 85 L80 90 Z" fill="white"/>
          <circle cx="90" cy="90" r="5" fill="white"/>
          <line x1="90" y1="35" x2="90" y2="45" stroke="white" strokeWidth="2"/>
          <line x1="90" y1="135" x2="90" y2="145" stroke="white" strokeWidth="2"/>
          <line x1="35" y1="90" x2="45" y2="90" stroke="white" strokeWidth="2"/>
          <line x1="135" y1="90" x2="145" y2="90" stroke="white" strokeWidth="2"/>
        </svg>
      )
    },
    {
      name: 'Heart Beat',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 140 C 90 140, 60 110, 60 85 C 60 65, 75 55, 90 65 C 105 55, 120 65, 120 85 C 120 110, 90 140, 90 140 Z" fill="white"/>
          <path d="M30 90 L50 90 L60 70 L70 110 L80 60 L90 90 L150 90" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Rocket Launch',
      component: (
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 20 L70 80 L70 120 L90 140 L110 120 L110 80 Z" fill="white"/>
          <circle cx="90" cy="50" r="8" fill="black"/>
          <path d="M70 80 L50 100 L70 100 Z" fill="white"/>
          <path d="M110 80 L130 100 L110 100 Z" fill="white"/>
          <ellipse cx="80" cy="145" rx="8" ry="15" fill="white" opacity="0.7"/>
          <ellipse cx="90" cy="150" rx="6" ry="18" fill="white" opacity="0.7"/>
          <ellipse cx="100" cy="145" rx="8" ry="15" fill="white" opacity="0.7"/>
        </svg>
      )
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artCollection.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [artCollection.length]);

  return (
    <div className="absolute inset-0 bg-black overflow-hidden">
      {/* Stars covering from top to bottom with fade effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }, (_, i) => {
          const topPosition = Math.random() * 100;
          const fadeOpacity = 1 - (topPosition / 120);
          
          return (
            <motion.div
              key={`star-${i}`}
              className="absolute text-white font-mono"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${topPosition}%`,
                fontSize: `${Math.random() * 10 + 6}px`,
                imageRendering: 'pixelated',
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, fadeOpacity * 0.8, fadeOpacity * 0.3, fadeOpacity * 1, 0],
              }}
              transition={{
                duration: 3,
                delay: Math.random() * 4,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
            >
              {['.', '*', '+', '·', '✦', '✧', '⋆'][Math.floor(Math.random() * 7)]}
            </motion.div>
          );
        })}
      </div>

      {/* Main content area - Center aligned, ends before bottom text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              {/* Simple SVG Art - Centered */}
              <motion.div
                className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
                initial={{ scale: 0.7, rotate: -15, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.7, rotate: 15, opacity: 0 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
              >
                {artCollection[currentIndex].component}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Text at the bottom - Smaller */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        >
          <motion.div
            className="text-white font-mono text-xs sm:text-base md:text-lg lg:text-xl tracking-widest"
            style={{
              textShadow: '0 0 15px rgba(255, 255, 255, 0.25)',
              fontFamily: 'monospace',
              letterSpacing: '0.25em',
            }}
            animate={{
              opacity: [0.6, 0.9, 0.6],
              textShadow: [
                '0 0 10px rgba(255, 255, 255, 0.2)',
                '0 0 20px rgba(255, 255, 255, 0.4)',
                '0 0 10px rgba(255, 255, 255, 0.2)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            TRACK YOUR DAILY JOURNEY
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-3" style={{
        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        imageRendering: 'pixelated',
        pointerEvents: 'none',
      }} />
    </div>
  );
}