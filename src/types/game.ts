// Core vector type
export interface Vec2 {
  x: number;
  y: number;
}

// Verlet integration particle
export interface Particle {
  id: number;
  x: number;
  y: number;
  px: number; // previous x
  py: number; // previous y
  fixed: boolean;
  mass: number;
}

// Distance constraint linking two particles
export interface Constraint {
  id: number;
  p1: number; // particle index
  p2: number; // particle index
  restLength: number;
  active: boolean;
  ropeId: number;
}

// A rope is a chain of particles + constraints
export interface Rope {
  id: number;
  particleIds: number[]; // anchor first, candy last
  constraintIds: number[];
  color: string;
  active: boolean;
}

// Collectible star
export interface Star {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  collectAnim: number; // 0-1
  pulsePhase: number;
}

// Om Nom mouth state
export interface OmNomState {
  x: number;
  y: number;
  radius: number;
  eating: boolean;
  eatAnim: number; // 0-1
  happy: boolean;
}

// The candy ball
export interface CandyInfo {
  particleId: number;
  radius: number;
  color: string;
  collected: boolean;
  collectAnim: number;
}

// Visual slash effect when cutting
export interface CutLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  age: number; // frames since created
}

export type GamePhase =
  | 'menu'
  | 'levelSelect'
  | 'playing'
  | 'paused'
  | 'success'
  | 'failed'
  | 'allComplete';

export interface LevelResult {
  completed: boolean;
  stars: number; // 0-3
}

export interface GameState {
  phase: GamePhase;
  currentLevel: number;
  levelResults: LevelResult[];
  soundEnabled: boolean;
  musicEnabled: boolean;
}

// Rope anchor definition in a level (normalized 0-1 coords)
export interface RopeAnchor {
  x: number;
  y: number;
}

// Level configuration
export interface LevelConfig {
  id: number;
  name: string;
  world: string;
  difficulty: 'easy' | 'medium' | 'hard';
  ropeColor: string;
  anchors: RopeAnchor[];
  candyX: number; // normalized 0-1
  candyY: number;
  omNomX: number;
  omNomY: number;
  stars: Array<{ x: number; y: number }>; // normalized
}
