---
layout: home
title: Cubatattoo Studio Documentation
---

<link rel="stylesheet" href="assets/css/custom.css">
<script src="assets/js/animations.js"></script>

<div class="docs-hero">
  <img src="assets/images/logo.png" alt="Cubatattoo Studio Banner" style="max-width:220px;margin-bottom:1rem;">
  <h1>Cubatattoo Studio Documentation</h1>
  <p>Professional resources, architecture, workflows, and advanced UI/UX guides for Cubatattoo Studio.</p>
  <nav class="docs-nav">
    <a href="#introduction">Overview</a>
    <a href="#architecture">Architecture</a>
    <a href="#components">Components</a>
    <a href="#agents">Agents & Flows</a>
    <a href="#roadmap">Roadmap</a>
    <a href="#annexes">Annexes</a>
    <a href="#protocol">AI Protocol</a>
    <a href="#faq">FAQ</a>
    <a href="#changelog">Changelog</a>
    <a href="#contact">Contact</a>
  </nav>
</div>

# <span id="introduction">Introduction & Overview</span>

## Vision & Brand Identity
- Digital flagship for Cubatattoo Studio: portfolio, client acquisition, brand communication, and artistic authority.
- Success measured by conversion of visitors to clients and reputation as a high-quality tattoo studio.
- "Modern Grit" aesthetic: dramatic photography, minimal design, bold accent color (#B91C1C), and clean typography (Anton/Oswald for headers, Inter/Roboto for body).
- Target audience: "The Discerning Collector" (25-45, art-focused, professional, expects seamless digital experience).

### Brand Philosophy
Cubatattoo Studio is committed to merging artistic excellence with operational professionalism. The site is designed to inspire, inform, and convert, balancing gallery-like visuals with clear calls to action and trust-building content.

## Strategic Objectives
- Convert visitors into clients with intuitive booking and compelling content.
- Build trust via artist profiles, hygiene standards, and transparent policies.
- Reduce admin overhead by proactively answering FAQs and streamlining communication.

---

# <span id="architecture">Architectural & Technical Fundamentals</span>

## Core Technology Stack
- React + Next.js (SSR/SSG)
- TypeScript
- Tailwind CSS
- Framer Motion, GSAP
- PostgreSQL / MongoDB
- GitHub Actions (CI/CD)

### Why This Stack?
Next.js enables fast, SEO-optimized pages with server-side rendering and static generation. TypeScript ensures code safety and maintainability. Tailwind CSS allows rapid prototyping and consistent design. Framer Motion and GSAP provide advanced animations for a premium user experience.

## Directory Structure
```
cubatattoo-studio/
├── public/assets/images/
├── src/app/(pages)/
│   ├── page.tsx
│   ├── artists/
│   ├── portfolio/
│   ├── studio/
│   └── contact/
├── src/components/react-bits/
├── src/styles/globals.css
├── docker/
│   └── Dockerfile
│   └── docker-compose.yml
├── .github/workflows/
├── package.json
└── tsconfig.json
```

## Principles
- Modular, scalable, secure, and internationalized.
- All third-party code in `/src/components/react-bits/` is managed manually (see Protocol section).
- Strict separation of concerns: UI, business logic, data, and configuration.
- Automated CI/CD for quality and speed.

---

# <span id="components">Component Mapping & Features</span>

## Homepage
- Hero: Letter Glitch or FadeIn (reactbits.dev) for animated headlines.
- Featured Artists: Horizontal showcase with interactive cards.
- Portfolio Preview: Magic Bento or Flying Posters (reactbits.dev) for dynamic grid.
- Studio Philosophy & CTA: Clear mission statement and booking prompt.

## Portfolio
- Masonry grid (reactbits.dev) for flexible image layouts.
- Filtering by artist/style for user-driven exploration.
- Modal/lightbox for images to enhance viewing experience.

## Artists
- Grid: Spotlight Card (reactbits.dev) for engaging artist previews.
- Profile: Carousel (reactbits.dev), bio, gallery, social links, booking CTA for each artist.

## Studio
- High-res photos/video, hygiene protocols, studio story for trust and transparency.
- Model Viewer (reactbits.dev) for 3D/AR if available, showcasing studio space or artwork.

## Contact
- Standard React form (name, email, phone, artist, idea, image upload) for streamlined inquiries.
- Google Maps embed, reservation policy for clarity and convenience.

---

# <span id="agents">Agents & Operational Flows</span>

## AI Agent Protocols
- Use the "Blueprint" as the primary source of truth for all development.
- Follow the "AIOp Protocol" for reactbits.dev components: verify dependencies, copy code, create file, import and use.
- Work in phases: build, present code, wait for approval, then next task.
- All code must be clean, commented, and follow TypeScript/Tailwind best practices.
- Communicate plan before execution for transparency and review.

### Example Prompt
> @CubatattooBuilder Usando el Blueprint, por favor, construye la página de Portafolio (/src/app/(pages)/portfolio/page.tsx).

### Agent Roles
- **@CubatattooBuilder:** Full-stack developer agent for React, Next.js, TypeScript.
- **Context Manager:** Ensures all documentation is loaded and accessible.
- **QA Agent:** Reviews code, verifies standards, manages approval cycles.

---

# <span id="roadmap">Roadmap & Temporal Planning</span>

## Milestones
1. Project Initialization: Requirements, documentation, repo setup, CI/CD.
2. Core Architecture Setup: Directory structure, dependencies, base components.
3. Homepage & Branding: Hero, featured artists, portfolio preview, brand visuals.
4. Portfolio & Artists: Dynamic grid, filtering, artist profiles, galleries.
5. Studio & Contact: Studio tour, hygiene, contact form, reservation policy.

### Timeline
- Each milestone includes review and approval phases for quality assurance.
- Roadmap is updated as features and requirements evolve.

---

# <span id="annexes">Annexes & References</span>
- Architectural diagrams, API docs, security policies, UI/UX guidelines.
- [reactbits.dev](https://reactbits.dev) – UI components source.
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

---

# <span id="protocol">AI Development Protocol</span>

## Component Integration (AIOp)
1. Navigate to reactbits.dev and select TypeScript/Tailwind tabs.
2. Verify and install dependencies.
3. Copy code, create file in `/src/components/react-bits/`, import and use.
4. For updates, check reactbits.dev for new versions before changing code.

## Governance
- All changes must be reviewed and approved by the user via diff viewer.
- Context must be loaded before development (use #Doc in Trae.ai).
- All components in `/src/components/react-bits/` are "unmanaged" and must be manually updated as needed.

---

# <span id="faq">Frequently Asked Questions</span>
- **How do I contribute?** See the guidelines in the repository and documentation. Fork the repo, create a feature branch, submit a pull request, and follow code review protocols.
- **Where can I find UI/UX assets?** Check the Annexes section above for diagrams, design guidelines, and component sources.
- **How do I deploy locally?** Use Docker and follow the Quick Start in the README. All dependencies and environment variables are managed via Docker Compose.
- **What is the role of AI agents?** Agents automate development, testing, and documentation, following strict protocols for quality and traceability.
- **How do I update reactbits.dev components?** Follow the AIOp protocol: check for updates, verify dependencies, copy new code, and replace files in `/src/components/react-bits/`.

---
# <span id="changelog">Changelog</span>
- **2025-07-30:** Migrated documentation to single-page format, added advanced navigation and visual coherence.
- **2025-07-29:** Added custom CSS and JS animations for documentation.
- **2025-07-28:** Initial setup of Jekyll and Cayman theme.

---
# <span id="contact">Contact</span>
- Email: info@cubatattoostudio.com
- Studio: [Google Maps Location](https://goo.gl/maps/example)

---
> This site is powered by Jekyll and the Cayman theme, customized for a premium, modern look.
