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

  // Animate nav links
  const navLinks = document.querySelectorAll('.docs-nav a');
  navLinks.forEach((link, i) => {
    link.style.opacity = 0;
    setTimeout(() => {
      link.style.transition = 'opacity 0.7s cubic-bezier(.77,0,.18,1)';
      link.style.opacity = 1;
    }, 400 + i * 120);
  });
});
