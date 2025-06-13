/*
  GSAP Animations for Artist Sections - GTA VI Style
  - Vertical scroll-triggered sections
  - Horizontal pinned galleries
  - Video playback synced to scroll position
*/
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Initialize animations when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Enable smooth scrolling for the whole page
  gsap.to('html, body', {
    scrollBehavior: 'smooth',
    scrollTo: { y: 0 },
    duration: 0.1
  });

  // Cache DOM elements for performance
  const artistSections = document.querySelectorAll(".artist-section");
  
  // Initialize each artist section
  artistSections.forEach((section, index) => {
    const gallery = section.querySelector(".artist-gallery");
    const galleryItems = section.querySelectorAll(".gallery-item");
    const video = section.querySelector(".artist-video");
    const sectionTitle = section.querySelector(".artist-name");
    const scrollIndicator = section.querySelector(".scroll-indicator");
    
    // Skip if no gallery found
    if (!gallery) return;
    
    // 1. Fade in section on enter
    gsap.from(section, {
      opacity: 0,
      y: 100,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        toggleActions: "play none none reverse",
        // markers: true // Enable for debugging
      }
    });
    
    // 2. Create horizontal scroll effect with pinning
    const galleryWidth = gallery.scrollWidth - window.innerWidth + 200; // Extra space
    const galleryTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${galleryWidth}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        // markers: true, // Enable for debugging
        onEnter: () => {
          section.classList.add('active-section');
          if (scrollIndicator) scrollIndicator.classList.add('visible');
        },
        onLeave: () => {
          if (scrollIndicator) scrollIndicator.classList.remove('visible');
        },
        onEnterBack: () => {
          section.classList.add('active-section');
          if (scrollIndicator) scrollIndicator.classList.add('visible');
        },
        onLeaveBack: () => {
          if (scrollIndicator) scrollIndicator.classList.remove('visible');
        }
      }
    });
    
    // Animate gallery horizontal scroll
    galleryTimeline.to(gallery, {
      x: -galleryWidth,
      ease: "none"
    });
    
    // 3. Parallax and fade effects for gallery items
    galleryItems.forEach((item, i) => {
      const direction = i % 2 === 0 ? -1 : 1;
      const distance = 100 * (i % 2 === 0 ? 1 : 0.5);
      
      gsap.fromTo(item,
        { y: distance * direction, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            containerAnimation: galleryTimeline,
            start: () => `left ${(i / galleryItems.length) * 80}%`,
            end: () => `left ${((i + 1) / galleryItems.length) * 100}%`,
            // markers: true // Enable for debugging
          }
        }
      );
    });
    
    // 4. Video playback control
    if (video) {
      let videoPlaying = false;
      let videoScrollTrigger;
      
      // Wait for video metadata to load
      video.addEventListener('loadedmetadata', () => {
        videoScrollTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onUpdate: (self) => {
            // Only play video when section is in view
            if (self.progress > 0.1 && self.progress < 0.9) {
              if (!videoPlaying) {
                video.play().catch(e => console.log("Video play failed:", e));
                videoPlaying = true;
              }
              // Sync video time with scroll progress
              video.currentTime = (self.progress * video.duration) || 0;
            } else if (videoPlaying) {
              video.pause();
              videoPlaying = false;
            }
          },
          // markers: true // Enable for debugging
        });
      });
    }
    
    // 5. Section title animation
    if (sectionTitle) {
      gsap.from(sectionTitle, {
        x: -100,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });
    }
  });
  
  // Refresh ScrollTrigger on window resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
