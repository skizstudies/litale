/**
 * Line-art for the coloring canvas. Everything is drawn in a 400×300 box — the
 * same 4:3 shape as the canvas — so the SVG and the brush layer line up.
 *
 *  - regions: tappable areas a child can fill, listed back-to-front
 *  - decor:   extra lines drawn on top (rays, stems, veins) that never fill
 */

export const ART_VIEWBOX = '0 0 400 300';

const r1 = (n) => Math.round(n * 10) / 10;

// A point `along` and `across` a direction, starting at (x, y).
const project = (x, y, angleDeg) => {
  const a = (angleDeg * Math.PI) / 180;
  return (along, across = 0) =>
    `${r1(x + along * Math.cos(a) - across * Math.sin(a))} ${r1(y + along * Math.sin(a) + across * Math.cos(a))}`;
};

const leafPath = ([x, y, length, angle]) => {
  const p = project(x, y, angle);
  const w = length * 0.42;
  return `M${p(0)} C${p(length * 0.25, -w)} ${p(length * 0.75, -w)} ${p(length)} C${p(length * 0.75, w)} ${p(length * 0.25, w)} ${p(0)} Z`;
};

const leafVein = ([x, y, length, angle]) => {
  const p = project(x, y, angle);
  return { shape: 'path', props: { d: `M${p(length * 0.1)} L${p(length * 0.85)}` } };
};

const mangoPath = (x, y) =>
  `M${x} ${y} C${x + 26} ${y} ${x + 34} ${y + 30} ${x + 26} ${y + 52} C${x + 18} ${y + 72} ${x - 14} ${y + 72} ${x - 20} ${y + 48} C${x - 26} ${y + 26} ${x - 18} ${y} ${x} ${y} Z`;

const rays = (cx, cy, inner, outer, angles) =>
  angles.map((angle) => {
    const p = project(cx, cy, angle);
    return { shape: 'path', props: { d: `M${p(inner)} L${p(outer)}` } };
  });

const sky = { id: 'sky', label: 'sky', shape: 'rect', props: { x: 0, y: 0, width: 400, height: 300 } };

/* ── Scene 1 · waving at the sun from the mango tree ─────────────── */
const sunScene = {
  regions: [
    sky,
    { id: 'cloud', label: 'cloud', shape: 'path', props: { d: 'M30 70 C30 55 50 50 58 60 C64 46 88 48 90 64 C104 64 106 82 92 84 H38 C26 84 24 72 30 70 Z' } },
    { id: 'sun', label: 'sun', shape: 'circle', props: { cx: 325, cy: 70, r: 30 } },
    { id: 'ground', label: 'grass', shape: 'path', props: { d: 'M0 235 C80 220 160 240 240 228 C310 218 360 232 400 226 V300 H0 Z' } },
    { id: 'trunk', label: 'tree trunk', shape: 'path', props: { d: 'M150 268 C156 230 158 190 154 160 H186 C182 190 184 230 192 268 Z' } },
    { id: 'crown', label: 'tree leaves', shape: 'path', props: { d: 'M95 170 C60 168 52 120 88 108 C86 70 130 52 160 70 C180 42 232 46 240 82 C276 84 290 126 262 148 C268 176 230 186 210 172 C190 188 150 188 135 172 C120 182 100 180 95 170 Z' } },
    { id: 'mango-1', label: 'left mango', shape: 'ellipse', props: { cx: 128, cy: 140, rx: 11, ry: 14 } },
    { id: 'mango-2', label: 'top mango', shape: 'ellipse', props: { cx: 185, cy: 100, rx: 11, ry: 14 } },
    { id: 'mango-3', label: 'right mango', shape: 'ellipse', props: { cx: 228, cy: 132, rx: 11, ry: 14 } },
  ],
  decor: rays(325, 70, 40, 54, [0, 45, 90, 135, 180, 225, 270, 315]),
};

/* ── Scene 2 · hunting for mangoes among the leaves ──────────────── */
const LEAVES = [
  [42, 84, 85, 100],
  [105, 84, 85, 75],
  [235, 88, 90, 68],
  [355, 84, 80, 62],
  [85, 56, 70, -60],
  [281, 61, 70, -118],
];

const leavesScene = {
  regions: [
    sky,
    { id: 'grass', label: 'grass', shape: 'path', props: { d: 'M0 262 C100 250 300 272 400 256 V300 H0 Z' } },
    ...LEAVES.map((leaf, i) => ({ id: `leaf-${i + 1}`, label: `leaf ${i + 1}`, shape: 'path', props: { d: leafPath(leaf) } })),
    { id: 'branch', label: 'branch', shape: 'path', props: { d: 'M0 58 C110 46 230 78 400 50 V76 C230 104 110 74 0 84 Z' } },
    { id: 'mango-1', label: 'left mango', shape: 'path', props: { d: mangoPath(175, 100) } },
    { id: 'mango-2', label: 'right mango', shape: 'path', props: { d: mangoPath(300, 112) } },
  ],
  decor: [
    ...LEAVES.map(leafVein),
    { shape: 'path', props: { d: 'M175 86 V100' } },
    { shape: 'path', props: { d: 'M300 87 V112' } },
  ],
};

/* ── Scene 3 · sharing mangoes in the shade ──────────────────────── */
const shareScene = {
  regions: [
    sky,
    { id: 'ground', label: 'grass', shape: 'path', props: { d: 'M0 215 C120 205 280 222 400 210 V300 H0 Z' } },
    { id: 'trunk', label: 'tree trunk', shape: 'path', props: { d: 'M28 230 C34 180 36 120 30 70 H70 C64 120 66 180 76 230 Z' } },
    { id: 'shade', label: 'shady leaves', shape: 'path', props: { d: 'M0 0 H400 V48 C380 80 330 78 310 66 C290 92 240 90 222 72 C200 98 150 96 134 76 C112 100 64 104 40 86 C26 100 8 98 0 92 Z' } },
    { id: 'mat', label: 'picnic mat', shape: 'path', props: { d: 'M110 238 H330 L362 288 H78 Z' } },
    { id: 'mango-1', label: 'left mango', shape: 'ellipse', props: { cx: 214, cy: 184, rx: 22, ry: 15 } },
    { id: 'mango-2', label: 'middle mango', shape: 'ellipse', props: { cx: 248, cy: 176, rx: 22, ry: 15 } },
    { id: 'mango-3', label: 'right mango', shape: 'ellipse', props: { cx: 282, cy: 184, rx: 22, ry: 15 } },
    { id: 'basket', label: 'basket', shape: 'path', props: { d: 'M186 196 H306 L290 262 H202 Z' } },
    { id: 'rim', label: 'basket rim', shape: 'rect', props: { x: 178, y: 188, width: 136, height: 16, rx: 8 } },
  ],
  decor: [
    { shape: 'path', props: { d: 'M196 190 C200 130 292 130 296 190' } },
    { shape: 'path', props: { d: 'M194 222 H298' } },
    { shape: 'path', props: { d: 'M199 244 H293' } },
    { shape: 'path', props: { d: 'M150 238 L134 288' } },
    { shape: 'path', props: { d: 'M290 238 L306 288' } },
  ],
};

/* ── Scene 4 · home in time for breakfast ────────────────────────── */
const laughScene = {
  regions: [
    sky,
    { id: 'sun', label: 'rising sun', shape: 'path', props: { d: 'M290 218 A40 40 0 0 1 370 218 Z' } },
    { id: 'ground', label: 'grass', shape: 'path', props: { d: 'M0 210 C60 204 110 218 160 218 H400 V300 H0 Z' } },
    { id: 'path', label: 'garden path', shape: 'path', props: { d: 'M150 240 H186 L204 300 H132 Z' } },
    { id: 'bush', label: 'bush', shape: 'path', props: { d: 'M22 244 C12 224 32 208 50 218 C58 202 84 206 84 224 C100 226 100 244 84 246 H30 Z' } },
    { id: 'wall', label: 'house wall', shape: 'rect', props: { x: 90, y: 140, width: 150, height: 100 } },
    { id: 'roof', label: 'roof', shape: 'path', props: { d: 'M74 144 L165 76 L256 144 Z' } },
    { id: 'door', label: 'door', shape: 'rect', props: { x: 150, y: 185, width: 36, height: 55, rx: 4 } },
    { id: 'window-1', label: 'left window', shape: 'rect', props: { x: 104, y: 162, width: 34, height: 30, rx: 3 } },
    { id: 'window-2', label: 'right window', shape: 'rect', props: { x: 198, y: 162, width: 30, height: 30, rx: 3 } },
  ],
  decor: [
    ...rays(330, 218, 50, 64, [195, 232, 270, 308, 345]),
    { shape: 'path', props: { d: 'M121 162 V192 M104 177 H138' } },
    { shape: 'path', props: { d: 'M213 162 V192 M198 177 H228' } },
    { shape: 'circle', props: { cx: 178, cy: 214, r: 2.5, fill: '#1B2E20' } },
  ],
};

/* ── Papa's First Boat · building on the beach ───────────────────── */
const waves = (...starts) =>
  starts.map(([x, y]) => ({ shape: 'path', props: { d: `M${x} ${y} q12 -9 24 0 q12 9 24 0` } }));

const buildScene = {
  regions: [
    sky,
    { id: 'sun', label: 'sun', shape: 'circle', props: { cx: 70, cy: 62, r: 26 } },
    { id: 'sea', label: 'sea', shape: 'path', props: { d: 'M0 140 H400 V200 H0 Z' } },
    { id: 'sand', label: 'sand', shape: 'path', props: { d: 'M0 190 C120 175 280 200 400 185 V300 H0 Z' } },
    { id: 'hull', label: 'boat', shape: 'path', props: { d: 'M110 222 H290 L265 262 H135 Z' } },
    { id: 'plank-1', label: 'left plank', shape: 'rect', props: { x: 22, y: 254, width: 78, height: 12, rx: 3 } },
    { id: 'plank-2', label: 'right plank', shape: 'rect', props: { x: 302, y: 248, width: 78, height: 12, rx: 3 } },
  ],
  decor: [
    ...rays(70, 62, 36, 48, [0, 60, 120, 180, 240, 300]),
    ...waves([150, 165], [260, 158], [40, 172]),
    { shape: 'path', props: { d: 'M120 236 H280 M128 250 H272' } },
  ],
};

/* ── Papa's First Boat · sailing out on a calm sea ───────────────── */
const sailScene = {
  regions: [
    sky,
    { id: 'sun', label: 'sun', shape: 'circle', props: { cx: 330, cy: 62, r: 26 } },
    { id: 'sea', label: 'sea', shape: 'path', props: { d: 'M0 180 C100 170 300 190 400 178 V300 H0 Z' } },
    { id: 'mast', label: 'mast', shape: 'rect', props: { x: 200, y: 80, width: 6, height: 122 } },
    { id: 'flag', label: 'flag', shape: 'path', props: { d: 'M206 80 L230 88 L206 96 Z' } },
    { id: 'sail', label: 'sail', shape: 'path', props: { d: 'M212 104 L212 192 L282 192 Z' } },
    { id: 'hull', label: 'boat', shape: 'path', props: { d: 'M120 200 H290 L262 240 H148 Z' } },
  ],
  decor: [
    ...rays(330, 62, 36, 48, [0, 60, 120, 180, 240, 300]),
    ...waves([30, 232], [250, 262], [70, 272], [320, 222]),
  ],
};

/* ── Papa's First Boat · fish jumping beside the boat ────────────── */
const fishScene = {
  regions: [
    sky,
    { id: 'sea', label: 'sea', shape: 'path', props: { d: 'M0 120 C100 110 300 130 400 118 V300 H0 Z' } },
    { id: 'hull', label: 'boat', shape: 'path', props: { d: 'M130 98 H280 L256 134 H154 Z' } },
    { id: 'fish-1', label: 'big fish', shape: 'ellipse', props: { cx: 110, cy: 205, rx: 34, ry: 18 } },
    { id: 'fish-1-tail', label: 'big fish tail', shape: 'path', props: { d: 'M77 205 L54 190 L54 220 Z' } },
    { id: 'fish-2', label: 'small fish', shape: 'ellipse', props: { cx: 300, cy: 225, rx: 28, ry: 15 } },
    { id: 'fish-2-tail', label: 'small fish tail', shape: 'path', props: { d: 'M327 225 L348 212 L348 238 Z' } },
    { id: 'fish-3', label: 'jumping fish', shape: 'ellipse', props: { cx: 336, cy: 84, rx: 22, ry: 12, transform: 'rotate(-35 336 84)' } },
    { id: 'fish-3-tail', label: 'jumping fish tail', shape: 'path', props: { d: 'M357 84 L374 73 L374 95 Z', transform: 'rotate(-35 336 84)' } },
  ],
  decor: [
    { shape: 'circle', props: { cx: 130, cy: 200, r: 3, fill: '#1B2E20' } },
    { shape: 'circle', props: { cx: 284, cy: 221, r: 2.5, fill: '#1B2E20' } },
    { shape: 'circle', props: { cx: 160, cy: 176, r: 5 } },
    { shape: 'circle', props: { cx: 172, cy: 156, r: 4 } },
    { shape: 'path', props: { d: 'M318 124 q8 -16 16 0 M340 126 q8 -14 16 0' } },
    ...waves([30, 140], [200, 270], [40, 270]),
  ],
};

/* ── Papa's First Boat · home at sunset ──────────────────────────── */
const harborScene = {
  regions: [
    sky,
    { id: 'sun', label: 'setting sun', shape: 'path', props: { d: 'M150 170 A50 50 0 0 1 250 170 Z' } },
    { id: 'sea', label: 'sea', shape: 'rect', props: { x: 0, y: 170, width: 400, height: 130 } },
    { id: 'post-1', label: 'dock post', shape: 'rect', props: { x: 300, y: 204, width: 10, height: 62 } },
    { id: 'post-2', label: 'far dock post', shape: 'rect', props: { x: 372, y: 204, width: 10, height: 62 } },
    { id: 'dock', label: 'dock', shape: 'rect', props: { x: 284, y: 190, width: 116, height: 14 } },
    { id: 'mast', label: 'mast', shape: 'rect', props: { x: 160, y: 120, width: 6, height: 95 } },
    { id: 'sail', label: 'sail', shape: 'path', props: { d: 'M172 128 L172 205 L226 205 Z' } },
    { id: 'net', label: 'fishing net', shape: 'path', props: { d: 'M98 215 C102 194 136 194 140 215 Z' } },
    { id: 'hull', label: 'boat', shape: 'path', props: { d: 'M88 215 H242 L220 250 H110 Z' } },
  ],
  decor: [
    ...rays(200, 170, 60, 74, [200, 235, 270, 305, 340]),
    { shape: 'path', props: { d: 'M106 206 H132 M112 198 L118 214 M126 198 L120 214' } },
    ...waves([20, 272], [300, 282], [150, 286]),
  ],
};

const ART_BY_ID = {
  sun: sunScene,
  leaves: leavesScene,
  share: shareScene,
  laugh: laughScene,
  build: buildScene,
  sail: sailScene,
  fish: fishScene,
  harbor: harborScene,
};
const ART_LIST = [sunScene, leavesScene, shareScene, laughScene];

/** Art for a scene; unknown scenes (future custom stories) reuse art by position. */
export const getSceneArt = (sceneId, index) => ART_BY_ID[sceneId] ?? ART_LIST[index % ART_LIST.length];

// Gentle finished-book colours, used in the reader when a scene wasn't colored.
const DEFAULT_FILLS = [
  [/^sky/, '#F4F9F0'],
  [/^sun/, '#FCE89B'],
  [/^mango/, '#FFD93D'],
  [/^(crown|shade|leaf|bush|grass|ground)/, '#A8D98A'],
  [/^(trunk|branch|basket|rim|door|roof|path|plank|hull|mast|dock|post)/, '#D9B48C'],
  [/^(mat|fish)/, '#F7A89A'],
  [/^sea/, '#CFE7EC'],
  [/^(sand|net|flag)/, '#F6E7B8'],
];

export const defaultFillsFor = (art) =>
  Object.fromEntries(
    art.regions.map(({ id }) => [id, DEFAULT_FILLS.find(([pattern]) => pattern.test(id))?.[1] ?? '#FFFFFF']),
  );
