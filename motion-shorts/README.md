# motion-shorts

This project makes Three.js map and globe motion graphics for vertical (1080×1920) explainer shorts. The style follows the "El Niño" and "Tristan da Cunha" reference shorts. Each episode is a data file, and the renderer turns it into a frame-accurate MP4.

```bash
cd motion-shorts
npm install
npm run dev                                         # preview: http://localhost:5174/?episode=tristan
node scripts/render.mjs --episode tristan --still 5,12,24   # test frames → out/
node scripts/render.mjs --episode tristan                    # full video → out/tristan.mp4
node scripts/render.mjs --episode tristan --audio vo.mp3     # with narration
```

To render you need `ffmpeg` and a Chromium build. The renderer uses `/opt/pw-browsers/chromium` when it exists; otherwise set `CHROMIUM_PATH`.

| Path | What it is |
|---|---|
| `src/globe.js` | The globe: earth shader, atmosphere, starfield, and the spots shader for blobs and km rings |
| `src/stage.js` | Camera, arcs and flow lines, true-size outlines, hero islands, the DOM overlay layer, captions |
| `src/geo.js` | Geographic maths: great circles, bearings, the true-size transfer |
| `src/anim.js` | Easing, envelopes, keyframe tracks, a seeded random number generator |
| `episodes/tristan.js` | The sample episode (27 s) |
| `scripts/render.mjs` | Headless frame capture piped to ffmpeg |

The format rules and the full episode schema are in `.claude/skills/map-motion-shorts/SKILL.md`.

Earth textures come from the `three-globe` package (NASA Blue Marble). Country shapes come from `world-atlas` (Natural Earth).
