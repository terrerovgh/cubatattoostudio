# CubatattooStudio.com

![Cubatattoo Studio Banner](docs/assets/images/logo.png)

---

## Executive Overview
Cubatattoostudio.com is the digital flagship for Cubatattoo Studio, blending high-end tattoo artistry with robust, user-centric technology. The site combines immersive visuals, advanced UI, and operational excellence to convert visitors into loyal clients.

## Key Features
- **Immersive Homepage:** Full-screen hero, animated headlines, curated artist showcase.
- **Portfolio Gallery:** Filterable, high-res grid powered by React.
- **Artist Profiles:** Bios, galleries, direct booking.
- **Studio Tour & Hygiene:** Safety protocols, virtual walkthroughs.
- **Contact & Booking:** Streamlined forms, Google Maps, clear policies.
- **Custom UI Effects:** Artistic cursors, interactive layouts, 3D/AR support.
- **Premium Animations:** GSAP-powered transitions and effects.

## Technology Stack
- **Frontend:** React + Next.js (TypeScript)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion, GSAP
- **UI Library:** [reactbits.dev](https://reactbits.dev)
- **Backend:** Node.js (Express) / Python (FastAPI)
- **Database:** PostgreSQL / MongoDB
- **CI/CD:** GitHub Actions
- **Containerization:** Docker (`cubatattoostudio-web`)
- **Deployment:** Cloudflare Pages
- **Docs:** GitHub Pages ([docs.cubatattoostudio.com](https://docs.cubatattoostudio.com))

## Project Structure
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

## Quick Start
1. **Read the docs:** [Full Documentation](docs/)
2. **Dev environment:** Use Docker (`docker/README.md`)
3. **Scripts:**
   - `npm run dev` – Start development server
   - `npm run build` – Build for production
   - `npm run lint` – Lint codebase
   - `npm run format` – Format codebase

## Resources
- [Roadmap](docs/5-roadmap_temporal_planning.md)
- [Component Mapping](docs/2-feature_implementation_component_mapping.md)
- [Annexes & References](docs/6-annexes_references.md)

## Contact
- Email: [info@cubatattoostudio.com](mailto:info@cubatattoostudio.com)
- Studio: [Google Maps Location](https://goo.gl/maps/example)

---

> For full guidelines, workflows, and internal rules, see the documentation in `docs/`.
