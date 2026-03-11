'use client';
import { motion } from 'framer-motion';

interface Props {
  levelName: string;
  onResume: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
  onMenu: () => void;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export function PauseScreen({
  levelName,
  onResume,
  onRestart,
  onLevelSelect,
  onMenu,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 w-72 flex flex-col gap-3"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-1">⏸ Paused</h2>
        <p className="text-white/50 text-sm text-center -mt-1">{levelName}</p>

        <button
          onClick={onResume}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all"
        >
          ▶ Resume
        </button>
        <button
          onClick={onRestart}
          className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 active:scale-95 transition-all"
        >
          🔄 Restart
        </button>
        <button
          onClick={onLevelSelect}
          className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 active:scale-95 transition-all"
        >
          📋 Levels
        </button>
        <button
          onClick={onMenu}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-semibold hover:bg-white/10 active:scale-95 transition-all"
        >
          🏠 Main Menu
        </button>

        {/* Sound toggles */}
        <div className="flex gap-3 mt-1">
          <button
            onClick={onToggleSound}
            className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all active:scale-95 ${
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400'
                : 'bg-white/5 border-white/10 text-white/30'
            }`}
          >
            🔊 SFX
          </button>
          <button
            onClick={onToggleMusic}
            className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all active:scale-95 ${
              musicEnabled
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400'
                : 'bg-white/5 border-white/10 text-white/30'
            }`}
          >
            🎵 Music
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
