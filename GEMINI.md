# GEMINI Project Context

This document provides all essential context and operational rules for Gemini agents (such as gemini-cli) to autonomously develop, maintain, and document the cubatattoostudio.com project.

## Project Overview
- Project: cubatattoostudio.com
- Purpose: Modern web platform for tattoo studio management and client engagement.
- All documentation and code comments must be written in English.

## Key Documents
- Architectural Fundamentals: docs/2-fundamentos_arquitectonicos_estrategicos.md
- Component Mapping: docs/3-mapeo_componentes_funcionalidades.md
- Agent Execution: docs/4-ejecucion_agentes_flujos_operativos.md
- Roadmap: docs/5-roadmap_planificacion_temporal.md
- Project Rules for AI Agents: .trae/project_rules.md

## Operational Rules for Gemini Agents
- Always read and reference the documentation in the `docs/` folder before starting any task.
- Strictly follow architectural, functional, and roadmap decisions as documented.
- Use semantic search and code navigation to understand dependencies, relationships, and flows.
- For any new feature, bugfix, or refactor, update the relevant documentation and cross-reference affected components.
- Use descriptive and English names for all files, folders, variables, functions, and classes.
- Separate source code, static resources, and documentation into clearly defined directories.
- Use camelCase for variables and functions, PascalCase for classes, and kebab-case for file and folder names.
- Document every new component or functionality in the appropriate section of the documentation.
- Add explanatory comments to code, especially for complex logic or architectural decisions.
- Do not use abbreviations or acronyms unless they are industry standard and documented in a glossary.
- Use 2 spaces for indentation in JavaScript/TypeScript, 4 spaces for Python.
- End all files with a newline character and remove trailing whitespace.
- Limit line length to 120 characters in Markdown, 80 in source code files.
- Use linting and formatting tools (ESLint, Prettier, Black, etc.) for all supported languages.
- Run automated tests before every deployment or merge to main branch.
- Never store credentials, secrets, or sensitive data in the repository.
- Use `.env` files for environment variables and add them to `.gitignore`.
- Validate all user input and handle errors securely.
- Use feature branches for new development; merge to main only after review and testing.
- Write clear, descriptive commit messages in English.
- Use pull requests for all changes; require at least one review before merging.
- Communicate blockers, risks, and changes promptly to the team.

## Example Workflow for Gemini Agents
1. Read all documentation and project rules.
2. Use semantic search to understand context, dependencies, and requirements.
3. Create a feature branch for the assigned task.
4. Implement changes strictly following code style, structure, and documentation rules.
5. Add or update documentation and comments in English, referencing all affected components.
6. Run linting, formatting, and automated tests.
7. Open a pull request with a clear description and rationale.
8. Request review and address feedback.
9. Merge to main after approval and successful tests.
10. Update the changelog and roadmap if needed.
11. Document all decisions and changes for future AI agents and contributors.

## References
- Official Gemini documentation: https://ai.google.dev/gemini-cli
- Project Rules for AI Agents: .trae/project_rules.md
- All docs in /docs/
