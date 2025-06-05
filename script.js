document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    // Initialize ScrollSmoother
    // First, ensure #wrapper and #content exist and are correctly set up in HTML for ScrollSmoother.
    // The #content element should be the direct child of #wrapper that contains the scrollable content.
    // In our current HTML, #content is inside #wrapper, but it's a <main> element.
    // The structure is body > #wrapper > main#content. This should be fine.
    if (document.getElementById('wrapper') && document.getElementById('content')) {
        const smoother = ScrollSmoother.create({
            wrapper: '#wrapper', // The outer container
            content: '#content', // The scrollable content
            smooth: 1.5, // How much to smooth the scroll (1 is default, higher is smoother)
            effects: true, // Enable GSAP effects like data-speed and data-lag
            normalizeScroll: true, // Normalizes touch scrolling text on mobile devices
        });

        // Example of smoother.effects() for parallax on gallery images
        // Add data-speed or data-lag attributes to HTML elements for this to work.
        // e.g., <img src="..." data-speed="0.8"> for a parallax effect.
        // We can apply this to gallery items if they are direct children of a container that ScrollSmoother is aware of.
        // Or, create specific ScrollTriggers for them.

        // SplitText animation for the hero section heading
        const heroHeading = document.querySelector('#hero h2');
        if (heroHeading) {
            const split = new SplitText(heroHeading, { type: 'chars, words' });
            gsap.from(split.chars, {
                duration: 0.8,
                opacity: 0,
                scale: 0,
                y: 80,
                rotationX: 180,
                transformOrigin: '0% 50% -50',
                ease: 'back',
                stagger: 0.05,
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top center', // When the top of #hero hits the center of the viewport
                    // toggleActions: 'play none none none' // Play animation once
                }
            });
        }

        // The data-speed attributes on .gallery-item elements in HTML will be automatically
        // handled by ScrollSmoother's effects:true option to create parallax effects.
        // No additional JavaScript is needed for that specific data-speed parallax.
        // The previous custom gallery image animation (yPercent) is removed to avoid conflict
        // and rely on the cleaner data-speed approach.

        // Example animation for artist profiles appearing on scroll
        const artistProfiles = gsap.utils.toArray('.artist-profile');
        artistProfiles.forEach(profile => {
            gsap.from(profile, {
                duration: 0.5,
                opacity: 0,
                y: 50,
                scale: 0.9,
                ease: 'power1.out',
                scrollTrigger: {
                    trigger: profile,
                    start: 'top 80%', // When the top of the profile is 80% from the top of the viewport
                    // toggleActions: 'play none none reset' // Play on enter, reset if it goes back
                }
            });
        });

        // Add a class to header on scroll
        const header = document.getElementById('main-header');
        if(header){
            ScrollTrigger.create({
                start: "top -80", // When scrolling down 80px
                end: 99999,
                toggleClass: {className: "scrolled", targets: header}
            });
        }


    } else {
        console.error('ScrollSmoother target elements (#wrapper or #content) not found.');
    }

    // Note: The CodePen example might have more specific animations.
    // This script provides a foundation with ScrollSmoother, ScrollTrigger, and SplitText.
    // Further adaptations would depend on the exact animations from the CodePen.

    // Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
