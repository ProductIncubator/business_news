'use client';
import { useRef, useEffect, useCallback, MutableRefObject } from 'react';
import type { GameEngine } from '@/lib/game/GameEngine';
import { GameRenderer } from '@/components/game/GameRenderer';
import { CANVAS_W, CANVAS_H } from '@/lib/game/levels';

interface Props {
  engineRef: MutableRefObject<GameEngine | null>;
  onCut: (x1: number, y1: number, x2: number, y2: number) => void;
  onPause: () => void;
}

export function GameCanvas({ engineRef, onCut, onPause }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const rafRef = useRef<number>(0);

  // Drag state
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragCur = useRef({ x: 0, y: 0 });

  // ── Canvas coordinate conversion ─────────────────────────────────────────
  const toCanvas = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((clientY - rect.top) / rect.height) * CANVAS_H,
    };
  }, []);

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const pos = toCanvas(e.clientX, e.clientY);
      dragging.current = true;
      dragStart.current = pos;
      dragCur.current = pos;
    },
    [toCanvas]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging.current) return;
      dragCur.current = toCanvas(e.clientX, e.clientY);
    },
    [toCanvas]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      const end = toCanvas(e.clientX, e.clientY);
      onCut(dragStart.current.x, dragStart.current.y, end.x, end.y);
    },
    [toCanvas, onCut]
  );

  // ── Touch handlers ────────────────────────────────────────────────────────
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      const pos = toCanvas(t.clientX, t.clientY);
      dragging.current = true;
      dragStart.current = pos;
      dragCur.current = pos;
    },
    [toCanvas]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!dragging.current) return;
      const t = e.touches[0];
      dragCur.current = toCanvas(t.clientX, t.clientY);
    },
    [toCanvas]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (!dragging.current) return;
      dragging.current = false;
      const t = e.changedTouches[0];
      const end = toCanvas(t.clientX, t.clientY);
      onCut(dragStart.current.x, dragStart.current.y, end.x, end.y);
    },
    [toCanvas, onCut]
  );

  // ── Render loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    rendererRef.current = new GameRenderer(ctx, CANVAS_W, CANVAS_H);

    const loop = () => {
      const engine = engineRef.current;
      if (engine && rendererRef.current) {
        rendererRef.current.render(
          engine,
          dragging.current,
          dragStart.current.x,
          dragStart.current.y,
          dragCur.current.x,
          dragCur.current.y
        );
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [engineRef]);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Pause button */}
      <button
        onClick={onPause}
        className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Pause"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <rect x="2" y="2" width="4" height="12" rx="1" />
          <rect x="10" y="2" width="4" height="12" rx="1" />
        </svg>
      </button>

      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="max-w-full max-h-full cursor-crosshair touch-none select-none"
        style={{ imageRendering: 'pixelated' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
    </div>
  );
}
