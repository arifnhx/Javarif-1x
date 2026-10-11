// Renders index.html to an MP4 (H.264, 1920x1080, 30 fps) with Playwright + ffmpeg.
//   node render.mjs                 -> hormuz-oil-chokepoint.mp4
//   node render.mjs --stills 3,9,30 -> stills/t03.0.png ... for quick review
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright')); }

const here = fileURLToPath(new URL('.', import.meta.url));
const url = pathToFileURL(here + 'index.html').href + '?render=1';
const stillsArg = process.argv.indexOf('--stills');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', (e) => { console.error('page error:', e.message); process.exitCode = 1; });
await page.goto(url);
await page.evaluate(() => window.ready);
const { fps, duration } = await page.evaluate(() => ({ fps: window.SCENE.fps, duration: window.SCENE.duration }));

const frame = (t) => page.evaluate((t) => { window.renderAt(t); return document.getElementById('c').toDataURL('image/jpeg', 0.95); }, t)
  .then((d) => Buffer.from(d.split(',')[1], 'base64'));

if (stillsArg > 0) {
  mkdirSync(here + 'stills', { recursive: true });
  for (const t of process.argv[stillsArg + 1].split(',').map(Number)) {
    writeFileSync(`${here}stills/t${t.toFixed(1).padStart(4, '0')}.jpg`, await frame(t));
  }
} else {
  const out = here + 'hormuz-oil-chokepoint.mp4';
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(duration * fps);
  for (let i = 0; i < n; i++) {
    const buf = await frame(i / fps);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % 150 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  console.log('wrote', out);
}
await browser.close();
