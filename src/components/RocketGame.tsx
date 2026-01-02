import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Zap, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';

export function RocketGame() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rocketPosition, setRocketPosition] = useState(50); // percentage from left
  const [meteorites, setMeteorites] = useState<{ id: number; x: number; y: number; speed: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const meteoriteIdRef = useRef(0);
  const scoreIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [stars, setStars] = useState<{ id: number; x: number; y: number; speed: number }[]>([]);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rocketGameHighScore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('rocketGameHighScore', score.toString());
    }
  }, [score, highScore]);

  // Generate stars for background animation
  useEffect(() => {
    const newStars = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: Math.random() * 0.3 + 0.1, // Slower speed: 0.1 to 0.4
    }));
    setStars(newStars);
  }, []);

  // Animate stars slowly
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setStars(prev => prev.map(star => ({
        ...star,
        y: star.y >= 100 ? 0 : star.y + star.speed,
      })));
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle keyboard controls
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setRocketPosition(prev => Math.max(5, prev - 5));
      } else if (e.key === 'ArrowRight') {
        setRocketPosition(prev => Math.min(95, prev + 5));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  // Handle touch/mouse controls for mobile
  const handleGameAreaTouch = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying || !gameAreaRef.current) return;

    const rect = gameAreaRef.current.getBoundingClientRect();
    let clientX: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setRocketPosition(Math.max(5, Math.min(95, percentage)));
  };

  const handleMoveLeft = () => {
    setRocketPosition(prev => Math.max(5, prev - 8));
  };

  const handleMoveRight = () => {
    setRocketPosition(prev => Math.min(95, prev + 8));
  };

  // Spawn meteorites
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const newMeteorite = {
        id: meteoriteIdRef.current++,
        x: Math.random() * 90 + 5, // 5% to 95%
        y: 0,
        speed: Math.random() * 1 + 1.5, // Random speed between 1.5 and 2.5
      };
      setMeteorites(prev => [...prev, newMeteorite]);
    }, 1200); // spawn every 1.2 seconds

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Move meteorites down
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setMeteorites(prev => {
        const updated = prev.map(meteorite => ({
          ...meteorite,
          y: meteorite.y + meteorite.speed,
        })).filter(meteorite => meteorite.y < 100);

        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Increment score over time
  useEffect(() => {
    if (!isPlaying) return;

    scoreIntervalRef.current = setInterval(() => {
      setScore(prev => prev + 1);
    }, 100); // +1 point every 0.1 seconds

    return () => {
      if (scoreIntervalRef.current) {
        clearInterval(scoreIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // Check collisions
  useEffect(() => {
    if (!isPlaying) return;

    meteorites.forEach(meteorite => {
      // Check if meteorite is at rocket level (bottom 15% of screen)
      if (meteorite.y >= 85) {
        const rocketHitbox = 8; // Hitbox size
        const distance = Math.abs(meteorite.x - rocketPosition);

        if (distance < rocketHitbox) {
          // Collision detected!
          stopGame();
        }
      }
    });
  }, [meteorites, rocketPosition, isPlaying]);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setRocketPosition(50);
    setMeteorites([]);
  };

  const stopGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    if (scoreIntervalRef.current) {
      clearInterval(scoreIntervalRef.current);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="bg-white rounded-xl border border-border/50 shadow-sm p-4 sm:p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 sm:size-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Rocket className="size-4 sm:size-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base">Rocket Escape</h3>
            <p className="text-muted-foreground text-xs sm:text-sm">Dodge the meteorites!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl">{score}</span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1 justify-end">
            <Trophy className="size-3" />
            Best: {highScore}
          </p>
        </div>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-b from-blue-50 to-purple-50 rounded-lg overflow-hidden border-2 border-border/50"
        onTouchStart={handleGameAreaTouch}
        onTouchMove={handleGameAreaTouch}
        onMouseMove={handleGameAreaTouch}
      >
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm z-10">
            <Rocket className="size-12 sm:size-16 text-blue-600" />
            <div className="text-center space-y-2">
              <h4 className="text-lg sm:text-xl">Ready to Escape?</h4>
              <p className="text-muted-foreground text-xs sm:text-sm">Use ← → arrows to dodge meteorites</p>
            </div>
            <button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              Start Game
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/80 backdrop-blur-sm z-10">
            <Zap className="size-12 sm:size-16 text-red-500" />
            <div className="text-center space-y-2">
              <h4 className="text-lg sm:text-xl">Game Over!</h4>
              <p className="text-muted-foreground text-sm sm:text-base">Score: {score}</p>
              {score === highScore && score > 0 && (
                <p className="text-yellow-600 text-xs sm:text-sm">🎉 New High Score!</p>
              )}
            </div>
            <button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Stars background - slower animation */}
        {stars.map(star => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-blue-300/50 rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
          />
        ))}

        {/* Rocket */}
        {isPlaying && (
          <motion.div
            className="absolute bottom-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-100"
            style={{ left: `${rocketPosition}%` }}
            animate={{ x: '-50%' }}
          >
            <Rocket className="size-6 sm:size-8 text-blue-600 rotate-0" style={{ transform: 'rotate(-90deg)' }} />
          </motion.div>
        )}

        {/* Meteorites */}
        <AnimatePresence>
          {meteorites.map(meteorite => (
            <motion.div
              key={meteorite.id}
              className="absolute"
              style={{
                left: `${meteorite.x}%`,
                top: `${meteorite.y}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-lg relative">
                {/* Inner glow */}
                <div className="absolute inset-1 bg-yellow-400 rounded-full opacity-50" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Mobile touch controls - on-screen buttons */}
        {isPlaying && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-4 sm:hidden z-20">
            <button
              onTouchStart={handleMoveLeft}
              className="size-16 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-blue-700 transition-colors shadow-lg"
            >
              <ChevronLeft className="size-8 text-white" />
            </button>
            <button
              onTouchStart={handleMoveRight}
              className="size-16 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-blue-700 transition-colors shadow-lg"
            >
              <ChevronRight className="size-8 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* Controls info */}
      {isPlaying && (
        <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground">
          <span className="hidden sm:inline">← → Move</span>
          <span className="sm:hidden">Tap screen or use buttons</span>
          <span>|</span>
          <span>Dodge meteorites to survive</span>
          <span>|</span>
          <button
            onClick={stopGame}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            Stop
          </button>
        </div>
      )}
    </motion.div>
  );
}