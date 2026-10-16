// Pure timing helpers. Everything on screen is a function of t (seconds),
// so preview playback and frame-by-frame rendering always match.

export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const lerp = (a, b, s) => a + (b - a) * s;

export const ease = {
  linear: (x) => x,
  inOut: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  out: (x) => 1 - Math.pow(1 - x, 3),
  in: (x) => x * x * x,
  outBack: (x) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  outExpo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
};

// 0→1 progress of t through [start, start+dur], eased.
export function prog(t, start, dur, fn = ease.inOut) {
  if (dur <= 0) return t >= start ? 1 : 0;
  return fn(clamp01((t - start) / dur));
}

// Visibility envelope: fades in at `start`, out at `end`.
export function env(t, start, end = Infinity, fadeIn = 0.35, fadeOut = 0.35) {
  if (t < start || t > end) return 0;
  const a = fadeIn > 0 ? clamp01((t - start) / fadeIn) : 1;
  const b = end === Infinity || fadeOut <= 0 ? 1 : clamp01((end - t) / fadeOut);
  return Math.min(a, b);
}

// Keyframe track: keys = [{t, ...numbers}], each segment eased with key.ease (on the
// destination key). Returns an object with every numeric field interpolated.
export function track(keys, t, mix = (a, b, s) => {
  const o = {};
  for (const k in b) if (typeof b[k] === 'number') o[k] = lerp(a[k] ?? b[k], b[k], s);
  return o;
}) {
  if (t <= keys[0].t) return { ...keys[0] };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (t < b.t) {
      const s = (ease[b.ease] || ease.inOut)(clamp01((t - a.t) / (b.t - a.t)));
      return { ...b, ...mix(a, b, s, a, b) };
    }
  }
  return { ...keys[keys.length - 1] };
}

// Deterministic pseudo-random (for stars, jitter) — never Math.random in a render.
export function rng(seed = 1) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
