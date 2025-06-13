# Cuba Tattoo Studio Website

## 🧠 Project Context
This is the official website for **Cuba Tattoo Studio**, a highly visual and immersive landing page. It features animated scroll, videos, theme-based design, and storytelling. Each artist will be presented in a personalized section reflecting their tattoo style, personality, and aesthetic — all within a single scrollable page.

## 🚀 Chosen Stack
- **Main Framework:** Astro (ultrafast static site generator)
- **Languages:** HTML, CSS (Tailwind or CSS Modules), JavaScript (for animations)
- **Deployment:** Cloudflare Pages
- **Version Control:** GitHub
- **Domain:** cubatattoostudio.com

## 🎯 Frontend Goals
1. High-impact, animated landing page
2. Dark, elegant, modern, artistic design (inspired by Awwwards)
3. One-page layout, scrollable artist sections with custom video, images, and text
4. Smooth, professional animations (in the style of GTA VI)
5. Easy content management and future automation
6. Optimized asset loading (images, videos)
7. Solid base for future enhancements

## 📁 Suggested Project Structure
```
/
├── public/
├── src/
│   ├── components/
│   ├── content/artists/
│   ├── layouts/
│   ├── pages/
│   │   └── index.astro
│   └── scripts/
├── astro.config.mjs
└── tailwind.config.js
```

## 🧩 Artist Content (.md example)
```markdown
---
name: "Meli Ink"
slug: "meli-ink"
style: "Blackwork & Fine Line"
video: "/videos/meli.mp4"
images:
  - "/images/meli-1.jpg"
  - "/images/meli-2.jpg"
description: |
  Meli specializes in fine lines and dark compositions.
  Her art reflects precision and personality.
---
```

## 🧙 Key Libraries & Tools
- GSAP + ScrollTrigger (advanced animations)
- Locomotive Scroll (smooth scrolling with parallax)
- AOS (optional simple scroll animations)
- astro:content (content collection management)
- @astrojs/cloudflare (for deployment)

## ✅ Best Practices
- Keep animations separated in dedicated scripts
- Use optimized media assets
- Don’t hardcode content into HTML/JSX
- Use `astro:content` for dynamic rendering

## 🧠 Future Automation
- Markdown files for each artist make it easy to auto-generate sections later
- Content can be managed from a CMS or generated from backend logic

## 🧯 Pitfalls to Avoid
- Avoid inline content/data in code
- Avoid uncompressed assets (always lazy-load)
- Keep animation logic modular and clean

## 🔧 Suggested Development Phases

**Phase 1 – Technical Setup**
- [ ] Initialize Astro project
- [ ] Integrate Tailwind CSS (optional)
- [ ] Configure Cloudflare Pages

**Phase 2 – Layout & Structure**
- [ ] Design main layout and hero section
- [ ] Build reusable `ArtistSection.astro` component
- [ ] Load artist example from markdown

**Phase 3 – Animations & Style**
- [ ] Implement scroll-based animations (GSAP or Locomotive)
- [ ] Add video/image transitions
- [ ] Customize sections per artist

**Phase 4 – Production Prep**
- [ ] Optimize media
- [ ] Basic SEO
- [ ] Connect to cubatattoostudio.com domain

## 👤 Project Owner
**Josmar Terrero**  
GitHub: https://github.com/terrerovgh  
Website: https://cubatattoostudio.com