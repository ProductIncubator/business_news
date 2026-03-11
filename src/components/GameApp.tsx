'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameEngine } from '@/hooks/useGameEngine';
import { GameCanvas } from '@/components/game/GameCanvas';
import { StartScreen } from '@/components/screens/StartScreen';
import { LevelSelectScreen } from '@/components/screens/LevelSelectScreen';
import { PauseScreen } from '@/components/screens/PauseScreen';
import { EndScreen } from '@/components/screens/EndScreen';
import { LEVELS } from '@/lib/game/levels';

export default function GameApp() {
  const {
    engine,
    gameState,
    startLevel,
    handleCut,
    pauseGame,
    resumeGame,
    restartLevel,
    nextLevel,
    goToMenu,
    goToLevelSelect,
    toggleSound,
    toggleMusic,
  } = useGameEngine();

  const currentConfig = LEVELS.find((l) => l.id === gameState.currentLevel);
  const currentLevelName = currentConfig ? `Level ${currentConfig.id} — ${currentConfig.name}` : '';
  const isLastLevel = gameState.currentLevel === LEVELS.length;

  const engineStarRating = engine.current?.getStarRating() ?? 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060412] overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ── MENU ─────────────────────────────────────────────────────────── */}
        {gameState.phase === 'menu' && (
          <motion.div
            key="menu"
            className="w-full h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <StartScreen
              onPlay={() => {
                // Start from first incomplete level or level 1
                const firstIncomplete = LEVELS.findIndex(
                  (_, i) => !gameState.levelResults[i]?.completed
                );
                startLevel(firstIncomplete === -1 ? 1 : LEVELS[firstIncomplete].id);
              }}
              onLevelSelect={goToLevelSelect}
              soundEnabled={gameState.soundEnabled}
              musicEnabled={gameState.musicEnabled}
              onToggleSound={toggleSound}
              onToggleMusic={toggleMusic}
            />
          </motion.div>
        )}

        {/* ── LEVEL SELECT ─────────────────────────────────────────────────── */}
        {gameState.phase === 'levelSelect' && (
          <motion.div
            key="levelSelect"
            className="w-full h-screen"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <LevelSelectScreen
              levelResults={gameState.levelResults}
              onSelectLevel={startLevel}
              onBack={goToMenu}
            />
          </motion.div>
        )}

        {/* ── PLAYING / PAUSED / SUCCESS / FAILED ──────────────────────────── */}
        {(gameState.phase === 'playing' ||
          gameState.phase === 'paused' ||
          gameState.phase === 'success' ||
          gameState.phase === 'failed') && (
          <motion.div
            key="game"
            className="relative w-full h-screen flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            {/* HUD */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-0.5">
              <span className="text-white/80 text-xs font-semibold">{currentLevelName}</span>
              <span className="text-white/40 text-xs">{currentConfig?.world}</span>
            </div>

            {/* Game canvas */}
            <GameCanvas engineRef={engine} onCut={handleCut} onPause={pauseGame} />

            {/* Pause overlay */}
            <AnimatePresence>
              {gameState.phase === 'paused' && (
                <PauseScreen
                  levelName={currentLevelName}
                  onResume={resumeGame}
                  onRestart={restartLevel}
                  onLevelSelect={goToLevelSelect}
                  onMenu={goToMenu}
                  soundEnabled={gameState.soundEnabled}
                  musicEnabled={gameState.musicEnabled}
                  onToggleSound={toggleSound}
                  onToggleMusic={toggleMusic}
                />
              )}
            </AnimatePresence>

            {/* End screen */}
            <AnimatePresence>
              {(gameState.phase === 'success' || gameState.phase === 'failed') && (
                <EndScreen
                  success={gameState.phase === 'success'}
                  stars={engineStarRating}
                  levelName={currentLevelName}
                  isLastLevel={isLastLevel}
                  onNext={nextLevel}
                  onRestart={restartLevel}
                  onLevelSelect={goToLevelSelect}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── ALL COMPLETE ─────────────────────────────────────────────────── */}
        {gameState.phase === 'allComplete' && (
          <motion.div
            key="complete"
            className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-b from-[#0d0520] to-[#1a1040] px-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🏆
            </motion.div>
            <h2 className="text-4xl font-black text-white drop-shadow-[0_0_20px_rgba(251,191,36,0.7)]">
              You Win!
            </h2>
            <p className="text-white/60 mt-2 text-lg">All levels complete!</p>
            <div className="text-2xl mt-3 text-yellow-400">
              ⭐ {gameState.levelResults.reduce((s, r) => s + (r?.stars ?? 0), 0)} /{' '}
              {LEVELS.length * 3}
            </div>
            <div className="flex flex-col gap-3 mt-8 w-full max-w-xs">
              <button
                onClick={() => startLevel(1)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold text-lg hover:from-yellow-400 hover:to-amber-400 active:scale-95 transition-all"
              >
                🔄 Play Again
              </button>
              <button
                onClick={goToLevelSelect}
                className="w-full py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 active:scale-95 transition-all"
              >
                📋 Level Select
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
