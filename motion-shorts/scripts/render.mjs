// Frame-accurate MP4 render: drives window.renderAt(t) in headless Chromium,
// screenshots every frame (WebGL + HUD), and pipes them into ffmpeg.
//
//   node scripts/render.mjs --episode tristan [--out out/tristan.mp4] [--fps 30]
//        [--from 0] [--to <duration>] [--audio voice.mp3] [--still 12.5]
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { startServer } from './server.mjs';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => {
  if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
  return acc;
}, []));
const episode = args.episode || 'tristan';
const executablePath = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

const server = await startServer(0);
const port = server.address().port;
const browser = await chromium.launch({
  executablePath,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('console', (m) => m.type() === 'error' && console.error('[page]', m.text()));
page.on('pageerror', (e) => console.error('[page]', e.message));
await page.goto(`http://127.0.0.1:${port}/?episode=${episode}&render=1`);
const { duration, fps: epFps } = await page.evaluate(() => window.__ready);
const fps = Number(args.fps || epFps);

const outDir = path.resolve('out');
fs.mkdirSync(outDir, { recursive: true });

if (args.still !== undefined) {
  // Single frames: --still 3,8.5,14
  for (const t of String(args.still).split(',').map(Number)) {
    await page.evaluate((t) => window.renderAt(t), t);
    const file = path.join(outDir, `${episode}_${t.toFixed(2)}s.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 90 });
    console.log('still', file);
  }
} else {
  const from = Number(args.from || 0), to = Number(args.to || duration);
  const out = path.resolve(args.out || path.join(outDir, `${episode}.mp4`));
  const frames = Math.round((to - from) * fps);
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    ...(args.audio ? ['-ss', String(from), '-i', args.audio, '-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let i = 0; i < frames; i++) {
    const t = from + i / fps;
    await page.evaluate((t) => window.renderAt(t), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % fps === 0) process.stdout.write(`\r${i}/${frames} frames  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  console.log(`\nwrote ${out}`);
}
await browser.close();
server.close();
