import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $activeSection, $currentBackground, $sectionBackgrounds } from '@/store';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollObserver() {
  useEffect(() => {
    let ctx = gsap.context(() => {
      // ─── 1. Section Logic (Backgrounds & Active State) ────────
      const sections = document.querySelectorAll<HTMLElement>('[data-section]');
      const bgMap: Record<string, string> = {};

      sections.forEach((section) => {
        const id = section.dataset.section!;
        const bg = section.dataset.bg;
        if (bg) bgMap[id] = bg;

        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            $activeSection.set(id);
            if (bgMap[id]) $currentBackground.set(bgMap[id]);
          },
          onEnterBack: () => {
            $activeSection.set(id);
            if (bgMap[id]) $currentBackground.set(bgMap[id]);
          },
        });
      });
      $sectionBackgrounds.set(bgMap);

      // ─── 2. Hero Timeline ────────────────────────────────────
      const heroSection = document.querySelector('[data-section="hero"]');
      if (heroSection) {
        const tl = gsap.timeline({ delay: 0.2 });

        const order = ['logo', 'line', 'subtitle', 'cta', 'scroll'] as const;
        order.forEach((name) => {
          const el = heroSection.querySelector(`[data-hero="${name}"]`);
          if (!el) return;

          if (name === 'logo') {
            tl.fromTo(
              el,
              { opacity: 0, scale: 1.3, filter: 'blur(20px)' },
              { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' }
            );
          } else if (name === 'line') {
            tl.fromTo(
              el,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.8, ease: 'power2.inOut' },
              '-=0.3'
            );
          } else if (name === 'scroll') {
            tl.fromTo(el, { opacity: 0 }, { opacity: 0.4, duration: 0.5 }, '-=0.2');
          } else {
            tl.fromTo(
              el,
              { opacity: 0, y: 30, filter: 'blur(8px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' },
              '-=0.3'
            );
          }
        });

        // SVG ornament stroke-dashoffset draw-in
        const ornaments = heroSection.querySelectorAll('.hero-ornament path');
        if (ornaments.length > 0) {
          ornaments.forEach((path) => {
            const len = (path as SVGPathElement).getTotalLength?.() || 200;
            gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          });
          tl.to(
            ornaments,
            { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut', stagger: 0.2 },
            0.5
          );
        }

        // Fade out scroll indicator when user scrolls
        ScrollTrigger.create({
          trigger: heroSection,
          start: 'top top',
          end: '+=100',
          onLeave: () => {
            gsap.to('[data-hero="scroll"]', { opacity: 0, duration: 0.3 });
          },
        });
      }

      // ─── 3. Animate Cards (Batch — fade up) ──────────────────
      const cards = document.querySelectorAll('[data-animate]');
      if (cards.length > 0) {
        gsap.set(cards, {
          opacity: 0,
          y: 60,
          scale: 0.95,
          filter: 'blur(10px)',
          transition: 'none',
        });

        ScrollTrigger.batch(cards, {
          start: 'top 90%',
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          },
          once: true,
        });
      }

      // ─── 4. Animate Headings ──────────────────────────────────
      const headings = document.querySelectorAll('[data-animate-heading]');
      if (headings.length > 0) {
        gsap.set(headings, {
          opacity: 0,
          y: 40,
          filter: 'blur(8px)',
          transition: 'none',
        });

        ScrollTrigger.batch(headings, {
          start: 'top 85%',
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 1,
              stagger: 0.15,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          },
          once: true,
        });
      }

      // ─── 5. Slide from Sides ─────────────────────────────────
      (['left', 'right'] as const).forEach((dir) => {
        const els = document.querySelectorAll(`[data-animate-${dir}]`);
        if (els.length > 0) {
          gsap.set(els, {
            opacity: 0,
            x: dir === 'left' ? -80 : 80,
            filter: 'blur(6px)',
            transition: 'none',
          });

          ScrollTrigger.batch(els, {
            start: 'top 88%',
            onEnter: (batch) => {
              gsap.to(batch, {
                opacity: 1,
                x: 0,
                filter: 'blur(0px)',
                duration: 0.9,
                stagger: 0.12,
                ease: 'power3.out',
                overwrite: 'auto',
              });
            },
            once: true,
          });
        }
      });

      // ─── 6. Scale Reveal ──────────────────────────────────────
      const scaleEls = document.querySelectorAll('[data-animate-scale]');
      if (scaleEls.length > 0) {
        gsap.set(scaleEls, {
          opacity: 0,
          scale: 0.8,
          filter: 'blur(8px)',
          transition: 'none',
        });

        ScrollTrigger.batch(scaleEls, {
          start: 'top 90%',
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.7,
              stagger: 0.08,
              ease: 'back.out(1.4)',
              overwrite: 'auto',
            });
          },
          once: true,
        });
      }

      // ─── 7. Clip-Path Reveal ──────────────────────────────────
      const clipEls = document.querySelectorAll('[data-animate-clip]');
      if (clipEls.length > 0) {
        gsap.set(clipEls, {
          clipPath: 'inset(15% 15% 15% 15% round 2rem)',
          opacity: 0.3,
          transition: 'none',
        });

        ScrollTrigger.batch(clipEls, {
          start: 'top 85%',
          onEnter: (batch) => {
            gsap.to(batch, {
              clipPath: 'inset(0% 0% 0% 0% round 2rem)',
              opacity: 1,
              duration: 1,
              stagger: 0.15,
              ease: 'power3.out',
              overwrite: 'auto',
            });
          },
          once: true,
        });
      }

      // ─── 8. Stagger Wave (from center) ────────────────────────
      const waveContainers = document.querySelectorAll('[data-stagger-wave]');
      waveContainers.forEach((container) => {
        const items = container.querySelectorAll('[data-wave-item]');
        if (items.length > 0) {
          gsap.set(items, {
            opacity: 0,
            y: 40,
            scale: 0.9,
            transition: 'none',
          });

          ScrollTrigger.create({
            trigger: container,
            start: 'top 85%',
            onEnter: () => {
              gsap.to(items, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.2)',
                stagger: { each: 0.06, from: 'center' },
                overwrite: 'auto',
              });
            },
            once: true,
          });
        }
      });

      // ─── 9. Parallax ─────────────────────────────────────────
      const parallaxEls = document.querySelectorAll<HTMLElement>('[data-parallax]');
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.2');
        gsap.to(el, {
          y: () => speed * ScrollTrigger.maxScroll(window) * -0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      });
    });

    // Force refresh after a delay to account for layout shifts (e.g. images loading)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return null;
}
