// Geographic helpers. Globe radius is 1 unit; 1 unit = EARTH_KM kilometres.
import * as THREE from 'three';

export const EARTH_KM = 6371;
const D2R = Math.PI / 180;

// Same convention as THREE.SphereGeometry UVs, so an equirectangular texture lines up.
export function latLonToVec3(lat, lon, r = 1, out = new THREE.Vector3()) {
  const phi = (90 - lat) * D2R;
  const theta = (lon + 180) * D2R;
  return out.set(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

export function vec3ToLatLon(v) {
  const n = v.clone().normalize();
  const lat = 90 - Math.acos(THREE.MathUtils.clamp(n.y, -1, 1)) / D2R;
  let lon = Math.atan2(n.z, -n.x) / D2R - 180;
  if (lon < -180) lon += 360;
  return [lat, lon];
}

// Local east/north unit vectors at a surface point.
export function tangentFrame(lat, lon) {
  const up = latLonToVec3(lat, lon).normalize();
  const east = new THREE.Vector3(0, 1, 0).cross(up);
  if (east.lengthSq() < 1e-8) east.set(1, 0, 0);
  east.normalize();
  const north = up.clone().cross(east).normalize();
  return { up, east, north };
}

export function distanceKm([lat1, lon1], [lat2, lon2]) {
  const a = latLonToVec3(lat1, lon1), b = latLonToVec3(lat2, lon2);
  return a.angleTo(b) * EARTH_KM;
}

export function bearing([lat1, lon1], [lat2, lon2]) {
  const p1 = lat1 * D2R, p2 = lat2 * D2R, dl = (lon2 - lon1) * D2R;
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return Math.atan2(y, x);
}

export function destination([lat, lon], brng, km) {
  const d = km / EARTH_KM, p1 = lat * D2R, l1 = lon * D2R;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(brng));
  const l2 = l1 + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(p1), Math.cos(d) - Math.sin(p1) * Math.sin(p2));
  return [p2 / D2R, ((l2 / D2R + 540) % 360) - 180];
}

// Points along the great circle a→b, lifted by `lift * sin(pi*s)` above the surface.
export function greatCirclePoints(a, b, lift = 0, n = 96) {
  const va = latLonToVec3(a[0], a[1]), vb = latLonToVec3(b[0], b[1]);
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const v = slerp(va, vb, s);
    pts.push(v.multiplyScalar(1 + lift * Math.sin(Math.PI * s)));
  }
  return pts;
}

export function slerp(a, b, s) {
  const omega = a.angleTo(b);
  if (omega < 1e-6) return a.clone();
  const so = Math.sin(omega);
  return a.clone().multiplyScalar(Math.sin((1 - s) * omega) / so).add(b.clone().multiplyScalar(Math.sin(s * omega) / so));
}

// Spherical centroid (good enough for country-sized shapes).
export function centroid(ring) {
  const v = new THREE.Vector3();
  for (const [lon, lat] of ring) v.add(latLonToVec3(lat, lon));
  return vec3ToLatLon(v);
}

// "True size" transfer: keep each vertex's distance and bearing from the source
// centroid, re-anchored at a new centre. Shapes keep their real area anywhere.
export function transferRing(ring, fromCenter, toCenter) {
  return ring.map(([lon, lat]) => {
    const km = distanceKm(fromCenter, [lat, lon]);
    const b = bearing(fromCenter, [lat, lon]);
    const [nlat, nlon] = destination(toCenter, b, km);
    return [nlon, nlat];
  });
}

// Polyline curve so TubeGeometry follows straight segments (no Catmull-Rom overshoot).
export class PolylineCurve extends THREE.Curve {
  constructor(points) {
    super();
    this.points = points;
    this.cum = [0];
    for (let i = 1; i < points.length; i++) this.cum.push(this.cum[i - 1] + points[i].distanceTo(points[i - 1]));
    this.total = this.cum[this.cum.length - 1] || 1;
  }
  getPoint(t, out = new THREE.Vector3()) {
    const d = t * this.total;
    let i = 1;
    while (i < this.cum.length - 1 && this.cum[i] < d) i++;
    const seg = this.cum[i] - this.cum[i - 1] || 1;
    return out.copy(this.points[i - 1]).lerp(this.points[i], (d - this.cum[i - 1]) / seg);
  }
}
