"use strict";

console.log("runs");

document.addEventListener("DOMContentLoaded", () => {
  /* Lenis */

  const lenis = new Lenis();

  lenis.on("scroll", (e) => {
    // console.log(e)
    const logo = document.querySelector('.logo');
    if (logo) {
      if (e.scroll > 100) {
        logo.classList.add('scrolled');
      } else {
        logo.classList.remove('scrolled');
      }
    }
  });

  // Parallax effects for artist sections
  function initParallaxEffects() {
    const parallaxItems = document.querySelectorAll('.parallax-item');
    
    parallaxItems.forEach(item => {
      const speed = parseFloat(item.dataset.speed) || 0.1;
      
      gsap.to(item, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  // Artist sections animations
  function initArtistAnimations() {
    const artistSections = document.querySelectorAll('.artist-section');
    
    artistSections.forEach((section, index) => {
      const artistInfo = section.querySelector('.artist-info');
      const artistGallery = section.querySelector('.artist-gallery');
      const parallaxItems = section.querySelectorAll('.parallax-item');
      
      // Animate artist info on scroll
      gsap.fromTo(artistInfo, 
        {
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
      
      // Animate gallery items with stagger
      gsap.fromTo(parallaxItems,
        {
          y: 100,
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: artistGallery,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }

  // Artists intro animation
  function initArtistsIntroAnimation() {
    const artistsIntro = document.querySelector('.artists-intro');
    if (artistsIntro) {
      const title = artistsIntro.querySelector('h2');
      const subtitle = artistsIntro.querySelector('p');
      
      gsap.fromTo([title, subtitle],
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          stagger: 0.3,
          scrollTrigger: {
            trigger: artistsIntro,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }

  // Initialize all artist animations
  initParallaxEffects();
  initArtistAnimations();
  initArtistsIntroAnimation();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Gsap from here

  gsap.registerPlugin(ScrollTrigger, Flip);

  const grid = document.querySelector(".grid");
  const backy = document.querySelector(".backy");
  const gridItems = document.querySelectorAll(".grid-item");

  let flipCtx;

  function anim() {
    console.log("anim function");
    flipCtx && flipCtx.revert();
    flipCtx = gsap.context(() => {
      gridItems.forEach((item) => {
        item.classList.add("final-state");
      });
      grid.classList.add("final-state");
      backy.classList.add("final-state");

      const state = Flip.getState([grid, gridItems, backy], {
        props: "opacity, backgroundColor"
      });

      grid.classList.remove("final-state");
      backy.classList.remove("final-state");
      gridItems.forEach((item) => item.classList.remove("final-state"));

      const tl = Flip.to(state, {
        ease: "none",
        absolute: true,
        scale: true,
        scrollTrigger: {
          trigger: ".height",
          start: "50vh center",
          end: "bottom bottom",
          scrub: 1
        }
      });

      return () => gsap.set([grid, gridItems, backy], { clearProps: "all" });
    });
  }
  anim();

  window.addEventListener("resize", anim);
});