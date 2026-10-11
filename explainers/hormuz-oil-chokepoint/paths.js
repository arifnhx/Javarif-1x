// Path helpers shared by the engine (browser) and build-geo.mjs (Node).
(function (root) {
  // Mercator in degrees: x = lon, y = mercator-lat in degrees.
  function merc([lon, lat]) {
    const r = (lat * Math.PI) / 180;
    return [lon, (Math.log(Math.tan(Math.PI / 4 + r / 2)) * 180) / Math.PI];
  }
  function unmerc([x, y]) {
    return [x, (Math.atan(Math.sinh((y * Math.PI) / 180)) * 180) / Math.PI];
  }

  // Centripetal Catmull-Rom through lon/lat waypoints, in Mercator space.
  // Returns { pts: [[x,y]...] (mercator), cum: [arc length...], length }.
  function smooth(lonlats, perSeg = 14) {
    const p = lonlats.map(merc);
    const out = [];
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
      for (let s = 0; s < perSeg; s++) {
        const t = s / perSeg, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map((k) =>
          0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 +
            (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
      }
    }
    out.push(p[p.length - 1]);
    return measure(out);
  }

  // Closed ellipse loop in Mercator space around a lon/lat centre.
  function ellipse({ center, rx, ry, reverse }, n = 96) {
    const [cx, cy] = merc(center);
    const out = [];
    for (let i = 0; i <= n; i++) {
      const a = ((reverse ? -1 : 1) * i * 2 * Math.PI) / n;
      out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
    }
    return measure(out);
  }

  function measure(pts) {
    const cum = [0];
    for (let i = 1; i < pts.length; i++) {
      cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    }
    return { pts, cum, length: cum[cum.length - 1] };
  }

  // Point + heading (radians, mercator space, north-up) at arc distance d.
  function at(path, d) {
    const { pts, cum, length } = path;
    d = Math.max(0, Math.min(length, d));
    let lo = 0, hi = cum.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= d) lo = mid; else hi = mid;
    }
    const seg = cum[hi] - cum[lo] || 1e-9;
    const f = (d - cum[lo]) / seg;
    const a = pts[lo], b = pts[hi];
    return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, heading: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  }

  root.PATHS = { merc, unmerc, smooth, ellipse, at };
})(typeof window !== 'undefined' ? window : globalThis);
