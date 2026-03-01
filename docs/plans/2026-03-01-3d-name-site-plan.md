# 3D Animated Name Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build taylorsteil.com as a full-viewport Three.js scene rendering "TAYLOR" in 3D animated block letters with per-letter periodic motion on a 10-second loop.

**Architecture:** Vite serves a single `index.html` with a full-viewport `<canvas>`. TypeScript modules handle scene setup, letter mesh creation, and per-letter animation functions. No framework — just vanilla Three.js with an imperative animation loop driven by `requestAnimationFrame`.

**Tech Stack:** Vite, Three.js, TypeScript (strict), Biome

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `biome.json`
- Create: `index.html`
- Create: `src/main.ts` (placeholder)

**Step 1: Initialize package.json**

```json
{
  "name": "taylorsteil-com",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 4100",
    "build": "tsc && vite build",
    "preview": "vite preview --port 4100",
    "check": "biome check .",
    "format": "biome format --write ."
  }
}
```

Write this to `package.json`.

**Step 2: Install dependencies**

Run: `npm install three`
Run: `npm install -D vite typescript @types/three @biomejs/biome`

**Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

Write to `tsconfig.json`.

**Step 4: Create biome.json**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  }
}
```

Write to `biome.json`.

**Step 5: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Taylor Steil</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    body {
      background: linear-gradient(180deg, #0a1628 0%, #060d18 100%);
    }
    canvas { display: block; }
    .github-link {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      letter-spacing: 0.05em;
      transition: color 0.2s;
      z-index: 10;
    }
    .github-link:hover { color: rgba(255, 255, 255, 0.85); }
  </style>
</head>
<body>
  <a class="github-link" href="http://github.com/tayl0r" target="_blank" rel="noopener">GitHub</a>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

Write to `index.html`.

**Step 6: Create placeholder main.ts**

```typescript
console.log("taylorsteil.com");
```

Write to `src/main.ts`.

**Step 7: Verify dev server starts**

Run: `npx vite --port 4100 &` (background, verify it starts, then kill)
Expected: Vite dev server starts on http://localhost:4100

**Step 8: Run biome check**

Run: `npx biome check .`
Expected: No errors

**Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json biome.json index.html src/main.ts
git commit -m "feat: scaffold project with Vite, Three.js, TypeScript, Biome"
```

---

### Task 2: Scene Setup (Camera, Lighting, Renderer)

**Files:**
- Create: `src/scene.ts`
- Modify: `src/main.ts`

**Step 1: Create scene.ts**

This module exports a function that creates and returns the scene, camera, renderer, and a resize handler.

```typescript
import * as THREE from "three";

export interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export function createScene(): SceneContext {
  const scene = new THREE.Scene();

  // Camera: positioned to see ~12 units wide (6 letters with spacing)
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.set(0, 0, 12);

  // Renderer: full viewport, transparent background
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(5, 5, 10);
  scene.add(directional);

  // Resize handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer };
}
```

Write to `src/scene.ts`.

**Step 2: Update main.ts to use scene**

```typescript
import { createScene } from "./scene";

const { scene, camera, renderer } = createScene();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
```

Write to `src/main.ts`.

**Step 3: Verify it runs**

Run: `npx vite --port 4100 &` (background, verify it starts, then kill)
Expected: Page loads with dark gradient background and no errors in console.

**Step 4: Run biome check**

Run: `npx biome check .`
Expected: No errors

**Step 5: Commit**

```bash
git add src/scene.ts src/main.ts
git commit -m "feat: add scene setup with camera, lighting, and renderer"
```

---

### Task 3: 3D Letter Creation

**Files:**
- Create: `src/letters.ts`
- Modify: `src/main.ts`

**Step 1: Create letters.ts**

This module loads a font and creates 6 letter meshes positioned along the X-axis with a blue-to-orange color gradient.

```typescript
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import type { Font } from "three/addons/loaders/FontLoader.js";

const LETTERS = ["T", "A", "Y", "L", "O", "R"] as const;

// Blue-to-orange gradient: 6 colors
const COLORS = [
  0x1a5fb4, // T - deep blue
  0x1a8a8a, // A - blue-teal
  0x2aaa6a, // Y - teal
  0x8a8a1a, // L - teal-orange
  0xd4781a, // O - orange
  0xc64600, // R - deep orange
];

export interface LetterMesh {
  mesh: THREE.Mesh;
  homePosition: THREE.Vector3;
  index: number;
}

export async function createLetters(
  scene: THREE.Scene,
): Promise<LetterMesh[]> {
  const font = await loadFont();
  const letterMeshes: LetterMesh[] = [];

  // Calculate total width for centering
  const spacing = 2.0;
  const totalWidth = (LETTERS.length - 1) * spacing;
  const startX = -totalWidth / 2;

  for (let i = 0; i < LETTERS.length; i++) {
    const geometry = new TextGeometry(LETTERS[i], {
      font,
      size: 1.5,
      depth: 0.4,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelSegments: 5,
    });

    // Center each letter's geometry on its own origin
    geometry.computeBoundingBox();
    if (geometry.boundingBox) {
      const cx =
        (geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2 +
        geometry.boundingBox.min.x;
      const cy =
        (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2 +
        geometry.boundingBox.min.y;
      geometry.translate(-cx, -cy, 0);
    }

    const material = new THREE.MeshStandardMaterial({
      color: COLORS[i],
      roughness: 1,
      metalness: 0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const homePosition = new THREE.Vector3(startX + i * spacing, 0, 0);
    mesh.position.copy(homePosition);

    scene.add(mesh);
    letterMeshes.push({ mesh, homePosition: homePosition.clone(), index: i });
  }

  return letterMeshes;
}

function loadFont(): Promise<Font> {
  return new Promise((resolve, reject) => {
    const loader = new FontLoader();
    // Use the helvetiker bold font bundled with three.js examples
    loader.load(
      "https://cdn.jsdelivr.net/npm/three@0.175.0/examples/fonts/helvetiker_bold.typeface.json",
      (font) => resolve(font),
      undefined,
      (err) => reject(err),
    );
  });
}
```

Write to `src/letters.ts`.

**Step 2: Update main.ts to create letters**

```typescript
import { createLetters } from "./letters";
import { createScene } from "./scene";

const { scene, camera, renderer } = createScene();

async function init() {
  const letters = await createLetters(scene);
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
```

Write to `src/main.ts`.

**Step 3: Verify letters render**

Run: `npx vite --port 4100 &` (background, check browser, then kill)
Expected: 6 block letters "TAYLOR" visible, colored blue-to-orange, centered in viewport.

**Step 4: Run biome check**

Run: `npx biome check .`
Expected: No errors

**Step 5: Commit**

```bash
git add src/letters.ts src/main.ts
git commit -m "feat: add 3D block letter creation with blue-to-orange gradient"
```

---

### Task 4: Animation System

**Files:**
- Create: `src/animations.ts`
- Modify: `src/main.ts`

**Step 1: Create animations.ts**

Each function takes a normalized time `t` in [0, 2*PI] (representing position within the 10-second cycle) and returns an `{x, y, z}` offset.

```typescript
const TWO_PI = Math.PI * 2;
const PERIOD = 10; // seconds

interface Offset {
  x: number;
  y: number;
  z: number;
}

type MotionFn = (t: number) => Offset;

// T — sine wave: bobs up and down on Y-axis
function sineWave(t: number): Offset {
  return { x: 0, y: Math.sin(t) * 0.8, z: 0 };
}

// A — circular orbit in XY plane
function circularOrbit(t: number): Offset {
  return { x: Math.cos(t) * 0.6, y: Math.sin(t) * 0.6, z: 0 };
}

// Y — parabolic arc: rises and falls on Y, slight X drift
// Uses a shifted cosine so it starts and ends at 0
function parabolicArc(t: number): Offset {
  // -cos(t) goes from -1 to 1 to -1; shift to 0..1..0
  const y = (1 - Math.cos(t)) / 2;
  return { x: 0, y: y * 1.2, z: 0 };
}

// L — figure-8 / lemniscate in XZ plane
function figure8(t: number): Offset {
  return {
    x: Math.sin(t) * 0.7,
    y: 0,
    z: Math.sin(t * 2) * 0.4,
  };
}

// O — elliptical orbit in YZ plane
function ellipticalOrbit(t: number): Offset {
  return {
    x: 0,
    y: Math.sin(t) * 0.5,
    z: Math.cos(t) * 0.8,
  };
}

// R — pendulum swing in XY plane
function pendulumSwing(t: number): Offset {
  return {
    x: Math.sin(t) * 0.7,
    y: (1 - Math.cos(t)) * 0.3,
    z: 0,
  };
}

const MOTION_FUNCTIONS: MotionFn[] = [
  sineWave,       // T
  circularOrbit,  // A
  parabolicArc,   // Y
  figure8,        // L
  ellipticalOrbit,// O
  pendulumSwing,  // R
];

/**
 * Compute the position offset for a given letter index at a given time (seconds).
 * All motions are periodic with a 10-second cycle.
 */
export function getLetterOffset(letterIndex: number, timeSec: number): Offset {
  const normalizedTime = ((timeSec % PERIOD) / PERIOD) * TWO_PI;
  return MOTION_FUNCTIONS[letterIndex](normalizedTime);
}
```

Write to `src/animations.ts`.

**Step 2: Update main.ts to apply animation**

```typescript
import { getLetterOffset } from "./animations";
import { type LetterMesh, createLetters } from "./letters";
import { createScene } from "./scene";

const { scene, camera, renderer } = createScene();

let letters: LetterMesh[] = [];

async function init() {
  letters = await createLetters(scene);
  animate();
}

function animate() {
  requestAnimationFrame(animate);

  const timeSec = performance.now() / 1000;

  for (const letter of letters) {
    const offset = getLetterOffset(letter.index, timeSec);
    letter.mesh.position.set(
      letter.homePosition.x + offset.x,
      letter.homePosition.y + offset.y,
      letter.homePosition.z + offset.z,
    );
  }

  renderer.render(scene, camera);
}

init();
```

Write to `src/main.ts`.

**Step 3: Verify animation works**

Run: `npx vite --port 4100 &` (background, check browser, then kill)
Expected: Each letter moves in its own unique pattern, all returning to home position every 10 seconds.

**Step 4: Run biome check**

Run: `npx biome check .`
Expected: No errors

**Step 5: Commit**

```bash
git add src/animations.ts src/main.ts
git commit -m "feat: add per-letter animation system with 10-second periodic motions"
```

---

### Task 5: Polish & Final Verification

**Files:**
- Modify: `src/scene.ts` (tweak camera if needed)
- Modify: `src/letters.ts` (tweak colors/spacing if needed)
- Modify: `src/animations.ts` (tweak amplitudes if needed)

**Step 1: Run full build**

Run: `npx tsc && npx vite build`
Expected: Build succeeds with no errors, outputs to `dist/`.

**Step 2: Run biome check**

Run: `npx biome check .`
Expected: No errors

**Step 3: Test preview build**

Run: `npx vite preview --port 4100 &` (background, verify in browser, then kill)
Expected: Production build runs correctly with all letters animating.

**Step 4: Add dist and node_modules to .gitignore**

Ensure `.gitignore` contains:
```
node_modules
dist
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: complete 3D animated name site"
```
