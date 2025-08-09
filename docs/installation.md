# Installation Guide - Cuba Tattoo Studio

## 🚀 Quick Start

Get the Cuba Tattoo Studio website running locally in under 5 minutes.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **pnpm** 8.x or higher (recommended) or npm
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (recommended IDE)

### Verify Prerequisites

```bash
# Check Node.js version
node --version
# Should output: v20.x.x or higher

# Check pnpm version
pnpm --version
# Should output: 8.x.x or higher

# If pnpm is not installed:
npm install -g pnpm

# Check Git version
git --version
# Should output: git version 2.x.x or higher
```

## 📦 Installation Methods

### Method 1: DevContainer (Recommended)

The easiest way to get started with a consistent development environment.

#### Requirements
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **VS Code** with Dev Containers extension

#### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/cubatattoostudio.git
   cd cubatattoostudio
   ```

2. **Open in VS Code**
   ```bash
   code .
   ```

3. **Reopen in Container**
   - VS Code will show a notification: "Reopen in Container"
   - Click "Reopen in Container" or use Command Palette:
     - `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
     - Type: "Dev Containers: Reopen in Container"

4. **Wait for Setup**
   - The container will build automatically (first time takes 3-5 minutes)
   - Dependencies will be installed automatically
   - Development server will start automatically

5. **Access the Site**
   - Open browser to `http://localhost:4321`
   - The site should load with hot reloading enabled

### Method 2: Local Installation

For developers who prefer local development setup.

#### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/cubatattoostudio.git
   cd cubatattoostudio
   ```

2. **Install dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   ```

3. **Start development server**
   ```bash
   # Using pnpm
   pnpm dev
   
   # Or using npm
   npm run dev
   ```

4. **Open in browser**
   ```bash
   # Automatically open browser
   open http://localhost:4321
   
   # Or manually navigate to http://localhost:4321
   ```

### Method 3: GitHub Codespaces

Develop directly in the browser with GitHub Codespaces.

1. **Open Repository on GitHub**
   - Navigate to the repository on GitHub
   - Click the green "Code" button
   - Select "Codespaces" tab
   - Click "Create codespace on main"

2. **Wait for Setup**
   - Codespace will initialize (2-3 minutes)
   - Dependencies install automatically
   - Development server starts automatically

3. **Access the Site**
   - VS Code will open in browser
   - Port 4321 will be forwarded automatically
   - Click the port notification to open the site

## 🔧 Configuration

### Environment Variables

Create environment files for different environments:

#### Development Environment

```bash
# Create .env.local file
cp .env.example .env.local
```

```bash
# .env.local
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_GA_ID=G-XXXXXXXXXX
CONTACT_EMAIL=dev@cubatattoostudio.com
BOOKING_WEBHOOK_URL=http://localhost:3001/webhook
NODE_ENV=development
```

#### Production Environment

```bash
# .env.production
PUBLIC_SITE_URL=https://cubatattoostudio.com
PUBLIC_GA_ID=G-REALTRACKINGID
CONTACT_EMAIL=info@cubatattoostudio.com
BOOKING_WEBHOOK_URL=https://api.cubatattoostudio.com/webhook
NODE_ENV=production
```

### VS Code Configuration

#### Recommended Extensions

Install these extensions for the best development experience:

```bash
# Install via command line
code --install-extension astro-build.astro-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
```

#### Workspace Settings

The project includes VS Code workspace settings in `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.astro": "astro"
  },
  "emmet.includeLanguages": {
    "astro": "html"
  },
  "tailwindCSS.includeLanguages": {
    "astro": "html"
  }
}
```

## 🛠️ Development Commands

### Available Scripts

```bash
# Start development server
pnpm dev
# Starts Astro dev server on http://localhost:4321

# Build for production
pnpm build
# Creates optimized production build in ./dist

# Preview production build
pnpm preview
# Serves production build locally for testing

# Type checking
pnpm astro check
# Runs TypeScript type checking

# Lint code
pnpm lint
# Runs ESLint on all source files

# Format code
pnpm format
# Formats code with Prettier

# Clean build artifacts
pnpm clean
# Removes node_modules, .astro, and dist directories
```

### Development Workflow

```bash
# Daily development workflow
pnpm dev          # Start development server
# Make changes to code
pnpm astro check  # Check for TypeScript errors
pnpm lint         # Check for linting issues
pnpm format       # Format code
pnpm build        # Test production build
```

## 🔍 Verification

### Verify Installation

After installation, verify everything is working correctly:

1. **Development Server**
   ```bash
   pnpm dev
   ```
   - Should start without errors
   - Should be accessible at `http://localhost:4321`
   - Hot reloading should work when you edit files

2. **Build Process**
   ```bash
   pnpm build
   ```
   - Should complete without errors
   - Should create `./dist` directory
   - Should show build statistics

3. **Type Checking**
   ```bash
   pnpm astro check
   ```
   - Should complete without TypeScript errors
   - Should show "0 errors found"

4. **Code Quality**
   ```bash
   pnpm lint
   ```
   - Should complete without linting errors
   - Should show "No problems found"

### Test Key Features

1. **Homepage Animations**
   - Navigate to `http://localhost:4321`
   - Verify GSAP animations load and play smoothly
   - Check console for any JavaScript errors

2. **Navigation**
   - Test all navigation links
   - Verify mobile menu works
   - Check responsive design on different screen sizes

3. **Portfolio Gallery**
   - Navigate to `/portfolio`
   - Test filtering functionality
   - Verify images load correctly

4. **Booking Form**
   - Navigate to `/reservas`
   - Test form validation
   - Verify all fields work correctly

## 🐛 Troubleshooting

### Common Issues

#### Node.js Version Issues

```bash
# Error: "Node.js version not supported"
# Solution: Update Node.js to version 20.x or higher

# Check current version
node --version

# Update using nvm (recommended)
nvm install 20
nvm use 20

# Or download from nodejs.org
```

#### Package Installation Issues

```bash
# Error: "Package installation failed"
# Solution: Clear cache and reinstall

# Clear pnpm cache
pnpm store prune

# Remove node_modules and lock file
rm -rf node_modules pnpm-lock.yaml

# Reinstall dependencies
pnpm install
```

#### Port Already in Use

```bash
# Error: "Port 4321 is already in use"
# Solution: Use different port or kill existing process

# Use different port
pnpm dev --port 3000

# Or kill process using port 4321
lsof -ti:4321 | xargs kill -9
```

#### DevContainer Issues

```bash
# Error: "Failed to build container"
# Solution: Rebuild container

# In VS Code Command Palette:
# "Dev Containers: Rebuild Container"

# Or rebuild without cache:
# "Dev Containers: Rebuild Container Without Cache"
```

#### GSAP Animation Issues

```bash
# Error: "GSAP animations not working"
# Solution: Check GSAP license and imports

# Verify GSAP is installed
pnpm list gsap

# Check for console errors in browser
# Verify ScrollTrigger plugin is registered
```

### Getting Help

If you encounter issues not covered here:

1. **Check the Console**
   - Open browser DevTools (F12)
   - Look for error messages in Console tab
   - Check Network tab for failed requests

2. **Check Build Logs**
   ```bash
   pnpm build --verbose
   ```
   - Look for detailed error messages
   - Check for missing dependencies

3. **Verify File Permissions**
   ```bash
   # On macOS/Linux, ensure proper permissions
   chmod -R 755 .
   ```

4. **Clean Installation**
   ```bash
   # Complete clean installation
   rm -rf node_modules .astro dist pnpm-lock.yaml
   pnpm install
   pnpm dev
   ```

## 📞 Support

If you need additional help:

- **Documentation**: Check the [docs](./README.md) folder
- **Issues**: Create an issue on [GitHub](https://github.com/your-org/cubatattoostudio/issues)
- **Discussions**: Join the [GitHub Discussions](https://github.com/your-org/cubatattoostudio/discussions)
- **Email**: Contact [dev@cubatattoostudio.com](mailto:dev@cubatattoostudio.com)

## 🎯 Next Steps

After successful installation:

1. **Read the Documentation**
   - [Project Overview](./project-overview.md)
   - [Development Guide](./development.md)
   - [Component Library](./components.md)

2. **Explore the Codebase**
   - Start with `src/pages/index.astro` (homepage)
   - Look at `src/components/` for reusable components
   - Check `src/data/` for content structure

3. **Make Your First Change**
   - Edit a component
   - See hot reloading in action
   - Commit your changes

4. **Set Up Your Development Environment**
   - Configure your preferred tools
   - Set up debugging
   - Install additional extensions

---

*This installation guide should get you up and running quickly. If you encounter any issues, please refer to the troubleshooting section or reach out for support.*