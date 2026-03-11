'use client';
import { motion } from 'framer-motion';

interface Props {
  success: boolean;
  stars: number; // 0-3
  levelName: string;
  isLastLevel: boolean;
  onNext: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
}

function AnimatedStar({ index, earned }: { index: number; earned: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: earned ? 1 : 0.6, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 18,
        delay: 0.3 + index * 0.15,
      }}
      className={`text-5xl ${earned ? 'drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]' : 'opacity-20'}`}
    >
      ★
    </motion.div>
  );
}

export function EndScreen({ success, stars, levelName, isLastLevel, onNext, onRestart, onLevelSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-20"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-7 w-80 flex flex-col items-center gap-4"
      >
        {success ? (
          <>
            {/* Success header */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.05 }}
              className="text-6xl"
            >
              🎉
            </motion.div>
            <h2 className="text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(74,222,128,0.6)]">
              Yummy!
            </h2>
            <p className="text-white/60 text-sm">{levelName}</p>

            {/* Stars */}
            <div className="flex gap-3 text-yellow-400 my-1">
              {[0, 1, 2].map((i) => (
                <AnimatedStar key={i} index={i} earned={i < stars} />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 w-full mt-1">
              {!isLastLevel && (
                <button
                  onClick={onNext}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:from-emerald-400 hover:to-teal-400 active:scale-95 transition-all"
                >
                  Next Level →
                </button>
              )}
              <button
                onClick={onRestart}
                className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 active:scale-95 transition-all"
              >
                🔄 Play Again
              </button>
              <button
                onClick={onLevelSelect}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-semibold hover:bg-white/10 active:scale-95 transition-all"
              >
                📋 Level Select
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Failed header */}
            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
              className="text-6xl"
            >
              😢
            </motion.div>
            <h2 className="text-3xl font-black text-red-400">Oh no!</h2>
            <p className="text-white/60 text-sm text-center">
              The candy missed Om Nom...
            </p>
            <p className="text-white/40 text-xs">{levelName}</p>

            <div className="flex flex-col gap-2 w-full mt-2">
              <button
                onClick={onRestart}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold hover:from-red-400 hover:to-rose-400 active:scale-95 transition-all"
              >
                🔄 Try Again
              </button>
              <button
                onClick={onLevelSelect}
                className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white/60 font-semibold hover:bg-white/20 active:scale-95 transition-all"
              >
                📋 Level Select
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
