# Project Rules & Agent Guidelines

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

---

# AI Agent Context (Copilot, Gemini, Trae)
- Agents must always reference the latest documentation in `docs/`.
- Use branch-specific workflows and Docker context for all tasks.
- Optimize code for SEO, accessibility, and AI discoverability.
- Log and reference all architectural decisions and changes in documentation.

## Recommended Configuration for GitHub Copilot
- Install and activate Copilot in VS Code.
- Use `.vscode/settings.json` for TypeScript strict mode, ESLint, Prettier, and Tailwind CSS IntelliSense.
- Add clear comments and context in each file for relevant code suggestions.
- Keep documentation updated and referenced in main files.
- Follow naming conventions and folder structure as indicated in the README.

## Recommended Configuration for Gemini
- Provide README and documentation in English, with clear structure and cross-references.
- Include Docker environment, branches, GitHub Actions workflows, and deployment endpoints.
- Add GSAP and advanced component usage examples in docs.
- Document CI/CD flows and SEO configurations for Gemini to suggest improvements.
- Maintain accessible changelog and roadmap for agents.
