'use client';
import { useRef, useCallback } from 'react';

/** Generates all sound effects procedurally via Web Audio API — no audio files needed. */
export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, [enabled]);

  /** Rope cut — quick downward swish */
  const playCut = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }, [getCtx]);

  /** Star collected — bright sparkle chime */
  const playStar = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const freqs = [1046, 1318, 1568]; // C6 E6 G6
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    });
  }, [getCtx]);

  /** Om Nom eats — nomnom sound */
  const playEat = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.05);
    osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.12);
    osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }, [getCtx]);

  /** Level complete fanfare */
  const playSuccess = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const melody = [523, 659, 784, 1046]; // C5 E5 G5 C6
    melody.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    });
  }, [getCtx]);

  /** Level failed — descending sad tone */
  const playFail = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.48);
  }, [getCtx]);

  return { playCut, playStar, playEat, playSuccess, playFail };
}
