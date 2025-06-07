// Cuba Tattoo Studio - Animaciones GSAP
// Basado en la plantilla GTA VI, adaptado para temática cubana

// Registrar ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Animación inicial
gsap.from(".hero-main-container", {
  scale: 1.45,
  duration: 2.8,
  ease: "power3.out",
});

gsap.to(".overlay", {
  opacity: 0,
  duration: 2.8,
  ease: "power3.out",
  onComplete: () => {
    document.body.style.overflow = "visible";
    document.body.style.overflowX = "hidden";
  },
});

// Indicador de scroll
const scrollIndicator = document.querySelector(".scroll-indicator");
if (scrollIndicator) {
  const bounceTimeline = gsap.timeline({
    repeat: -1,
    yoyo: true,
  });

  bounceTimeline.to(scrollIndicator, {
    y: 20,
    opacity: 0.6,
    duration: 0.8,
    ease: "power1.inOut",
  });
}

// Timeline principal con ScrollTrigger
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".container",
    scrub: 2,
    pin: true,
    start: "top top",
    end: "+=2000",
    ease: "none",
  },
});

// Configuración inicial del scale
tl.set(".hero-main-container", {
  scale: 1.25,
});

// Transición del contenedor principal
tl.to(".hero-main-container", {
  scale: 1,
  duration: 1,
});

// Fade out del logo principal
tl.to(
  ".hero-main-logo",
  {
    opacity: 0,
    duration: 0.5,
  },
  "<" // inicia al mismo tiempo que la animación anterior
);

// Fade out de la imagen hero
tl.to(
  ".hero-main-image",
  {
    opacity: 0,
    duration: 0.9,
  },
  "<+=0.5"
);

// Cambio de tamaño del background
tl.to(
  ".hero-main-container",
  {
    backgroundSize: "28vh",
    duration: 1.5,
  },
  "<+=0.2"
);

// Transición del texto hero con gradientes cubanos
tl.fromTo(
  ".hero-text",
  {
    backgroundImage: `radial-gradient(
          circle at 50% 200vh,
          rgba(255, 215, 0, 0) 0,
          rgba(139, 0, 0, 0.5) 90vh,
          rgba(0, 39, 118, 0.8) 120vh,
          rgba(32, 31, 66, 0) 150vh
        )`,
  },
  {
    backgroundImage: `radial-gradient(circle at 50% 3.9575vh, rgb(255, 215, 0) 0vh,
     rgb(139, 0, 0) 50.011vh,
      rgb(0, 39, 118) 90.0183vh,
       rgba(32, 31, 66, 0) 140.599vh)`,
    duration: 3,
  },
  "<1.2"
);

// Aparición del logo púrpura (adaptado para Cuba)
tl.fromTo(
  ".hero-text-logo",
  {
    opacity: 0,
    maskImage: `radial-gradient(circle at 50% 145.835%, rgb(0, 0, 0) 36.11%, rgba(0, 0, 0, 0) 68.055%)`,
  },
  {
    opacity: 1,
    maskImage: `radial-gradient(
    circle at 50% 105.594%,
    rgb(0, 0, 0) 62.9372%,
    rgba(0, 0, 0, 0) 81.4686%
  )`,
    duration: 3,
  },
  "<0.2"
);

// Ocultar el contenedor principal
tl.set(".hero-main-container", { opacity: 0 });

// Escalar el primer hero
tl.to(".hero-1-container", { scale: 0.85, duration: 3 }, "<-=3");

// Aplicar máscara al primer hero
tl.set(
  ".hero-1-container",
  {
    maskImage: `radial-gradient(circle at 50% 16.1137vh, rgb(0, 0, 0) 96.1949vh, rgba(0, 0, 0, 0) 112.065vh)`,
  },
  "<+=2.1"
);

// Transición de máscara
tl.to(
  ".hero-1-container",
  {
    maskImage: `radial-gradient(circle at 50% -40vh, rgb(0, 0, 0) 0vh, rgba(0, 0, 0, 0) 80vh)`,
    duration: 2,
  },
  "<+=0.2"
);

// Fade out del logo de texto
tl.to(
  ".hero-text-logo",
  {
    opacity: 0,
    duration: 2,
  },
  "<1.5"
);

// Transición al segundo hero
tl.set(".hero-1-container", { opacity: 0 });
tl.set(".hero-2-container", { visibility: "visible" });

// Fade in del segundo hero
tl.to(".hero-2-container", { opacity: 1, duration: 3 }, "<+=0.2");

// Gradiente final del segundo hero
tl.fromTo(
  ".hero-2-container",
  {
    backgroundImage: `radial-gradient(
          circle at 50% 200vh,
          rgba(255, 215, 0, 0) 0,
          rgba(139, 0, 0, 0.5) 90vh,
          rgba(0, 39, 118, 0.8) 120vh,
          rgba(32, 31, 66, 0) 150vh
        )`,
  },
  {
    backgroundImage: `radial-gradient(circle at 50% 3.9575vh, rgb(255, 215, 0) 0vh,
     rgb(139, 0, 0) 50.011vh,
      rgb(0, 39, 118) 90.0183vh,
       rgba(32, 31, 66, 0) 140.599vh)`,
    duration: 3,
  },
  "<1.2"
);

// Animaciones para la galería
gsap.utils.toArray(".gallery-item").forEach((item, index) => {
  gsap.fromTo(item, 
    {
      opacity: 0,
      y: 100,
      scale: 0.8
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      delay: index * 0.2,
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    }
  );
});

// Animaciones para la sección de contacto
gsap.utils.toArray(".contact-item").forEach((item, index) => {
  gsap.fromTo(item,
    {
      opacity: 0,
      x: index % 2 === 0 ? -100 : 100,
      rotation: index % 2 === 0 ? -5 : 5
    },
    {
      opacity: 1,
      x: 0,
      rotation: 0,
      duration: 1.2,
      delay: index * 0.3,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        end: "bottom 15%",
        toggleActions: "play none none reverse"
      }
    }
  );
});

// Efectos adicionales para temática cubana
// Partículas flotantes (simulando polvo de tinta dorada)
function createInkParticles() {
  const particles = [];
  const colors = ['#FFD700', '#8B0000', '#002776', '#FFFFFF'];
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '5';
    particle.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
    document.body.appendChild(particle);
    particles.push(particle);
    
    gsap.set(particle, {
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 10,
      opacity: 0
    });
    
    gsap.to(particle, {
      y: -10,
      x: `+=${Math.random() * 200 - 100}`,
      opacity: 1,
      rotation: 360,
      duration: Math.random() * 4 + 3,
      repeat: -1,
      delay: Math.random() * 3,
      ease: "none"
    });
  }
}

// Efecto de máquina de tatuar (vibración sutil)
function createTattooMachineEffect() {
  const heroText = document.querySelector('.hero-text');
  if (heroText) {
    gsap.to(heroText, {
      x: "+=2",
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: 5 // Empieza después de las animaciones iniciales
    });
  }
}

// Efecto de cursor personalizado (como aguja de tatuar)
function createCustomCursor() {
  const cursor = document.createElement('div');
  cursor.style.position = 'fixed';
  cursor.style.width = '20px';
  cursor.style.height = '20px';
  cursor.style.background = 'radial-gradient(circle, #FFD700 30%, transparent 30%)';
  cursor.style.borderRadius = '50%';
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '9999';
  cursor.style.transition = 'transform 0.1s ease';
  document.body.appendChild(cursor);
  
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX - 10,
      y: e.clientY - 10,
      duration: 0.1
    });
  });
  
  document.addEventListener('mousedown', () => {
    gsap.to(cursor, { scale: 1.5, duration: 0.1 });
  });
  
  document.addEventListener('mouseup', () => {
    gsap.to(cursor, { scale: 1, duration: 0.1 });
  });
}

// Activar efectos después de la carga inicial
gsap.delayedCall(3, () => {
  createInkParticles();
  createTattooMachineEffect();
  createCustomCursor();
});

// Animación de entrada para títulos de sección
gsap.utils.toArray('h2').forEach(title => {
  gsap.fromTo(title,
    {
      opacity: 0,
      y: 50,
      scale: 0.8
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.5,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: title,
        start: "top 90%",
        end: "bottom 10%",
        toggleActions: "play none none reverse"
      }
    }
  );
});

// Efecto parallax para el fondo
gsap.to(".cuban-particles", {
  yPercent: -50,
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

// Optimización de rendimiento
gsap.config({
  force3D: true,
  nullTargetWarn: false
});