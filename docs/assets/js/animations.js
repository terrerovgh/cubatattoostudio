document.addEventListener('DOMContentLoaded', function() {
  // Fade in hero section
  const hero = document.querySelector('.docs-hero');
  if (hero) {
    hero.style.opacity = 0;
    hero.style.transform = 'translateY(40px)';
    setTimeout(() => {
      hero.style.transition = 'opacity 1.2s cubic-bezier(.77,0,.18,1), transform 1.2s cubic-bezier(.77,0,.18,1)';
      hero.style.opacity = 1;
      hero.style.transform = 'translateY(0)';
    }, 200);
  }

  // GSAP-powered landing page animations
  if (window.gsap) {
    // Hero headline animation
    gsap.from('.hero-title', {
      duration: 1.2,
      y: 60,
      opacity: 0,
      ease: 'power4.out',
      delay: 0.2
    });
    gsap.from('.hero-subtitle', {
      duration: 1.1,
      y: 40,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.5
    });
    gsap.from('.hero-cta', {
      duration: 1,
      scale: 0.8,
      opacity: 0,
      ease: 'back.out(1.7)',
      delay: 0.8
    });
    // Animate hero logo
    gsap.from('.hero-logo', {
      duration: 1.2,
      scale: 0.7,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.1
    });
    // Animate nav links
    gsap.utils.toArray('.docs-nav a').forEach((link, i) => {
      gsap.from(link, {
        duration: 0.7,
        opacity: 0,
        y: 20,
        delay: 1 + i * 0.12
      });
    });
    // Scroll-triggered section reveals
    gsap.utils.toArray('.animated-section').forEach((section, i) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.2 + i * 0.1
      });
    });
    // Portfolio grid hover effect
    document.querySelectorAll('.portfolio-grid img').forEach(img => {
      img.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.08, boxShadow: '0 8px 32px #b91c1c44', duration: 0.3 });
      });
      img.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, boxShadow: '0 2px 12px #b91c1c22', duration: 0.3 });
      });
    });
    // Artist card hover effect
    document.querySelectorAll('.artist-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.04, y: -8, boxShadow: '0 8px 32px #b91c1c44', duration: 0.3 });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, y: 0, boxShadow: '0 2px 12px #b91c1c22', duration: 0.3 });
      });
    });
    // Background effect (subtle animated gradient)
    gsap.to('body', {
      background: 'linear-gradient(120deg, #111111 0%, #232323 100%)',
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }
});
