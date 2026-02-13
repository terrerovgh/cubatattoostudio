---
id: karli
accentColor: "#4A9EBF"
accentColorLight: "#6BB5D1"
accentColorDark: "#357A99"
backgroundImage: /backgrounds/artists.svg
layout: gallery-top

# ─── Splash Cursor Effect ────────────────────────────────────
# WebGL fluid simulation that follows the cursor.
# Creates colorful ink-splash trails on hover/touch.
splashCursor:
  enabled: true
  SIM_RESOLUTION: 128         # Simulation grid resolution
  DYE_RESOLUTION: 1440        # Color resolution (higher = sharper trails)
  DENSITY_DISSIPATION: 3.5    # How fast color fades (higher = faster)
  VELOCITY_DISSIPATION: 2     # How fast motion fades
  PRESSURE: 0.1               # Pressure iteration value
  CURL: 3                     # Vorticity / swirl amount
  SPLAT_RADIUS: 0.2           # Size of each splash
  SPLAT_FORCE: 6000           # Force of each splash
  COLOR_UPDATE_SPEED: 10      # How fast colors cycle

# ─── Availability ────────────────────────────────────────────
availability:
  timezone: "America/Denver"
  schedule:
    monday: { start: "10:00", end: "18:00" }
    tuesday: null
    wednesday: { start: "10:00", end: "18:00" }
    thursday: { start: "10:00", end: "18:00" }
    friday: { start: "10:00", end: "18:00" }
    saturday: { start: "11:00", end: "15:00" }
    sunday: null
  blockedDates: []
  note: "Specialty in Greek mythology and pet portraits. Book 2 weeks in advance."
---
