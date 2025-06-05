# Project Rules for AI Agents: Cuba Tattoo Studio

**Project Context:** These rules guide AI agent behavior specifically for the "Cuba Tattoo Studio - Website & Management System" project. Agents must adhere to these rules when interacting with the project's G_ FormattingitHub repository and Project board via MCP.

---

1.  **Project Name:** Cuba Tattoo Studio - Website & Management System.
2.  **Primary Project Objective:** Develop a unique, attractive, and high-performing website for Cuba Tattoo Studio that increases visibility in Albuquerque and drives bookings. Implement a backend system using n8n and AI for efficient studio management. The project will be self-hosted via Docker.
3.  **Key Project Goals:**
    * Launch an initial MVP website (frontend focus) on GitHub Pages by [User to specify Target Date, e.g., June 10, 2025].
    * Increase studio visibility in Albuquerque.
    * Implement a booking system originating from social media, processed via the website.
    * Showcase artists' diverse styles and Cuban heritage appropriately.
4.  **Current Project Focus:** [User to specify current sprint/MVP goal, e.g., "MVP Frontend on GitHub Pages - Homepage and core design elements"].

## Technology Stack & Standards

5.  **Frontend Technologies:** Utilize HTML5, CSS3, JavaScript (ES6+), and `anime.js`.
6.  **JavaScript Style:** Adhere to [User to specify, e.g., "Modern ES6 syntax, functional components where appropriate, and clear, JSDoc-style comments for functions"].
7.  **CSS Style:** Implement [User to specify, e.g., "BEM naming convention, SCSS if a preprocessor is introduced, and a mobile-first responsive design approach"].
8.  **`anime.js` Usage:** Employ `anime.js` for primary scroll-based animations (e.g., the tattoo machine concept) and other subtle UI/UX enhancements. Prioritize animation performance.
9.  **Backend/Automation Technology:** Utilize `n8n.io` (self-hosted configuration).
10. **AI Model Integration:** Primary AI models are Gemini AI (Google) and [User to specify "trae.ia" details or other models]. Integrate these via `n8n.io` as needed.
11. **Deployment Technologies:**
    * MVP Frontend: GitHub Pages.
    * Full Project: Docker (self-hosted).
12. **Version Control:** All code and configuration files must be versioned using Git, hosted on the project's GitHub repository.
13. **Code Formatting:** Automatically format all code (HTML, CSS, JS) using [User to specify, e.g., "Prettier with the project's `.prettierrc` configuration"] before each commit.
14. **Code Linting:** Adhere to linting rules defined by [User to specify, e.g., "ESLint with the project's `.eslintrc.js` configuration"] for JavaScript code.

## GitHub Interaction via MCP (`@modelcontextprotocol/server-github`)

15. **Mandatory MCP Interface:** All interactions with the GitHub repository and Project board MUST be performed using `@modelcontextprotocol/server-github`.
16. **Target Repository:** `https://github.com/terrerovgh/cubatattoostudio`
17. **Target Project Board:** `https://github.com/users/terrerovgh/projects/3`
18. **Authentication Protocol:** Assume necessary GitHub permissions are granted and managed through the `@modelcontextprotocol/server-github` connection.

### Code Management (Repository)

19. **Read Access:** Authorized to read and analyze all existing code and project files to understand structure and context.
20. **Write/Add New Files:** Authorized to create new files (HTML, CSS, JS, `anime.js` scripts, Markdown, Dockerfiles, n8n workflow JSON/YAML, etc.) as required by project tasks.
21. **Modify/Edit Existing Files:** Authorized to update existing code to implement features, fix bugs, refactor (with caution for large refactors), or improve performance, adhering to all defined standards.
22. **Delete Files/Code:** Authorized to delete files or code segments only if they are confirmed obsolete or unused. For significant deletions, request confirmation.
23. **Commit Messages:** All commits MUST use clear, descriptive messages following the [User to specify, e.g., "Conventional Commits standard (e.g., `feat: implement homepage hero animation` or `fix: correct responsive layout on artist page`)"].
24. **Branching Strategy:**
    * All new development, features, or fixes MUST be done on separate feature branches (e.g., `feature/new-booking-form`, `fix/header-css-bug`).
    * The primary development integration branch is [User to specify, e.g., "`main`" or "`develop`"].
25. **Pull Requests (PRs):**
    * Create Pull Requests for merging feature branches into the primary development branch.
    * PR descriptions MUST link to the relevant GitHub Issue(s) or Project board card(s).
26. **Code Review Assistance:** Authorized to assist in code reviews by providing suggestions, identifying potential issues, or checking for adherence to standards.

### Project Management (GitHub Project Board)

27. **Read Project Board:** Authorized to read all tasks, their details (description, labels, assignees), and their current status across all defined columns ("Cubo de Ideas," "Por Hacer," "En Progreso," "Hecho").
28. **Update Task Status:** Move tasks/cards between columns accurately reflecting their current work status (e.g., from "Por Hacer" to "En Progreso" when starting; to "Hecho" upon meeting the "Definition of Done").
29. **Update Task Details:** Add comments to tasks/issues with progress updates, findings, or questions. Assign tasks or update labels (effort, epic, type) as appropriate or instructed.
30. **Create New Tasks/Issues:** If a necessary sub-task, bug, or a new small feature aligned with current goals is identified, propose or create a new issue/card, preferably placing it in "Cubo de Ideas" or "Por Hacer" for review.
31. **Link Work to Tasks:** Ensure all commits and Pull Requests are clearly linked to their corresponding GitHub Issue(s) or Project board card(s).

## AI Agent Workflow & Collaboration

32. **Task Source:** Primarily work on tasks explicitly assigned or those selected from the "Por Hacer" column of the GitHub Project board as prioritized.
33. **Progress Communication:** Provide clear and concise feedback on task progress, any encountered issues, or ambiguities in instructions, primarily via comments in GitHub Issues/PRs.
34. **Problem Articulation:** If blocked or unable to solve a problem, clearly describe the problem, an summary of attempted solutions, and request specific clarification or assistance.
35. **Testing Support:** Where applicable, assist in writing or suggesting basic unit/functional tests for new code or modifications. Confirm functionality based on task requirements.
36. **MVP Task Prioritization:** Give highest priority to tasks related to the current MVP (as defined in rule #4), especially those labeled with high priority or linked to the "MVP Semana 1" milestone (if used).

## Project-Specific Restrictions

38. **Security Settings:** Do NOT alter any security, billing, or administrative settings within the GitHub repository or associated organization.
39. **Major Refactors/Deletions:** Request explicit confirmation before undertaking large-scale code refactoring or deleting multiple critical files.
40. **Sensitive Data Handling:** Do not include any sensitive data (API keys, passwords, personal client information) directly in the codebase or in logs. Utilize environment variables or secure secret management practices (to be defined separately if AI needs to interact with these).

---
