/**
 * ReactBits Core JavaScript
 * Handles all interactive functionality for the ReactBits design system
 */

class ReactBitsCore {
  constructor() {
    this.isInitialized = false;
    this.customCursor = null;
    this.pageLoader = null;
    this.mobileMenu = null;
    this.themeToggle = null;
    this.searchInput = null;
    this.particles = [];
    
    // Bind methods
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  
  static init() {
    if (!window.reactBitsCore) {
      window.reactBitsCore = new ReactBitsCore();
    }
    return window.reactBitsCore.initialize();
  }
  
  initialize() {
    if (this.isInitialized) return;
    
    console.log('🚀 Initializing ReactBits Core...');
    
    // Initialize components
    this.initializePageLoader();
    this.initializeCustomCursor();
    this.initializeMobileMenu();
    this.initializeThemeToggle();
    this.initializeSearch();
    this.initializeAnimations();
    this.initializeParticles();
    this.initializeScrollEffects();
    
    // Add event listeners
    this.addEventListeners();
    
    this.isInitialized = true;
    console.log('✅ ReactBits Core initialized successfully');
  }
  
  initializePageLoader() {
    this.pageLoader = document.getElementById('pageLoader');
    if (!this.pageLoader) return;
    
    const progressBar = document.getElementById('progressBar');
    const logoPath = this.pageLoader.querySelector('.logo-path');
    
    // Animate logo
    if (logoPath) {
      gsap.fromTo(logoPath, 
        { strokeDasharray: 100, strokeDashoffset: 100 },
        { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }
      );
    }
    
    // Animate progress bar
    if (progressBar) {
      gsap.to(progressBar, {
        width: '100%',
        duration: 2.5,
        ease: 'power2.out',
        onComplete: () => this.hidePageLoader()
      });
    } else {
      // Fallback timeout
      setTimeout(() => this.hidePageLoader(), 2000);
    }
  }
  
  hidePageLoader() {
    if (!this.pageLoader) return;
    
    gsap.to(this.pageLoader, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        this.pageLoader.style.display = 'none';
        this.animatePageEntrance();
      }
    });
  }
  
  animatePageEntrance() {
    const mainContent = document.getElementById('mainContent');
    const header = document.querySelector('.header-main');
    const sidebar = document.getElementById('sidebar');
    
    const tl = gsap.timeline();
    
    if (header) {
      tl.fromTo(header, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
    
    if (sidebar) {
      tl.fromTo(sidebar, 
        { x: -300, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      );
    }
    
    if (mainContent) {
      tl.fromTo(mainContent, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      );
    }
  }
  
  initializeCustomCursor() {
    this.customCursor = document.getElementById('customCursor');
    if (!this.customCursor) return;
    
    // Hide default cursor on interactive elements
    document.body.style.cursor = 'none';
    
    // Set initial cursor position
    gsap.set(this.customCursor, { xPercent: -50, yPercent: -50 });
  }
  
  initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    this.mobileMenu = document.getElementById('mobileNav');
    
    if (!mobileMenuToggle || !this.mobileMenu) return;
    
    mobileMenuToggle.addEventListener('click', () => {
      const isActive = mobileMenuToggle.classList.contains('active');
      
      if (isActive) {
        this.closeMobileMenu();
      } else {
        this.openMobileMenu();
      }
      
      mobileMenuToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !this.mobileMenu.contains(e.target)) {
        this.closeMobileMenu();
        mobileMenuToggle.classList.remove('active');
      }
    });
  }
  
  openMobileMenu() {
    if (!this.mobileMenu) return;
    
    this.mobileMenu.classList.add('active');
    
    gsap.fromTo(this.mobileMenu.querySelectorAll('.mobile-nav-link'), 
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, ease: 'power2.out' }
    );
  }
  
  closeMobileMenu() {
    if (!this.mobileMenu) return;
    
    this.mobileMenu.classList.remove('active');
  }
  
  initializeThemeToggle() {
    this.themeToggle = document.getElementById('themeToggle');
    if (!this.themeToggle) return;
    
    this.themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light');
      
      // Animate theme icon
      gsap.to(this.themeToggle.querySelector('.theme-icon'), {
        rotation: 180,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }
  
  initializeSearch() {
    this.searchInput = document.getElementById('sidebarSearch');
    if (!this.searchInput) return;
    
    // Add keyboard shortcut (Cmd+K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.searchInput.focus();
      }
    });
    
    // Simple search functionality
    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
      
      navLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const listItem = link.closest('.nav-item');
        
        if (text.includes(query) || query === '') {
          listItem.style.display = 'block';
        } else {
          listItem.style.display = 'none';
        }
      });
    });
  }
  
  initializeAnimations() {
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('[data-animate]');
    
    animateElements.forEach(element => {
      const animationType = element.dataset.animate;
      
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        onEnter: () => this.playAnimation(element, animationType)
      });
    });
    
    // Hover animations for cards
    const cards = document.querySelectorAll('.card, .component-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -5,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }
  
  playAnimation(element, type) {
    switch (type) {
      case 'fadeIn':
        gsap.fromTo(element, 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
        break;
      case 'slideInLeft':
        gsap.fromTo(element, 
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );
        break;
      case 'slideInRight':
        gsap.fromTo(element, 
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
        );
        break;
      case 'scaleIn':
        gsap.fromTo(element, 
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
        );
        break;
    }
  }
  
  initializeParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create particle canvas
    const canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    heroSection.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    
    // Animate particles
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      this.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
  }
  
  initializeScrollEffects() {
    // Parallax effect for hero background
    const hero = document.querySelector('.hero');
    if (hero) {
      ScrollTrigger.create({
        trigger: hero,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: self => {
          const y = self.progress * 100;
          gsap.set(hero, { backgroundPosition: `center ${y}px` });
        }
      });
    }
    
    // Progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'scroll-progress';
    progressIndicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 2px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressIndicator);
    
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        progressIndicator.style.width = `${self.progress * 100}%`;
      }
    });
  }
  
  addEventListeners() {
    // Mouse events for custom cursor
    document.addEventListener('mousemove', this.handleMouseMove);
    
    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .interactive');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', this.handleMouseEnter);
      element.addEventListener('mouseleave', this.handleMouseLeave);
    });
    
    // Window resize
    window.addEventListener('resize', this.handleResize);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: target, offsetY: 100 },
            ease: 'power3.inOut'
          });
        }
      });
    });
  }
  
  handleMouseMove(e) {
    if (!this.customCursor) return;
    
    gsap.to(this.customCursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: 'power2.out'
    });
  }
  
  handleMouseEnter(e) {
    if (!this.customCursor) return;
    
    gsap.to(this.customCursor, {
      scale: 1.5,
      duration: 0.2,
      ease: 'power2.out'
    });
  }
  
  handleMouseLeave(e) {
    if (!this.customCursor) return;
    
    gsap.to(this.customCursor, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out'
    });
  }
  
  handleResize() {
    // Refresh ScrollTrigger on resize
    ScrollTrigger.refresh();
  }
  
  // Utility methods
  static utils = {
    // Debounce function
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    // Throttle function
    throttle(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
    
    // Random number between min and max
    random(min, max) {
      return Math.random() * (max - min) + min;
    },
    
    // Linear interpolation
    lerp(start, end, factor) {
      return start + (end - start) * factor;
    }
  };
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReactBitsCore;
} else {
  window.ReactBitsCore = ReactBitsCore;
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ReactBitsCore.init);
} else {
  ReactBitsCore.init();
}