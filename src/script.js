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