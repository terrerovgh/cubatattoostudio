# Feature Implementation & Component Mapping

This section translates strategic vision into actionable plans for AI agents, detailing the structure, content, and required components for each page of cubatattoostudio.com. Explicit mapping ensures autonomous, error-free execution.

## Page-by-Page Blueprint
### Homepage
- **Hero Section:** Full-screen, high-impact visual (video loop or high-res photo) with animated headline.
- **Featured Artists:** Horizontal showcase of 2–3 principal artists.
- **Portfolio Preview:** Curated grid of top works.
- **Studio Philosophy:** Concise statement on art, safety, and professionalism.
- **Primary CTA:** Prominent call to action (e.g., "View Our Work" or "Book a Consultation").

### Portfolio Page
- **Dynamic Grid:** Visually appealing layout for many images.
- **Filtering:** Controls for artist and tattoo style (e.g., Realism, Traditional, Fine-Line).
- **Image Modal:** High-res modal/lightbox for image viewing.

### Artists Pages
- **Main Grid:** Card-based grid of resident artists, each linking to individual profiles.
- **Profile Page:**
  - Professional photo and detailed bio
  - Personal portfolio gallery
  - Social media links (Instagram)
  - CTA for booking with the artist

### Studio Page
- **Studio Tour:** High-res photos or video walkthrough
- **Hygiene & Safety:** Detailed sterilization and safety protocols
- **Studio Story:** Background and mission

### Contact & Booking Page
- **Contact Form:** Standard React form (name, email, phone, preferred artist, tattoo idea, optional image upload)
- **Location Info:** Embedded Google Map, address, phone, hours
- **Booking Policy:** Clear summary of deposit, cancellation, and consultation procedures

## Component Integration Protocol (AIOp)
For each reactbits.dev component:
1. Access the component’s page and select TypeScript/Tailwind tabs.
2. Check and install listed dependencies.
3. Copy code and create a file in `/src/components/react-bits/` (PascalCase).
4. Import and use locally.

## Component Mapping Table
| Page/Feature         | Recommended Component(s) | Rationale/Notes | Dependencies | Source URL |
|----------------------|--------------------------|-----------------|--------------|------------|
| Homepage Hero        | Letter Glitch / FadeIn   | High-impact headline | framer-motion | https://reactbits.dev/animated-content/letter-glitch |
| Portfolio Preview    | Magic Bento / Flying Posters | Modern, interactive grid | framer-motion | https://reactbits.dev/components/magic-bento |
| Portfolio Gallery    | Masonry                  | Mosaic layout for images | react-masonry-css | https://reactbits.dev/components/masonry |
| Artists Grid         | Spotlight Card           | Interactive artist cards | framer-motion | https://reactbits.dev/components/spotlight-card |
| Artist Portfolio     | Carousel                 | Ordered gallery in profile | framer-motion | https://reactbits.dev/components/carousel |
| Global Cursor Effect | Star Border / Splash Cursor | Artistic cursor | framer-motion | https://reactbits.dev/animated-content/star-border |
| Studio Visuals       | Model Viewer             | Immersive 3D/AR (if available) | @google/model-viewer | https://reactbits.dev/components/model-viewer |
