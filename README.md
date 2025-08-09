# Cuba Tattoo Studio

<div align="center">
  <img src="./logo.png" alt="Cuba Tattoo Studio Logo" width="200" height="200">
  
  <h3>Cuba Tattoo Studio Website</h3>
  <p>Premium tattoo artistry in Albuquerque, New Mexico</p>
  
  [![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![GSAP](https://img.shields.io/badge/GSAP-3.x-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  
  [🌐 Live web](https://cubatattoostudio.com) • [📚 Documentation](./docs) • [🐛 Report Bug](https://github.com/terrerovgh/cubatattoostudio/issues)
</div>

## ✨ Features

### 🎨 **Visual Excellence**
- **Cinematic Animations** - GSAP-powered animations inspired by Rockstar Games
- **Monochromatic Design** - Striking black & white aesthetic
- **Responsive Design** - Mobile-first approach with perfect scaling
- **High-Performance Images** - WebP/AVIF optimization with lazy loading

### 🏪 **Business Features**
- **Artist Portfolios** - Individual artist pages with extensive galleries
- **Portfolio Filtering** - Filter by artist, style, and tattoo categories
- **Online Booking** - Comprehensive appointment scheduling system
- **Studio Information** - About us, FAQ, and contact details
- **SEO Optimized** - Schema.org markup and meta optimization

### ⚡ **Technical Excellence**
- **Lighthouse Score 90+** - Optimized for Core Web Vitals
- **Accessibility First** - WCAG 2.1 AA compliant
- **Modern Stack** - Astro, Tailwind CSS, GSAP
- **Type Safety** - Full TypeScript implementation
- **Progressive Enhancement** - Works without JavaScript

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ 
- **pnpm** (recommended) or npm
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/terrerovgh/cubatattoostudio.git
cd cubatattoostudio

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be available at `http://localhost:4321`

### Development Commands

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm astro check
```

## 🏗️ Project Structure

```
cubatattoostudio/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── animations/      # GSAP animation components
│   │   ├── forms/          # Form components
│   │   ├── gallery/        # Portfolio gallery components
│   │   ├── layout/         # Header, Footer, Navigation
│   │   └── ui/             # Basic UI elements
│   ├── data/               # JSON data files
│   │   ├── artists.json    # Artist information
│   │   └── tattoo-styles.json # Tattoo style definitions
│   ├── layouts/            # Page layouts
│   ├── pages/              # Route pages
│   │   ├── api/            # API endpoints
│   │   ├── artistas/       # Artist pages
│   │   └── *.astro         # Main pages
│   └── styles/             # Global styles
├── public/                 # Static assets
├── docs/                   # Project documentation
└── .devcontainer/          # Development container config
```

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--cuba-black: #000000;     /* Backgrounds, text */
--cuba-white: #FFFFFF;     /* Text, accents */

/* Grayscale */
--cuba-gray-400: #A0A0A0;  /* Secondary text */
--cuba-gray-600: #525252;  /* Borders, dividers */
```

### Typography

- **Headings**: Bebas Neue (condensed, uppercase)
- **Body Text**: Inter (clean, readable)
- **UI Elements**: System fonts for performance

### Animation Principles

- **Cinematic Feel** - Inspired by rockstargames.com/VI
- **Smooth Transitions** - 60fps performance target
- **Meaningful Motion** - Animations enhance UX
- **Progressive Enhancement** - Graceful degradation

## 📱 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| **Homepage** | `/` | Hero section with cinematic animations |
| **Artists** | `/artistas` | Grid of all studio artists |
| **Artist Profile** | `/artistas/[slug]` | Individual artist portfolios |
| **Portfolio** | `/portfolio` | Complete gallery with filtering |
| **Studio Info** | `/estudio` | About us, philosophy, FAQ |
| **Booking** | `/reservas` | Appointment form and contact |

## 🛠️ Technology Stack

### Core Technologies

- **[Astro 5.x](https://astro.build)** - Static site generator with islands architecture
- **[Tailwind CSS 4.x](https://tailwindcss.com)** - Utility-first CSS framework
- **[GSAP 3.x](https://greensock.com/gsap/)** - Professional animation library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### Build & Deployment

- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Cloudflare Pages](https://pages.cloudflare.com/)** - Edge deployment platform
- **[Sharp](https://sharp.pixelplumbing.com/)** - High-performance image processing

### Development Tools

- **[DevContainer](https://containers.dev/)** - Consistent development environment
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Prettier](https://prettier.io/)** - Code formatting

## 🎯 Performance Metrics

### Lighthouse Scores (Target)

- **Performance**: 90+ 
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## 🌐 SEO & Analytics

### SEO Features

- **Schema.org Markup** - Local business structured data
- **Open Graph Tags** - Social media optimization
- **XML Sitemap** - Automatic generation
- **Meta Tags** - Unique per page
- **Canonical URLs** - Duplicate content prevention

### Analytics Integration

- **Google Analytics 4** - User behavior tracking
- **Google Search Console** - Search performance
- **Core Web Vitals** - Performance monitoring

## 🔧 Configuration

### Environment Variables

```bash
# .env.local
PUBLIC_SITE_URL=https://cubatattoostudio.com
PUBLIC_GA_ID=G-XXXXXXXXXX
CONTACT_EMAIL=info@cubatattoostudio.com
BOOKING_WEBHOOK_URL=https://api.example.com/booking
```

### Key Configuration Files

- `astro.config.mjs` - Astro configuration
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` - TypeScript configuration
- `.devcontainer/` - Development environment setup

## 🚀 Deployment

### Cloudflare Pages (Recommended)

1. **Connect Repository** to Cloudflare Pages
2. **Build Settings**:
   - Build command: `pnpm build`
   - Output directory: `dist`
   - Node.js version: `20`
3. **Environment Variables** - Set in Cloudflare dashboard
4. **Custom Domain** - Configure DNS settings

### Alternative Deployments

- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop or Git integration
- **GitHub Pages**: Free hosting for public repos

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Responsive Design** - Test on mobile, tablet, desktop
- [ ] **Animation Performance** - Smooth 60fps animations
- [ ] **Form Functionality** - Booking form validation
- [ ] **Navigation** - All links working correctly
- [ ] **Accessibility** - Keyboard navigation, screen readers
- [ ] **Performance** - Lighthouse audit scores

### Automated Testing

```bash
# Run type checking
pnpm astro check

# Build test (catches build errors)
pnpm build

# Preview production build
pnpm preview
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript** for type safety
- **ESLint + Prettier** for code formatting
- **Conventional Commits** for commit messages
- **Component-driven** development approach

## 📞 Support & Contact

### Technical Support

- **Issues**: [GitHub Issues](https://github.com/your-org/cubatattoostudio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/cubatattoostudio/discussions)
- **Email**: [dev@cubatattoostudio.com](mailto:dev@cubatattoostudio.com)

### Business Contact

- **Studio**: [info@cubatattoostudio.com](mailto:info@cubatattoostudio.com)
- **Phone**: +1 (505) 123-4567
- **Address**: Albuquerque, New Mexico
- **Instagram**: [@cubatattoostudio](https://instagram.com/cubatattoostudio)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Rockstar Games VI website
- **Animation Library**: GreenSock (GSAP)
- **Framework**: Astro team
- **Community**: Open source contributors

---

<div align="center">
  <p><strong>Built with ❤️ for Cuba Tattoo Studio</strong></p>
  <p>Albuquerque, New Mexico • 2025</p>
</div>