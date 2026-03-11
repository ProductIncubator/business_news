import { PhysicsWorld } from '@/lib/physics/PhysicsWorld';
import { CANVAS_W, CANVAS_H } from '@/lib/game/levels';
import type { LevelConfig, Star, OmNomState, CandyInfo, CutLine } from '@/types/game';

const STAR_COLLECT_RADIUS = 28;
const OMNOM_EAT_RADIUS = 42;
const OUT_OF_BOUNDS_MARGIN = 80;
const CUT_LINE_MAX_AGE = 18;

export type EnginePhase = 'playing' | 'success' | 'failed';

export class GameEngine {
  physics: PhysicsWorld;
  stars: Star[];
  omNom: OmNomState;
  candy: CandyInfo;
  cutLines: CutLine[];
  phase: EnginePhase;
  starsCollected: number;
  frameCount: number;
  private config: LevelConfig;

  constructor(config: LevelConfig) {
    this.config = config;
    this.physics = new PhysicsWorld(CANVAS_W, CANVAS_H);
    this.cutLines = [];
    this.phase = 'playing';
    this.starsCollected = 0;
    this.frameCount = 0;

    // ── Candy particle (shared endpoint for all ropes) ────────────────────
    const cx = config.candyX * CANVAS_W;
    const cy = config.candyY * CANVAS_H;
    const candyId = this.physics.addParticle(cx, cy, false);

    this.candy = {
      particleId: candyId,
      radius: 18,
      color: '#4ade80',
      collected: false,
      collectAnim: 0,
    };

    // ── Build ropes from each anchor to the candy ─────────────────────────
    for (const anchor of config.anchors) {
      this.physics.addRope(
        anchor.x * CANVAS_W,
        anchor.y * CANVAS_H,
        candyId,
        config.ropeColor
      );
    }

    // ── Stars ─────────────────────────────────────────────────────────────
    this.stars = config.stars.map((s: { x: number; y: number }, i: number) => ({
      id: i,
      x: s.x * CANVAS_W,
      y: s.y * CANVAS_H,
      collected: false,
      collectAnim: 0,
      pulsePhase: i * 1.2,
    }));

    // ── Om Nom ────────────────────────────────────────────────────────────
    this.omNom = {
      x: config.omNomX * CANVAS_W,
      y: config.omNomY * CANVAS_H,
      radius: 38,
      eating: false,
      eatAnim: 0,
      happy: false,
    };
  }

  /** Main update — call once per animation frame */
  update(): void {
    if (this.phase !== 'playing') {
      // Still animate Om Nom eating / stars even after phase change
      this.tickAnimations();
      return;
    }

    this.physics.update();
    this.frameCount++;
    this.tickAnimations();
    this.checkStarCollisions();
    this.checkOmNomCollision();
    this.checkOutOfBounds();
  }

  /** Process a cut gesture from (x1,y1) to (x2,y2) in canvas coords */
  handleCut(x1: number, y1: number, x2: number, y2: number): number {
    if (this.phase !== 'playing') return 0;
    const count = this.physics.tryCut(x1, y1, x2, y2);
    if (count > 0) {
      this.cutLines.push({ x1, y1, x2, y2, age: 0 });
    }
    return count;
  }

  /** Star rating for this level: 3 = all stars + candy in mouth, 1/2 = partial */
  getStarRating(): number {
    if (this.phase !== 'success') return 0;
    const total = this.stars.length;
    if (total === 0) return 3; // no stars needed → perfect
    if (this.starsCollected === total) return 3;
    if (this.starsCollected >= Math.ceil(total / 2)) return 2;
    return 1;
  }

  /** Candy position from physics */
  get candyPos() {
    const p = this.physics.particles[this.candy.particleId];
    return { x: p.x, y: p.y };
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private tickAnimations(): void {
    // Age / remove cut lines
    this.cutLines = this.cutLines.filter((cl) => {
      cl.age++;
      return cl.age < CUT_LINE_MAX_AGE;
    });

    // Star collect animation
    for (const s of this.stars) {
      if (s.collected && s.collectAnim < 1) {
        s.collectAnim = Math.min(1, s.collectAnim + 0.07);
      }
      s.pulsePhase += 0.04;
    }

    // Om Nom eat animation
    if (this.omNom.eating) {
      this.omNom.eatAnim = Math.min(1, this.omNom.eatAnim + 0.06);
      if (this.omNom.eatAnim >= 1) this.omNom.happy = true;
    }

    // Candy collect anim
    if (this.candy.collected) {
      this.candy.collectAnim = Math.min(1, this.candy.collectAnim + 0.08);
    }
  }

  private checkStarCollisions(): void {
    const { x: cx, y: cy } = this.candyPos;
    for (const s of this.stars) {
      if (s.collected) continue;
      const dx = cx - s.x;
      const dy = cy - s.y;
      if (Math.sqrt(dx * dx + dy * dy) < STAR_COLLECT_RADIUS + this.candy.radius) {
        s.collected = true;
        this.starsCollected++;
      }
    }
  }

  private checkOmNomCollision(): void {
    if (this.candy.collected) return;
    const { x: cx, y: cy } = this.candyPos;
    const dx = cx - this.omNom.x;
    const dy = cy - this.omNom.y;
    if (Math.sqrt(dx * dx + dy * dy) < OMNOM_EAT_RADIUS + this.candy.radius) {
      this.candy.collected = true;
      this.omNom.eating = true;
      this.phase = 'success';
    }
  }

  private checkOutOfBounds(): void {
    const { x: cx, y: cy } = this.candyPos;
    const margin = OUT_OF_BOUNDS_MARGIN;
    if (
      cx < -margin ||
      cx > CANVAS_W + margin ||
      cy > CANVAS_H + margin
    ) {
      this.phase = 'failed';
    }
  }
}
