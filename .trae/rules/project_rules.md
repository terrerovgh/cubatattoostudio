---
# Project Rules 

This document provides detailed guidelines specifically tailored for developing the "Cuba Tattoo Studio" frontend website project. Follow these guidelines strictly during development and maintenance.

## 1. Framework and Dependencies

* **Astro Framework:** latest stable release (minimum v4.x)
* **CSS Framework:** Tailwind CSS latest stable release
* **Animation Libraries:** GSAP (GreenSock Animation Platform), GSAP ScrollTrigger, Locomotive Scroll
* **Internationalization:** Astro built-in i18n support
* **Image Management:** Astro Image component

## 2. Development Best Practices

* Clearly separate Astro components into atomic design structures (atoms, molecules, organisms).
* Always prefer statically generated content (SSG) for optimal performance.
* Minimize JavaScript runtime usage, leveraging Astro’s partial hydration capabilities (`client:visible`, `client:idle`).
* Keep dependencies minimal and frequently audited.

## 3. Testing and Quality Assurance

* **Unit Testing:** Use Vitest for comprehensive testing of critical logic.
* **End-to-End Testing:** Implement Playwright for testing key user flows.
* **Accessibility:** Ensure adherence to WCAG AA guidelines; all components must be accessible.

## 4. Performance Standards

* Regularly audit using Lighthouse and Chrome DevTools.
* Aim for minimum Lighthouse scores of 90 in performance, accessibility, best practices.
* Avoid DOM thrashing by strategically batching DOM operations.
* Prioritize hardware-accelerated CSS properties (transform, opacity).

## 5. APIs and Third-party Integrations

* **Google Calendar API:** OAuth integration for bookings.
* **Gemini AI Integration:** Managed via n8n workflows and serverless endpoints.
* Avoid direct browser API calls that impact performance negatively (frequent layout recalculations, synchronous XMLHttpRequests).

## 6. Internationalization (i18n)

* Use Astro’s built-in i18n routes (`/en`, `/es`).
* Clearly separate language-specific content.
* Implement language toggle functionality smoothly without page reloads.

## 7. Animation Guidelines

* Keep animations subtle, meaningful, and performance-focused.
* Always use GSAP with ScrollTrigger for scroll-based animations.
* Lazy-load animations using IntersectionObserver or ScrollTrigger viewport detection.

## 8. Deployment and Monitoring

* Deploy strictly via Cloudflare Pages.
* Configure CDN with effective cache-control strategies.
* Use Sentry for error monitoring and Google Analytics or Plausible for user analytics.

---