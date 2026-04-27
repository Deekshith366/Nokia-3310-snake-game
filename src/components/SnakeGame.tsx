import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const FAST_SPEED = 100;
const SLOW_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    setFood(generateFood(INITIAL_SNAKE));
  }, [generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Escape') {
        if (!gameOver) setIsPaused(prev => !prev);
        return;
      }

      if (gameOver || isPaused) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
      setDirection(directionRef.current);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          handleGameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = score > 100 ? FAST_SPEED : SLOW_SPEED - Math.min(score, 50);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, score, generateFood]);

  const handleGameOver = () => {
    setGameOver(true);
    setHighScore(prev => Math.max(prev, score));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6 w-full h-full">
      {/* Center: Snake Game Window (Col 6) */}
      <div className="col-span-1 lg:col-span-6 flex flex-col h-full relative">
        <div className="relative flex-1 bg-[#0a0a0a] border-2 border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] min-h-[400px] flex items-center justify-center">
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 0)', backgroundSize: '25px 25px' }}></div>
          
          {/* Overlay HUD */}
          <div className="absolute top-4 lg:top-6 left-4 lg:left-6 flex gap-4 z-40">
            <div className="bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
              <span className="text-xs text-zinc-400 uppercase tracking-tighter">Status: </span>
              <span className={`text-xs font-bold ${gameOver ? 'text-red-500' : isPaused ? 'text-yellow-400' : 'text-green-400'} ${(!gameOver && !isPaused) ? 'animate-pulse' : ''}`}>
                 {gameOver ? 'CRITICAL FAILURE' : isPaused ? 'PAUSED' : 'RUNNING'}
              </span>
            </div>
          </div>

          {/* Game Board (Square) */}
          <div className="relative w-full max-w-[500px] aspect-square bg-transparent z-10 flex items-center justify-center p-4">
             <div 
               className="w-full h-full grid"
               style={{ 
                 gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                 gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
               }}
             >
                {/* Food */}
                <div
                  className="bg-fuchsia-500 shadow-[0_0_15px_#d946ef] rounded-[4px] z-10 m-[2px] animate-pulse"
                  style={{
                    gridColumn: food.x + 1,
                    gridRow: food.y + 1,
                  }}
                />

                {/* Snake */}
                {snake.map((segment, index) => {
                  const isHead = index === 0;
                  const opacity = Math.max(0.2, 1 - (index * 0.04));
                  return (
                    <motion.div
                      key={`${segment.x}-${segment.y}-${index}`}
                      initial={isHead ? { scale: 0.8 } : false}
                      animate={{ scale: 1 }}
                      className={isHead ? 'bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-20 rounded-sm' : 'bg-cyan-400/80 shadow-[0_0_5px_#22d3ee] z-10 rounded-sm'}
                      style={{
                        gridColumn: segment.x + 1,
                        gridRow: segment.y + 1,
                        opacity: isHead ? 1 : opacity,
                        margin: isHead ? '0px' : '1px'
                      }}
                    />
                  );
                })}
             </div>
          </div>

          {/* Overlays */}
          {(gameOver || isPaused) && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              {gameOver ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
                  <div className="text-red-500 text-4xl lg:text-5xl font-black tracking-widest drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] uppercase leading-none">
                    Terminal<br/>Failure
                  </div>
                  <button onClick={resetGame} className="mt-4 px-8 py-3 bg-red-500/10 border-2 border-red-500 text-red-500 font-mono font-bold tracking-wider rounded-full hover:bg-red-500 hover:text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all">
                    REBOOT SYSTEM
                  </button>
                </motion.div>
              ) : (
                <div className="text-yellow-400 text-3xl font-bold font-mono tracking-widest drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] uppercase animate-pulse">
                  SYSTEM PAUSED
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar: Stats & Controls (Col 3) */}
      <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
        
        {/* Score Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Total Score</span>
          <div className="text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600">
            {score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
          <div className="flex items-center gap-3 mt-4 px-4 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/30">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">High Score</span>
            <span className="text-[11px] font-mono text-cyan-200">
              {highScore.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>
          </div>
        </div>

        {/* Controls Guide Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex flex-col flex-1 shadow-xl backdrop-blur-md">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Operations Guide</h3>
          
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-300">Vector Control</span>
              <div className="flex gap-1">
                {['W','A','S','D'].map(k => (
                   <kbd key={k} className="bg-zinc-800 border border-zinc-700 w-6 h-6 flex items-center justify-center rounded text-cyan-400 font-mono text-[10px] shadow-sm">{k}</kbd>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-300">Suspend Task</span>
              <kbd className="bg-zinc-800 border border-zinc-700 px-3 py-1 rounded text-yellow-400 font-mono text-[10px] shadow-sm">SPACE</kbd>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-300">Force Restart</span>
              <button onClick={resetGame} className="bg-zinc-800 border border-zinc-700 hover:border-red-500 px-3 py-1 rounded text-red-400 hover:text-red-500 font-mono text-[10px] shadow-sm transition-colors uppercase tracking-wider">
                Reboot
              </button>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-zinc-800/50 text-center">
             <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-widest">
               Grid Size: {GRID_SIZE}x{GRID_SIZE}
             </span>
          </div>
        </div>

      </div>
    </div>
  );
}
