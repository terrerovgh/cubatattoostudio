# 📚 Cuba Tattoo Studio - Documentation Site

> Comprehensive documentation for the Cuba Tattoo Studio website project, deployed at [docs.cubatattoostudio.com](https://docs.cubatattoostudio.com)

## 🎯 Overview

This documentation site provides complete technical guides, component documentation, and user guides for the Cuba Tattoo Studio website project. Built with Jekyll and deployed on GitHub Pages with a custom domain.

## 🏗️ Architecture

### Technology Stack
- **Static Site Generator:** Jekyll 4.3.2
- **Styling:** Custom SCSS with Cuba Tattoo Studio design system
- **Animations:** GSAP (GreenSock Animation Platform)
- **Deployment:** GitHub Pages with GitHub Actions
- **Domain:** Custom domain `docs.cubatattoostudio.com`

### Design System
- **Color Palette:** Monochromatic (Black #000000, White #FFFFFF, Grays)
- **Typography:** Bebas Neue (headings) + Inter (body text)
- **Layout:** Dark, minimalist design matching main website
- **Animations:** Interactive GSAP component gallery

## 📁 Project Structure

```
docs/
├── _config.yml              # Jekyll configuration
├── _layouts/                 # Page layouts
│   └── default.html         # Main layout with GSAP integration
├── _includes/               # Reusable components
│   ├── head.html           # HTML head with fonts and meta
│   ├── header.html         # Site navigation
│   ├── footer.html         # Site footer
│   └── advanced-animations.html # Advanced animation examples
├── _sass/                   # SCSS stylesheets
│   └── cuba.scss           # Cuba Tattoo Studio design system
├── assets/                  # Static assets
│   ├── css/
│   │   └── style.scss      # Main stylesheet
│   └── js/
│       └── animation-gallery.js # Interactive animation controls
├── *.md                     # Documentation pages
├── Gemfile                  # Ruby dependencies
├── CNAME                    # Custom domain configuration
└── README.md               # This file
```

## 📖 Documentation Pages

### Core Guides
- **[Installation Guide](installation-guide.md)** - Setup and development environment
- **[Component Guide](component-guide.md)** - Reusable UI components
- **[GSAP Animation Guide](gsap-animation-guide.md)** - Animation implementation
- **[Technical Architecture](technical-architecture.md)** - System design and structure
- **[Contribution Guide](contribution-guide.md)** - Development workflow and standards
- **[User Guide](user-guide.md)** - End-user documentation

### Interactive Features
- **[Animation Gallery](animation-gallery.md)** - Interactive GSAP component showcase
  - Fade animations (fade-in, fade-in-up)
  - Slide animations (slide-left, slide-right)
  - Stagger effects with customizable timing
  - Scroll-triggered animations
  - Parallax effects
  - Advanced animations (text reveal, morphing, magnetic hover)
  - Loading animations and spinners
  - Code examples and implementation guides

## 🚀 Deployment

### Automatic Deployment
The site is automatically deployed to GitHub Pages using GitHub Actions:

1. **Trigger:** Push to `main` branch with changes in `docs/` folder
2. **Build:** Jekyll builds the site with production settings
3. **Deploy:** Artifacts uploaded to GitHub Pages
4. **Domain:** Available at `docs.cubatattoostudio.com`

### Manual Deployment
For local testing and manual deployment:

```bash
# Navigate to docs directory
cd docs

# Install dependencies
bundle install

# Serve locally (development)
bundle exec jekyll serve

# Build for production
JEKYLL_ENV=production bundle exec jekyll build
```

### GitHub Pages Configuration
- **Source:** GitHub Actions workflow
- **Custom Domain:** `docs.cubatattoostudio.com`
- **HTTPS:** Enforced
- **Build:** Automatic on push to main

## 🎨 Design Guidelines

### Visual Identity
The documentation site maintains the same visual identity as the main Cuba Tattoo Studio website:

- **Monochromatic Design:** Strict black and white color scheme
- **Typography Hierarchy:** Bebas Neue for impact, Inter for readability
- **Minimalist Layout:** Clean, professional aesthetic
- **Responsive Design:** Mobile-first approach

### Animation Principles
- **Performance:** 60fps animations using transform and opacity
- **Accessibility:** Respects `prefers-reduced-motion`
- **Timing:** Natural feeling animations (0.3s - 1.2s duration)
- **Easing:** Power2.out for smooth, professional feel

## 🛠️ Development

### Local Development Setup

1. **Prerequisites:**
   ```bash
   # Install Ruby (version 3.1+)
   # Install Bundler
   gem install bundler
   ```

2. **Clone and Setup:**
   ```bash
   git clone https://github.com/cubatattoostudio/website.git
   cd website/docs
   bundle install
   ```

3. **Development Server:**
   ```bash
   bundle exec jekyll serve --livereload
   # Site available at http://localhost:4000
   ```

### Adding New Documentation

1. **Create Markdown File:**
   ```markdown
   ---
   layout: default
   title: "Your Page Title"
   description: "Page description for SEO"
   permalink: /your-page-url/
   ---
   
   # Your Content Here
   ```

2. **Update Navigation:**
   - Add link to `_includes/header.html`
   - Update `_config.yml` navigation section

3. **Add to Footer:**
   - Include in `_includes/footer.html` quick links

### Animation Gallery Contributions

To add new animation examples:

1. **Create Animation Component:**
   ```html
   <div class="component-card">
     <h3 class="component-title">Animation Name</h3>
     <p class="component-description">Description</p>
     <div class="component-demo" id="demo-id">
       <!-- Demo element -->
     </div>
     <details>
       <summary>📋 View Code</summary>
       <!-- Code examples -->
     </details>
     <button class="btn btn-outline" onclick="replayFunction()">🔄 Replay</button>
   </div>
   ```

2. **Add JavaScript Function:**
   ```javascript
   function replayFunction() {
     const element = document.querySelector('#demo-id .demo-element');
     gsap.fromTo(element, fromProps, toProps);
   }
   ```

3. **Include in Gallery:**
   - Add to `animation-gallery.md` or `_includes/advanced-animations.html`

## 🔧 Configuration

### Jekyll Configuration (`_config.yml`)
- Site metadata and SEO settings
- Plugin configuration
- Custom variables for Cuba Tattoo Studio
- Navigation structure
- Build settings for GitHub Pages

### Styling Configuration
- **Main Stylesheet:** `assets/css/style.scss`
- **Design System:** `_sass/cuba.scss`
- **Component Styles:** Inline in components or includes

### JavaScript Configuration
- **GSAP Library:** Loaded from CDN in layout
- **Animation Gallery:** `assets/js/animation-gallery.js`
- **Interactive Controls:** Inline scripts in components

## 📊 Performance

### Optimization Features
- **Compressed CSS:** Sass compression enabled
- **Optimized Images:** Responsive images with proper sizing
- **Minimal JavaScript:** Only load what's needed per page
- **CDN Resources:** GSAP loaded from reliable CDN
- **Caching:** GitHub Pages provides automatic caching

### Performance Monitoring
- **Lighthouse Scores:** Target 90+ in all categories
- **Core Web Vitals:** Optimized for Google's metrics
- **Animation Performance:** 60fps animations with GPU acceleration

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-docs`)
3. Make changes in `docs/` directory
4. Test locally with `bundle exec jekyll serve`
5. Commit changes with descriptive messages
6. Push to your fork and create Pull Request
7. Automatic deployment on merge to main

### Content Guidelines
- **Markdown:** Use standard Markdown with Jekyll extensions
- **Code Examples:** Include syntax highlighting
- **Images:** Optimize for web, use descriptive alt text
- **Links:** Use relative URLs for internal links
- **SEO:** Include meta descriptions and proper headings

### Code Standards
- **SCSS:** Follow BEM methodology where applicable
- **JavaScript:** ES6+ syntax, proper error handling
- **HTML:** Semantic markup, accessibility considerations
- **Jekyll:** Liquid templating best practices

## 📞 Support

For questions about the documentation site:

- **Technical Issues:** Create GitHub issue
- **Content Updates:** Submit Pull Request
- **Design Questions:** Contact development team
- **General Inquiries:** info@cubatattoostudio.com

## 📄 License

This documentation is part of the Cuba Tattoo Studio website project. All rights reserved.

---

**Cuba Tattoo Studio** - *Premium Tattoo Artistry in Albuquerque, NM*

🌐 [Main Website](https://cubatattoostudio.com) | 📚 [Documentation](https://docs.cubatattoostudio.com) | 📱 [Instagram](https://instagram.com/cubatattoostudio)