// The globe: satellite-style earth, atmosphere rim, starfield and a "spots" overlay
// (glowing blobs, km rings) drawn in one shader pass on a slightly larger sphere.
import * as THREE from 'three';
import { latLonToVec3 } from './geo.js';
import { rng } from './anim.js';

export const MAX_SPOTS = 16;

const earthVert = /* glsl */ `
  varying vec2 vUv; varying vec3 vNormalW; varying vec3 vPosW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vPosW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`;

const earthFrag = /* glsl */ `
  uniform sampler2D uMap, uTopo, uWater;
  uniform vec3 uSun, uOcean, uShelf, uTint;
  uniform float uSat, uBright, uRelief, uTintAmt;
  varying vec2 vUv; varying vec3 vNormalW; varying vec3 vPosW;

  float h(vec2 uv) { return texture2D(uTopo, uv).r; }

  void main() {
    vec3 col = texture2D(uMap, vUv).rgb;
    float water = texture2D(uWater, vUv).r;

    // Coast proximity → lighter continental shelf, like the reference shorts.
    float near = 0.0;
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.7853982;
      near += texture2D(uWater, vUv + vec2(cos(a) * 0.006, sin(a) * 0.009)).r;
    }
    float coast = 1.0 - near / 8.0;

    // Ocean: replace the near-black Blue Marble water with a readable teal.
    vec3 ocean = uOcean + col * 0.55;
    ocean = mix(ocean, uShelf, smoothstep(0.0, 0.6, coast) * 0.85);

    // Land: hillshade from the elevation map (light from the north-west).
    vec2 e = vec2(1.0 / 2048.0, 1.0 / 1024.0);
    float dx = h(vUv + vec2(e.x, 0.0)) - h(vUv - vec2(e.x, 0.0));
    float dy = h(vUv + vec2(0.0, e.y)) - h(vUv - vec2(0.0, e.y));
    float shade = clamp(1.0 + (-dx + dy) * uRelief, 0.55, 1.45);
    vec3 land = pow(col, vec3(0.85)) * 1.15 * shade;

    vec3 c = mix(land, ocean, water);

    // Mostly flat "map" lighting with a gentle terminator for depth.
    float lit = 0.82 + 0.28 * max(dot(normalize(vNormalW), uSun), 0.0);
    c *= lit;

    // Grade: saturation, brightness, tint (used for mood shifts like a dark "history" look).
    float l = dot(c, vec3(0.299, 0.587, 0.114));
    c = mix(vec3(l), c, uSat) * uBright;
    c = mix(c, c * uTint, uTintAmt);

    // Fresnel lift at the limb.
    vec3 viewDir = normalize(cameraPosition - vPosW);
    float rim = pow(1.0 - max(dot(normalize(vNormalW), viewDir), 0.0), 3.0);
    c += vec3(0.35, 0.6, 0.8) * rim * 0.35 * uBright;

    gl_FragColor = vec4(c, 1.0);
  }`;

const atmoFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uStrength;
  varying vec3 vNormalW; varying vec3 vPosW;
  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosW);
    float f = pow(1.0 - abs(dot(normalize(vNormalW), viewDir)), 2.2);
    gl_FragColor = vec4(uColor, f * uStrength);
  }`;

// Spots: per-spot params
//   uSpotC[i]  = unit centre vector
//   uSpotA[i]  = (rx deg, ry deg, softness 0..1, opacity)        — ellipse in lat/lon degrees
//   uSpotB[i]  = (mode, ringRadius rad, ringWidth rad, fillAlpha) — mode 0 blob, 1 ring
//   uSpotCol[i]= colour
const spotsFrag = /* glsl */ `
  #define N ${MAX_SPOTS}
  uniform vec3 uSpotC[N]; uniform vec4 uSpotA[N]; uniform vec4 uSpotB[N]; uniform vec3 uSpotCol[N];
  uniform int uCount; uniform float uTime;
  varying vec3 vPosW;

  float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  vec2 latlon(vec3 n) { return vec2(degrees(asin(clamp(n.y, -1.0, 1.0))), degrees(atan(n.z, -n.x))); }

  void main() {
    vec3 n = normalize(vPosW);
    vec2 ll = latlon(n);
    vec3 acc = vec3(0.0); float alpha = 0.0;
    for (int i = 0; i < N; i++) {
      if (i >= uCount) break;
      vec4 A = uSpotA[i]; vec4 B = uSpotB[i];
      if (A.w <= 0.001) continue;
      float a = 0.0;
      if (B.x < 0.5) {
        vec2 c = latlon(uSpotC[i]);
        float dlon = mod(ll.y - c.y + 540.0, 360.0) - 180.0;
        vec2 d = vec2(dlon * cos(radians(ll.x)) / max(A.x, 0.001), (ll.x - c.x) / max(A.y, 0.001));
        float r = length(d);
        float wobble = (noise(n * 9.0 + uTime * 0.15) - 0.5) * 0.35 * A.z;
        a = 1.0 - smoothstep(1.0 - A.z, 1.0, r + wobble);
      } else {
        float dist = acos(clamp(dot(n, uSpotC[i]), -1.0, 1.0));
        float ring = exp(-pow((dist - B.y) / max(B.z, 1e-5), 2.0));
        float fill = (1.0 - smoothstep(B.y - B.z, B.y, dist)) * B.w;
        a = max(ring, fill);
      }
      a *= A.w;
      acc = acc * (1.0 - a) + uSpotCol[i] * a;
      alpha = alpha + a * (1.0 - alpha);
    }
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(acc / max(alpha, 1e-4), alpha);
  }`;

export async function createGlobe(scene, { textures }) {
  const loader = new THREE.TextureLoader();
  const load = (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej));
  const [map, topo, water] = await Promise.all([load(textures.map), load(textures.topo), load(textures.water)]);
  map.colorSpace = THREE.NoColorSpace;
  map.anisotropy = 8;

  const earthU = {
    uMap: { value: map }, uTopo: { value: topo }, uWater: { value: water },
    uSun: { value: new THREE.Vector3(-0.4, 0.6, 0.7).normalize() },
    uOcean: { value: new THREE.Color('#123f4d') },
    uShelf: { value: new THREE.Color('#2b7889') },
    uTint: { value: new THREE.Color('#ffffff') },
    uSat: { value: 1 }, uBright: { value: 1 }, uRelief: { value: 7 }, uTintAmt: { value: 0 },
  };
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 192, 128),
    new THREE.ShaderMaterial({ uniforms: earthU, vertexShader: earthVert, fragmentShader: earthFrag })
  );
  scene.add(earth);

  const atmoU = { uColor: { value: new THREE.Color('#8fd3ff') }, uStrength: { value: 0.9 } };
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(1.06, 96, 64),
    new THREE.ShaderMaterial({
      uniforms: atmoU, vertexShader: earthVert, fragmentShader: atmoFrag,
      side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
  );
  scene.add(atmo);

  const spotU = {
    uSpotC: { value: Array.from({ length: MAX_SPOTS }, () => new THREE.Vector3(0, 1, 0)) },
    uSpotA: { value: Array.from({ length: MAX_SPOTS }, () => new THREE.Vector4()) },
    uSpotB: { value: Array.from({ length: MAX_SPOTS }, () => new THREE.Vector4()) },
    uSpotCol: { value: Array.from({ length: MAX_SPOTS }, () => new THREE.Color()) },
    uCount: { value: 0 }, uTime: { value: 0 },
  };
  const spots = new THREE.Mesh(
    new THREE.SphereGeometry(1.0015, 192, 128),
    new THREE.ShaderMaterial({
      uniforms: spotU, vertexShader: earthVert, fragmentShader: spotsFrag,
      transparent: true, depthWrite: false,
    })
  );
  spots.renderOrder = 2;
  scene.add(spots);

  // Starfield (deterministic).
  const r = rng(7), pos = [];
  for (let i = 0; i < 1400; i++) {
    const v = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize().multiplyScalar(60 + r() * 20);
    pos.push(v.x, v.y, v.z);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xbfd8ff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.55 }));
  scene.add(stars);

  return {
    earth, atmo, spots, stars, earthU, atmoU, spotU,
    setSpot(i, s) {
      latLonToVec3(s.at[0], s.at[1], 1, spotU.uSpotC.value[i]).normalize();
      spotU.uSpotA.value[i].set(s.rx ?? s.r ?? 5, s.ry ?? s.r ?? 5, s.soft ?? 0.5, s.opacity);
      spotU.uSpotB.value[i].set(s.mode === 'ring' ? 1 : 0, s.ringRad ?? 0, s.ringWidth ?? 0.004, s.fill ?? 0);
      spotU.uSpotCol.value[i].set(s.color ?? '#ff5a4a');
    },
  };
}
