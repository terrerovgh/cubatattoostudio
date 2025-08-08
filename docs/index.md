---
layout: reactbits
title: Cuba Tattoo Studio Design System
description: Professional tattoo studio design system with animated components and modern UI patterns
hide_sidebar: true
---

<div class="hero" data-animate="fadeIn">
  <div class="hero-background">
    <div class="hero-gradient"></div>
  </div>
  
  <div class="hero-content">
    <div class="hero-badge" data-animate="scaleIn">
      <span class="badge-text">✨ Design System v2.1</span>
    </div>
    
    <h1 class="hero-title" data-animate="slideInLeft">
      Build Beautiful
      <span class="text-gradient">Tattoo Experiences</span>
    </h1>
    
    <p class="hero-description" data-animate="slideInRight">
      A comprehensive design system for modern tattoo studios. Create stunning, 
      animated interfaces with our collection of components, patterns, and guidelines.
    </p>
    
    <div class="hero-actions" data-animate="fadeIn">
      <a href="{{ '/getting-started/' | relative_url }}" class="btn-primary">
        Get Started
        <svg class="btn-icon" width="16" height="16" viewBox="0 0 16 16">
          <path fill="currentColor" d="M8.22 2.97a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.44 8.5H2.75a.75.75 0 0 1 0-1.5h8.69L8.22 4.03a.75.75 0 0 1 0-1.06Z"/>
        </svg>
      </a>
      
      <a href="{{ '/animation-gallery/' | relative_url }}" class="btn-secondary">
        View Gallery
      </a>
    </div>
    
    <div class="hero-stats" data-animate="fadeIn">
      <div class="stat-item">
        <div class="stat-number">50+</div>
        <div class="stat-label">Components</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-number">100+</div>
        <div class="stat-label">Animations</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-number">∞</div>
        <div class="stat-label">Possibilities</div>
      </div>
    </div>
  </div>
</div>

<section class="features-section">
  <div class="container">
    <div class="section-header" data-animate="fadeIn">
      <h2 class="section-title">Why Choose Cuba Design System?</h2>
      <p class="section-description">
        Built specifically for tattoo studios, our design system combines 
        artistic flair with modern web technologies.
      </p>
    </div>
    
    <div class="features-grid">
      <div class="feature-card" data-animate="slideInLeft">
        <div class="feature-icon">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path fill="currentColor" d="M16 2L20 12L30 16L20 20L16 30L12 20L2 16L12 12L16 2Z"/>
          </svg>
        </div>
        <h3 class="feature-title">Animated Components</h3>
        <p class="feature-description">
          Over 50 pre-built components with smooth GSAP animations 
          that bring your tattoo studio to life.
        </p>
      </div>
      
      <div class="feature-card" data-animate="fadeIn">
        <div class="feature-icon">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path fill="currentColor" d="M8 4V28L24 16L8 4Z"/>
          </svg>
        </div>
        <h3 class="feature-title">Performance First</h3>
        <p class="feature-description">
          Optimized for speed and accessibility, ensuring your 
          clients have the best experience possible.
        </p>
      </div>
      
      <div class="feature-card" data-animate="slideInRight">
        <div class="feature-icon">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <path fill="currentColor" d="M16 8C12.69 8 10 10.69 10 14S12.69 20 16 20 22 17.31 22 14 19.31 8 16 8ZM16 2C21.52 2 26 6.48 26 12C26 20.25 16 30 16 30S6 20.25 6 12C6 6.48 10.48 2 16 2Z"/>
          </svg>
        </div>
        <h3 class="feature-title">Studio Focused</h3>
        <p class="feature-description">
          Designed specifically for tattoo studios with components 
          for portfolios, bookings, and artist showcases.
        </p>
      </div>
    </div>
  </div>
</section>

<section class="showcase-section">
  <div class="container">
    <div class="section-header" data-animate="fadeIn">
      <h2 class="section-title">Component Showcase</h2>
      <p class="section-description">
        Explore our collection of beautifully crafted components.
      </p>
    </div>
    
    <div class="component-preview-grid">
      <div class="component-preview-card" data-animate="scaleIn">
        <div class="preview-header">
          <h3 class="preview-title">Button Components</h3>
          <span class="preview-badge">Interactive</span>
        </div>
        <div class="preview-demo">
          <button class="btn-primary">Primary Button</button>
          <button class="btn-secondary">Secondary</button>
          <button class="btn-ghost">Ghost Button</button>
        </div>
        <a href="{{ '/components/buttons/' | relative_url }}" class="preview-link">
          View Documentation →
        </a>
      </div>
      
      <div class="component-preview-card" data-animate="scaleIn">
        <div class="preview-header">
          <h3 class="preview-title">Card Layouts</h3>
          <span class="preview-badge">Responsive</span>
        </div>
        <div class="preview-demo">
          <div class="demo-card">
            <div class="demo-card-header"></div>
            <div class="demo-card-content">
              <div class="demo-line"></div>
              <div class="demo-line short"></div>
            </div>
          </div>
        </div>
        <a href="{{ '/components/cards/' | relative_url }}" class="preview-link">
          View Documentation →
        </a>
      </div>
      
      <div class="component-preview-card" data-animate="scaleIn">
        <div class="preview-header">
          <h3 class="preview-title">Animation Gallery</h3>
          <span class="preview-badge">GSAP Powered</span>
        </div>
        <div class="preview-demo">
          <div class="demo-animation">
            <div class="demo-particle"></div>
            <div class="demo-particle"></div>
            <div class="demo-particle"></div>
          </div>
        </div>
        <a href="{{ '/animation-gallery/' | relative_url }}" class="preview-link">
          View Gallery →
        </a>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <div class="cta-content" data-animate="fadeIn">
      <h2 class="cta-title">Ready to Transform Your Studio?</h2>
      <p class="cta-description">
        Join hundreds of tattoo studios using our design system to create 
        exceptional digital experiences.
      </p>
      
      <div class="cta-actions">
        <a href="{{ '/getting-started/' | relative_url }}" class="btn-primary btn-large">
          Start Building Today
        </a>
        <a href="https://github.com/cubatattoostudio" class="btn-secondary btn-large" target="_blank" rel="noopener">
          View on GitHub
        </a>
      </div>
    </div>
  </div>
</section>