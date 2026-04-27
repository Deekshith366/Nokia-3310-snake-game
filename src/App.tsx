import React from 'react';
import MusicPlayer, { Track } from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

// We use highly reliable audio tracks from common royalty-free / placeholder sources
const DUMMY_TRACKS: Track[] = [
  {
    id: 'track1',
    title: 'Cyber Synthwave 01',
    artist: 'AI.Gen',
    src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2452033bc2.mp3?filename=cyberpunk-2099-10701.mp3'
  },
  {
    id: 'track2',
    title: 'Neon Overdrive',
    artist: 'AI.Synth',
    src: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_eb347bb6b8.mp3?filename=dark-synthwave-124036.mp3'
  },
  {
    id: 'track3',
    title: 'Grid Runner',
    artist: 'Neural.Net',
    src: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_31743c58bc.mp3?filename=synthwave-80s-110045.mp3'
  }
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden sm:p-8 flex items-center justify-center relative select-none">
      
      {/* Background ambient neon glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-cyan-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-fuchsia-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      {/* Main Content Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start justify-center h-full pt-8 lg:pt-0">
        
        {/* Left Side: Game Section */}
        <div className="w-full flex-1 flex flex-col gap-6 order-2 lg:order-1 items-center justify-center">
          <SnakeGame />
        </div>

        {/* Right Side: Header and Music Player */}
        <div className="w-full lg:w-[400px] flex flex-col gap-8 order-1 lg:order-2 items-center lg:items-end">
          
          <div className="text-center lg:text-right mt-4 lg:mt-12">
             <h1 className="text-5xl lg:text-6xl font-black italic tracking-tighter uppercase mb-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                  Grid
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-400 to-purple-600 drop-shadow-[0_0_15px_rgba(217,70,239,0.4)]">
                  Runner
                </span>
             </h1>
             <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">
                Neural link established.
             </p>
          </div>

          <MusicPlayer tracks={DUMMY_TRACKS} />
          
        </div>
      </div>
    </div>
  );
}

