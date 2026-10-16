---
name: map-motion-shorts
description: Plan, script and build map/globe explainer YouTube Shorts (the "El Niño" / "Tristan da Cunha" style) as Three.js motion graphics with the motion-shorts engine, and render them to 1080×1920 MP4. Use when asked for a geography, history, science or "why does X happen" short with map animation, a new episode file, a new motion-graphics primitive, or a render.
---

# Map motion shorts

Faceless 60–90 s vertical explainers in which **one globe/map is the whole set**. The camera flies,
overlays pop on, and big captions carry the narration. The format was distilled from two reference
shorts:

- **El Niño:** a "fan" metaphor, warm/cold blobs, impacts tour, a historic death toll, then "2027".
- **Tristan da Cunha:** a dive to the island, distance line, outline comparison, a chibi skit, then "97%".

The engine lives in `motion-shorts/`. An episode is a single data file in `motion-shorts/episodes/`.

## 1. Format rules (the "formula")

| Beat | Time | Rule |
|---|---|---|
| Hook | 0–5 s | "Imagine…" / "Look at the middle of nowhere…" plus camera movement in the first second. Never open on a static frame. |
| Reveal / name | 5–10 s | Name the thing with a handwritten label or a big glowing title. |
| Scale shot | 8–18 s | Make size or distance physical: a distance arc with a km counter, a true-size outline, a km ring, or a thermometer. |
| Turn | ~35–45% | "It all started with…" / "You see…". Change layer or mood (grade dip, dark history map). |
| Mechanism / story | middle | Every noun the narrator says appears on screen *at that word*. |
| Tone break | ~60% | Skit, joke, emoji, or a mood shift, to beat the mid-video drop-off. |
| Payoff | last 20% | One huge number in yellow or red (97%, 40,000,000, 3.4 °C, 7). |
| End | last 3 s | Punchline (light topics) or future stakes (science). If possible, write a last line that loops back into the first. |

Craft rules:
- **Colour code is a language:** warm = red/pink blobs, cold/water = blue/cyan, key number = yellow `#ffd23f`, danger = `#ff5a4a`, places = white or pale-blue handwriting. Keep it consistent so the map reads with the sound off.
- **Captions:** 1–3 words per chunk, lower third (~69% height), white heavy sans, with key words in yellow (`*word*`). Never put overlays in the caption band; use `frameY` to lift the subject.
- **Pacing:** about 2.7 narrated words per second. Something new must appear on screen every 1.5–3 s.
- **Layers:** switch visual layers every 15–20 s (satellite globe → km ring/outline → dark grade → hero close-up). This gives a reset without hard cuts.
- **Facts:** every on-screen number must match the narration. In the reference video the narration said "almost 2,000 km" but the map said 2,440 km. Verify claims, and label forecasts as forecasts.
- **Audio:** master loud (≈ −17 LUFS-ish mean, peaks near −1 dB). Narration is added at render time (`--audio`) or in the editor.

## 2. Engine quick reference (`motion-shorts/`)

```
npm install
npm run dev                      # preview with play/scrub: http://localhost:5174/?episode=<name>
node scripts/render.mjs --episode <name> --still 3,8.5,14    # check frames → out/<name>_<t>s.jpg
node scripts/render.mjs --episode <name> [--audio voice.mp3] [--from a --to b] [--fps 30]  # → out/<name>.mp4
```

Rendering is deterministic: the renderer calls `window.renderAt(t)` per frame (headless Chromium with
SwiftShader WebGL), then screenshots the frame and pipes it to ffmpeg. Never use `Math.random()`,
`Date.now()` or CSS animations in the stage. Everything must be a pure function of `t` (use `rng(seed)`
from `src/anim.js`).

### Episode schema (`episodes/<name>.js`, `export default {…}`)

- `meta`: `{ title, duration, fps: 30, fov: 34 }`
- `camera`: keys `{ t, lat, lon, alt, tilt°, heading°, frameY, ease }`.
  - `alt` is measured above the surface in globe radii and is log-interpolated, so zooms feel even.
  - Rough guide: 4.4 shows the whole globe, 1.5 is ocean-basin scale, 0.3 is the island hero shot.
  - `tilt` 30–45° gives a 3D close-up. `frameY` 0.03–0.12 pushes the subject up the frame.
  - Each key's `ease` applies to the segment arriving at it: `inOut` (default), `linear`, `out`, `in`, `outBack`, `outExpo`.
- `grade`: `{ tint, keys: [{ t, sat, bright, tintAmt }] }`. Use it for mood shifts, e.g. sat 0.3 and bright 0.55 for a "history" look.
- `spots`: drawn on the globe surface.
  - Blob: `{ at, rx, ry (degrees), soft, color, opacity, start, end, grow:[t,dur], pulse, moveTo, move:[t,dur] }`. Use it for warm pools, drought zones, rain areas or shallow-water halos. `moveTo` slides a blob, e.g. El Niño warm water moving east.
  - Ring: `{ mode:'ring', at, km, widthKm, fill, grow }`. Use it for "everything within X km".
- `arcs`: `{ id, from, to, lift, width, color, start, dur, end }` draws a great-circle line on over `dur`. Add `dash: n, speed` for animated flow lines (trade winds, currents, shipping routes).
- `outlines`: `{ country, to, color, fill, fillOpacity, start, dur, end }` is a **true-size** outline (Natural Earth 50m names, e.g. 'India', 'France', 'United States of America') moved to `to`.
- `islands`: `{ at, radiusKm, heightKm, seed, start, end }` is a procedural volcanic hero island, exaggerated so it reads on a phone.
- `overlays` (DOM HUD, anchored by `at:[lat,lon]`, `screen:[x,y]` in 0..1, or `arc:'id', along`):
  - `label`: `{ text, font:'hand', size, color, rotate, dx, dy, reveal:'write'|'pop', arrow, arrowFrom, arrowBend }`
  - `pin`: `{ color }` (pulsing)
  - `counter`: `{ from, to, prefix, suffix, round, icon:'people', className:'box' }`
  - `arcTag`: `{ arc, total, suffix }` counts up with the arc's progress
  - `big`: `{ text, sub, y, color }` is the payoff number
  - `orbit`: `{ names:[…], rx, ry, stagger, spin }`
- `captions`: `[{ t, text, end?, max? }]`. Words are auto-timed by length. Chunks break at punctuation or every 3 words. `*word*` highlights a word.

### Workflow for a new episode

1. Write the narration first (60–90 s at about 2.7 words/s). Mark each beat from §1, and list the on-screen object for every noun.
2. Fact-check numbers. Put exact coordinates in constants at the top of the episode file.
3. Block the camera keys to the caption times. Hold 1.5–3 s on each reveal, and move the camera during the narration bridges.
4. Add layers beat by beat, then render `--still` at every beat. Check for HUD collisions with the caption band, legibility at phone size, and that nothing important sits behind the globe.
5. Render the MP4. Add the voiceover with `--audio`, or the VO, music and SFX (whooshes on camera moves, pops on labels) in CapCut.

### Extending the engine

- New surface effects go into the `spots` shader (`src/globe.js`; `MAX_SPOTS` is the limit).
- New HUD types go in `buildHud()` and `updateHud()` in `src/stage.js`, written as pure functions of `t`.
- Ideas not built yet, taken from the references:
  - a sea-temperature anomaly texture swap (El Niño "real data" shots)
  - a thermometer overlay
  - an icon-drop layer (crossed-out crops, clouds, suns)
  - a flat "old map" style via the grade with a parchment ocean colour
  - billboard sprites for chibi characters and photo cut-outs (e.g. a Napoleon portrait leaning into frame)
  - a second texture set for night lights
