import type { GameEngine } from '@/lib/game/GameEngine';
import type { Star, OmNomState, CandyInfo, CutLine } from '@/types/game';
import type { PhysicsWorld } from '@/lib/physics/PhysicsWorld';

const TAU = Math.PI * 2;

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private w: number;
  private h: number;

  constructor(ctx: CanvasRenderingContext2D, w: number, h: number) {
    this.ctx = ctx;
    this.w = w;
    this.h = h;
  }

  render(engine: GameEngine, isDragging: boolean, dragX1: number, dragY1: number, dragX2: number, dragY2: number): void {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);

    this.drawBackground(engine.frameCount);
    this.drawStars(engine.stars, engine.frameCount);
    this.drawRopes(engine.physics);
    this.drawAnchors(engine.physics);
    this.drawOmNom(engine.omNom);
    this.drawCandy(engine.candy, engine.physics);
    this.drawCutLines(engine.cutLines);

    // Live drag preview
    if (isDragging) {
      this.drawDragLine(dragX1, dragY1, dragX2, dragY2);
    }
  }

  // ── Background ────────────────────────────────────────────────────────────

  private drawBackground(frame: number): void {
    const { ctx, w, h } = this;

    // Deep space gradient
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0d0520');
    bg.addColorStop(0.5, '#0f0728');
    bg.addColorStop(1, '#1a1040');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Animated background stars (tiny)
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    const seed = Math.floor(frame / 120);
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137.5 + seed * 7) % w + w) % w;
      const sy = ((i * 97.3 + seed * 3) % h + h) % h;
      const blink = Math.sin(frame * 0.05 + i) * 0.5 + 0.5;
      ctx.globalAlpha = blink * 0.4;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }
    ctx.globalAlpha = 1;
  }

  // ── Ropes ─────────────────────────────────────────────────────────────────

  private drawRopes(physics: PhysicsWorld): void {
    const { ctx } = this;

    for (const rope of physics.ropes) {
      if (!rope.active) continue;
      const pts = rope.particleIds.map((id) => physics.particles[id]);
      if (pts.length < 2) continue;

      // Shadow / glow pass
      ctx.save();
      ctx.shadowColor = rope.color;
      ctx.shadowBlur = 8;
      ctx.strokeStyle = rope.color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
      ctx.restore();

      // Bright highlight on top
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    }
  }

  // ── Anchors ───────────────────────────────────────────────────────────────

  private drawAnchors(physics: PhysicsWorld): void {
    const { ctx } = this;
    for (const rope of physics.ropes) {
      if (!rope.active) continue;
      const anchorId = rope.particleIds[0];
      const p = physics.particles[anchorId];

      // Pin shape
      ctx.save();
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;

      // Outer ring
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, TAU);
      ctx.stroke();

      // Inner fill
      const grad = ctx.createRadialGradient(p.x - 2, p.y - 2, 1, p.x, p.y, 6);
      grad.addColorStop(0, '#fff7ed');
      grad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, TAU);
      ctx.fill();

      ctx.restore();
    }
  }

  // ── Stars ─────────────────────────────────────────────────────────────────

  private drawStars(stars: Star[], frame: number): void {
    const { ctx } = this;
    for (const s of stars) {
      if (s.collected && s.collectAnim >= 1) continue;

      const pulse = 1 + Math.sin(s.pulsePhase) * 0.08;
      const scale = s.collected ? 1 + s.collectAnim * 1.5 : pulse;
      const alpha = s.collected ? Math.max(0, 1 - s.collectAnim * 1.5) : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(s.x, s.y);
      ctx.rotate(frame * 0.02 + s.pulsePhase);
      ctx.scale(scale, scale);

      // Glow
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 16;

      // Star shape
      this.drawStarShape(ctx, 14, 6, '#fbbf24', '#fde68a');
      ctx.restore();
    }
  }

  private drawStarShape(
    ctx: CanvasRenderingContext2D,
    outerR: number,
    innerR: number,
    fill: string,
    highlight: string
  ): void {
    const points = 5;
    const step = Math.PI / points;

    const grad = ctx.createRadialGradient(-2, -4, 1, 0, 0, outerR);
    grad.addColorStop(0, highlight);
    grad.addColorStop(1, fill);

    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = i * step - Math.PI / 2;
      if (i === 0) ctx.moveTo(r * Math.cos(angle), r * Math.sin(angle));
      else ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // ── Om Nom ────────────────────────────────────────────────────────────────

  private drawOmNom(omNom: OmNomState): void {
    const { ctx } = this;
    const { x, y, radius, eatAnim, happy } = omNom;
    const mouthOpen = omNom.eating
      ? Math.sin((eatAnim * Math.PI) / 2) * 0.8
      : 0.25 + Math.sin(Date.now() / 600) * 0.08;

    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 6;

    // Body
    const bodyGrad = ctx.createRadialGradient(-8, -10, 4, 0, 0, radius);
    bodyGrad.addColorStop(0, '#4ade80');
    bodyGrad.addColorStop(0.7, '#16a34a');
    bodyGrad.addColorStop(1, '#14532d');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, TAU);
    ctx.fill();

    // Belly
    ctx.fillStyle = 'rgba(134,239,172,0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 8, radius * 0.6, radius * 0.45, 0, 0, TAU);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Mouth (arc that opens)
    const mouthAngle = mouthOpen * Math.PI;
    ctx.fillStyle = happy ? '#fbbf24' : '#dc2626';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 4, radius * 0.55, Math.PI * 0.1 + mouthAngle * 0.4, Math.PI * 0.9 - mouthAngle * 0.4);
    ctx.closePath();
    ctx.fill();

    // Teeth
    if (mouthOpen > 0.15) {
      ctx.fillStyle = '#f8fafc';
      const teethY = 4 - radius * 0.2;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.roundRect(i * 10 - 4, teethY, 8, 8, 2);
        ctx.fill();
      }
    }

    // Eyes
    this.drawEye(ctx, -radius * 0.35, -radius * 0.2, 9, happy);
    this.drawEye(ctx, radius * 0.35, -radius * 0.2, 9, happy);

    ctx.restore();
  }

  private drawEye(
    ctx: CanvasRenderingContext2D,
    ex: number,
    ey: number,
    r: number,
    happy: boolean
  ): void {
    // White
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(ex, ey, r, 0, TAU);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#1e1b4b';
    const py = happy ? ey + 1 : ey;
    ctx.beginPath();
    ctx.arc(ex + 1, py, r * 0.55, 0, TAU);
    ctx.fill();

    // Shine
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(ex + r * 0.2, ey - r * 0.3, r * 0.22, 0, TAU);
    ctx.fill();

    if (happy) {
      // Happy squint
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ex, ey, r, Math.PI * 0.1, Math.PI * 0.9);
      ctx.stroke();
    }
  }

  // ── Candy ─────────────────────────────────────────────────────────────────

  private drawCandy(candy: CandyInfo, physics: PhysicsWorld): void {
    if (candy.collected && candy.collectAnim >= 0.9) return;
    const { ctx } = this;
    const p = physics.particles[candy.particleId];
    const r = candy.radius;
    const scale = candy.collected ? 1 - candy.collectAnim * 0.6 : 1;
    const alpha = candy.collected ? 1 - candy.collectAnim : 1;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(p.x, p.y);
    ctx.scale(scale, scale);

    // Glow
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 20;

    // Main body
    const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
    grad.addColorStop(0, '#86efac');
    grad.addColorStop(0.5, '#22c55e');
    grad.addColorStop(1, '#15803d');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fill();

    // Stripe
    ctx.strokeStyle = 'rgba(134,239,172,0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.6, -0.8, 0.8);
    ctx.stroke();

    // Specular highlight
    ctx.shadowBlur = 0;
    const shine = ctx.createRadialGradient(-r * 0.28, -r * 0.32, r * 0.05, -r * 0.18, -r * 0.22, r * 0.45);
    shine.addColorStop(0, 'rgba(255,255,255,0.75)');
    shine.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  // ── Cut lines ─────────────────────────────────────────────────────────────

  private drawCutLines(lines: CutLine[]): void {
    const { ctx } = this;
    for (const cl of lines) {
      const t = 1 - cl.age / 18;
      ctx.save();
      ctx.globalAlpha = t;
      ctx.strokeStyle = `rgba(255,255,255,${t})`;
      ctx.lineWidth = 2.5 * t;
      ctx.lineCap = 'round';
      ctx.shadowColor = '#fff';
      ctx.shadowBlur = 12 * t;
      ctx.beginPath();
      ctx.moveTo(cl.x1, cl.y1);
      ctx.lineTo(cl.x2, cl.y2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // ── Drag preview ──────────────────────────────────────────────────────────

  private drawDragLine(x1: number, y1: number, x2: number, y2: number): void {
    const { ctx } = this;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 5]);
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(255,255,255,0.4)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }
}
