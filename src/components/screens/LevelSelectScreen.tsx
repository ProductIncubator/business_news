'use client';
import { motion } from 'framer-motion';
import { LEVELS } from '@/lib/game/levels';
import type { LevelResult } from '@/types/game';

interface Props {
  levelResults: LevelResult[];
  onSelectLevel: (id: number) => void;
  onBack: () => void;
}

const WORLDS = ['Cardboard Box', 'Fabric', 'Foil'] as const;
const WORLD_COLORS: Record<string, { bg: string; border: string; glow: string }> = {
  'Cardboard Box': { bg: 'from-amber-900/40 to-amber-800/20', border: 'border-amber-600/30', glow: 'shadow-amber-500/20' },
  Fabric: { bg: 'from-teal-900/40 to-teal-800/20', border: 'border-teal-500/30', glow: 'shadow-teal-500/20' },
  Foil: { bg: 'from-indigo-900/40 to-indigo-800/20', border: 'border-indigo-400/30', glow: 'shadow-indigo-400/20' },
};

function StarDisplay({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 justify-center mt-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`text-sm ${i < count ? 'text-yellow-400' : 'text-white/15'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export function LevelSelectScreen({ levelResults, onSelectLevel, onBack }: Props) {
  // A level is unlocked if it's level 1, or the previous level is completed
  const isUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return levelResults[levelId - 2]?.completed === true;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#0d0520] via-[#0f0728] to-[#1a1040] px-4 py-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-white">Levels</h2>
      </div>

      {/* Worlds */}
      {WORLDS.map((world) => {
        const worldLevels = LEVELS.filter((l) => l.world === world);
        const colors = WORLD_COLORS[world];
        return (
          <motion.section
            key={world}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-3">
              {world}
            </h3>
            <div className={`rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-3 grid grid-cols-4 gap-3`}>
              {worldLevels.map((level) => {
                const result = levelResults[level.id - 1];
                const unlocked = isUnlocked(level.id);
                return (
                  <motion.button
                    key={level.id}
                    onClick={() => unlocked && onSelectLevel(level.id)}
                    whileHover={unlocked ? { scale: 1.05 } : {}}
                    whileTap={unlocked ? { scale: 0.95 } : {}}
                    className={`relative flex flex-col items-center justify-center rounded-xl py-3 px-1 border transition-all ${
                      unlocked
                        ? `bg-white/10 ${colors.border} hover:bg-white/20 shadow-lg ${colors.glow} cursor-pointer`
                        : 'bg-white/5 border-white/10 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {unlocked ? (
                      <>
                        <span className="text-white font-bold text-lg leading-none">{level.id}</span>
                        <span className="text-white/50 text-[10px] mt-0.5 truncate w-full text-center px-1">
                          {level.name}
                        </span>
                        <StarDisplay count={result?.stars ?? 0} />
                        {result?.completed && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
                        )}
                      </>
                    ) : (
                      <span className="text-white/40 text-xl">🔒</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.section>
        );
      })}

      {/* Total stars */}
      <div className="mt-auto pt-4 text-center">
        <p className="text-white/40 text-sm">
          ⭐ {levelResults.reduce((s, r) => s + (r?.stars ?? 0), 0)} /{' '}
          {LEVELS.length * 3} stars collected
        </p>
      </div>
    </div>
  );
}
