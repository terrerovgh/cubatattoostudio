import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $activeSection, $currentBackground, $sectionBackgrounds } from '@/store';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollObserver() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll<HTMLElement>('[data-section]');

      const bgMap: Record<string, string> = {};
      sections.forEach((section) => {
        const id = section.dataset.section!;
        const bg = section.dataset.bg;
        if (bg) bgMap[id] = bg;
      });
      $sectionBackgrounds.set(bgMap);

      sections.forEach((section) => {
        const id = section.dataset.section!;

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

      // Animate elements with staggered Liquid Glass entrance
      const cards = document.querySelectorAll('[data-animate]');
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 50,
            scale: 0.95,
            filter: 'blur(10px)',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1,
            delay: index * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Animate section headings
      const headings = document.querySelectorAll('[data-animate-heading]');
      headings.forEach((heading) => {
        gsap.fromTo(
          heading,
          {
            opacity: 0,
            y: 30,
            filter: 'blur(6px)',
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
