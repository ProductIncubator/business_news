import type { LevelConfig } from '@/types/game';

// Canvas base dimensions (physics/render coords)
export const CANVAS_W = 400;
export const CANVAS_H = 700;

/**
 * All 12 levels.
 * Positions are normalized (0-1) relative to CANVAS_W × CANVAS_H.
 * Ropes connect each anchor to the shared candy particle.
 */
export const LEVELS: LevelConfig[] = [
  // ── WORLD 1: CARDBOARD BOX (levels 1-4, easy) ────────────────────────────
  {
    id: 1,
    name: 'First Cut',
    world: 'Cardboard Box',
    difficulty: 'easy',
    ropeColor: '#c8a06e',
    anchors: [{ x: 0.5, y: 0.04 }],
    candyX: 0.5,
    candyY: 0.47,
    omNomX: 0.5,
    omNomY: 0.89,
    stars: [],
  },
  {
    id: 2,
    name: 'Star Shower',
    world: 'Cardboard Box',
    difficulty: 'easy',
    ropeColor: '#c8a06e',
    anchors: [{ x: 0.5, y: 0.04 }],
    candyX: 0.5,
    candyY: 0.41,
    omNomX: 0.5,
    omNomY: 0.89,
    stars: [
      { x: 0.5, y: 0.57 },
      { x: 0.5, y: 0.68 },
      { x: 0.5, y: 0.78 },
    ],
  },
  {
    id: 3,
    name: 'Go Left',
    world: 'Cardboard Box',
    difficulty: 'easy',
    ropeColor: '#c8a06e',
    anchors: [
      { x: 0.275, y: 0.04 },
      { x: 0.775, y: 0.04 },
    ],
    candyX: 0.5,
    candyY: 0.36,
    omNomX: 0.125,
    omNomY: 0.89,
    stars: [
      { x: 0.3, y: 0.62 },
      { x: 0.17, y: 0.76 },
    ],
  },
  {
    id: 4,
    name: 'Go Right',
    world: 'Cardboard Box',
    difficulty: 'easy',
    ropeColor: '#c8a06e',
    anchors: [
      { x: 0.225, y: 0.04 },
      { x: 0.775, y: 0.04 },
    ],
    candyX: 0.5,
    candyY: 0.34,
    omNomX: 0.875,
    omNomY: 0.89,
    stars: [
      { x: 0.7, y: 0.62 },
      { x: 0.83, y: 0.76 },
    ],
  },

  // ── WORLD 2: FABRIC (levels 5-8, medium) ─────────────────────────────────
  {
    id: 5,
    name: 'Three Ropes',
    world: 'Fabric',
    difficulty: 'medium',
    ropeColor: '#5eead4',
    anchors: [
      { x: 0.175, y: 0.04 },
      { x: 0.5, y: 0.04 },
      { x: 0.825, y: 0.04 },
    ],
    candyX: 0.5,
    candyY: 0.31,
    omNomX: 0.875,
    omNomY: 0.9,
    stars: [
      { x: 0.62, y: 0.5 },
      { x: 0.75, y: 0.64 },
      { x: 0.85, y: 0.77 },
    ],
  },
  {
    id: 6,
    name: 'Long Swing',
    world: 'Fabric',
    difficulty: 'medium',
    ropeColor: '#5eead4',
    anchors: [
      { x: 0.125, y: 0.04 },
      { x: 0.925, y: 0.04 },
    ],
    candyX: 0.5,
    candyY: 0.27,
    omNomX: 0.125,
    omNomY: 0.9,
    stars: [
      { x: 0.25, y: 0.57 },
      { x: 0.15, y: 0.72 },
      { x: 0.13, y: 0.83 },
    ],
  },
  {
    id: 7,
    name: 'Deep Drop',
    world: 'Fabric',
    difficulty: 'medium',
    ropeColor: '#5eead4',
    anchors: [
      { x: 0.35, y: 0.04 },
      { x: 0.65, y: 0.04 },
    ],
    candyX: 0.5,
    candyY: 0.5,
    omNomX: 0.5,
    omNomY: 0.9,
    stars: [
      { x: 0.375, y: 0.69 },
      { x: 0.5, y: 0.79 },
      { x: 0.625, y: 0.69 },
    ],
  },
  {
    id: 8,
    name: 'Zigzag Stars',
    world: 'Fabric',
    difficulty: 'medium',
    ropeColor: '#5eead4',
    anchors: [
      { x: 0.25, y: 0.04 },
      { x: 0.5, y: 0.04 },
      { x: 0.75, y: 0.04 },
    ],
    candyX: 0.5,
    candyY: 0.31,
    omNomX: 0.5,
    omNomY: 0.9,
    stars: [
      { x: 0.37, y: 0.52 },
      { x: 0.63, y: 0.62 },
      { x: 0.5, y: 0.76 },
    ],
  },

  // ── WORLD 3: FOIL (levels 9-12, hard) ────────────────────────────────────
  {
    id: 9,
    name: 'Precision',
    world: 'Foil',
    difficulty: 'hard',
    ropeColor: '#a5b4fc',
    anchors: [
      { x: 0.15, y: 0.04 },
      { x: 0.925, y: 0.3 },
    ],
    candyX: 0.5,
    candyY: 0.44,
    omNomX: 0.125,
    omNomY: 0.9,
    stars: [
      { x: 0.3, y: 0.62 },
      { x: 0.19, y: 0.73 },
      { x: 0.13, y: 0.84 },
    ],
  },
  {
    id: 10,
    name: 'Four Anchors',
    world: 'Foil',
    difficulty: 'hard',
    ropeColor: '#a5b4fc',
    anchors: [
      { x: 0.125, y: 0.04 },
      { x: 0.375, y: 0.04 },
      { x: 0.625, y: 0.04 },
      { x: 0.875, y: 0.04 },
    ],
    candyX: 0.5,
    candyY: 0.3,
    omNomX: 0.875,
    omNomY: 0.9,
    stars: [
      { x: 0.67, y: 0.47 },
      { x: 0.77, y: 0.61 },
      { x: 0.85, y: 0.75 },
    ],
  },
  {
    id: 11,
    name: 'Spider Web',
    world: 'Foil',
    difficulty: 'hard',
    ropeColor: '#a5b4fc',
    anchors: [
      { x: 0.175, y: 0.04 },
      { x: 0.5, y: 0.04 },
      { x: 0.875, y: 0.29 },
    ],
    candyX: 0.5,
    candyY: 0.39,
    omNomX: 0.175,
    omNomY: 0.9,
    stars: [
      { x: 0.35, y: 0.55 },
      { x: 0.25, y: 0.67 },
      { x: 0.175, y: 0.8 },
    ],
  },
  {
    id: 12,
    name: 'Master Class',
    world: 'Foil',
    difficulty: 'hard',
    ropeColor: '#a5b4fc',
    anchors: [
      { x: 0.1, y: 0.04 },
      { x: 0.35, y: 0.04 },
      { x: 0.65, y: 0.04 },
      { x: 0.9, y: 0.04 },
    ],
    candyX: 0.5,
    candyY: 0.29,
    omNomX: 0.9,
    omNomY: 0.9,
    stars: [
      { x: 0.67, y: 0.46 },
      { x: 0.79, y: 0.59 },
      { x: 0.88, y: 0.73 },
    ],
  },
];
