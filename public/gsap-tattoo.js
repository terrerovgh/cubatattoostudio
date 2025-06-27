// Cuba Tattoo Studio - GSAP JavaScript Animations
// Animaciones especializadas para el estudio de tatuajes

$(document).ready(function() {
  
  // Registrar ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Variables globales
  let isNavOpen = false;
  
  // ========== ANIMACIONES DE CARGA INICIAL ==========
  
  // Timeline principal para la animación de entrada
  const mainTimeline = gsap.timeline();
  
  // Animación del logo
  mainTimeline.from("#logo", {
    duration: 1.2,
    y: -50,
    opacity: 0,
    ease: "power3.out"
  });
  
  // Animación del menú
  mainTimeline.from("#Navbar", {
    duration: 1,
    y: -50,
    opacity: 0,
    ease: "power3.out"
  }, "-=0.8");
  
  // Animación del título principal
  mainTimeline.from(".landingPage section h1 span", {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: "power4.out"
  }, "-=0.5");
  
  // Animación de los párrafos
  mainTimeline.from(".landingPage section p span", {
    duration: 1.2,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: "power3.out"
  }, "-=0.8");
  
  // Animación del símbolo decorativo
  mainTimeline.from("#d", {
    duration: 1,
    scale: 0,
    rotation: 180,
    opacity: 0,
    ease: "back.out(1.7)"
  }, "-=0.5");
  
  // Animación del scroll down
  mainTimeline.from("#ScrollDown", {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: "power3.out"
  }, "-=0.3");
  
  // ========== NAVEGACIÓN INTERACTIVA ==========
  
  // Toggle del menú
  $("#Navbar").click(function() {
    const nav = $("nav");
    
    if (!isNavOpen) {
      // Abrir menú
      nav.removeClass("DisplayNone").addClass("show");
      gsap.from("nav a", {
        duration: 0.6,
        x: 50,
        opacity: 0,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2
      });
      $(this).text("Cerrar");
      isNavOpen = true;
    } else {
      // Cerrar menú
      nav.removeClass("show");
      setTimeout(() => {
        nav.addClass("DisplayNone");
      }, 500);
      $(this).text("Menú");
      isNavOpen = false;
    }
  });
  
  // Cerrar menú al hacer click en un enlace
  $("nav a").click(function() {
    $("nav").removeClass("show");
    setTimeout(() => {
      $("nav").addClass("DisplayNone");
    }, 500);
    $("#Navbar").text("Menú");
    isNavOpen = false;
  });
  
  // ========== ANIMACIONES DE SCROLL ==========
  
  // Configuración de cada slide con ScrollTrigger
  const slides = [".slide1", ".slide2", ".slide3", ".slide4", ".artists"];
  
  slides.forEach((slide, index) => {
    // Animación de entrada del contenedor de imagen
    gsap.fromTo(`${slide} #ImageContainer`, {
      scale: 0.8,
      opacity: 0,
      rotation: index % 2 === 0 ? -5 : 5
    }, {
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: slide,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse"
      }
    });
    
    // Animación de la imagen con efecto parallax
    gsap.fromTo(`${slide} #ImageContainer img`, {
      scale: 1.2,
      y: 50
    }, {
      scale: 1,
      y: 0,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: slide,
        start: "top 100%",
        end: "bottom 0%",
        scrub: 1
      }
    });
    
    // Animación del contenido de texto
    gsap.fromTo(`${slide} #slide h1`, {
      x: index % 2 === 0 ? -100 : 100,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: slide,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });
    
    gsap.fromTo(`${slide} #slide p`, {
      x: index % 2 === 0 ? -50 : 50,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      delay: 0.3,
      scrollTrigger: {
        trigger: slide,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });
  });
  
  // ========== EFECTOS ESPECIALES ==========
  
  // Efecto parallax en el símbolo decorativo
  gsap.to("#d", {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: "none"
  });
  
  // Efecto de hover mejorado para las imágenes
  $(".slide1, .slide2, .slide3, .slide4, .artists").each(function() {
    const container = $(this).find("#ImageContainer");
    const img = container.find("img");
    
    container.hover(
      function() {
        gsap.to(img, {
          scale: 1.1,
          rotation: 2,
          duration: 0.6,
          ease: "power2.out"
        });
        gsap.to(container, {
          boxShadow: "0 30px 80px rgba(255, 107, 53, 0.3)",
          duration: 0.6,
          ease: "power2.out"
        });
      },
      function() {
        gsap.to(img, {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          ease: "power2.out"
        });
        gsap.to(container, {
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          duration: 0.6,
          ease: "power2.out"
        });
      }
    );
  });
  
  // ========== ANIMACIÓN DEL CTA ==========
  
  // Animación del botón de call-to-action
  gsap.fromTo("#codeby", {
    y: 100,
    opacity: 0
  }, {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".artists",
      start: "top 50%",
      toggleActions: "play none none reverse"
    }
  });
  
  // Efecto de partículas en el hover del CTA
  $("#codeby a").hover(
    function() {
      gsap.to(this, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    },
    function() {
      gsap.to(this, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  );
  
  // ========== SMOOTH SCROLLING ==========
  
  // Smooth scroll para los enlaces de navegación
  $("nav a").click(function(e) {
    e.preventDefault();
    const targetId = $(this).attr("href");
    
    if (targetId === "#Studio") {
      gsap.to(window, {duration: 1.5, scrollTo: ".slide1", ease: "power2.inOut"});
    } else if (targetId === "#Artists") {
      gsap.to(window, {duration: 1.5, scrollTo: ".artists", ease: "power2.inOut"});
    } else if (targetId === "#Gallery") {
      gsap.to(window, {duration: 1.5, scrollTo: ".slide2", ease: "power2.inOut"});
    } else if (targetId === "#Contact") {
      gsap.to(window, {duration: 1.5, scrollTo: "#codeby", ease: "power2.inOut"});
    }
  });
  
  // ========== CURSOR PERSONALIZADO (OPCIONAL) ==========
  
  // Crear cursor personalizado para desktop
  if (window.innerWidth > 768) {
    const cursor = $('<div class="custom-cursor"></div>');
    $("body").append(cursor);
    
    $("body").css("cursor", "none");
    
    $(document).mousemove(function(e) {
      gsap.to(cursor, {
        duration: 0.2,
        x: e.clientX,
        y: e.clientY,
        ease: "power2.out"
      });
    });
    
    // Agregar estilos para el cursor personalizado
    $("<style>")
      .prop("type", "text/css")
      .html(`
        .custom-cursor {
          width: 20px;
          height: 20px;
          background: #ff6b35;
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          transform: translate(-50%, -50%);
        }
        
        a:hover ~ .custom-cursor,
        button:hover ~ .custom-cursor,
        [role="button"]:hover ~ .custom-cursor {
          transform: translate(-50%, -50%) scale(2);
        }
      `)
      .appendTo("head");
  }
  
  // ========== OPTIMIZACIONES DE RENDIMIENTO ==========
  
  // Pausar animaciones cuando la pestaña no está visible
  document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
      gsap.globalTimeline.pause();
    } else {
      gsap.globalTimeline.resume();
    }
  });
  
  // Refresh ScrollTrigger en resize
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
  
  console.log("🎨 Cuba Tattoo Studio - Animaciones GSAP cargadas correctamente");
});
