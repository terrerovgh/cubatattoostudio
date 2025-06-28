/**
 * Cuba Tattoo Studio - GSAP Landing JavaScript
 * Sistema principal de animaciones y efectos
 */

// Variables globales
var isInitialized = false;
var globalBackgroundTl = null;

// Configuración global para efectos adicionales
const TattooStudio = {
  config: {
    backgroundTransitionDuration: 2,
    parallaxStrength: 0.5,
    debugMode: false
  },

  // Inicialización principal
  init() {
    console.log('🎨 Cuba Tattoo Studio - GSAP Landing Effects Initialized');
    
    // Registrar plugin de ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Esperar a que el loading termine
    window.addEventListener('loadingComplete', function() {
      var mainContent = document.getElementById('main-content');
      if (mainContent && typeof gsap !== 'undefined') {
        gsap.to(mainContent, {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          onComplete: function() {
            initStudio();
          }
        });
      }
    });
    
    // Inicializar inmediatamente si ya está cargado
    if (document.readyState === 'complete') {
      initStudio();
    }
  }
};

// Función principal de inicialización
function initStudio() {
  if (isInitialized || typeof gsap === 'undefined') return;
  
  try {
    // Configuración inicial
    gsap.set("body", { visibility: "visible" });
    
    // Configurar ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
        ignoreMobileResize: true
      });
    }
    
    // Inicializar sistema de fondo global
    initGlobalBackground();
    
    // Navegación suave
    setupSmoothNavigation();
    
    // Animaciones automáticas
    setupAutoAnimations();
    
    // Manejar redimensionamiento
    setupResizeHandler();
    
    isInitialized = true;
    console.log("Cuba Tattoo Studio initialized successfully");
    
  } catch (error) {
    console.error("Error initializing:", error);
  }
}

function initGlobalBackground() {
  var bgElements = {
    bwImage: document.querySelector('#global-bg-bw'),
    colorImage: document.querySelector('#global-bg-color'),
    container: document.querySelector('#global-background')
  };

  if (!bgElements.bwImage || !bgElements.colorImage) {
    console.warn("Global background elements not found");
    return;
  }

  // Animación continua de zoom (12 segundos por ciclo)
  gsap.to([bgElements.bwImage, bgElements.colorImage], {
    scale: 1.2,
    duration: 6,
    ease: "power2.inOut",
    yoyo: true,
    repeat: -1,
    repeatDelay: 0
  });

  // Transición continua de color basada en scroll
  var sections = document.querySelectorAll('section, main, div[id]');
  
  sections.forEach(function(section, index) {
    var isEven = index % 2 === 0;
    
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: function() {
          gsap.to(bgElements.colorImage, {
            opacity: isEven ? 0.7 : 0.3,
            duration: 2,
            ease: "power2.inOut"
          });
        },
        onLeave: function() {
          gsap.to(bgElements.colorImage, {
            opacity: 0.5,
            duration: 1,
            ease: "power2.inOut"
          });
        },
        onEnterBack: function() {
          gsap.to(bgElements.colorImage, {
            opacity: isEven ? 0.7 : 0.3,
            duration: 2,
            ease: "power2.inOut"
          });
        },
        onLeaveBack: function() {
          gsap.to(bgElements.colorImage, {
            opacity: 0.5,
            duration: 1,
            ease: "power2.inOut"
          });
        }
      });
    }
  });
  
  console.log("Global background system initialized");
}

function setupSmoothNavigation() {
  document.addEventListener('click', function(e) {
    var target = e.target;
    if (!target) return;
    
    var link = target.closest('a[href^="#"]');
    if (!link) return;
    
    e.preventDefault();
    var href = link.getAttribute('href');
    var targetId = href ? href.substring(1) : null;
    var targetElement = targetId ? document.getElementById(targetId) : null;
    
    if (targetElement && typeof gsap !== 'undefined') {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: targetElement,
          offsetY: 80
        },
        ease: "power2.inOut"
      });
    }
  });
}

function setupAutoAnimations() {
  // Elementos con clase .scroll-animate
  var scrollElements = document.querySelectorAll('.scroll-animate');
  
  scrollElements.forEach(function(element, index) {
    var animationType = element.dataset.animation || 'fadeIn';
    var delay = element.dataset.delay ? parseFloat(element.dataset.delay) : index * 0.1;
    
    var fromVars = {};
    switch(animationType) {
      case 'fadeIn':
        fromVars = { y: 30, opacity: 0 };
        break;
      case 'slideInLeft':
        fromVars = { x: -50, opacity: 0 };
        break;
      case 'slideInRight':
        fromVars = { x: 50, opacity: 0 };
        break;
      case 'scaleIn':
        fromVars = { scale: 0.8, opacity: 0 };
        break;
      default:
        fromVars = { y: 30, opacity: 0 };
    }
    
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(element, fromVars, {
        y: 0,
        x: 0,
        scale: 1,
        opacity: 1,
        duration: 0.8,
        delay: delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse",
          markers: false
        }
      });
    }
  });
  
  console.log("Animation system initialized");
}

function setupResizeHandler() {
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function() {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 250);
  });
}

function refreshAnimations() {
  if (isInitialized && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

// Exponer funciones globalmente
window.TattooStudio = TattooStudio;
window.CubaTattooStudio = {
  refresh: refreshAnimations,
  init: initStudio
};

// Auto-inicializar
TattooStudio.init();
