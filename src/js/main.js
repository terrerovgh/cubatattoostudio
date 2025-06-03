/**
 * Cuba Tattoo Studio - Main JavaScript
 * Archivo principal para manejar animaciones e interactividad
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Cuba Tattoo Studio - Sitio web cargado');
    
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
    const header = document.querySelector('.site-header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    // Cambiar estilo del header al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Menú móvil toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Cerrar menú móvil al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
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
    
    // Aquí se implementará la animación de la máquina de tatuaje con anime.js
    // Por ahora, mostraremos un mensaje de placeholder
    const placeholder = document.querySelector('.machine-placeholder');
    if (placeholder) {
        placeholder.textContent = 'Animación de máquina de tatuaje (próximamente)';
    }
    
    // Ejemplo básico de animación para el placeholder
    anime({
        targets: '.machine-placeholder',
        scale: [0.9, 1],
        opacity: [0, 1],
        duration: 1500,
        easing: 'easeOutElastic(1, .5)'
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
            
            // Obtener la categoría a filtrar
            const filterValue = button.getAttribute('data-filter');
            
            // Filtrar los elementos de la galería
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    // Mostrar el elemento con animación
                    if (typeof anime !== 'undefined') {
                        anime({
                            targets: item,
                            opacity: [0, 1],
                            scale: [0.9, 1],
                            duration: 500,
                            easing: 'easeOutSine'
                        });
                    }
                    item.style.display = 'block';
                } else {
                    // Ocultar el elemento
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Activar el filtro 'all' por defecto
    const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilter) allFilter.click();
}

/**
 * Formulario de Contacto
 * Maneja la validación y envío del formulario de contacto
 */
function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validar el formulario
        const isValid = validateForm(contactForm);
        
        if (isValid) {
            // Aquí se implementará el envío del formulario
            // Por ahora, mostraremos un mensaje de éxito simulado
            showFormMessage('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
            contactForm.reset();
        }
    });
    
    // Validación en tiempo real
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });
}

/**
 * Valida un formulario completo
 * @param {HTMLFormElement} form - El formulario a validar
 * @returns {boolean} - True si el formulario es válido, false en caso contrario
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Valida un campo de formulario individual
 * @param {HTMLInputElement|HTMLTextAreaElement} input - El campo a validar
 * @returns {boolean} - True si el campo es válido, false en caso contrario
 */
function validateInput(input) {
    const value = input.value.trim();
    const errorElement = input.parentElement.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';
    
    // Eliminar mensaje de error existente
    if (errorElement) {
        errorElement.remove();
    }
    
    // Validar según el tipo de campo
    if (input.required && value === '') {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    } else if (input.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un email válido';
        }
    } else if (input.id === 'phone' && value !== '') {
        const phoneRegex = /^[0-9\s\-\+\(\)]{9,15}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un número de teléfono válido';
        }
    }
    
    // Mostrar mensaje de error si es necesario
    if (!isValid) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = errorMessage;
        error.style.color = 'var(--color-rojo-cubano)';
        error.style.fontSize = '0.8rem';
        error.style.marginTop = '5px';
        input.parentElement.appendChild(error);
        input.classList.add('invalid');
    } else {
        input.classList.remove('invalid');
    }
    
    return isValid;
}

/**
 * Muestra un mensaje después del envío del formulario
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - El tipo de mensaje ('success' o 'error')
 */
function showFormMessage(message, type) {
    const contactForm = document.querySelector('#contact-form');
    
    if (!contactForm) return;
    
    // Eliminar mensaje existente
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Crear nuevo mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Estilos según el tipo
    if (type === 'success') {
        messageElement.style.backgroundColor = 'rgba(42, 157, 143, 0.1)';
        messageElement.style.color = 'var(--color-verde-palma)';
        messageElement.style.border = '1px solid var(--color-verde-palma)';
    } else {
        messageElement.style.backgroundColor = 'rgba(214, 40, 40, 0.1)';
        messageElement.style.color = 'var(--color-rojo-cubano)';
        messageElement.style.border = '1px solid var(--color-rojo-cubano)';
    }
    
    // Estilos comunes
    messageElement.style.padding = 'var(--spacing-md)';
    messageElement.style.borderRadius = 'var(--border-radius-sm)';
    messageElement.style.marginTop = 'var(--spacing-md)';
    
    // Insertar mensaje después del formulario
    contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
    
    // Animar mensaje si anime.js está disponible
    if (typeof anime !== 'undefined') {
        anime({
            targets: messageElement,
            opacity: [0, 1],
            translateY: [10, 0],
            duration: 500,
            easing: 'easeOutSine'
        });
    }
    
    // Eliminar mensaje después de 5 segundos si es de éxito
    if (type === 'success') {
        setTimeout(() => {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: messageElement,
                    opacity: [1, 0],
                    translateY: [0, -10],
                    duration: 500,
                    easing: 'easeOutSine',
                    complete: () => messageElement.remove()
                });
            } else {
                messageElement.remove();
            }
        }, 5000);
    }
}