# 🍬 Cut the Rope

A physics-based rope-cutting puzzle game built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Slice ropes with your mouse or finger to swing candy into Om Nom's hungry mouth!

---

## ✨ Features

- **12 handcrafted levels** across 3 worlds (Cardboard Box → Fabric → Foil)
- **Realistic rope physics** via Verlet integration with constraint solving
- **3-star rating** per level based on stars collected
- **Progress saving** via localStorage
- **Procedural sound effects** using the Web Audio API (no audio files needed)
- **Responsive & mobile-first** — works on desktop, tablet, and phone
- **Touch & mouse controls** — drag to cut ropes
- **Smooth 60 fps** with sub-stepping physics for stability
- **Neon Space theme** — dark background, glowing ropes, shiny candy
- **Animated Om Nom** — canvas-drawn monster that opens its mouth and eats
- **Pause / resume / restart** functionality
- **Level select** with lock/unlock progression

---

## 🎮 Controls

| Action | Mouse | Mobile |
|---|---|---|
| Cut rope | Click & drag across it | Swipe across it |
| Pause | Click the ⏸ button (top-right) | Tap the ⏸ button |

**Tip:** Cut ropes in the right order to swing candy through all 3 stars before it lands in Om Nom's mouth!

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Rendering | HTML5 Canvas 2D |
| Physics | Custom Verlet integration engine |
| Sound | Web Audio API (procedural) |
| Storage | localStorage |

---

## 🚀 Run Locally

```bash
# 1. Clone / enter the project directory
cd cut_the_rope

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## ☁️ Deploy to Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import the repository — Next.js is auto-detected
4. Click **Deploy** (no env vars needed)

---

## 🎯 Level Guide

| # | Name | World | Difficulty | Hint |
|---|---|---|---|---|
| 1 | First Cut | Cardboard Box | Easy | Just cut the rope |
| 2 | Star Shower | Cardboard Box | Easy | Cut rope, fall through stars |
| 3 | Go Left | Cardboard Box | Easy | Cut the right rope |
| 4 | Go Right | Cardboard Box | Easy | Cut the left rope |
| 5 | Three Ropes | Fabric | Medium | Cut left + center ropes |
| 6 | Long Swing | Fabric | Medium | Cut right rope for big arc |
| 7 | Deep Drop | Fabric | Medium | Cut both ropes simultaneously |
| 8 | Zigzag Stars | Fabric | Medium | Cut outer ropes |
| 9 | Precision | Foil | Hard | Cut ceiling rope carefully |
| 10 | Four Anchors | Foil | Hard | Cut 3 left ropes |
| 11 | Spider Web | Foil | Hard | Sequential rope cuts |
| 12 | Master Class | Foil | Hard | All skills required |

---

## 🧠 Physics Engine

Custom Verlet integration (`src/lib/physics/PhysicsWorld.ts`):

- **Substeps**: 3 per frame for stability
- **Constraint iterations**: 10 (Jakobsen method)
- **Gravity**: 0.45 px/frame²
- **Damping**: 0.992
- **Cutting**: 2D line-segment intersection test

---

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router (layout, page, globals)
├── types/game.ts     # All TypeScript interfaces
├── lib/
│   ├── physics/      # Verlet physics world
│   └── game/         # Level configs & game engine
├── hooks/            # useGameEngine, useSound
└── components/
    ├── game/         # GameCanvas, GameRenderer
    └── screens/      # StartScreen, LevelSelect, Pause, EndScreen
```
