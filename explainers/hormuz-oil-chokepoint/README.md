# Hormuz: the world's oil chokepoint

A 41-second 16:9 animated map explainer (1920×1080, 30 fps): why the world's oil depends on one narrow strait.

- `hormuz-oil-chokepoint.mp4` is the rendered video.
- `index.html` is the live player. Open it in a browser to play or scrub; space toggles play.
- `scene.js` holds every beat, camera, flag, route, swarm and label as data.
- `index.html` also holds the engine: Mercator plus a tilt camera, vector flags, route draw-on, a tanker/warship swarm and the blockade ring.
- `build-geo.mjs` regenerates `geo.js` from Natural Earth (world-atlas). It also checks that every route and swarm path stays at sea.
- `render.mjs` renders the MP4 through Playwright and ffmpeg. `--stills 3,10,30` writes single frames instead.

```sh
npm install && npm run build:geo && npm run render
```

## Beats and narration

| Time | Beat | Camera | Narration |
|---|---|---|---|
| 0–6 s | The Strait of Hormuz | tight on the strait (Iran and Oman flags) | In normal times, about one fifth of the world's oil passes through this one strait, every day. |
| 6–13.5 s | The supply | Persian Gulf; routes from Saudi Arabia, Iraq, Kuwait, the UAE, plus LNG from Qatar | Tankers from Saudi Arabia, the biggest shipper, plus Iraq, Kuwait and the UAE — and LNG from Qatar — all funnel through the Persian Gulf. |
| 13.5–20.5 s | The buyers | Gulf to East Asia; routes to China, India, Japan, South Korea | Out the other side, most of it heads east to Asia: China, India, Japan and South Korea take the bulk. |
| 20.5–28 s | The risk | tight on the strait; Iran's shore, the ≈33 km narrows, blockade ring | Iran lines the strait's northern shore. At its narrowest it's only about 33 km wide — a closure would cut the world off from that oil. |
| 28–34.5 s | **The navy at sea** | tilted 52°, span 7°; a warship column transits the strait and others patrol the Gulf of Oman | US Navy warships regularly sail through the Strait of Hormuz. |
| 34.5–41 s | The whole picture | Gulf to Japan; all routes, ring reprise | One narrow strait, holding up the global economy: the world's most important oil chokepoint. |

The warships are drawn by the swarm renderer (`kind: 'warship'`) as vector hulls with wakes. They move steadily, nose first along their path tangent, and are drawn in ground space so they foreshorten with the tilt. No generated images are used.
