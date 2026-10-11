// Scene definition for "Hormuz: the world's oil chokepoint".
// Everything the engine draws is declared here as data: beats (camera +
// narration), flags, routes, swarms, labels. Coordinates are [lon, lat].
(function (root) {
  const STRAIT = [56.42, 26.52];

  // Shared Gulf lane, from the head of the Gulf to the strait. Every supply
  // route joins it, so they visibly funnel into one channel.
  const GULF_LANE = [
    [50.9, 27.55], [52.2, 26.95], [53.7, 26.3], [54.9, 26.4], [55.75, 26.38], STRAIT,
  ];
  // Strait out into the Gulf of Oman and the open Arabian Sea.
  const EXIT_LANE = [STRAIT, [56.75, 26.12], [57.25, 25.45], [58.4, 24.75], [59.9, 23.7], [61.6, 22.4]];
  // Arabian Sea -> south of Sri Lanka -> Malacca -> South China Sea.
  const EAST_TRUNK = [
    [61.6, 22.4], [65.0, 17.0], [71.5, 10.2], [76.8, 6.0], [80.6, 5.3], [86.0, 5.8],
    [93.5, 6.4], [97.6, 5.6], [99.9, 3.6], [102.6, 1.85], [103.45, 1.18], [103.85, 1.2], [104.4, 1.3], [105.6, 2.4], [109.0, 7.0],
  ];

  const SCENE = {
    title: "Hormuz: the world's oil chokepoint",
    width: 1920,
    height: 1080,
    fps: 30,
    duration: 41,
    strait: STRAIT,

    // Camera keyframes. Each beat holds its camera; the engine eases between
    // consecutive beats over `move` seconds at the start of the next beat.
    // span = degrees of longitude across the frame; tilt in degrees.
    beats: [
      {
        id: 'open', t0: 0, t1: 6,
        camera: { center: [56.35, 26.45], span: 3.4, tilt: 0 }, move: 0,
        kicker: 'THE STRAIT OF HORMUZ',
        narration: 'In normal times, about one fifth of the world’s oil passes through this one strait, every day.',
      },
      {
        id: 'supply', t0: 6, t1: 13.5,
        camera: { center: [51.6, 27.25], span: 17.5, tilt: 0 }, move: 2.0,
        kicker: 'THE SUPPLY',
        narration: 'Tankers from Saudi Arabia, the biggest shipper, plus Iraq, Kuwait and the UAE — and LNG from Qatar — all funnel through the Persian Gulf.',
      },
      {
        id: 'asia', t0: 13.5, t1: 20.5,
        camera: { center: [93.0, 17.5], span: 98, tilt: 0 }, move: 2.2,
        kicker: 'THE BUYERS',
        narration: 'Out the other side, most of it heads east to Asia: China, India, Japan and South Korea take the bulk.',
      },
      {
        id: 'risk', t0: 20.5, t1: 28,
        camera: { center: [56.45, 26.55], span: 2.6, tilt: 0 }, move: 2.2,
        kicker: 'THE RISK',
        narration: 'Iran lines the strait’s northern shore. At its narrowest it’s only about 33 km wide — a closure would cut the world off from that oil.',
      },
      {
        id: 'navy', t0: 28, t1: 34.5,
        camera: { center: [57.05, 25.75], span: 7.0, tilt: 52 }, move: 1.6,
        kicker: 'THE NAVY AT SEA',
        narration: 'US Navy warships regularly sail through the Strait of Hormuz.',
      },
      {
        id: 'whole', t0: 34.5, t1: 41,
        camera: { center: [92.0, 19.0], span: 104, tilt: 0 }, move: 2.4,
        kicker: 'THE WHOLE PICTURE',
        narration: 'One narrow strait, holding up the global economy: the world’s most important oil chokepoint.',
      },
    ],

    // Country fills. `tone` keys map to palette colours in the engine;
    // each window is [start, end] in seconds.
    highlights: [
      { id: 364, tone: 'iran', on: [[0, 41]] },
      { id: 512, tone: 'oman', on: [[0, 41]] },
      { ids: [682, 368, 414, 784, 634], tone: 'supplier', on: [[6.4, 41]] },
      { ids: [156, 356, 392, 410], tone: 'buyer', on: [[14.2, 41]] },
      { id: 364, tone: 'threat', on: [[21.0, 28.4]] },
    ],

    flags: [
      // Open: the two shores of the strait.
      { code: 'IR', name: 'Iran', at: [55.6, 27.0], on: [0.6, 5.8], side: 'right' },
      { code: 'OM', name: 'Oman', at: [56.25, 26.02], on: [1.0, 5.8], side: 'left' },
      // Supply.
      { code: 'SA', name: 'Saudi Arabia', note: 'biggest shipper', at: [47.8, 25.4], on: [7.2, 13.4], side: 'right', big: true },
      { code: 'IQ', name: 'Iraq', at: [47.0, 30.9], on: [8.2, 13.4], side: 'right', plain: true },
      { code: 'KW', name: 'Kuwait', at: [47.75, 29.3], on: [8.6, 13.4], side: 'left', plain: true },
      { code: 'AE', name: 'UAE', at: [54.3, 24.1], on: [9.0, 13.4], side: 'right', offset: [20, -90] },
      { code: 'QA', name: 'Qatar', note: 'LNG', at: [51.2, 25.25], on: [9.4, 13.4], side: 'right', offset: [10, 70] },
      { code: 'IR', name: 'Iran', at: [53.2, 29.4], on: [7.6, 13.4], side: 'right' },
      // Buyers.
      { code: 'CN', name: 'China', at: [105.0, 33.0], on: [15.6, 20.4], side: 'right', big: true },
      { code: 'IN', name: 'India', at: [78.5, 22.0], on: [15.2, 20.4], side: 'right', big: true },
      { code: 'JP', name: 'Japan', at: [138.5, 36.6], on: [16.2, 20.4], side: 'left', big: true },
      { code: 'KR', name: 'South Korea', at: [127.9, 36.4], on: [16.6, 20.4], side: 'right', plain: true, offset: [0, 80] },
      // Risk.
      { code: 'IR', name: 'Iran', note: 'northern shore', at: [55.9, 27.0], on: [21.2, 27.9], side: 'right', big: true },
      { code: 'OM', name: 'Oman', at: [56.1, 26.2], on: [21.6, 27.9], side: 'left' },
      // Navy beat: the shores, quietly.
      { code: 'IR', name: 'Iran', at: [57.6, 27.05], on: [29.0, 34.4], side: 'right' },
      { code: 'OM', name: 'Oman', at: [56.15, 24.2], on: [29.2, 34.4], side: 'right' },
      // Whole picture.
      { code: 'SA', name: 'Saudi Arabia', at: [45.0, 24.0], on: [36.0, 41], side: 'right', offset: [-30, 150] },
      { code: 'IR', name: 'Iran', at: [54.5, 32.5], on: [36.0, 41], side: 'left' },
      { code: 'AE', name: 'UAE', at: [53.8, 23.2], on: [36.3, 41], side: 'left' },
      { code: 'QA', name: 'Qatar', at: [51.2, 25.3], on: [36.3, 41], side: 'left', mini: true },
      { code: 'OM', name: 'Oman', at: [57.0, 21.0], on: [36.4, 41], side: 'left', mini: true },
      { code: 'IN', name: 'India', at: [78.5, 22.0], on: [36.6, 41], side: 'right' },
      { code: 'CN', name: 'China', at: [112.0, 28.0], on: [36.8, 41], side: 'right' },
      { code: 'JP', name: 'Japan', at: [138.5, 36.6], on: [37.0, 41], side: 'left' },
    ],

    // Routes are drawn on between `draw[0]` and `draw[1]` and stay until `off`.
    routes: [
      // Supply into the strait.
      { id: 'iraq', kind: 'supply', pts: [[48.85, 29.62], [49.55, 28.95], [50.25, 28.2], ...GULF_LANE], draw: [7.0, 10.2], off: 41 },
      { id: 'kuwait', kind: 'supply', pts: [[48.38, 29.05], [49.1, 28.55], [50.0, 27.95], ...GULF_LANE], draw: [7.3, 10.4], off: 41 },
      { id: 'saudi', kind: 'supply', pts: [[50.28, 26.72], [50.95, 26.95], [52.2, 26.95], ...GULF_LANE.slice(2)], draw: [6.8, 9.8], off: 41, weight: 1.6 },
      { id: 'qatar', kind: 'lng', pts: [[51.75, 25.95], [52.6, 26.1], [53.7, 26.3], ...GULF_LANE.slice(3)], draw: [8.0, 10.8], off: 41 },
      { id: 'uae', kind: 'supply', pts: [[52.6, 24.55], [53.4, 25.15], [54.4, 25.75], [55.2, 26.15], [55.75, 26.38], STRAIT], draw: [8.3, 10.8], off: 41 },
      // Exports out of the strait.
      { id: 'exit', kind: 'export', pts: EXIT_LANE, draw: [14.0, 15.2], off: 41, weight: 1.6 },
      { id: 'india', kind: 'export', pts: [[61.6, 22.4], [65.5, 22.0], [68.3, 22.3], [69.4, 22.6]], draw: [15.0, 16.4], off: 41 },
      { id: 'trunk', kind: 'export', pts: EAST_TRUNK, draw: [15.0, 17.2], off: 41, weight: 1.4 },
      { id: 'china', kind: 'export', pts: [[109.0, 7.0], [112.5, 14.5], [117.0, 20.8], [119.6, 24.0], [121.0, 26.6], [122.4, 29.4], [122.2, 30.7]], draw: [17.0, 18.6], off: 41 },
      { id: 'japan', kind: 'export', pts: [[109.0, 7.0], [114.5, 15.5], [120.9, 20.4], [124.0, 25.0], [128.5, 29.4], [132.5, 31.6], [136.0, 33.2], [139.75, 34.9]], draw: [17.2, 19.0], off: 41 },
      { id: 'korea', kind: 'export', pts: [[128.5, 29.4], [128.0, 32.2], [128.9, 34.2], [129.6, 35.3]], draw: [18.4, 19.4], off: 41 },
    ],

    // Moving things. kind 'tanker' and 'warship' are drawn by the engine's
    // swarm renderer, nose first along the path tangent.
    swarms: [
      // Open: traffic already moving through the strait.
      {
        kind: 'tanker', on: [0, 6.2], column: true,
        pts: [[55.2, 26.33], [55.8, 26.36], STRAIT, [56.78, 26.1], [57.3, 25.4]],
        count: 5, gapDeg: 0.42, speedDeg: 0.06, lead: 1.85,
      },
      // Tankers riding the supply and export routes (the flow made visible).
      { kind: 'tanker', route: 'saudi', every: 0.22, speed: 0.06, on: [9.0, 13.6] },
      { kind: 'tanker', route: 'iraq', every: 0.3, speed: 0.06, on: [9.6, 13.6] },
      { kind: 'tanker', route: 'kuwait', every: 0.3, speed: 0.06, on: [9.8, 13.6], phase: 0.15 },
      { kind: 'lng', route: 'qatar', every: 0.34, speed: 0.06, on: [10.0, 13.6] },
      { kind: 'tanker', route: 'uae', every: 0.34, speed: 0.06, on: [10.0, 13.6] },
      { kind: 'tanker', route: 'trunk', every: 0.12, speed: 0.04, on: [16.6, 20.6] },
      { kind: 'tanker', route: 'india', every: 0.34, speed: 0.07, on: [16.0, 20.6] },
      { kind: 'tanker', route: 'china', every: 0.3, speed: 0.06, on: [18.0, 20.6] },
      { kind: 'tanker', route: 'japan', every: 0.22, speed: 0.05, on: [18.2, 20.6] },
      { kind: 'tanker', route: 'exit', every: 0.25, speed: 0.08, on: [15.0, 20.6] },

      // THE NAVY AT SEA: a column transiting the strait, nose first...
      {
        kind: 'warship', on: [28.4, 34.6], column: true,
        pts: [[55.15, 26.33], [55.8, 26.36], STRAIT, [56.78, 26.1], [57.3, 25.4], [58.0, 24.95]],
        count: 5, gapDeg: 0.26, speedDeg: 0.115, lead: 1.25, size: 1.0,
      },
      // ...and others patrolling the Gulf of Oman beyond it.
      {
        kind: 'warship', on: [28.6, 34.6], loop: { center: [58.35, 24.6], rx: 0.62, ry: 0.27 },
        count: 3, speedDeg: 0.07, phase: 0.1, size: 0.9,
      },
      {
        kind: 'warship', on: [28.8, 34.6], loop: { center: [57.75, 25.25], rx: 0.32, ry: 0.15, reverse: true },
        count: 2, speedDeg: 0.06, phase: 0.55, size: 0.85,
      },
    ],

    // Narrowest point of the strait, Musandam (Oman) to the Iranian side.
    narrows: { a: [56.364, 26.386], b: [56.342, 26.827], label: '≈ 33 km', on: [22.4, 28.0] },

    // Blockade ring across the strait.
    blockade: { at: STRAIT, on: [24.2, 28.2], reprise: [37.4, 41] },

    labels: [
      { text: 'STRAIT OF HORMUZ', at: STRAIT, hero: true, on: [0.4, 5.9] },
      { text: 'PERSIAN GULF', at: [51.3, 27.6], sea: true, on: [6.8, 13.4] },
      { text: 'GULF OF OMAN', at: [58.6, 24.25], sea: true, on: [7.8, 13.4] },
      { text: 'STRAIT OF HORMUZ', at: STRAIT, chip: true, on: [9.5, 13.4] },
      { text: 'ARABIAN SEA', at: [64.5, 15.0], sea: true, on: [14.6, 20.4] },
      { text: 'Strait of Hormuz', at: STRAIT, chip: true, on: [14.2, 20.4] },
      { text: 'STRAIT OF HORMUZ', at: STRAIT, hero: true, on: [28.6, 34.4] },
      { text: 'GULF OF OMAN', at: [58.45, 24.05], sea: true, on: [29.0, 34.4] },
      { text: 'PERSIAN GULF', at: [55.0, 26.05], sea: true, on: [29.0, 34.4] },
    ],

    // Big stat callouts, screen-anchored.
    stats: [
      { big: '≈ 1/5', small: 'of the world’s oil, every day', on: [1.6, 5.8] },
      { big: '≈ 33 km', small: 'wide at its narrowest', on: [22.8, 27.8] },
      { big: 'MOST GOES EAST', small: 'China · India · Japan · South Korea', on: [17.4, 20.4], left: true, y: 690 },
    ],

    endCard: {
      on: [36.2, 41],
      line1: 'ONE NARROW STRAIT',
      line2: 'The world’s most important oil chokepoint',
    },
  };

  root.SCENE = SCENE;
})(typeof window !== 'undefined' ? window : globalThis);
