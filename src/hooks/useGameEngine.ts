'use client';
import { useRef, useState, useCallback, useEffect } from 'react';
import { GameEngine } from '@/lib/game/GameEngine';
import { LEVELS } from '@/lib/game/levels';
import { useSound } from '@/hooks/useSound';
import type { GameState, LevelResult } from '@/types/game';

const STORAGE_KEY = 'cut-the-rope-progress';

function loadResults(): LevelResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as LevelResult[];
  } catch {
    // ignore
  }
  return [];
}

function saveResults(results: LevelResult[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  } catch {
    // ignore
  }
}

export function useGameEngine() {
  const engineRef = useRef<GameEngine | null>(null);
  const rafRef = useRef<number>(0);
  const prevPhaseRef = useRef<string>('playing');

  const [gameState, setGameState] = useState<GameState>(() => ({
    phase: 'menu',
    currentLevel: 1,
    levelResults: loadResults(),
    soundEnabled: true,
    musicEnabled: false,
  }));

  const sound = useSound(gameState.soundEnabled);

  // ── Game loop ────────────────────────────────────────────────────────────
  const startLoop = useCallback(() => {
    const loop = () => {
      const engine = engineRef.current;
      if (!engine) return;

      engine.update();

      // React to phase changes
      if (engine.phase !== prevPhaseRef.current) {
        prevPhaseRef.current = engine.phase;

        if (engine.phase === 'success') {
          sound.playEat();
          setTimeout(() => sound.playSuccess(), 300);

          setGameState((prev) => {
            const results = [...prev.levelResults];
            const idx = prev.currentLevel - 1;
            const rating = engine.getStarRating();
            if (!results[idx] || results[idx].stars < rating) {
              results[idx] = { completed: true, stars: rating };
              saveResults(results);
            }
            const allDone =
              prev.currentLevel === LEVELS.length &&
              results.every((r) => r?.completed);
            return {
              ...prev,
              phase: allDone ? 'allComplete' : 'success',
              levelResults: results,
            };
          });
        }

        if (engine.phase === 'failed') {
          sound.playFail();
          setGameState((prev) => ({ ...prev, phase: 'failed' }));
        }
      }

      // Notify star collections
      engine.stars.forEach((s, i) => {
        if (s.collected && s.collectAnim < 0.1 && s.collectAnim > 0) {
          void i; // avoid lint warning
          sound.playStar();
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [sound]);

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  useEffect(() => () => stopLoop(), [stopLoop]);

  // ── Public API ───────────────────────────────────────────────────────────

  const startLevel = useCallback(
    (levelId: number) => {
      stopLoop();
      const config = LEVELS.find((l) => l.id === levelId);
      if (!config) return;
      engineRef.current = new GameEngine(config);
      prevPhaseRef.current = 'playing';
      setGameState((prev) => ({ ...prev, phase: 'playing', currentLevel: levelId }));
      startLoop();
    },
    [stopLoop, startLoop]
  );

  const handleCut = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      const engine = engineRef.current;
      if (!engine) return;
      const cut = engine.handleCut(x1, y1, x2, y2);
      if (cut > 0) sound.playCut();
    },
    [sound]
  );

  const pauseGame = useCallback(() => {
    stopLoop();
    setGameState((prev) => ({ ...prev, phase: 'paused' }));
  }, [stopLoop]);

  const resumeGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, phase: 'playing' }));
    startLoop();
  }, [startLoop]);

  const restartLevel = useCallback(() => {
    startLevel(gameState.currentLevel);
  }, [startLevel, gameState.currentLevel]);

  const nextLevel = useCallback(() => {
    const next = gameState.currentLevel + 1;
    if (next <= LEVELS.length) {
      startLevel(next);
    } else {
      setGameState((prev) => ({ ...prev, phase: 'allComplete' }));
    }
  }, [gameState.currentLevel, startLevel]);

  const goToMenu = useCallback(() => {
    stopLoop();
    engineRef.current = null;
    setGameState((prev) => ({ ...prev, phase: 'menu' }));
  }, [stopLoop]);

  const goToLevelSelect = useCallback(() => {
    stopLoop();
    engineRef.current = null;
    setGameState((prev) => ({ ...prev, phase: 'levelSelect' }));
  }, [stopLoop]);

  const toggleSound = useCallback(() => {
    setGameState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const toggleMusic = useCallback(() => {
    setGameState((prev) => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  }, []);

  return {
    engine: engineRef,
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
  };
}
