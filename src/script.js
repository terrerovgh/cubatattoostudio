// Cuba Tattoo Studio - Animaciones con Anime.js
// Inspirado en el proyecto moto-scroll

// Variables globales
let scrollY = 0;
let tattooMachine = null;
let needle = null;
let inkDrops = null;
let isAnimating = false;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeAnimations();
    setupScrollAnimations();
    setupIntersectionObserver();
    setupHeaderAnimation();
});

// Inicializar elementos del DOM
function initializeElements() {
    tattooMachine = document.getElementById('tattooMachine');
    needle = document.getElementById('needle');
    inkDrops = document.getElementById('inkDrops');
    
    if (!tattooMachine || !needle || !inkDrops) {
        console.error('No se pudieron encontrar todos los elementos necesarios');
        return;
    }
    
    console.log('Elementos inicializados correctamente');
}

// Animaciones iniciales
function initializeAnimations() {
    // Animación de entrada del logo
    anime({
        targets: '.logo-img',
        scale: [0, 1],
        rotate: [0, 360],
        duration: 1500,
        easing: 'easeOutElastic(1, .8)',
        delay: 500
    });
    
    // Animación de entrada del título
    anime({
        targets: '.hero-title',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 1200,
        easing: 'easeOutQuart',
        delay: 800
    });
    
    // Animación de entrada del subtítulo
    anime({
        targets: '.hero-subtitle',
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuart',
        delay: 1000
    });
    
    // Animación de entrada de la máquina de tatuar
    anime({
        targets: '.tattoo-machine',
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 1500,
        easing: 'easeOutElastic(1, .6)',
        delay: 600
    });
}

// Configurar animaciones basadas en scroll
function setupScrollAnimations() {
    let ticking = false;
    
    function updateAnimations() {
        scrollY = window.pageYOffset;
        
        // Calcular el progreso del scroll (0 a 1)
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        
        // Animaciones de la máquina de tatuar basadas en scroll
        animateTattooMachine(scrollProgress);
        
        // Animaciones de la aguja
        animateNeedle(scrollProgress);
        
        // Animaciones de las gotas de tinta
        animateInkDrops(scrollProgress);
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Animar la máquina de tatuar
function animateTattooMachine(scrollProgress) {
    if (!tattooMachine) return;
    
    // Vibración basada en el scroll
    const vibrationIntensity = scrollProgress * 10;
    const vibrationX = Math.sin(Date.now() * 0.02) * vibrationIntensity;
    const vibrationY = Math.cos(Date.now() * 0.025) * vibrationIntensity;
    
    // Rotación sutil
    const rotation = scrollProgress * 15 - 7.5; // -7.5 a 7.5 grados
    
    // Escala que cambia con el scroll
    const scale = 1 + (scrollProgress * 0.2);
    
    // Aplicar transformaciones
    tattooMachine.style.transform = `
        translate(${vibrationX}px, ${vibrationY}px) 
        rotate(${rotation}deg) 
        scale(${scale})
    `;
    
    // Cambiar el filtro para simular intensidad
    const glowIntensity = scrollProgress * 30 + 20;
    tattooMachine.style.filter = `
        drop-shadow(0 0 ${glowIntensity}px rgba(255, 119, 48, 0.3))
        drop-shadow(0 0 ${glowIntensity * 2}px rgba(120, 119, 198, 0.2))
        contrast(${1.2 + scrollProgress * 0.3})
        brightness(${1.1 + scrollProgress * 0.2})
    `;
}

// Animar la aguja
function animateNeedle(scrollProgress) {
    if (!needle) return;
    
    // Movimiento de entrada y salida de la aguja
    const needleMovement = Math.sin(scrollProgress * Math.PI * 8) * 10;
    const needleScale = 1 + Math.abs(Math.sin(scrollProgress * Math.PI * 6)) * 0.3;
    
    // Vibración de alta frecuencia
    const highFreqVibration = Math.sin(Date.now() * 0.1) * 2;
    
    needle.style.transform = `
        translateY(${needleMovement + highFreqVibration}px) 
        scaleY(${needleScale})
    `;
    
    // Cambiar opacidad basada en el movimiento
    const opacity = 0.7 + Math.abs(needleMovement) * 0.03;
    needle.style.opacity = Math.min(opacity, 1);
}

// Animar las gotas de tinta
function animateInkDrops(scrollProgress) {
    if (!inkDrops) return;
    
    // Mostrar gotas cuando la aguja está "trabajando"
    const needleActivity = Math.abs(Math.sin(scrollProgress * Math.PI * 8));
    
    if (needleActivity > 0.7 && scrollProgress > 0.1) {
        // Mostrar gota
        inkDrops.style.opacity = needleActivity;
        inkDrops.style.transform = `
            translateX(-50%) 
            scale(${0.5 + needleActivity * 0.5})
        `;
        
        // Crear efecto de goteo ocasional
        if (Math.random() > 0.95) {
            createInkDrop();
        }
    } else {
        inkDrops.style.opacity = '0';
    }
}

// Crear gotas de tinta que caen
function createInkDrop() {
    const drop = document.createElement('div');
    drop.className = 'falling-ink-drop';
    drop.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        background: #000;
        border-radius: 50%;
        top: 70%;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 10;
    `;
    
    document.querySelector('.tattoo-machine-container').appendChild(drop);
    
    // Animar la caída de la gota
    anime({
        targets: drop,
        translateY: [0, 100],
        opacity: [1, 0],
        scale: [1, 0.3],
        duration: 1500,
        easing: 'easeInQuart',
        complete: function() {
            drop.remove();
        }
    });
}

// Configurar Intersection Observer para animaciones de entrada
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                
                // Animaciones específicas por sección
                if (target.classList.contains('about')) {
                    animateAboutSection();
                } else if (target.classList.contains('artists')) {
                    animateArtistsSection();
                } else if (target.classList.contains('gallery')) {
                    animateGallerySection();
                } else if (target.classList.contains('contact')) {
                    animateContactSection();
                }
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    // Observar secciones
    document.querySelectorAll('.about, .artists, .gallery, .contact').forEach(section => {
        observer.observe(section);
    });
}

// Animaciones de la sección About
function animateAboutSection() {
    anime({
        targets: '.about .section-title',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutQuart'
    });
    
    anime({
        targets: '.about-text p',
        translateX: [-50, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(200),
        easing: 'easeOutQuart'
    });
    
    anime({
        targets: '.sketch-palm, .sketch-music, .sketch-cigar',
        scale: [0, 1],
        rotate: [0, 360],
        opacity: [0, 0.6],
        duration: 1000,
        delay: anime.stagger(300),
        easing: 'easeOutElastic(1, .8)'
    });
}

// Animaciones de la sección Artists
function animateArtistsSection() {
    anime({
        targets: '.artists .section-title',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutQuart'
    });
    
    anime({
        targets: '.artist-card',
        translateY: [100, 0],
        opacity: [0, 1],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutQuart'
    });
    
    anime({
        targets: '.artist-photo',
        scale: [0, 1],
        duration: 600,
        delay: anime.stagger(300, {start: 400}),
        easing: 'easeOutElastic(1, .8)'
    });
}

// Animaciones de la sección Gallery
function animateGallerySection() {
    anime({
        targets: '.gallery .section-title',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutQuart'
    });
    
    anime({
        targets: '.gallery-item',
        scale: [0, 1],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(100),
        easing: 'easeOutElastic(1, .8)'
    });
}

// Animaciones de la sección Contact
function animateContactSection() {
    anime({
        targets: '.contact .section-title',
        translateY: [50, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutQuart'
    });
    
    anime({
        targets: '.contact-info',
        translateX: [-100, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutQuart'
    });
    
    anime({
        targets: '.contact-form',
        translateX: [100, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 200,
        easing: 'easeOutQuart'
    });
}

// Animación del header al hacer scroll
function setupHeaderAnimation() {
    let lastScrollY = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
        
        // Ocultar/mostrar header basado en dirección del scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Animación del botón CTA
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animación de click
            anime({
                targets: ctaButton,
                scale: [1, 0.95, 1],
                duration: 200,
                easing: 'easeOutQuart'
            });
            
            // Aquí puedes agregar la lógica para abrir el formulario de contacto
            document.querySelector('#contacto').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});

// Animación continua de vibración para la máquina (efecto idle)
function startIdleVibration() {
    if (!tattooMachine) return;
    
    anime({
        targets: tattooMachine,
        translateX: [
            {value: 1, duration: 100},
            {value: -1, duration: 100},
            {value: 0, duration: 100}
        ],
        translateY: [
            {value: -0.5, duration: 150},
            {value: 0.5, duration: 150},
            {value: 0, duration: 100}
        ],
        loop: true,
        easing: 'easeInOutSine'
    });
}

// Iniciar vibración idle después de un delay
setTimeout(startIdleVibration, 2000);

// Smooth scrolling para los enlaces de navegación
document.querySelectorAll('.nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Efecto de partículas en el hero
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 119, 48, 0.6);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        hero.appendChild(particle);
        
        // Animar partícula
        anime({
            targets: particle,
            translateY: [0, -100],
            translateX: [0, (Math.random() - 0.5) * 100],
            opacity: [0.6, 0],
            scale: [1, 0],
            duration: Math.random() * 3000 + 2000,
            delay: Math.random() * 2000,
            easing: 'easeOutQuart',
            complete: function() {
                particle.remove();
            }
        });
    }
}

// Crear partículas periódicamente
setInterval(createParticles, 3000);

// Debugging
console.log('🎨 Cuba Tattoo Studio - Animaciones cargadas correctamente');
console.log('📱 Scroll para ver las animaciones de la máquina de tatuar');