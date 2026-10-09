// usage: node render.js still <t,...> | node render.js video
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const FPS = 30, TOTAL = 36, out = process.env.OUT || path.join(__dirname, 'frames');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('file://' + path.join(__dirname, 'scene.html'));
  await p.evaluate(() => document.fonts.ready);
  fs.mkdirSync(out, { recursive: true });
  const el = await p.$('canvas');
  if (process.argv[2] === 'still') {
    for (const t of process.argv[3].split(',')) { await p.evaluate(t => draw(t), +t); await el.screenshot({ path: path.join(out, `still_${t}.png`) }); }
  } else {
    const n = FPS * TOTAL;
    for (let i = 0; i < n; i++) {
      await p.evaluate(t => draw(t), i / FPS);
      await el.screenshot({ path: path.join(out, `f_${String(i).padStart(5, '0')}.png`) });
    }
  }
  await b.close();
})();
