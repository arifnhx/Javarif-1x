// Sample episode: "The loneliest island" (Tristan da Cunha), 27 s vertical short.
// An episode is pure data: camera keys + timed layers. Times are in seconds.
const TRISTAN = [-37.11, -12.28];
const ST_HELENA = [-15.96, -5.71];
const INDIA_DROP = [-31.0, -15.5];

export default {
  meta: { title: 'The Loneliest Island', duration: 27, fps: 30, fov: 34 },

  // Camera: lat/lon of the point looked at, altitude above the surface (globe radius = 1),
  // tilt in degrees from straight down, frameY shifts the subject up the frame (captions live low).
  camera: [
    { t: 0.0, lat: -12, lon: -30, alt: 4.4, frameY: 0.06 },
    { t: 3.0, lat: -22, lon: -18, alt: 3.6, frameY: 0.06, ease: 'linear' },
    { t: 6.2, lat: TRISTAN[0], lon: TRISTAN[1], alt: 0.3, tilt: 34, frameY: 0.07, ease: 'inOut' },
    { t: 8.7, lat: TRISTAN[0], lon: TRISTAN[1], alt: 0.24, tilt: 40, frameY: 0.07, ease: 'linear' },
    { t: 11.4, lat: -26.8, lon: -8.6, alt: 1.6, tilt: 0, frameY: 0.12 },
    { t: 13.0, lat: -26.5, lon: -8.8, alt: 1.5, tilt: 0, frameY: 0.12, ease: 'linear' },
    { t: 14.9, lat: -31, lon: -11.5, alt: 3.5, tilt: 0, frameY: 0.05 },
    { t: 18.6, lat: -31, lon: -11.5, alt: 3.3, tilt: 0, frameY: 0.05, ease: 'linear' },
    { t: 21.2, lat: TRISTAN[0], lon: TRISTAN[1], alt: 0.3, tilt: 36, frameY: 0.03 },
    { t: 27.0, lat: TRISTAN[0], lon: TRISTAN[1], alt: 0.22, tilt: 44, frameY: 0.03, heading: 25, ease: 'linear' },
  ],

  // Colour grade over time — dips to a dark, desaturated "story" mood at the turn.
  grade: {
    tint: '#ffb27a',
    keys: [
      { t: 0, sat: 1, bright: 1, tintAmt: 0 },
      { t: 18.4, sat: 1, bright: 1, tintAmt: 0 },
      { t: 19.0, sat: 0.3, bright: 0.55, tintAmt: 0.35 },
      { t: 20.6, sat: 0.3, bright: 0.55, tintAmt: 0.35, ease: 'linear' },
      { t: 21.6, sat: 1.05, bright: 1, tintAmt: 0 },
    ],
  },

  // Surface overlays drawn on the globe: soft blobs (lat/lon ellipse) and km rings.
  spots: [
    { at: TRISTAN, r: 0.9, soft: 0.9, color: '#63c7c9', opacity: 0.7, start: 4.4, end: 12 },
    { at: TRISTAN, r: 0.9, soft: 0.9, color: '#63c7c9', opacity: 0.7, start: 19.8 },
    { at: TRISTAN, mode: 'ring', km: 2430, widthKm: 20, fill: 0.14, color: '#a8e4ff', opacity: 0.95, grow: [13.4, 1.8], start: 13.2, end: 19 },
  ],

  // Great-circle arcs (drawn on) — add `dash: n` for animated flow lines (winds, currents, routes).
  arcs: [
    { id: 'hop', from: TRISTAN, to: ST_HELENA, lift: 0.035, width: 0.0045, color: '#ff5a4a', start: 9.6, dur: 2.2, end: 15 },
  ],

  // True-size country outlines dropped somewhere else on the globe.
  outlines: [
    { country: 'India', to: INDIA_DROP, color: '#d8f1ff', fill: '#3d9cf0', fillOpacity: 0.5, start: 15.5, dur: 1.3, end: 19 },
  ],

  // Procedural hero islands (exaggerated scale so they read on a phone).
  islands: [
    { at: TRISTAN, radiusKm: 50, heightKm: 42, start: 4.6, end: 12 },
    { at: TRISTAN, radiusKm: 50, heightKm: 42, start: 19.8 },
  ],

  // HUD elements anchored to lat/lon (or screen [x,y] in 0..1).
  overlays: [
    { type: 'label', text: 'Middle of Nowhere', at: TRISTAN, dx: -170, dy: -300, arrow: true, arrowFrom: [60, 40], start: 1.2, end: 3.6, size: 58 },
    { type: 'label', text: 'Tristan da Cunha', font: 'hand', at: TRISTAN, dy: -250, size: 92, color: '#cdeeff', rotate: -4, start: 5.6, end: 9.6 },
    { type: 'counter', at: TRISTAN, dy: 210, icon: 'people', prefix: '~', from: 0, to: 240, round: 1, className: 'box', start: 6.8, end: 9.6 },

    { type: 'pin', at: TRISTAN, start: 9.3, end: 19.2, color: '#4fc3ff' },
    { type: 'pin', at: ST_HELENA, start: 9.4, end: 15, color: '#ff5a4a' },
    { type: 'label', text: 'Tristan da Cunha', font: 'hand', at: TRISTAN, dx: -200, dy: 10, size: 56, color: '#cdeeff', start: 9.6, end: 13 },
    { type: 'label', text: 'Saint Helena', font: 'hand', at: ST_HELENA, dx: 30, dy: -70, size: 56, color: '#ffffff', start: 10.4, end: 15 },
    { type: 'arcTag', arc: 'hop', along: 0.5, dx: 120, rotate: -10, total: 2430, suffix: ' km', round: 10, className: 'tag', start: 9.8, end: 13.2 },

    { type: 'label', text: '× 5', font: 'hand', at: INDIA_DROP, dx: 250, dy: -230, size: 150, color: '#ffd23f', rotate: -8, reveal: 'pop', start: 17.0, end: 19 },
    { type: 'label', text: 'People… <b>HERE?!</b>', font: 'hand', screen: [0.5, 0.3], size: 110, color: '#ffd23f', rotate: -7, reveal: 'pop', start: 18.9, end: 20.9 },

    { type: 'orbit', at: TRISTAN, names: ['Glass', 'Green', 'Hagan', 'Lavarello', 'Repetto', 'Rogers', 'Swain'], rx: 330, ry: 250, start: 22.0, stagger: 0.16 },
    { type: 'big', text: '7', sub: 'surnames', y: 0.17, color: '#ffd23f', start: 23.4 },
  ],

  // Narration lines; words are split into 1–3 word caption chunks. *word* = highlight.
  captions: [
    { t: 0.25, text: 'Look at the *middle* of nowhere…' },
    { t: 3.0, text: '…now zoom in.' },
    { t: 4.6, text: 'This is *Tristan* *da* *Cunha.*' },
    { t: 6.6, text: 'Only about *240* people live here.' },
    { t: 8.8, text: 'Their nearest neighbours?' },
    { t: 10.1, text: '*Saint* *Helena,* *2,430* km away.' },
    { t: 13.1, text: 'This empty circle is so big…' },
    { t: 15.3, text: '…you could fit *India* inside it *five* times.' },
    { t: 18.7, text: 'So who would live out here?' },
    { t: 20.7, text: 'Just a handful of families.' },
    { t: 22.3, text: 'Almost everyone shares one of just *seven* surnames.', end: 26.6 },
  ],
};
