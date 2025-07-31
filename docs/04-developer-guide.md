# Developer Guide

This guide provides essential instructions for developers and AI agents working on the Cubatattoo Studio project. Adherence to these protocols is critical for maintaining code quality and consistency.

## Development Workflow

The project follows a phased implementation model. Developers should:
1.  Build one primary page or component at a time.
2.  Submit code changes for review upon completion of a logical unit of work.
3.  Await user approval before proceeding to the next task.
4.  Ensure all code is clean, well-commented, and adheres to TypeScript and Tailwind CSS best practices.

## Component Integration Protocol (AIOp)

There is a critical gap between a human developer's implicit understanding and an AI's need for explicit instructions. The non-standard workflow of `reactbits.dev` exacerbates this gap. Therefore, the following precise protocol must be followed for every `reactbits.dev` component used in this project.

### The Protocol
1.  **Navigate**: Programmatically access the provided URL for the specified component on `reactbits.dev`.
2.  **Configure**: In the page's code viewer, select the **"TypeScript"** and **"Tailwind"** tabs.
3.  **Verify Dependencies**: Read the **"Install dependencies"** section on the component's page. If any new dependencies are listed that have not been previously installed, run the `npm install [dependency-name]` command in the terminal.
4.  **Copy Code**: Copy the entire code content for the component.
5.  **Create File**: Create a new file within the `/src/components/react-bits/` directory. The filename must be the exact component name in **PascalCase** (e.g., `Masonry.tsx`).
6.  **Paste and Save**: Paste the copied code into the new file and save it.
7.  **Import and Use**: Import the component from its new local path (e.g., `import Masonry from '@/components/react-bits/Masonry';`) into the target page or component.

## Maintenance of Unmanaged Components

All components within `/src/components/react-bits/` are "unmanaged." They are a snapshot in time from `reactbits.dev`. To obtain updates or bug fixes for these components, you must manually repeat the Component Integration Protocol (AIOp).

When tasked with maintenance, developers should first check the `reactbits.dev` website for newer versions of the components located in this directory before proposing any changes.
