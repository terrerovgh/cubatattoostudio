# CubatattooStudio.com

![Cubatattoo Studio Banner](docs/assets/images/logo.png)

## Executive Overview
Cubatattoostudio.com is the digital flagship for Cubatattoo Studio, designed to seamlessly blend high-end tattoo artistry with robust, user-centric technology. This project sets a new standard for creative studios, combining immersive visuals, advanced UI, and operational excellence to convert visitors into loyal clients.

## Key Features
- **Visually Immersive Homepage:** Full-screen hero, animated headlines, and curated artist showcase.
- **Dynamic Portfolio Gallery:** Filterable, high-resolution grid powered by modern React components.
- **Artist Profiles:** Detailed bios, personal galleries, and direct booking CTAs.
- **Studio Tour & Hygiene:** Transparent safety protocols and virtual walkthroughs.
- **Contact & Booking System:** Streamlined forms, Google Maps integration, and clear reservation policies.
- **Custom UI Effects:** Artistic cursors, interactive layouts, and 3D/AR model support.
- **Advanced Animations:** GSAP-powered transitions and effects for a premium user experience.

## Technology Stack
- **Frontend:** React + Next.js (TypeScript)
- **Styling:** Tailwind CSS (utility-first, rapid prototyping)
- **Animation:** Framer Motion, GSAP
- **Component Library:** [reactbits.dev](https://reactbits.dev) (custom, high-impact UI)
- **Backend:** Node.js (Express) or Python (FastAPI)
- **Database:** PostgreSQL or MongoDB
- **CI/CD:** GitHub Actions
- **Containerization:** Docker (container: `cubatattoostudio-web`)
- **Deployment:** Cloudflare Pages (`cubatattoostudio.com`)
- **Documentation:** GitHub Pages (`docs.cubatattoostudio.com`)

## Repository & Branching Strategy
- **GitHub Repository:** [terrerovgh/cubatattoostudio](https://github.com/terrerovgh/cubatattoostudio)
- **Main Branches:**
  - `main`: Production (live site)
  - `dev`: Development (active feature work)
  - `test`: Testing (QA, staging)
- **Branch-Specific Configurations:**
  - Each branch uses dedicated GitHub Actions workflows for build, test, and deploy.
  - Automated deployments:
    - `main` → Cloudflare Pages (production)
    - `test` → Staging environment
    - `dev` → Preview builds

## Docker Development Environment
- The project is always developed inside a Docker container (`cubatattoostudio-web`).
- All dependencies, scripts, and environment variables are managed via Docker Compose for consistency and reproducibility.
- See `docker/README.md` for setup instructions.

## SEO & AI Optimization
- Fully optimized for SEO best practices (Next.js SSR/SSG, meta tags, sitemap, robots.txt).
- Designed for compatibility and discoverability by AI agents and search engines.
- Fast, secure, and accessible for all users and bots.

## Documentation
- Professional documentation is deployed at [docs.cubatattoostudio.com](https://docs.cubatattoostudio.com) via GitHub Pages.
- Follows best practices: clear structure, cross-references, code samples, and visual assets.
- All changes and architectural decisions are tracked and versioned.

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

## VS Code & Copilot Configuration
- **Recommended Extensions:**
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - GitHub Copilot
  - GitLens
  - EditorConfig
- **Workspace Settings:**
  - TypeScript strict mode enabled
  - Tailwind CSS IntelliSense configured
  - ESLint and Prettier auto-format on save
  - EditorConfig for consistent indentation
- **Tasks:**
  - View documentation: `xdg-open docs/1-introduction_overview.md`
  - Build and run scripts in `package.json`
- **Scripts:**
  - `npm run dev` – Start development server
  - `npm run build` – Build for production
  - `npm run lint` – Lint codebase
  - `npm run format` – Format codebase

## Development Guidelines
1. **Read the documentation in `docs/` before starting any task.**
2. **Follow the prescribed folder structure and naming conventions.**
3. **Use provided scripts and configurations for automation.**
4. **Keep documentation updated with every relevant change.**
5. **Integrate third-party components via the AIOp protocol (see docs).**
6. **Always develop and test inside the Docker container.**
7. **Use branch-specific workflows for CI/CD and deployments.**

## Resources
- [Full Documentation](docs/)
- [Roadmap & Planning](docs/5-roadmap_temporal_planning.md)
- [Component Mapping](docs/2-feature_implementation_component_mapping.md)
- [Annexes & References](docs/6-annexes_references.md)

## Contact
For inquiries, collaboration, or support:
- Email: [email@example.com]
- Studio: [Google Maps Location](https://goo.gl/maps/example)

---

# Project Rules – CubatattooStudio.com

## Branching & Workflow
- Use three main branches: `main` (production), `dev` (development), `test` (QA/staging).
- All feature work and fixes must be done in dedicated branches and merged via pull requests.
- Each branch triggers specific GitHub Actions workflows for build, test, and deploy.

## Docker Development
- All development and testing must occur inside the `cubatattoostudio-web` Docker container.
- Use `docker-compose` for environment setup and reproducibility.
- Document any environment variable or dependency changes in `docker/README.md`.

## CI/CD & Deployment
- `main` branch deploys automatically to Cloudflare Pages (`cubatattoostudio.com`).
- `test` branch deploys to a staging environment.
- `dev` branch deploys preview builds for review.
- Documentation is deployed to GitHub Pages (`docs.cubatattoostudio.com`).

## Coding & Documentation
- Use GSAP for advanced animations and transitions.
- All code must be TypeScript, follow ESLint/Prettier rules, and be auto-formatted on save.
- Documentation must be updated with every architectural or feature change.
- SEO best practices are mandatory (meta tags, sitemap, robots.txt, SSR/SSG).
- All documentation must be clear, cross-referenced, and versioned.

## AI Agent Context
- Agents (Copilot, Gemini, Trae) must always reference the latest documentation in `docs/`.
- Agents should use branch-specific workflows and Docker context for all tasks.
- Agents must optimize code for SEO, accessibility, and AI discoverability.
- All architectural decisions and changes must be logged and referenced in documentation.

---

## Configuración recomendada para GitHub Copilot

- Instala y activa Copilot en VS Code.
- Usa el archivo `.vscode/settings.json` para habilitar TypeScript strict mode, ESLint, Prettier y Tailwind CSS IntelliSense.
- Añade comentarios claros y contexto en cada archivo para que Copilot pueda sugerir código relevante.
- Mantén la documentación actualizada y referenciada en los comentarios de los archivos principales.
- Usa convenciones de nombres y estructura de carpetas como se indica en el README.

---

## Configuración recomendada para Gemini

- Proporciona el README y toda la documentación en inglés, con estructura clara y referencias cruzadas.
- Incluye detalles sobre el entorno Docker, las ramas, los workflows de GitHub Actions y los endpoints de despliegue.
- Añade ejemplos de uso de GSAP y componentes avanzados en la documentación.
- Documenta los flujos de CI/CD y las configuraciones de SEO para que Gemini pueda entender y sugerir mejoras.
- Mantén un changelog y roadmap accesible para agentes.

---

¿Quieres que cree ejemplos de workflows de GitHub Actions, archivos de configuración Docker, o una estructura para la documentación en GitHub Pages? Indícalo y lo haré.
