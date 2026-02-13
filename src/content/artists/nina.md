---
id: nina
accentColor: "#9B7EC8"
accentColorLight: "#B49AD4"
accentColorDark: "#7A5FA5"
backgroundImage: /backgrounds/artists.svg
layout: gallery-right

# ─── Constellation Background ────────────────────────────────
# Algorithmic art rendered as constellation-style mandalas,
# roses, and sacred geometry on the portfolio background.
constellation:
  enabled: true

  # Color palette for stars, lines, and figures.
  # First color is primary, rest are alternated across figures.
  colors:
    - "#B49AD4"   # purple light
    - "#C4A8E0"   # lilac
    - "#9B7EC8"   # purple accent

  # Star field density: 0 = none, 0.4 = subtle, 1 = very dense
  starDensity: 0.4

  # Global rotation speed for all figures (radians/sec). Lower = slower.
  rotationSpeed: 0.008

  # Mandalas — each entry creates a constellation mandala.
  # petals: number of radial symmetry arms (3-24)
  # layers: concentric rings of nodes (1-8)
  # scale: size relative to viewport (0.05-0.5)
  # position: [x%, y%] on screen (0-1)
  mandalas:
    - { petals: 12, layers: 4, scale: 0.22, position: [0.50, 0.15] }
    - { petals: 8,  layers: 3, scale: 0.16, position: [0.12, 0.55] }
    - { petals: 10, layers: 3, scale: 0.18, position: [0.85, 0.75] }

  # Rhodonea roses — mathematical rose curves (r = cos(k*theta)).
  # k: petal parameter. Integer = k petals (odd) or 2k petals (even).
  #    Fractions (e.g. 2.333) create complex overlapping patterns.
  # scale: size relative to viewport (0.03-0.4)
  # position: [x%, y%] on screen (0-1)
  roses:
    - { k: 5,     scale: 0.12, position: [0.85, 0.18] }
    - { k: 2.333, scale: 0.14, position: [0.10, 0.82] }
    - { k: 4,     scale: 0.10, position: [0.65, 0.45] }
    - { k: 1.5,   scale: 0.09, position: [0.35, 0.92] }

  # Toggle additional figure types
  sacredGeometry: true    # Flower of Life + Metatron's Cube
  geometricShapes: true   # Hexagons, octagons, pentagons
  phyllotaxis: true       # Fibonacci/golden angle spirals

# ─── Availability ────────────────────────────────────────────
availability:
  timezone: "America/Denver"
  schedule:
    monday: { start: "11:00", end: "19:00" }
    tuesday: { start: "11:00", end: "19:00" }
    wednesday: { start: "11:00", end: "19:00" }
    thursday: null
    friday: { start: "11:00", end: "19:00" }
    saturday: { start: "12:00", end: "17:00" }
    sunday: null
  blockedDates: []
  note: "Consultations via DM on Instagram. Available for freehand designs."
---
