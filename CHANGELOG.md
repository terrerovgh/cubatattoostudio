# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Docker support with Dockerfile and docker-compose.yml
- Base components: Button.astro, Heading.astro, ImageOptimized.astro
- Locomotive Scroll dependency for smooth scrolling
- Comprehensive project status report
- TypeScript error fixes for better development experience

### Changed
- Improved GSAP loading system with external scripts
- Enhanced loading screen with minimal spinner design
- Converted all inline scripts to external files for better Astro compatibility

### Fixed
- Vite/Astro LoadPluginContext errors
- TypeScript compilation issues
- Script bundling conflicts with `is:inline` directive

## [1.0.0] - 2025-06-28

### Added
- Initial project setup with Astro 5.9.2
- GSAP animation system with ScrollTrigger
- Tailwind CSS 4.1.9 integration
- Component structure:
  - Layout.astro with global background system
  - HeroSection.astro with animations
  - ServicesSection.astro
  - GallerySection.astro
  - ArtistsSection.astro
  - ContactSection.astro
  - Footer.astro
  - LoadingScreen.astro
- Global animated background system
- Responsive design implementation
- GitHub repository setup

### Technical Details
- Node.js 20+ compatible
- Modern JavaScript/TypeScript support
- Optimized build system
- Performance-focused architecture
