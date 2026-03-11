import type { Particle, Constraint, Rope, Vec2 } from '@/types/game';

const GRAVITY = 0.45;
const DAMPING = 0.992;
const SUBSTEPS = 3;
const ITERATIONS = 10;
const SEGMENT_LEN = 22;

export class PhysicsWorld {
  particles: Particle[] = [];
  constraints: Constraint[] = [];
  ropes: Rope[] = [];

  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  /** Add a particle and return its index */
  addParticle(x: number, y: number, fixed: boolean): number {
    const id = this.particles.length;
    this.particles.push({ id, x, y, px: x, py: y, fixed, mass: 1 });
    return id;
  }

  /** Add a distance constraint between two particles */
  addConstraint(p1: number, p2: number, ropeId: number): number {
    const a = this.particles[p1];
    const b = this.particles[p2];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const restLength = Math.sqrt(dx * dx + dy * dy);
    const id = this.constraints.length;
    this.constraints.push({ id, p1, p2, restLength, active: true, ropeId });
    return id;
  }

  /**
   * Build a rope from (anchorX, anchorY) to an existing candy particle.
   * Creates intermediate particles along a straight line.
   */
  addRope(
    anchorX: number,
    anchorY: number,
    candyParticleId: number,
    color: string
  ): number {
    const candy = this.particles[candyParticleId];
    const dx = candy.x - anchorX;
    const dy = candy.y - anchorY;
    const totalLen = Math.sqrt(dx * dx + dy * dy);
    const numSegments = Math.max(3, Math.ceil(totalLen / SEGMENT_LEN));

    const ropeId = this.ropes.length;
    const particleIds: number[] = [];
    const constraintIds: number[] = [];

    // Fixed anchor
    const anchorId = this.addParticle(anchorX, anchorY, true);
    particleIds.push(anchorId);

    // Inner particles along the straight line
    for (let i = 1; i < numSegments; i++) {
      const t = i / numSegments;
      const pid = this.addParticle(anchorX + dx * t, anchorY + dy * t, false);
      particleIds.push(pid);
      constraintIds.push(this.addConstraint(particleIds[i - 1], pid, ropeId));
    }

    // Connect last inner particle to candy
    particleIds.push(candyParticleId);
    constraintIds.push(
      this.addConstraint(particleIds[particleIds.length - 2], candyParticleId, ropeId)
    );

    this.ropes.push({ id: ropeId, particleIds, constraintIds, color, active: true });
    return ropeId;
  }

  /**
   * Test if the drag line (x1,y1)→(x2,y2) intersects any active rope constraint.
   * Cuts intersecting constraints and deactivates their ropes.
   * Returns the number of ropes cut.
   */
  tryCut(x1: number, y1: number, x2: number, y2: number): number {
    const cutRopeIds = new Set<number>();

    for (const c of this.constraints) {
      if (!c.active) continue;
      const p1 = this.particles[c.p1];
      const p2 = this.particles[c.p2];
      if (
        this.segmentsIntersect(
          { x: x1, y: y1 },
          { x: x2, y: y2 },
          { x: p1.x, y: p1.y },
          { x: p2.x, y: p2.y }
        )
      ) {
        c.active = false;
        cutRopeIds.add(c.ropeId);
      }
    }

    // Deactivate entire ropes that had a constraint cut
    for (const rid of cutRopeIds) {
      this.ropes[rid].active = false;
      // Deactivate ALL constraints in this rope so the chain falls
      for (const cid of this.ropes[rid].constraintIds) {
        this.constraints[cid].active = false;
      }
    }

    return cutRopeIds.size;
  }

  /** Advance physics by one frame */
  update(): void {
    for (let step = 0; step < SUBSTEPS; step++) {
      // Verlet integration with damping
      for (const p of this.particles) {
        if (p.fixed) continue;
        const vx = (p.x - p.px) * DAMPING;
        const vy = (p.y - p.py) * DAMPING;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;
      }

      // Iterative constraint relaxation (Jakobsen method)
      for (let iter = 0; iter < ITERATIONS; iter++) {
        for (const c of this.constraints) {
          if (!c.active) continue;
          const p1 = this.particles[c.p1];
          const p2 = this.particles[c.p2];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 1e-6) continue;
          const dist = Math.sqrt(distSq);
          const diff = (dist - c.restLength) / dist;

          const w1 = p1.fixed ? 0 : 1;
          const w2 = p2.fixed ? 0 : 1;
          const total = w1 + w2;
          if (total === 0) continue;

          p1.x += (dx * diff * w1) / total;
          p1.y += (dy * diff * w1) / total;
          p2.x -= (dx * diff * w2) / total;
          p2.y -= (dy * diff * w2) / total;
        }
      }

      // Soft horizontal boundary
      for (const p of this.particles) {
        if (p.fixed) continue;
        if (p.x < 0) {
          p.x = 0;
          p.px = p.x + (p.x - p.px) * 0.3;
        }
        if (p.x > this.width) {
          p.x = this.width;
          p.px = p.x + (p.x - p.px) * 0.3;
        }
      }
    }
  }

  /** Standard 2D line-segment intersection test */
  private segmentsIntersect(a: Vec2, b: Vec2, c: Vec2, d: Vec2): boolean {
    const d1x = b.x - a.x;
    const d1y = b.y - a.y;
    const d2x = d.x - c.x;
    const d2y = d.y - c.y;
    const cross = d1x * d2y - d1y * d2x;
    if (Math.abs(cross) < 1e-8) return false;
    const ex = c.x - a.x;
    const ey = c.y - a.y;
    const t = (ex * d2y - ey * d2x) / cross;
    const u = (ex * d1y - ey * d1x) / cross;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  }
}
