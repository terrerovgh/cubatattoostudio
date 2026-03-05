# Cuba Tattoo Studio Design System
**Version 1.0.0** | **Status:** Publish-Ready

---

## 1. Design Principles

As an Apple-grade, premium design system for a high-end tattoo studio, every decision stems from three core principles:
1. **Immersive Elegance:** The interface should feel like liquid glass over an artist's canvas. Interactions must be fluid, unobtrusive, and deeply premium.
2. **Focus on the Art:** The UI exists to frame the tattoo artistry. Content is king; UI Chrome is minimal and translucent.
3. **Tactile Feedback:** Every interaction must feel responsive and intentional. Use micro-animations, staggered reveals, and haptic-like visual cues.

---

## 2. Foundations

### 2.1 Color System

Our palette relies on a deep, immersive dark mode with premium gold accents. We use semantic tokens to separate intent from execution.

#### Primary Palette
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `color-gold` | `#C8956C` | Primary brand color, primary buttons, active states, key icons. |
| `color-gold-light` | `#DABA8F` | Hover states on gold, lighter text emphasis. |
| `color-gold-dark` | `#9E7048` | Pressed states, subtle active borders, gradients. |
| `color-gold-muted` | `#C8956C33` | Backgrounds for active tabs, subtle highlights, glowing shadows. |

#### Liquid Glass Tokens (Surfaces)
| Token | RGBA | Usage |
| :--- | :--- | :--- |
| `glass-bg` | `rgba(18, 18, 20, 0.55)` | Standard card/panel background. Requires blur(40px). |
| `glass-bg-elevated` | `rgba(28, 28, 32, 0.6)` | Floating menus, dialogs, modals. Requires blur(60px). |
| `glass-border` | `rgba(255, 255, 255, 0.08)` | Default border for glass elements. |
| `glass-border-hover` | `rgba(255, 255, 255, 0.14)` | Hover state for interactive glass cards. |

#### Text Hierarchy
| Token | Description | Contrast Ratio Check |
| :--- | :--- | :--- |
| `text-primary` (`rgba(250, 248, 245, 0.94)`) | Headings, primary body text. | **Pass (14.2:1)** vs `#08080a` |
| `text-secondary` (`rgba(250, 248, 245, 0.52)`) | Subtitles, supporting copy. | **Pass (5.4:1)** vs `#08080a` |
| `text-tertiary` (`rgba(250, 248, 245, 0.3)`) | Disabled text, placeholders, metadata. | Decorative only (fails AA) |

### 2.2 Typography

Typography is built on Apple's standard system stacks (`Inter`, `SF Pro Display` for Sans, `SF Mono` for Mono), utilizing fluid clamping for perfect responsive scaling.

**Font Families:**
* **Sans:** `"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont`
* **Mono:** `"SF Mono", ui-monospace, "Cascadia Code"`

**Responsive Scale (9 Levels):**
1. **Display XL:** `clamp(2rem, 5vw + 1rem, 4rem)` (Hero Titles)
2. **Display LG:** `clamp(1.5rem, 3.5vw + 0.75rem, 3rem)` (Section Headers)
3. **Display MD:** `clamp(1.125rem, 2vw + 0.5rem, 1.75rem)` (Card Titles)
4. **Heading LG:** `1.5rem` (Dialog Titles)
5. **Heading MD:** `1.25rem` (Sub-section Titles)
6. **Heading SM:** `1.125rem` (Small UI Titles)
7. **Body LG:** `clamp(0.9rem, 1.2vw + 0.5rem, 1.25rem)` (Lead Paragraphs)
8. **Body MD:** `1rem` (Standard UI Text)
9. **Body SM / Label:** `0.875rem` (Tooltips, Captions)

### 2.3 Grid & Layout

**12-Column Grid:**
We employ a fluid 12-column CSS Grid layout for complex metric placements.
- **Gutter:** `24px` (Desktop), `16px` (Mobile)
- **Margin:** `clamp(1rem, 5vw, 2rem)` (Dynamic edges)

**Containers:**
- `.container-narrow`: `maxWidth: 640px` (Forms, Articles)
- `.container-standard`: `maxWidth: 1024px` (Standard Layouts)
- `.container-wide`: `maxWidth: 1280px` (Galleries, Dashboards)

### 2.4 Spacing System

Based on an `8px` strict baseline grid (`0.5rem = 8px`).
- `space-1` (4px): Micro-adjustments
- `space-2` (8px): Inside components (Button padding)
- `space-4` (16px): Standard gap (Between cards)
- `space-6` (24px): Medium gap
- `space-8` (32px): Component margins
- `space-12` (48px): Section padding (Mobile)
- `space-24` (96px): Section padding (Desktop)

---

## 3. Component Library (32 Components)

*Built exclusively on top of `@cloudflare/kumo` React components bridged via Astro Islands. Custom classes reside in `global.css`.*

### Atoms
**1. Button**
- **Anatomy:** Container, Icon (Left/Right), Label.
- **States:** Default, Hover (`scale: 1.02`), Active (`scale: 0.98`), Loading.
- **Usage:** `<Button variant="primary">Next</Button>`

**2. IconButton**
- **Anatomy:** Circular or rounded-square container, Phosphor Icon.
- **States:** Standard hover background lightness increase. Used for toolbars and quick actions.

**3. Label**
- **Anatomy:** Text `Body SM`, `color-text-secondary`.
- **Usage:** Associates seamlessly with Inputs via `htmlFor`.

**4. TextInput Premium**
- **Anatomy:** Glass container, Text node, optional trailing clear icon.
- **States:** Focus (`box-shadow: 0 0 0 3px rgba(200, 149, 108, 0.1)`).

**5. TextArea Premium**
- **Anatomy:** Resizable container, identical styling to TextInput. Used for "Tattoo Vision" descriptions.

**6. Checkbox**
- **Anatomy:** 20x20px box, SVG Checkmark.
- **States:** Checked (solid `color-gold`), Unchecked (glass border).

**7. RadioButton**
- **Anatomy:** Circular indicator, inner gold dot when selected.

**8. Switch / Toggle**
- **Anatomy:** Pill track, circular thumb. Apple-style animation.
- **Usage:** Used in Admin to toggle Flash Drop status.

**9. Avatar**
- **Anatomy:** Circular masked image, optional `ring-2` for active state.
- **Usage:** Artist profiles in lists.

**10. Badge / Tag**
- **Anatomy:** Small pill, `Body SM`, dense padding (`px-2 py-1`).
- **Variants:** Default (Glass), Success (`color-success`), Alert (`color-error`).

**11. Spinner / Loader**
- **Anatomy:** SVG arc, infinite linear rotation. Color adapts to parent text.

**12. Tooltip**
- **Anatomy:** Floating popover (`glass-bg-elevated`), arrow pointer, absolute positioning.
- **Trigger:** Hover/Focus on target. Delays in 300ms.

### Molecules
**13. Select / Dropdown**
- **Anatomy:** Trigger Button, Floating Menu (`glass-bg-elevated`), Option Items.
- **Usage:** Selecting artists or dates. Note: Rely on Kumo UI’s popover engine.

**14. SearchBar**
- **Anatomy:** Input with leading MagnifyingGlass icon, trailing "clear" IconButton.

**15. SegmentedControl (Tabs)**
- **Anatomy:** Container pill, sliding active indicator background (`color-gold-muted`).
- **Usage:** Switching between "Available" and "Sold Out" flash drops.

**16. Breadcrumbs**
- **Anatomy:** Truncated path list, CaretRight separators.
- **Usage:** Dashboard navigation (e.g., `Admin > Flash > New Drop`).

**17. ProgressBar (Booking)**
- **Anatomy:** Track `h-1 bg-white/5`, Fill `bg-gold scale-x`.
- **States:** Transition `transform 500ms ease`.

**18. GlassCard (Static)**
- **Anatomy:** Div with `.liquid-glass`. Standard container for forms.

**19. InteractiveCard (Hover lift)**
- **Anatomy:** GlassCard + `.card-hover-lift`.
- **Behavior:** Translates Y `-4px`, drops deeper box shadow on hover.

**20. ToastNotification**
- **Anatomy:** Floating rectangle edge-anchored. Icon + Title + Body.
- **Usage:** Booking confirmation, payment success. Auto-dismisses in 4s.

**21. ModalDialog**
- **Anatomy:** Full screen overlay (`color-surface-overlay`), Centered `.liquid-glass-elevated` card.
- **Usage:** Danger zones (deleting flash), detailed term acceptances.

**22. Accordion**
- **Anatomy:** Header trigger (Chevron icon), Expandable body content.
- **Usage:** FAQs regarding tattoo healing, booking policies.

**23. SetupWizardStep**
- **Anatomy:** Wrapping container handling `.step-enter` / `.step-exit` animations for booking flow.

### Organisms
**24. FloatingDock (Nav)**
- **Anatomy:** Fixed bottom pill (`backdrop-blur-3xl`), Icons for Home, Portfolio, Booking.
- **Behavior:** Scales slightly on hover, active state glows gold.

**25. HeroHeader (Dynamic SVG/Glass)**
- **Anatomy:** `<header>` tag, `.color-bends-bg`, Floating SVG logo, Typography lockup.
- **Usage:** The first impression of the site.

**26. ArtistProfileCard**
- **Anatomy:** Avatar, Name, Specialty Badges, "Book" primary action. Responsive layout.

**27. GalleryMasonry**
- **Anatomy:** Variable height CSS columns (`columns-2 md:columns-3`). Renders R2 optimized images.
- **Behavior:** Lazy loads, `figure` tags with `figcaption` overlays.

**28. FlashDropCard**
- **Anatomy:** 4:5 Aspect Image, `.prismatic-border` if premium/limited, Title, Price, Buy Button.
- **Action:** Triggers Stripe Checkout flow directly.

**29. ServiceCarousel**
- **Anatomy:** `.scroll-x-fade` container. Horizontal scrolling snap cards.
- **Usage:** Showcasing Piercing vs Tattoos vs Laser removal.

**30. DatePickerGrid**
- **Anatomy:** Month header, Grid of 7 days, interactive date circles.
- **Behavior:** Disables past dates or booked dates dynamically.

**31. AdminStatsWidget**
- **Anatomy:** GlassCard containing Top-line metric (e.g. "$4.5k"), Sparkline graph, percentage change badge.

**32. ConfigurableBentoGrid**
- **Anatomy:** Complex asymmetric grid `grid-cols-4`, varying span layouts per component.
- **Usage:** Used inside individual Artist profile pages to showcase key pieces dynamically.

---

## 4. UI Patterns

### 4.1 "Waterfall" Hydration Pattern
Astro delivers SSG HTML instantly. Interactive components (e.g., Booking Wizard `StepSchedule.tsx`) are wrapped in `client:load` or `client:only="react"` to hydrate progressively.
- **Pattern:** Use skeleton loaders within the Astro template before the React Island hydrates.

### 4.2 Staggered Floating Entrance
When a user scrolls into a section, child elements fade in sequentially.
- **Implementation:** Apply `.stagger-children` to parent. Children automatically receive staggered delays (`60ms`, `120ms`, etc.) utilizing keyframe `floatIn`.

### 4.3 Form Wizards (State Machine)
Booking and Consultation are multi-step.
- **Pattern:** Keep state in a centralized Nano Store or React Context. Animate between steps using `.step-enter` and `.step-exit` classes.

---

## 5. Do's and Don'ts

### Colors & Contrast
* **DO:** Use Gold (`#C8956C`) exclusively for primary actions, active indicators, and critical brand moments.
* **DON'T:** Use Gold for body text or large background areas. It is an accent.
* **DO:** Use Liquid Glass layers for visual hierarchy without losing background context.

### Typography
* **DO:** Use `text-fluid-*` classes to allow clamping natively on smaller screens.
* **DON'T:** Hardcode `px` font sizes unless absolutely necessary for dense tables.

### Motion
* **DO:** Utilize `500ms cubic-bezier(0.23, 1, 0.32, 1)` for interface transitions (it maps to Apple's Spring physics).
* **DON'T:** Animate structural layout properties (width, height, top, left). Only animate `transform` and `opacity`.
* **DO:** Respect `@media (prefers-reduced-motion: reduce)` by ensuring animations fall back to instantly appearing.

### Accessibility
* **DO:** Ensure all inputs have associated `<label>` or `aria-label`.
* **DON'T:** Rely purely on color to indicate errors. Always pair `color-error` with an error message and icon.
* **DO:** Wrap keyboard navigation boundaries inside modal dialogs.

---

## 6. Developer Guide

### Environment
* Next-Gen CSS styling via **Tailwind v4** (no `tailwind.config.js`, all variables inside `@theme` in `global.css`).
* UI Library: `@cloudflare/kumo`.

### Adding a New Component
1. Check `@cloudflare/kumo` docs first. Do not build custom UI if Kumo provides it.
2. If styling overrides are needed, apply Tailwind utility classes.
3. For heavy custom styling (like Glassmorphism), apply the custom utility classes defined in `global.css` (e.g., `className="liquid-glass card-hover-lift"`).

### Design Tokens Access
Tokens are defined in CSS variables (`var(--color-gold)`) and synced with Tailwind v4 `@theme`.
To access tokens in Javascript/React logic:
1. Parse `design-tokens.json` OR
2. Hook into Tailwind Config values if required via custom utilities.

### Asset Pipeline
Background SVGs are optimized and transition using Nano Stores `$currentBackground`. Always pass raw SVGs or optimized R2 URLs to image components.

---
*End of Document. Property of Cuba Tattoo Studio Design System.*
