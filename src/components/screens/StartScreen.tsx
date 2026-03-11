'use client';
import { motion } from 'framer-motion';

interface Props {
  onPlay: () => void;
  onLevelSelect: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export function StartScreen({ onPlay, onLevelSelect, soundEnabled, musicEnabled, onToggleSound, onToggleMusic }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-[#0d0520] via-[#0f0728] to-[#1a1040] relative overflow-hidden">
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Om Nom mascot */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="mb-4"
      >
        <OmNomIcon />
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.15 }}
        className="text-center mb-2"
      >
        <h1 className="text-5xl font-black text-white drop-shadow-[0_0_20px_rgba(74,222,128,0.8)] tracking-tight">
          Cut the Rope
        </h1>
        <p className="text-emerald-400 text-lg mt-1 font-medium">
          Physics puzzle adventure
        </p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-3 w-full max-w-xs mt-8"
      >
        <button
          onClick={onPlay}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xl shadow-lg shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all"
        >
          🎮 Play
        </button>
        <button
          onClick={onLevelSelect}
          className="w-full py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white font-semibold text-lg hover:bg-white/20 active:scale-95 transition-all"
        >
          📋 Level Select
        </button>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 mt-6"
      >
        <ToggleButton active={soundEnabled} onClick={onToggleSound} label="SFX">
          🔊
        </ToggleButton>
        <ToggleButton active={musicEnabled} onClick={onToggleMusic} label="Music">
          🎵
        </ToggleButton>
      </motion.div>

      {/* Controls hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 text-center text-white/40 text-sm max-w-xs"
      >
        <p>🖱️ Drag across ropes to cut them</p>
        <p className="mt-1">👆 Swipe on mobile</p>
      </motion.div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-5 py-3 rounded-xl border transition-all active:scale-95 ${
        active
          ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400'
          : 'bg-white/5 border-white/10 text-white/30'
      }`}
    >
      <span className="text-xl">{children}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function OmNomIcon() {
  return (
    <motion.svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Body */}
      <defs>
        <radialGradient id="bodyGrad" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="55" r="38" fill="url(#bodyGrad)" />
      {/* Belly */}
      <ellipse cx="50" cy="65" rx="22" ry="16" fill="rgba(134,239,172,0.25)" />
      {/* Mouth */}
      <path d="M 30 60 Q 50 76 70 60" fill="#dc2626" />
      {/* Teeth */}
      <rect x="38" y="56" width="8" height="7" rx="2" fill="white" />
      <rect x="54" y="56" width="8" height="7" rx="2" fill="white" />
      {/* Eyes */}
      <circle cx="35" cy="44" r="9" fill="white" />
      <circle cx="65" cy="44" r="9" fill="white" />
      <circle cx="37" cy="44" r="5" fill="#1e1b4b" />
      <circle cx="67" cy="44" r="5" fill="#1e1b4b" />
      <circle cx="39" cy="41" r="2" fill="white" />
      <circle cx="69" cy="41" r="2" fill="white" />
      {/* Rope above */}
      <line x1="50" y1="17" x2="50" y2="4" stroke="#c8a06e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="4" r="4" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
    </motion.svg>
  );
}
