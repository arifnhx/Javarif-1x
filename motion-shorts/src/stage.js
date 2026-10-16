// Stage: turns an episode description (pure data) into a frame for any time t.
// Layers: WebGL globe (earth, spots, arcs, outlines, hero islands) + a DOM HUD
// (labels, pins, counters, big numbers, captions) projected from 3D anchors.
import * as THREE from 'three';
import { feature } from 'topojson-client';
import { createGlobe, MAX_SPOTS } from './globe.js';
import { latLonToVec3, tangentFrame, greatCirclePoints, slerp, vec3ToLatLon, PolylineCurve, centroid, transferRing, distanceKm, EARTH_KM } from './geo.js';
import { ease, env, prog, lerp, clamp01, track, rng } from './anim.js';

THREE.ColorManagement.enabled = false; // colours in episodes are used as-is (what you write is what renders)

const arcVert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const arcFrag = /* glsl */ `
  uniform vec3 uColor; uniform float uProgress, uOpacity, uDash, uSpeed, uTime;
  varying vec2 vUv;
  void main() {
    float x = vUv.x;
    if (x > uProgress) discard;
    float a = uOpacity;
    vec3 c = uColor;
    if (uDash > 0.0) {
      float s = fract(x * uDash - uTime * uSpeed);
      a *= smoothstep(0.0, 0.75, s) * (1.0 - smoothstep(0.9, 1.0, s));
      a *= smoothstep(0.0, 0.1, x) * (1.0 - smoothstep(0.9, 1.0, x));
    } else {
      c = mix(c, vec3(1.0), smoothstep(uProgress - 0.04, uProgress, x) * 0.6);
    }
    if (a < 0.01) discard;
    gl_FragColor = vec4(c, a);
  }`;

const W = 1080, H = 1920;

export class Stage {
  constructor(root, episode, { assetBase = '.' } = {}) {
    this.root = root;
    this.ep = episode;
    this.assetBase = assetBase;
    this.duration = episode.meta.duration;
    this.fps = episode.meta.fps || 30;
  }

  async init() {
    const ep = this.ep;
    this.root.classList.add('stage');
    this.root.style.width = W + 'px';
    this.root.style.height = H + 'px';
    this.root.style.setProperty('--bg', ep.meta.background || 'radial-gradient(120% 80% at 50% 35%, #0f3346 0%, #061520 55%, #02070b 100%)');

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(W, H, false);
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.setClearColor(0x000000, 0);
    this.root.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(ep.meta.fov || 34, W / H, 0.001, 300);

    this.scene.add(new THREE.HemisphereLight(0xdff3ff, 0x3a4a3a, 3.2));
    const sun = new THREE.DirectionalLight(0xfff4e0, 4.0);
    sun.position.set(-3, 4, 5);
    this.scene.add(sun);
    this.sunLight = sun;

    this.globe = await createGlobe(this.scene, {
      textures: {
        map: `${this.assetBase}/node_modules/three-globe/example/img/earth-blue-marble.jpg`,
        topo: `${this.assetBase}/node_modules/three-globe/example/img/earth-topology.png`,
        water: `${this.assetBase}/node_modules/three-globe/example/img/earth-water.png`,
      },
    });
    if (ep.globe?.ocean) this.globe.earthU.uOcean.value.set(ep.globe.ocean);
    if (ep.globe?.shelf) this.globe.earthU.uShelf.value.set(ep.globe.shelf);
    if (ep.grade?.tint) this.globe.earthU.uTint.value.set(ep.grade.tint);

    this.buildArcs();
    await this.buildOutlines();
    this.buildIslands();
    this.buildHud();
    await document.fonts.ready;
    return this;
  }

  // ---------- 3D builders ----------

  buildArcs() {
    this.arcs = {};
    for (const a of this.ep.arcs || []) {
      const pts = greatCirclePoints(a.from, a.to, a.lift ?? 0.04, 160);
      const curve = new PolylineCurve(pts);
      const geo = new THREE.TubeGeometry(curve, 320, a.width ?? 0.004, 8, false);
      const uniforms = {
        uColor: { value: new THREE.Color(a.color || '#ffffff') },
        uProgress: { value: 0 }, uOpacity: { value: 0 },
        uDash: { value: a.dash || 0 }, uSpeed: { value: a.speed ?? 0.6 }, uTime: { value: 0 },
      };
      const mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({
        uniforms, vertexShader: arcVert, fragmentShader: arcFrag, transparent: true, depthWrite: false,
      }));
      mesh.renderOrder = 4;
      this.scene.add(mesh);
      this.arcs[a.id || `arc${Object.keys(this.arcs).length}`] = { def: a, mesh, uniforms, curve, km: distanceKm(a.from, a.to) };
    }
  }

  async buildOutlines() {
    this.outlines = [];
    const defs = this.ep.outlines || [];
    if (!defs.length) return;
    const topo = await (await fetch(`${this.assetBase}/node_modules/world-atlas/countries-50m.json`)).json();
    const countries = feature(topo, topo.objects.countries).features;
    for (const o of defs) {
      const f = countries.find((c) => c.properties.name === o.country);
      if (!f) { console.warn('country not found', o.country); continue; }
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      const ring = polys.map((p) => p[0]).sort((a, b) => b.length - a.length)[0];
      const from = centroid(ring);
      const moved = o.to ? transferRing(ring, from, o.to) : ring;
      const center = o.to || from;

      const pts = moved.map(([lon, lat]) => latLonToVec3(lat, lon, 1.003));
      const curve = new PolylineCurve(pts);
      const uniforms = {
        uColor: { value: new THREE.Color(o.color || '#9fdcff') }, uProgress: { value: 0 }, uOpacity: { value: 0 },
        uDash: { value: 0 }, uSpeed: { value: 0 }, uTime: { value: 0 },
      };
      const line = new THREE.Mesh(
        new THREE.TubeGeometry(curve, Math.min(4000, pts.length * 3), o.width ?? 0.0035, 6, true),
        new THREE.ShaderMaterial({ uniforms, vertexShader: arcVert, fragmentShader: arcFrag, transparent: true, depthWrite: false })
      );
      line.renderOrder = 5;

      // Fill: triangulate in the tangent plane at the centre, then wrap back onto the sphere.
      const { up, east, north } = tangentFrame(center[0], center[1]);
      const shape = new THREE.Shape(moved.map(([lon, lat]) => {
        const v = latLonToVec3(lat, lon);
        return new THREE.Vector2(v.dot(east), v.dot(north));
      }));
      const sg = new THREE.ShapeGeometry(shape);
      const p = sg.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), y = p.getY(i);
        const v = up.clone().multiplyScalar(Math.sqrt(Math.max(0, 1 - x * x - y * y))).addScaledVector(east, x).addScaledVector(north, y).normalize().multiplyScalar(1.002);
        p.setXYZ(i, v.x, v.y, v.z);
      }
      const fillMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(o.fill || o.color || '#4aa8ff'), transparent: true, opacity: 0, depthWrite: false, depthTest: false, side: THREE.DoubleSide });
      const fill = new THREE.Mesh(sg, fillMat);
      fill.renderOrder = 3;
      this.scene.add(fill, line);
      this.outlines.push({ def: o, line, uniforms, fill, fillMat, center });
    }
  }

  buildIslands() {
    this.islands = [];
    for (const d of this.ep.islands || []) {
      const R = (d.radiusKm ?? 50) / EARTH_KM, Hh = (d.heightKm ?? 25) / EARTH_KM;
      const rings = 40, segs = 96, r = rng(d.seed ?? 3);
      const bumps = Array.from({ length: 7 }, () => [r() * Math.PI * 2, 0.015 + r() * 0.03, 3 + Math.floor(r() * 6)]);
      const rough = (a) => 1 + bumps.reduce((s, [ph, amp, k]) => s + amp * Math.sin(k * a + ph), 0);
      const pos = [], col = [], idx = [];
      const cSand = new THREE.Color('#c9b38a'), cGrass = new THREE.Color('#4f7a3a'), cDark = new THREE.Color('#2f5228'),
        cRock = new THREE.Color('#6b5a4c'), cSnow = new THREE.Color('#e9eef2'), cSea = new THREE.Color('#2f8197');
      for (let i = 0; i <= rings; i++) {
        const u = i / rings; // 0 centre → 1 shore
        for (let j = 0; j < segs; j++) {
          const a = (j / segs) * Math.PI * 2, rr = u * R * rough(a);
          // Volcano profile: summit cone, wide plateau, steep coastal cliffs, sloping into the sea.
          let h = u < 0.22 ? lerp(1, 0.55, u / 0.22) : u < 0.8 ? lerp(0.55, 0.32, (u - 0.22) / 0.58) : u < 0.93 ? lerp(0.32, 0.03, ease.in((u - 0.8) / 0.13)) : lerp(0.03, -0.08, (u - 0.93) / 0.07);
          h += (r() - 0.5) * 0.03 * (1 - u);
          pos.push(Math.cos(a) * rr, h * Hh, Math.sin(a) * rr);
          const c = u > 0.93 ? cSand.clone().lerp(cSea, (u - 0.93) / 0.07) : u > 0.8 ? cRock.clone().lerp(cSand, (u - 0.8) / 0.13) : u > 0.3 ? cGrass.clone().lerp(cDark, r() * 0.5) : u > 0.1 ? cRock.clone().lerp(cGrass, (u - 0.1) / 0.2) : cSnow.clone().lerp(cRock, u / 0.1);
          col.push(c.r, c.g, c.b);
        }
      }
      for (let i = 0; i < rings; i++) for (let j = 0; j < segs; j++) {
        const a = i * segs + j, b = i * segs + ((j + 1) % segs), c = a + segs, e = b + segs;
        idx.push(a, c, b, b, c, e);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      geo.setIndex(idx);
      geo.computeVertexNormals();
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, metalness: 0, transparent: true, side: THREE.DoubleSide }));
      const { up } = tangentFrame(d.at[0], d.at[1]);
      const g = new THREE.Group();
      g.position.copy(up).multiplyScalar(1.0005);
      g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
      g.add(mesh);
      this.scene.add(g);
      this.islands.push({ def: d, group: g, mesh });
    }
  }

  // ---------- HUD ----------

  buildHud() {
    const hud = document.createElement('div');
    hud.className = 'hud';
    this.root.appendChild(hud);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.classList.add('hud-svg');
    svg.innerHTML = `<defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>`;
    hud.appendChild(svg);
    this.hud = hud;
    this.svg = svg;

    const vignette = document.createElement('div');
    vignette.className = 'vignette';
    this.root.insertBefore(vignette, hud);

    this.items = (this.ep.overlays || []).map((o) => {
      const el = document.createElement('div');
      el.className = `ov ov-${o.type} ${o.font === 'hand' ? 'hand' : ''} ${o.className || ''}`;
      if (o.color) el.style.color = o.color;
      if (o.size) el.style.fontSize = o.size + 'px';
      let arrow = null;
      if (o.type === 'label') {
        el.innerHTML = `<span class="ink">${o.text}</span>`;
        if (o.arrow) {
          arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          arrow.setAttribute('class', 'arrow');
          arrow.setAttribute('marker-end', 'url(#ah)');
          arrow.style.stroke = o.arrowColor || o.color || '#ffffff';
          svg.appendChild(arrow);
        }
      } else if (o.type === 'pin') {
        el.innerHTML = `<i class="pulse"></i><i class="dot"></i>`;
        if (o.color) el.style.setProperty('--pin', o.color);
      } else if (o.type === 'counter') {
        el.innerHTML = `${o.icon === 'people' ? peopleIcon() : ''}<b class="num"></b>`;
      } else if (o.type === 'arcTag') {
        el.innerHTML = `<b class="num"></b>`;
      } else if (o.type === 'big') {
        el.innerHTML = `<div class="big-main">${o.text}</div>${o.sub ? `<div class="big-sub">${o.sub}</div>` : ''}`;
      } else if (o.type === 'orbit') {
        el.innerHTML = o.names.map((n) => `<span class="orbit-name hand">${n}</span>`).join('');
      }
      hud.appendChild(el);
      return { o, el, arrow };
    });

    this.capEl = document.createElement('div');
    this.capEl.className = 'caption';
    hud.appendChild(this.capEl);
    this.chunks = buildCaptionChunks(this.ep.captions || [], this.duration);
    this.lastChunk = -1;
  }

  project(lat, lon, alt = 0) {
    const p = latLonToVec3(lat, lon, 1 + alt);
    const n = p.clone().normalize();
    const toCam = this.camera.position.clone().sub(p).normalize();
    const facing = n.dot(toCam);
    const v = p.clone().project(this.camera);
    return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, visible: facing > 0.05 && v.z < 1, facing };
  }

  anchor(o) {
    if (o.screen) return { x: o.screen[0] * W, y: o.screen[1] * H, visible: true, facing: 1 };
    if (o.at) return this.project(o.at[0], o.at[1]);
    if (o.arc && this.arcs[o.arc]) {
      const a = this.arcs[o.arc];
      const [lat, lon] = vec3ToLatLon(a.curve.getPoint(o.along ?? 0.5));
      return this.project(lat, lon, (a.def.lift ?? 0.04) * Math.sin(Math.PI * (o.along ?? 0.5)));
    }
    return { x: W / 2, y: H / 2, visible: true, facing: 1 };
  }

  // ---------- per-frame ----------

  renderAt(t) {
    const ep = this.ep;
    this.updateCamera(t);

    const g = track(ep.grade?.keys || [{ t: 0, sat: 1, bright: 1, tintAmt: 0 }], t);
    this.globe.earthU.uSat.value = g.sat ?? 1;
    this.globe.earthU.uBright.value = g.bright ?? 1;
    this.globe.earthU.uTintAmt.value = g.tintAmt ?? 0;
    this.globe.atmoU.uStrength.value = 0.9 * (g.bright ?? 1);

    // Spots
    const spots = ep.spots || [];
    const u = this.globe.spotU;
    u.uCount.value = Math.min(spots.length, MAX_SPOTS);
    u.uTime.value = t;
    spots.slice(0, MAX_SPOTS).forEach((s, i) => {
      let opacity = (s.opacity ?? 0.85) * env(t, s.start ?? 0, s.end ?? Infinity, s.fadeIn ?? 0.6, s.fadeOut ?? 0.6);
      if (s.pulse) opacity *= 0.75 + 0.25 * Math.sin(t * s.pulse * Math.PI * 2);
      const gp = s.grow ? prog(t, s.grow[0], s.grow[1], ease.out) : 1;
      const move = s.moveTo ? prog(t, s.move[0], s.move[1]) : 0;
      const at = s.moveTo ? vec3ToLatLon(slerp(latLonToVec3(...s.at), latLonToVec3(...s.moveTo), move)) : s.at;
      this.globe.setSpot(i, {
        ...s, at, opacity,
        rx: (s.rx ?? s.r ?? 5) * (s.mode === 'ring' ? 1 : lerp(0.3, 1, gp)),
        ry: (s.ry ?? s.r ?? 5) * (s.mode === 'ring' ? 1 : lerp(0.3, 1, gp)),
        ringRad: ((s.km ?? 0) / EARTH_KM) * gp,
        ringWidth: (s.widthKm ?? 18) / EARTH_KM,
      });
    });

    for (const a of Object.values(this.arcs)) {
      const d = a.def;
      a.uniforms.uTime.value = t;
      a.uniforms.uOpacity.value = (d.opacity ?? 1) * env(t, d.start, d.end ?? Infinity, d.dash ? 0.6 : 0.01, 0.5);
      a.uniforms.uProgress.value = d.dash ? 1 : prog(t, d.start, d.dur ?? 1.5, ease.inOut) * 1.0001;
      a.progress = a.uniforms.uProgress.value;
    }

    for (const o of this.outlines) {
      const d = o.def;
      const e = env(t, d.start, d.end ?? Infinity, 0.01, 0.5);
      o.uniforms.uOpacity.value = e;
      o.uniforms.uProgress.value = prog(t, d.start, d.dur ?? 1.2, ease.inOut) * 1.0001;
      o.fillMat.opacity = (d.fillOpacity ?? 0.45) * e * prog(t, d.start + (d.dur ?? 1.2) * 0.6, 0.6);
    }

    for (const isl of this.islands) {
      const d = isl.def;
      const e = env(t, d.start ?? 0, d.end ?? Infinity, d.fadeIn ?? 0.8, d.fadeOut ?? 0.8);
      isl.group.visible = e > 0.001;
      isl.group.scale.set(1, Math.max(0.001, ease.out(e)), 1);
      isl.mesh.material.opacity = Math.min(1, e * 2);
    }

    this.renderer.render(this.scene, this.camera);
    this.updateHud(t);
  }

  updateCamera(t) {
    const keys = this.ep.camera;
    let a = keys[0], b = keys[0], s = 0;
    for (let i = 1; i < keys.length; i++) {
      if (t < keys[i].t) { a = keys[i - 1]; b = keys[i]; s = (ease[b.ease] || ease.inOut)(clamp01((t - a.t) / (b.t - a.t))); break; }
      a = b = keys[i];
    }
    const va = latLonToVec3(a.lat, a.lon), vb = latLonToVec3(b.lat, b.lon);
    const [lat, lon] = vec3ToLatLon(slerp(va, vb, s));
    const alt = Math.exp(lerp(Math.log(a.alt), Math.log(b.alt), s)); // log zoom feels uniform
    const tilt = lerp(a.tilt ?? 0, b.tilt ?? 0, s) * Math.PI / 180;
    const heading = lerp(a.heading ?? 0, b.heading ?? 0, s) * Math.PI / 180;
    const frameY = lerp(a.frameY ?? 0, b.frameY ?? 0, s);

    const { up, east, north } = tangentFrame(lat, lon);
    const fwd = north.clone().multiplyScalar(Math.cos(heading)).addScaledVector(east, Math.sin(heading));
    const dir = up.clone().multiplyScalar(Math.cos(tilt)).addScaledVector(fwd, -Math.sin(tilt));
    const P = up.clone();
    this.camera.position.copy(P).addScaledVector(dir, alt);
    this.camera.up.copy(fwd);
    this.camera.lookAt(P);
    this.camera.near = Math.max(0.0005, alt * 0.02);
    this.camera.updateProjectionMatrix();
    if (frameY) this.camera.setViewOffset(W, H, 0, frameY * H, W, H); else this.camera.clearViewOffset();
    this.camera.updateMatrixWorld();
    this.sunLight.position.copy(this.camera.position).add(fwd.clone().multiplyScalar(2)).add(east.clone().multiplyScalar(-2));
    this.camState = { lat, lon, alt };
  }

  updateHud(t) {
    for (const { o, el, arrow } of this.items) {
      const e = env(t, o.start ?? 0, o.end ?? Infinity, o.fadeIn ?? 0.25, o.fadeOut ?? 0.3);
      const pos = this.anchor(o);
      const show = e > 0.001 && pos.visible;
      el.style.display = show ? '' : 'none';
      if (arrow) arrow.style.display = show ? '' : 'none';
      if (!show) continue;

      const popP = prog(t, o.start ?? 0, 0.45, ease.outBack);
      const x = pos.x + (o.dx ?? 0), y = pos.y + (o.dy ?? 0);
      const rot = o.rotate ?? 0;
      el.style.opacity = e;

      if (o.type === 'label') {
        const reveal = o.reveal === 'pop' ? 1 : prog(t, o.start ?? 0, o.writeDur ?? 0.7, ease.out);
        el.querySelector('.ink').style.clipPath = `inset(-20% ${(1 - reveal) * 100}% -20% -5%)`;
        const sc = o.reveal === 'pop' ? lerp(0.6, 1, popP) : 1;
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg) scale(${sc})`;
        if (arrow) {
          const ax = x + (o.arrowFrom?.[0] ?? 0), ay = y + (o.arrowFrom?.[1] ?? 40);
          const tx = pos.x, ty = pos.y;
          const len = Math.hypot(tx - ax, ty - ay), k = Math.max(0, (len - (o.arrowGap ?? 22)) / len);
          const ex = ax + (tx - ax) * k, ey = ay + (ty - ay) * k;
          const cx = (ax + ex) / 2 + (ey - ay) * (o.arrowBend ?? 0.25), cy = (ay + ey) / 2 - (ex - ax) * (o.arrowBend ?? 0.25);
          arrow.setAttribute('d', `M${ax},${ay} Q${cx},${cy} ${ex},${ey}`);
          const L = arrow.getTotalLength();
          const ap = prog(t, (o.start ?? 0) + 0.25, 0.5, ease.out);
          arrow.style.strokeDasharray = `${L}`;
          arrow.style.strokeDashoffset = `${L * (1 - ap)}`;
          arrow.style.opacity = e * (ap > 0.02 ? 1 : 0);
        }
      } else if (o.type === 'pin') {
        const ph = ((t - (o.start ?? 0)) * (o.pulse ?? 0.9)) % 1;
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${lerp(0.2, 1, popP)})`;
        const pulse = el.querySelector('.pulse');
        pulse.style.transform = `translate(-50%, -50%) scale(${lerp(0.3, 2.6, ph)})`;
        pulse.style.opacity = 1 - ph;
      } else if (o.type === 'counter' || o.type === 'arcTag') {
        let v;
        if (o.type === 'arcTag') v = (o.total ?? this.arcs[o.arc]?.km ?? 0) * (this.arcs[o.arc]?.progress ?? 0);
        else v = lerp(o.from ?? 0, o.to, prog(t, (o.start ?? 0) + (o.countDelay ?? 0.15), o.countDur ?? 1.2, ease.outExpo));
        el.querySelector('.num').textContent = `${o.prefix ?? ''}${fmt(v, o.round ?? 10)}${o.suffix ?? ''}`;
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${rot}deg) scale(${lerp(0.4, 1, popP)})`;
      } else if (o.type === 'big') {
        el.style.transform = `translate(${W / 2}px, ${(o.y ?? 0.3) * H}px) translate(-50%, -50%) scale(${lerp(0.3, 1, popP) * (1 + 0.03 * (t - (o.start ?? 0)))})`;
      } else if (o.type === 'orbit') {
        el.style.transform = `translate(${x}px, ${y}px)`;
        const names = el.children, n = names.length;
        for (let i = 0; i < n; i++) {
          const st = (o.start ?? 0) + i * (o.stagger ?? 0.18);
          const pp = prog(t, st, 0.4, ease.outBack);
          const ang = (i / n) * Math.PI * 2 - Math.PI / 2 + (t - (o.start ?? 0)) * (o.spin ?? 0.06);
          const nx = Math.cos(ang) * (o.rx ?? 300), ny = Math.sin(ang) * (o.ry ?? 240);
          names[i].style.opacity = clamp01((t - st) / 0.2);
          names[i].style.transform = `translate(${nx}px, ${ny}px) translate(-50%, -50%) scale(${lerp(0.3, 1, pp)})`;
        }
      }
    }

    // Captions: one chunk of 1–3 words at a time, popping in.
    let ci = -1;
    for (let i = 0; i < this.chunks.length; i++) if (t >= this.chunks[i].start && t < this.chunks[i].end) { ci = i; break; }
    if (ci !== this.lastChunk) {
      this.capEl.innerHTML = ci >= 0 ? this.chunks[ci].html : '';
      this.lastChunk = ci;
    }
    if (ci >= 0) {
      const c = this.chunks[ci];
      const p = prog(t, c.start, 0.16, ease.outBack);
      this.capEl.style.opacity = clamp01((t - c.start) / 0.06);
      this.capEl.style.transform = `translate(-50%, 0) scale(${lerp(0.85, 1, p)})`;
    }
  }
}

function fmt(v, round) {
  const r = Math.round(v / round) * round;
  return r.toLocaleString('en-US');
}

function peopleIcon() {
  const one = (x, s) => `<g transform="translate(${x},0) scale(${s})"><circle cx="10" cy="7" r="5.5"/><path d="M1 28 Q1 15 10 15 Q19 15 19 28 Z"/></g>`;
  return `<svg class="people" viewBox="0 0 70 30">${one(0, 0.9)}${one(16, 1)}${one(34, 1)}${one(52, 0.9)}</svg>`;
}

// Split narration lines into 1–3 word chunks, timed by word length.
// `*word*` marks a highlight word (rendered in the accent colour).
export function buildCaptionChunks(lines, duration) {
  const out = [];
  lines.forEach((line, li) => {
    const start = line.t;
    const end = line.end ?? (lines[li + 1]?.t ?? duration - 0.2) - 0.1;
    const words = line.text.split(/\s+/).filter(Boolean);
    const weights = words.map((w) => w.replace(/\*/g, '').length + 2);
    const total = weights.reduce((a, b) => a + b, 0);
    let groups = [], cur = [];
    words.forEach((w, i) => {
      cur.push(i);
      const brk = /[.,!?;:…—]$/.test(w.replace(/\*/g, '')) || cur.length === (line.max ?? 3);
      if (brk || i === words.length - 1) { groups.push(cur); cur = []; }
    });
    let acc = 0;
    for (const gidx of groups) {
      const s = start + (acc / total) * (end - start);
      acc += gidx.reduce((a, i) => a + weights[i], 0);
      const e = start + (acc / total) * (end - start);
      const html = gidx.map((i) => {
        const w = words[i];
        return /^\*.*\*[.,!?…]?$/.test(w) ? `<em>${w.replace(/\*/g, '')}</em>` : w;
      }).join(' ');
      out.push({ start: s, end: e, html });
    }
  });
  return out;
}
