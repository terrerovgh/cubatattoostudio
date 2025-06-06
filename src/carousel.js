// Carousel functionality for artist work sections
class ArtistCarousel {
    constructor(carouselElement) {
        this.carousel = carouselElement;
        this.track = this.carousel.querySelector('.carousel-track');
        this.slides = this.carousel.querySelectorAll('.carousel-slide');
        this.prevBtn = this.carousel.querySelector('.carousel-btn.prev');
        this.nextBtn = this.carousel.querySelector('.carousel-btn.next');
        this.indicators = this.carousel.querySelectorAll('.indicator');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Set up indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Auto-play carousel
        this.startAutoPlay();
        
        // Pause auto-play on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Initialize first slide
        this.updateCarousel();
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateCarousel();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateCarousel();
    }
    
    goToSlide(slideIndex) {
        this.currentSlide = slideIndex;
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Move track
        const translateX = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Initialize all carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        new ArtistCarousel(carousel);
    });
    
    // Contact form handling
    const contactForm = document.getElementById('booking-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.email || !data.phone || !data.artist || !data.date) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Phone validation (basic)
            const phoneRegex = /^[\d\s\-\(\)\+]+$/;
            if (!phoneRegex.test(data.phone)) {
                alert('Please enter a valid phone number.');
                return;
            }
            
            // Date validation (must be in the future)
            const selectedDate = new Date(data.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate <= today) {
                alert('Please select a future date for your appointment.');
                return;
            }
            
            // Show success message
            showSuccessMessage();
            
            // Reset form
            this.reset();
        });
    }
});

// Success message function
function showSuccessMessage() {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Appointment Request Sent!</h3>
            <p>Thank you for your interest! We'll contact you within 24 hours to confirm your appointment.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    // Add styles
    successDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const successContent = successDiv.querySelector('.success-content');
    successContent.style.cssText = `
        background: white;
        padding: 3rem;
        border-radius: 15px;
        text-align: center;
        max-width: 500px;
        margin: 2rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;
    
    const icon = successContent.querySelector('i');
    icon.style.cssText = `
        font-size: 4rem;
        color: #28a745;
        margin-bottom: 1rem;
    `;
    
    const title = successContent.querySelector('h3');
    title.style.cssText = `
        font-size: 2rem;
        color: #333;
        margin-bottom: 1rem;
        font-family: var(--font-display);
    `;
    
    const text = successContent.querySelector('p');
    text.style.cssText = `
        font-size: 1.1rem;
        color: #666;
        margin-bottom: 2rem;
        line-height: 1.6;
    `;
    
    const button = successContent.querySelector('button');
    button.style.cssText = `
        background: #d4af37;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    button.addEventListener('mouseenter', function() {
        this.style.background = '#b8941f';
        this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.background = '#d4af37';
        this.style.transform = 'translateY(0)';
    });
    
    // Add to page
    document.body.appendChild(successDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentElement) {
            successDiv.remove();
        }
    }, 5000);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});