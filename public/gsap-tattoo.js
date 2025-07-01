/**
 * Cuba Tattoo Studio - GSAP Landing JavaScript
 * Sistema principal de animaciones y efectos
 */

// Variables globales
const TattooStudio = {
  isInitialized: false,
  config: {
    backgroundTransitionDuration: 2,
    parallaxStrength: 0.5,
    debugMode: false
  },

  // Inicialización principal
  init() {
    console.log('🎨 Cuba Tattoo Studio - GSAP Landing Effects Initialized');
    
    // Función para verificar y esperar la carga de dependencias
    function waitForDependencies() {
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        console.log('All dependencies loaded, initializing...');
        initStudio();
      } else {
        console.log('Waiting for dependencies...');
        setTimeout(waitForDependencies, 100);
      }
    }
    
    // Esperar a que todos los scripts estén cargados
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', waitForDependencies);
    } else {
      waitForDependencies();
    }
    
    // También intentar después del evento load
    window.addEventListener('load', function() {
      if (!TattooStudio.isInitialized) {
        waitForDependencies();
      }
    });
    
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
  if (TattooStudio.isInitialized) return;
  
  console.log('Initializing Cuba Tattoo Studio...');
  console.log('GSAP available:', typeof gsap !== 'undefined');
  console.log('ScrollTrigger available:', typeof ScrollTrigger !== 'undefined');
  
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded');
    return;
  }
  
  try {
    // Registrar plugins de GSAP
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    if (typeof ScrollToPlugin !== 'undefined') {
      gsap.registerPlugin(ScrollToPlugin);
    }

    // Configuración inicial
    gsap.set("body", { visibility: "visible" });
    
    // Navegación suave
    setupSmoothNavigation();
    
    // Esperar un poco más antes de configurar las animaciones
    setTimeout(function() {
      setupAutoAnimations();
    }, 100);
    
    TattooStudio.isInitialized = true;
    console.log("Cuba Tattoo Studio initialized successfully");
    
    // Disparar evento global para notificar que el estudio está listo
    window.dispatchEvent(new CustomEvent('TattooStudioInitialized'));

  } catch (error) {
    console.error("Error initializing:", error);
  }
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
  // Verificar que GSAP y ScrollTrigger estén disponibles
  if (typeof gsap === 'undefined') {
    console.error('GSAP not available');
    return;
  }

  if (typeof ScrollTrigger === 'undefined') {
    console.error('ScrollTrigger not available');
    return;
  }

  // Elementos con clase .scroll-animate
  var scrollElements = document.querySelectorAll('.scroll-animate');
  console.log('Found scroll elements:', scrollElements.length);
  
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
    
    try {
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
    } catch (error) {
      console.error('Error creating animation for element:', element, error);
    }
  });
  
  console.log("Animation system initialized");
}

// Exponer funciones globalmente
window.TattooStudio = TattooStudio;
window.CubaTattooStudio = {
  init: initStudio,
  get isInitialized() {
    return TattooStudio.isInitialized;
  }
};

// Auto-inicializar
TattooStudio.init();
