/**
 * Cuba Tattoo Studio - Main JavaScript
 * Implementa todas las funcionalidades interactivas del sitio web
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initNavigation();
    initScrollAnimations();
    initTattooMachineAnimation();
    initGalleryFilters();
    initContactForm();
});

/**
 * Navegación y Header
 * Maneja el comportamiento del menú de navegación y el header
 */
function initNavigation() {
    const header = document.querySelector('header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Toggle del menú móvil
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Accesibilidad: actualizar aria-expanded
            const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
            navToggle.setAttribute('aria-expanded', !expanded);
        });
        
        // Cerrar menú al hacer clic en un enlace (en móvil)
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
}

/**
 * Animaciones al hacer scroll
 * Anima elementos cuando aparecen en el viewport
 */
function initScrollAnimations() {
    // Comprobar si anime.js está disponible
    if (typeof anime === 'undefined') {
        console.warn('anime.js no está cargado. Las animaciones no funcionarán.');
        return;
    }
    
    // Elementos a animar
    const animatedElements = document.querySelectorAll('.fade-in');
    
    // Opciones para el Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Crear el observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar el elemento cuando es visible
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    easing: 'easeOutExpo',
                    duration: 800,
                    delay: entry.target.dataset.delay || 0
                });
                
                // Dejar de observar después de animar
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar todos los elementos
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Animación de la Máquina de Tatuaje
 * Crea una animación interactiva para la máquina de tatuaje en la sección hero
 */
function initTattooMachineAnimation() {
    // Comprobar si anime.js está disponible
    if (typeof anime === 'undefined') {
        console.warn('anime.js no está cargado. La animación de la máquina de tatuaje no funcionará.');
        return;
    }
    
    // Elemento contenedor de la animación
    const machineContainer = document.querySelector('.tattoo-machine-animation');
    
    if (!machineContainer) {
        console.warn('No se encontró el contenedor para la animación de la máquina de tatuaje.');
        return;
    }
    
    // Cargar la imagen SVG de la máquina de tatuar
    fetch('/assets/tattoo-machine.svg')
        .then(response => response.text())
        .then(svgContent => {
            // Insertar el SVG en el contenedor
            machineContainer.innerHTML = svgContent;
            
            // Eliminar cualquier placeholder existente
            const placeholder = document.querySelector('.machine-placeholder');
            if (placeholder) placeholder.remove();
            
            // Iniciar animaciones una vez que el SVG está cargado
            setTimeout(() => {
                // Animación de entrada
                anime({
                    targets: '.tattoo-machine-animation svg',
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 1000,
                    easing: 'easeOutExpo'
                });
                
                // Animación constante de vibración de la máquina
                const machineVibration = anime({
                    targets: '.tattoo-machine-animation svg',
                    translateX: [
                        {value: -1, duration: 50, delay: 0},
                        {value: 1, duration: 50, delay: 0}
                    ],
                    translateY: [
                        {value: -0.5, duration: 50, delay: 25},
                        {value: 0.5, duration: 50, delay: 25}
                    ],
                    easing: 'linear',
                    loop: true,
                    autoplay: false
                });
                
                // Animación de la aguja
                const needleAnimation = anime({
                    targets: '#needle',
                    translateY: [
                        {value: 5, duration: 50},
                        {value: 0, duration: 50}
                    ],
                    easing: 'linear',
                    loop: true,
                    autoplay: false
                });
                
                // Animación de los resortes
                const springAnimation = anime({
                    targets: '#spring',
                    scaleY: [
                        {value: 0.95, duration: 50},
                        {value: 1, duration: 50}
                    ],
                    easing: 'linear',
                    loop: true,
                    autoplay: false
                });
                
                // Interactividad: iniciar/detener animación al hacer hover/click
                machineContainer.addEventListener('mouseenter', () => {
                    machineVibration.play();
                    needleAnimation.play();
                    springAnimation.play();
                });
                
                machineContainer.addEventListener('mouseleave', () => {
                    machineVibration.pause();
                    needleAnimation.pause();
                    springAnimation.pause();
                });
                
                // Para dispositivos táctiles
                machineContainer.addEventListener('click', () => {
                    if (machineVibration.paused) {
                        machineVibration.play();
                        needleAnimation.play();
                        springAnimation.play();
                    } else {
                        machineVibration.pause();
                        needleAnimation.pause();
                        springAnimation.pause();
                    }
                });
                
                // Añadir clase para indicar que está listo para interactuar
                machineContainer.classList.add('ready');
            }, 100);
        })
        .catch(error => {
            console.error('Error al cargar la animación de la máquina de tatuaje:', error);
            // Mostrar un mensaje de error en el placeholder
            const placeholder = document.querySelector('.machine-placeholder');
            if (placeholder) {
                placeholder.textContent = 'No se pudo cargar la animación';
                placeholder.classList.add('error');
            }
        });
}

/**
 * Filtros de Galería
 * Implementa la funcionalidad de filtrado para la galería de tatuajes
 */
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Si no hay botones de filtro o elementos de galería, salir
    if (!filterButtons.length || !galleryItems.length) return;
    
    // Añadir evento de clic a cada botón de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase activa de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase activa al botón clicado
            button.classList.add('active');
            
            // Obtener el valor del filtro
            const filterValue = button.getAttribute('data-filter');
            
            // Filtrar los elementos de la galería
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    // Mostrar con animación
                    anime({
                        targets: item,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        duration: 300,
                        easing: 'easeOutSine'
                    });
                    item.style.display = 'block';
                } else {
                    // Ocultar con animación
                    anime({
                        targets: item,
                        opacity: [1, 0],
                        scale: [1, 0.9],
                        duration: 300,
                        easing: 'easeOutSine',
                        complete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
    
    // Activar el filtro "todos" por defecto
    const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilter) allFilter.click();
}

/**
 * Formulario de Contacto
 * Maneja la validación y envío del formulario de contacto
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar el formulario
        const isValid = validateForm(contactForm);
        
        if (isValid) {
            // Simulación de envío (para el MVP)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Cambiar el texto del botón y deshabilitarlo
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Simular una petición de red
            setTimeout(() => {
                // Mostrar mensaje de éxito
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
                
                // Insertar mensaje después del formulario
                contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                
                // Resetear el formulario
                contactForm.reset();
                
                // Restaurar el botón
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Animar mensaje de éxito
                anime({
                    targets: successMessage,
                    opacity: [0, 1],
                    translateY: [10, 0],
                    duration: 800,
                    easing: 'easeOutExpo'
                });
                
                // Ocultar mensaje después de un tiempo
                setTimeout(() => {
                    anime({
                        targets: successMessage,
                        opacity: [1, 0],
                        translateY: [0, -10],
                        duration: 800,
                        easing: 'easeInExpo',
                        complete: () => {
                            successMessage.remove();
                        }
                    });
                }, 5000);
            }, 1500);
        }
    });
    
    // Validación en tiempo real
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
}

/**
 * Valida un campo de formulario individual
 * @param {HTMLElement} input - El campo a validar
 * @returns {boolean} - Si el campo es válido
 */
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Eliminar mensaje de error anterior si existe
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Validar según el tipo de campo
    switch(input.id) {
        case 'name':
            if (value === '') {
                isValid = false;
                errorMessage = 'Por favor, introduce tu nombre';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, introduce un email válido';
            }
            break;
            
        case 'phone':
            // Opcional, pero si se proporciona debe ser válido
            if (value !== '') {
                const phoneRegex = /^[0-9\+\-\s]{9,15}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, introduce un teléfono válido';
                }
            }
            break;
            
        case 'message':
            if (value === '') {
                isValid = false;
                errorMessage = 'Por favor, introduce tu mensaje';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Tu mensaje es demasiado corto';
            }
            break;
    }
    
    // Mostrar error si no es válido
    if (!isValid) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        input.parentNode.appendChild(errorElement);
        input.classList.add('invalid');
    } else {
        input.classList.remove('invalid');
    }
    
    return isValid;
}

/**
 * Valida todo el formulario
 * @param {HTMLFormElement} form - El formulario a validar
 * @returns {boolean} - Si el formulario es válido
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
        const isInputValid = validateInput(input);
        if (!isInputValid) isFormValid = false;
    });
    
    return isFormValid;
}