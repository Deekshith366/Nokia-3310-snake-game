import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  src: string;
}

interface MusicPlayerProps {
  tracks: Track[];
}

export default function MusicPlayer({ tracks }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play blocked by browser:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    playNext();
  };

  const toggleMute = () => {
    setVolume(volume === 0 ? 1 : 0);
  };

  const visualizerHeights = [40, 60, 100, 80, 40, 60];

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Neural Audio Library Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex flex-col shadow-2xl backdrop-blur-md">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">Neural Audio Library</h2>
        <div className="space-y-4">
          {tracks.map((track, i) => {
            const isActive = i === currentTrackIndex;
            return (
              <div
                key={track.id}
                onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
                className={`group p-3 rounded-xl flex flex-col gap-1 cursor-pointer transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                    : 'bg-zinc-800/40 border border-zinc-700 hover:bg-zinc-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-bold ${isActive ? 'text-cyan-300' : 'text-zinc-300'}`}>
                    0{i + 1}. {track.title}
                  </span>
                  {isActive && isPlaying && (
                     <span className="text-[10px] font-mono text-cyan-500 animate-pulse">PLAYING</span>
                  )}
                </div>
                <span className={`text-[11px] ${isActive ? 'text-cyan-600' : 'text-zinc-500'}`}>
                  {track.artist}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visualizer Card */}
      <div className="bg-fuchsia-950/20 border border-fuchsia-500/20 rounded-2xl p-4 h-32 flex items-end justify-between gap-1 overflow-hidden">
        {visualizerHeights.map((h, i) => (
           <motion.div
             key={i}
             animate={{ height: isPlaying ? [`${h}%`, `${Math.max(20, h - 30)}%`, `${h}%`] : '10%' }}
             transition={{ repeat: Infinity, duration: 0.5 + (i * 0.1), ease: "easeInOut" }}
             className="w-full bg-fuchsia-500 rounded-sm"
             style={{ height: `${h}%`, opacity: 0.4 + (i * 0.1) }}
           />
        ))}
      </div>

      {/* Music Controls Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-md flex-1">
        <div>
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Playback</h3>
              <button onClick={toggleMute} className="text-zinc-500 hover:text-white transition-colors">
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
           </div>
           
           <div className="w-full h-1 bg-zinc-800 rounded-full relative overflow-hidden mb-2">
             <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 shadow-[0_0_10px_#22d3ee]"
                animate={{ width: isPlaying ? '100%' : '0%' }}
                transition={{ duration: 180, ease: 'linear' }}
             />
           </div>
           <div className="flex justify-between text-[10px] font-mono text-zinc-600">
             <span className="text-cyan-400 font-bold truncate max-w-[150px]">{currentTrack.title}</span>
             <span className="animate-pulse">{isPlaying ? 'SYNCING...' : 'PAUSED'}</span>
           </div>
        </div>

        <div className="flex items-center justify-center gap-6 py-4">
          <button onClick={playPrev} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
             <SkipBack className="w-6 h-6" fill="currentColor" />
          </button>
          <button onClick={togglePlay} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">
             {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
          <button onClick={playNext} className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
             <SkipForward className="w-6 h-6" fill="currentColor" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
           <div className="bg-zinc-800/50 p-3 rounded-2xl flex flex-col items-center">
             <span className="text-[9px] text-zinc-500 uppercase font-bold">BPM</span>
             <span className="text-sm font-mono text-white">128</span>
           </div>
           <div className="bg-zinc-800/50 p-3 rounded-2xl flex flex-col items-center">
             <span className="text-[9px] text-zinc-500 uppercase font-bold">Level</span>
             <span className="text-sm font-mono text-white">08</span>
           </div>
        </div>
      </div>
    </div>
  );
}
