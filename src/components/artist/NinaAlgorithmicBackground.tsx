import { useEffect, useRef, useCallback } from 'react';

/**
 * Algorithmic Art Background for Nina's portfolio.
 * Constellation-style mandalas, rhodonea roses, sacred geometry —
 * tiny glowing star-dots connected by hair-thin lines on a dark sky.
 * Subtle, ethereal, like mapping constellations in the night.
 */

const TAU = Math.PI * 2;
const PHI = (1 + Math.sqrt(5)) / 2;

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Types ───────────────────────────────────────────────────

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
  twinkleSpeed: number;
}

interface ConstellationNode {
  x: number;
  y: number;
  size: number;
  brightness: number;
}

interface ConstellationMandala {
  cx: number;
  cy: number;
  radius: number;
  petals: number;
  layers: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  nodes: ConstellationNode[];
  edges: [number, number][];
}

interface ConstellationRose {
  cx: number;
  cy: number;
  radius: number;
  k: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  nodes: ConstellationNode[];
  edges: [number, number][];
}

interface ConstellationGeometry {
  cx: number;
  cy: number;
  radius: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  nodes: ConstellationNode[];
  edges: [number, number][];
}

interface ConstellationShape {
  cx: number;
  cy: number;
  size: number;
  sides: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  nodes: ConstellationNode[];
  edges: [number, number][];
}

// ─── Drawing primitives ──────────────────────────────────────

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number,
  time: number,
  phase: number,
) {
  const a = Math.max(0, Math.min(1, alpha));

  // Soft glow halo
  ctx.globalAlpha = a * 0.15;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size * 3, 0, TAU);
  ctx.fill();

  // Core dot
  ctx.globalAlpha = a;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, TAU);
  ctx.fill();

  // Tiny cross sparkle on brighter stars
  if (a > 0.15) {
    const sparkle = 0.4 + Math.sin(time * 2 + phase) * 0.3;
    ctx.globalAlpha = a * sparkle * 0.5;
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.3;
    const len = size * 2.5;
    ctx.beginPath();
    ctx.moveTo(x - len, y);
    ctx.lineTo(x + len, y);
    ctx.moveTo(x, y - len);
    ctx.lineTo(x, y + len);
    ctx.stroke();
  }
}

function drawConstellationLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  alpha: number,
) {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// ─── Mandala constellation builder ──────────────────────────

function buildMandalaConstellation(
  petals: number,
  layers: number,
  radius: number,
  rng: () => number,
): { nodes: ConstellationNode[]; edges: [number, number][] } {
  const nodes: ConstellationNode[] = [];
  const edges: [number, number][] = [];

  // Center node
  nodes.push({ x: 0, y: 0, size: 1.2, brightness: 0.35 });

  // Build concentric rings of nodes
  for (let layer = 1; layer <= layers; layer++) {
    const layerR = (radius / layers) * layer;
    const nodesInRing = petals * (layer <= 2 ? 1 : 2);
    const ringStartIdx = nodes.length;

    for (let i = 0; i < nodesInRing; i++) {
      const angle = (TAU / nodesInRing) * i + (layer % 2 === 0 ? TAU / nodesInRing / 2 : 0);
      const jitter = (rng() - 0.5) * radius * 0.02;
      nodes.push({
        x: Math.cos(angle) * (layerR + jitter),
        y: Math.sin(angle) * (layerR + jitter),
        size: 0.6 + rng() * 0.8,
        brightness: 0.12 + rng() * 0.2,
      });

      const idx = nodes.length - 1;

      // Connect to center from first ring
      if (layer === 1) {
        edges.push([0, idx]);
      }

      // Connect neighbors in same ring
      if (i > 0) {
        edges.push([idx - 1, idx]);
      }
    }
    // Close ring
    if (nodesInRing > 2) {
      edges.push([ringStartIdx, nodes.length - 1]);
    }

    // Connect to previous ring — radial lines
    if (layer > 1) {
      const prevRingStart = ringStartIdx - (petals * (layer <= 2 ? 1 : (layer - 1) <= 2 ? 1 : 2));
      const prevRingCount = petals * ((layer - 1) <= 2 ? 1 : 2);
      for (let i = 0; i < nodesInRing; i++) {
        const nearestPrev = prevRingStart + (Math.round((i / nodesInRing) * prevRingCount) % prevRingCount);
        edges.push([ringStartIdx + i, nearestPrev]);
      }
    }
  }

  // Add petal tip extensions
  const outerRingStart = nodes.length - petals * (layers <= 2 ? 1 : 2);
  const outerRingCount = petals * (layers <= 2 ? 1 : 2);
  for (let p = 0; p < petals; p++) {
    const angle = (TAU / petals) * p;
    const tipR = radius * (1.08 + rng() * 0.1);
    nodes.push({
      x: Math.cos(angle) * tipR,
      y: Math.sin(angle) * tipR,
      size: 0.5 + rng() * 0.5,
      brightness: 0.08 + rng() * 0.12,
    });
    // Connect tip to nearest outer ring node
    const nearest = outerRingStart + (Math.round((p / petals) * outerRingCount) % outerRingCount);
    edges.push([nodes.length - 1, nearest]);
  }

  return { nodes, edges };
}

// ─── Rose constellation builder ─────────────────────────────

function buildRoseConstellation(
  k: number,
  radius: number,
  rng: () => number,
): { nodes: ConstellationNode[]; edges: [number, number][] } {
  const nodes: ConstellationNode[] = [];
  const edges: [number, number][] = [];
  const loops = k % 1 === 0 ? (k % 2 === 0 ? 2 : 1) : Math.ceil(k) * 2;
  const totalNodes = 50;

  for (let i = 0; i < totalNodes; i++) {
    const theta = (TAU * loops * i) / totalNodes;
    const r = radius * Math.cos(k * theta);
    nodes.push({
      x: r * Math.cos(theta) + (rng() - 0.5) * 1.5,
      y: r * Math.sin(theta) + (rng() - 0.5) * 1.5,
      size: 0.5 + rng() * 0.8,
      brightness: 0.08 + Math.abs(Math.cos(k * theta)) * 0.18,
    });
    if (i > 0) {
      edges.push([i - 1, i]);
    }
  }
  // Close the curve
  edges.push([totalNodes - 1, 0]);

  // Add a few inner structure nodes
  for (let i = 0; i < 6; i++) {
    const angle = (TAU / 6) * i;
    const r = radius * 0.2;
    nodes.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      size: 0.4 + rng() * 0.4,
      brightness: 0.06 + rng() * 0.08,
    });
    if (i > 0) edges.push([totalNodes + i - 1, totalNodes + i]);
  }
  edges.push([totalNodes, totalNodes + 5]);

  return { nodes, edges };
}

// ─── Sacred geometry constellation builder ──────────────────

function buildSacredGeometryConstellation(
  radius: number,
  rng: () => number,
): { nodes: ConstellationNode[]; edges: [number, number][] } {
  const nodes: ConstellationNode[] = [];
  const edges: [number, number][] = [];
  const circleR = radius / 3;

  // 7 circle centers (flower of life)
  const centers: [number, number][] = [[0, 0]];
  for (let i = 0; i < 6; i++) {
    const angle = (TAU / 6) * i;
    centers.push([Math.cos(angle) * circleR, Math.sin(angle) * circleR]);
  }

  // Place nodes around each circle
  const nodesPerCircle = 12;
  for (let c = 0; c < centers.length; c++) {
    const [ccx, ccy] = centers[c];
    const startIdx = nodes.length;

    for (let i = 0; i < nodesPerCircle; i++) {
      const angle = (TAU / nodesPerCircle) * i;
      nodes.push({
        x: ccx + Math.cos(angle) * circleR + (rng() - 0.5) * 1,
        y: ccy + Math.sin(angle) * circleR + (rng() - 0.5) * 1,
        size: 0.4 + rng() * 0.5,
        brightness: 0.08 + rng() * 0.1,
      });
      if (i > 0) edges.push([startIdx + i - 1, startIdx + i]);
    }
    edges.push([startIdx, startIdx + nodesPerCircle - 1]);
  }

  // Connect circle centers (Metatron's cube lines)
  const centerNodeStart = nodes.length;
  for (const [cx, cy] of centers) {
    nodes.push({ x: cx, y: cy, size: 0.8, brightness: 0.15 });
  }
  for (let i = 0; i < centers.length; i++) {
    for (let j = i + 1; j < centers.length; j++) {
      edges.push([centerNodeStart + i, centerNodeStart + j]);
    }
  }

  return { nodes, edges };
}

// ─── Geometric shape constellation builder ──────────────────

function buildShapeConstellation(
  sides: number,
  size: number,
  rng: () => number,
): { nodes: ConstellationNode[]; edges: [number, number][] } {
  const nodes: ConstellationNode[] = [];
  const edges: [number, number][] = [];

  for (let ring = 0; ring < 3; ring++) {
    const ringSize = size * (0.4 + ring * 0.3);
    const startIdx = nodes.length;

    for (let s = 0; s < sides; s++) {
      const angle = (TAU / sides) * s - Math.PI / 2;
      nodes.push({
        x: Math.cos(angle) * ringSize,
        y: Math.sin(angle) * ringSize,
        size: 0.5 + rng() * 0.6,
        brightness: 0.1 + rng() * 0.12,
      });
      if (s > 0) edges.push([startIdx + s - 1, startIdx + s]);
    }
    edges.push([startIdx, startIdx + sides - 1]);

    // Connect rings
    if (ring > 0) {
      const prevStart = startIdx - sides;
      for (let s = 0; s < sides; s++) {
        edges.push([prevStart + s, startIdx + s]);
      }
    }
  }

  // Center
  nodes.push({ x: 0, y: 0, size: 0.7, brightness: 0.15 });
  const centerIdx = nodes.length - 1;
  for (let s = 0; s < sides; s++) {
    edges.push([centerIdx, s]);
  }

  return { nodes, edges };
}

// ─── Animated drawing with constellation feel ────────────────

function drawConstellation(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rotation: number,
  rotationSpeed: number,
  color: string,
  nodes: ConstellationNode[],
  edges: [number, number][],
  time: number,
  fadeOffset: number,
) {
  const rot = rotation + time * rotationSpeed;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  // Draw edges — very thin constellation lines
  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    const na = nodes[a];
    const nb = nodes[b];
    const lineAlpha =
      0.04 +
      Math.sin(time * 0.3 + i * 0.15 + fadeOffset) * 0.02;
    drawConstellationLine(ctx, na.x, na.y, nb.x, nb.y, color, lineAlpha);
  }

  // Draw nodes — glowing star dots
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const twinkle = 0.7 + Math.sin(time * 0.8 + i * 1.3 + fadeOffset) * 0.3;
    drawStar(
      ctx,
      n.x,
      n.y,
      n.size,
      color,
      n.brightness * twinkle,
      time,
      i * 0.7 + fadeOffset,
    );
  }

  ctx.restore();
}

// ─── Phyllotaxis as constellation ────────────────────────────

function drawPhyllotaxisConstellation(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string,
  time: number,
  phase: number,
) {
  const n = 80;
  const goldenAngle = TAU / (PHI * PHI);
  const spin = time * 0.03 + phase;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(spin);

  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const angle = i * goldenAngle;
    const r = Math.sqrt(i / n) * radius;
    pts.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }

  // Connect to nearest neighbors (subtle web)
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < Math.min(i + 4, pts.length); j++) {
      const dist = Math.hypot(pts[j].x - pts[i].x, pts[j].y - pts[i].y);
      if (dist < radius * 0.3) {
        const lineAlpha = 0.025 + Math.sin(time * 0.4 + i * 0.2) * 0.015;
        drawConstellationLine(ctx, pts[i].x, pts[i].y, pts[j].x, pts[j].y, color, lineAlpha);
      }
    }
  }

  for (let i = 0; i < n; i++) {
    const size = 0.4 + (i / n) * 0.8;
    const alpha = 0.06 + (1 - i / n) * 0.1 + Math.sin(time * 0.6 + i * 0.3) * 0.03;
    drawStar(ctx, pts[i].x, pts[i].y, size, color, alpha, time, i + phase);
  }

  ctx.restore();
}

// ─── Ambient star field ──────────────────────────────────────

function createStarField(
  w: number,
  h: number,
  colors: string[],
  rng: () => number,
  density: number = 0.4,
): Star[] {
  // density 0 = no stars, 0.4 = subtle, 1 = very dense
  const baseDivisor = 12000 - density * 8000; // 12000 (sparse) → 4000 (dense)
  const count = Math.floor((w * h) / Math.max(baseDivisor, 2000));
  const stars: Star[] = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: rng() * w,
      y: rng() * h,
      size: 0.3 + rng() * 0.8,
      alpha: 0.02 + rng() * 0.06,
      phase: rng() * TAU,
      twinkleSpeed: 0.3 + rng() * 0.8,
    });
  }

  return stars;
}

function drawStarField(
  ctx: CanvasRenderingContext2D,
  stars: Star[],
  colors: string[],
  time: number,
) {
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const twinkle = 0.5 + Math.sin(time * s.twinkleSpeed + s.phase) * 0.5;
    const color = colors[i % colors.length];

    ctx.globalAlpha = s.alpha * twinkle;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, TAU);
    ctx.fill();

    // Soft halo on some
    if (s.alpha > 0.04) {
      ctx.globalAlpha = s.alpha * twinkle * 0.1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * 3, 0, TAU);
      ctx.fill();
    }
  }
}

// ─── Config type (mirrors the Zod schema from content.config.ts) ─

interface ConstellationConfig {
  enabled: boolean;
  colors: string[];
  starDensity: number;
  rotationSpeed: number;
  mandalas: { petals: number; layers: number; scale: number; position: [number, number] }[];
  roses: { k: number; scale: number; position: [number, number] }[];
  sacredGeometry: boolean;
  geometricShapes: boolean;
  phyllotaxis: boolean;
}

// ─── Component ───────────────────────────────────────────────

interface Props {
  accentColor?: string;
  constellation: ConstellationConfig;
}

export default function NinaAlgorithmicBackground({
  accentColor = '#9B7EC8',
  constellation,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const stateRef = useRef<{
    stars: Star[];
    colors: string[];
    mandalas: ConstellationMandala[];
    roses: ConstellationRose[];
    geometries: ConstellationGeometry[];
    shapes: ConstellationShape[];
    phyllotaxes: { cx: number; cy: number; radius: number; color: string; phase: number }[];
  } | null>(null);

  const setup = useCallback(
    (w: number, h: number) => {
      const rng = mulberry32(42);
      const cfg = constellation;
      const colors = [...cfg.colors, '#ffffff'];
      const baseSpeed = cfg.rotationSpeed;
      const dim = Math.min(w, h);

      // Helper to pick a color cycling through the palette
      const pickColor = (index: number) => cfg.colors[index % cfg.colors.length];

      // ── Mandalas from config ──────────────────────────────
      const mandalas: ConstellationMandala[] = cfg.mandalas.map((m, i) => {
        const data = buildMandalaConstellation(m.petals, m.layers, dim * m.scale, rng);
        return {
          cx: w * m.position[0],
          cy: h * m.position[1],
          radius: dim * m.scale,
          petals: m.petals,
          layers: m.layers,
          rotation: (i * Math.PI) / (cfg.mandalas.length + 1),
          rotationSpeed: baseSpeed * (i % 2 === 0 ? 1 : -0.75),
          color: pickColor(i),
          ...data,
        };
      });

      // ── Roses from config ─────────────────────────────────
      const roses: ConstellationRose[] = cfg.roses.map((r, i) => {
        const data = buildRoseConstellation(r.k, dim * r.scale, rng);
        return {
          cx: w * r.position[0],
          cy: h * r.position[1],
          radius: dim * r.scale,
          k: r.k,
          color: pickColor(i + cfg.mandalas.length),
          rotation: (i * Math.PI) / (cfg.roses.length + 2),
          rotationSpeed: baseSpeed * (i % 2 === 0 ? -1.2 : 1),
          ...data,
        };
      });

      // ── Sacred geometry (toggle) ──────────────────────────
      const geometries: ConstellationGeometry[] = [];
      if (cfg.sacredGeometry) {
        const g1data = buildSacredGeometryConstellation(dim * 0.14, rng);
        const g2data = buildSacredGeometryConstellation(dim * 0.09, rng);
        geometries.push(
          { cx: w * 0.75, cy: h * 0.4, radius: dim * 0.14, color: pickColor(0), rotation: 0, rotationSpeed: baseSpeed * 0.6, ...g1data },
          { cx: w * 0.28, cy: h * 0.3, radius: dim * 0.09, color: pickColor(1), rotation: Math.PI / 4, rotationSpeed: -baseSpeed * 0.7, ...g2data },
        );
      }

      // ── Geometric shapes (toggle) ─────────────────────────
      const shapes: ConstellationShape[] = [];
      if (cfg.geometricShapes) {
        const s1data = buildShapeConstellation(6, dim * 0.1, rng);
        const s2data = buildShapeConstellation(8, dim * 0.07, rng);
        const s3data = buildShapeConstellation(5, dim * 0.06, rng);
        shapes.push(
          { cx: w * 0.42, cy: h * 0.52, size: dim * 0.1, sides: 6, color: pickColor(0), rotation: 0, rotationSpeed: baseSpeed * 0.9, ...s1data },
          { cx: w * 0.92, cy: h * 0.88, size: dim * 0.07, sides: 8, color: pickColor(1), rotation: Math.PI / 8, rotationSpeed: -baseSpeed * 1.1, ...s2data },
          { cx: w * 0.06, cy: h * 0.35, size: dim * 0.06, sides: 5, color: pickColor(2), rotation: 0, rotationSpeed: baseSpeed * 1.2, ...s3data },
        );
      }

      // ── Phyllotaxis (toggle) ──────────────────────────────
      const phyllotaxes: { cx: number; cy: number; radius: number; color: string; phase: number }[] = [];
      if (cfg.phyllotaxis) {
        phyllotaxes.push(
          { cx: w * 0.55, cy: h * 0.68, radius: dim * 0.12, color: pickColor(0), phase: 0 },
          { cx: w * 0.9, cy: h * 0.55, radius: dim * 0.07, color: pickColor(2), phase: 2 },
        );
      }

      // ── Star field ────────────────────────────────────────
      const stars = createStarField(w, h, colors, rng, cfg.starDensity);

      stateRef.current = { stars, colors, mandalas, roses, geometries, shapes, phyllotaxes };
    },
    [accentColor, constellation],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      setup(w, h);
    }

    resize();

    let lastTime = 0;

    function animate(timestamp: number) {
      if (!ctx || !canvas || !stateRef.current) return;

      // Throttle to ~30fps
      if (timestamp - lastTime < 33) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;

      const time = timestamp * 0.001;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const state = stateRef.current;

      ctx.clearRect(0, 0, w, h);

      // 1. Star field background
      drawStarField(ctx, state.stars, state.colors, time);

      // 2. Mandala constellations
      for (let i = 0; i < state.mandalas.length; i++) {
        const m = state.mandalas[i];
        drawConstellation(ctx, m.cx, m.cy, m.rotation, m.rotationSpeed, m.color, m.nodes, m.edges, time, i * 2);
      }

      // 3. Rose constellations
      for (let i = 0; i < state.roses.length; i++) {
        const r = state.roses[i];
        drawConstellation(ctx, r.cx, r.cy, r.rotation, r.rotationSpeed, r.color, r.nodes, r.edges, time, i * 3 + 10);
      }

      // 4. Sacred geometry
      for (let i = 0; i < state.geometries.length; i++) {
        const g = state.geometries[i];
        drawConstellation(ctx, g.cx, g.cy, g.rotation, g.rotationSpeed, g.color, g.nodes, g.edges, time, i * 4 + 20);
      }

      // 5. Geometric shapes
      for (let i = 0; i < state.shapes.length; i++) {
        const s = state.shapes[i];
        drawConstellation(ctx, s.cx, s.cy, s.rotation, s.rotationSpeed, s.color, s.nodes, s.edges, time, i * 2.5 + 30);
      }

      // 6. Phyllotaxis spirals
      for (const p of state.phyllotaxes) {
        drawPhyllotaxisConstellation(ctx, p.cx, p.cy, p.radius, p.color, time, p.phase);
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [setup]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 5,
      }}
      aria-hidden="true"
    />
  );
}
