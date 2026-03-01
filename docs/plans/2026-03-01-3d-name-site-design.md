# taylorsteil.com — 3D Animated Name Site

## Stack

- Vite (dev server on port 4100, build tool)
- Three.js (3D rendering)
- TypeScript (strict mode)
- Biome (linting + formatting)
- No framework, no CSS library, no other dependencies

## Project Structure

```
taylorsteil-com/
├── index.html              # Entry point, full-viewport canvas + GitHub link overlay
├── src/
│   ├── main.ts             # Entry: init scene, camera, renderer, animation loop
│   ├── letters.ts          # Create the 6 letter meshes (T, A, Y, L, O, R)
│   ├── animations.ts       # Per-letter motion functions
│   └── scene.ts            # Scene setup: lighting, background gradient, camera position
├── package.json
├── tsconfig.json
├── biome.json
└── CLAUDE.md
```

## Scene

- Perspective camera positioned to see all 6 letters centered in frame
- Letters arranged horizontally along the X-axis
- Canvas is full viewport with `alpha: true`

## Letters

- 3D block letters using `ExtrudeGeometry` over `TextGeometry` (from three/addons)
- Each letter is a separate mesh for independent animation
- Bold sans-serif font (bundled as JSON)
- `MeshStandardMaterial` with matte appearance (roughness=1, metalness=0)
- Color gradient across letters from deep blue (T) to deep orange (R):
  - T = deep blue
  - A = blue-teal
  - Y = teal
  - L = teal-orange
  - O = orange
  - R = deep orange

## Lighting

- One ambient light (soft fill)
- One directional light (subtle shading on block depth)

## Background

- CSS gradient on `<body>` behind transparent canvas
- Dark blue fading to dark navy/near-black

## Animation

Each letter's position offset is a function of time. All functions have a 10-second period — at t = 0, 10, 20, ... the offset is {0, 0, 0}.

The time parameter for all functions: `(t % 10) / 10 * 2 * PI`

| Letter | Motion            | Description                                      |
|--------|-------------------|--------------------------------------------------|
| T      | Sine wave         | Bobs up and down on Y-axis                       |
| A      | Circular orbit    | Traces a circle around home position (XY plane)  |
| Y      | Parabolic arc     | Arcs up and falls back, like a toss              |
| L      | Figure-8          | Traces a lemniscate in XZ plane                  |
| O      | Elliptical orbit  | Oval path in YZ plane                            |
| R      | Pendulum swing    | Swings side to side on an arc (XY)               |

Animation loop uses `requestAnimationFrame` with `performance.now()`.

## HTML Overlay

- Single `<a>` tag at bottom-center of viewport (`position: fixed`)
- Links to http://github.com/tayl0r
- Styled minimally: small text, semi-transparent white, no background

## Responsive

- Renderer resizes with window via `resize` event listener
- Camera aspect ratio updates on resize
- Letters stay centered; camera may adjust on narrow screens
