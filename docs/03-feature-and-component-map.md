# Feature Implementation & Component Map

This section translates the strategic vision into an actionable plan, detailing the structure, content, and required components for each page of the website. This explicit mapping is designed to ensure autonomous and error-free execution.

## Page-by-Page Blueprint

### Homepage (`/`)
-   **Hero Section**: A full-screen, high-impact visual (subtle video loop or high-res photo) with an animated headline.
-   **Featured Artists**: A horizontal showcase of 2-3 principal artists.
-   **Portfolio Preview**: A curated grid of top works to immediately demonstrate quality and artistic level.
-   **Studio Philosophy**: A short, compelling paragraph about the studio's mission and its commitment to art, safety, and professionalism.
-   **Primary CTA**: A prominent, full-width section near the bottom of the page, urging users to "View Our Work" or "Book a Consultation."

### Portfolio Page (`/portfolio`)
-   **Layout**: A dynamic grid layout is essential to display a large number of images without overwhelming the user.
-   **Filtering**: Must include controls to filter the gallery by **Artist** and **Tattoo Style** (e.g., "Realism," "Traditional," "Fine-Line").
-   **Image View**: Clicking an image should open a high-resolution view in a modal or lightbox, without navigating to a new page, for a seamless user experience.

### Artists Pages (`/artists`)
-   **Main Artists Page (`/artists`)**: A grid of all resident artists, presented with a consistent card-based design. Each card links to the artist's individual profile page.
-   **Individual Artist Profile (`/artists/[artistId]`)**: A dedicated page for each artist containing:
    -   A professional profile photo and a detailed biography covering their style, experience, and artistic philosophy.
    -   A personal portfolio gallery exclusively showcasing their work.
    -   Direct links to their professional social media profiles (primarily Instagram).
    -   A specific CTA to "Book a Consultation with [Artist's Name]."

### The Studio Page (`/studio`)
-   **Content**: Include high-resolution photos and/or a video tour of the studio space, emphasizing cleanliness, ambiance, and professionalism.
-   **Hygiene and Safety**: A dedicated section detailing sterilization procedures, use of disposable materials, and safety protocols.
-   **Studio History/Mission**: The story behind Cubatattoo Studio, helping to create a personal connection with visitors.

### Contact & Booking Page (`/contact`)
-   **Contact Form**: A clean and simple form. Required fields: Name, Email, Phone Number, Preferred Artist (dropdown menu), Tattoo Idea Description (text area), and Reference Image Upload (optional).
-   **Location Information**: An embedded Google Maps, the studio address, phone number, and business hours.
-   **Booking Policy**: A clear summary of the booking process, including deposit requirements, cancellation policy, and consultation procedures.

## Component Mapping Table

This table is the central translation layer between the website's features and the `reactbits.dev` library.

| Page/Feature         | Recommended Component(s) | Rationale/Notes | Dependencies | Source URL |
|----------------------|--------------------------|-----------------|--------------|------------|
| Homepage Hero        | Letter Glitch / FadeIn   | High-impact headline | framer-motion | https://reactbits.dev/animated-content/letter-glitch |
| Portfolio Preview    | Magic Bento / Flying Posters | Modern, interactive grid | framer-motion | https://reactbits.dev/components/magic-bento |
| Portfolio Gallery    | Masonry                  | Mosaic layout for images | react-masonry-css | https://reactbits.dev/components/masonry |
| Artists Grid         | Spotlight Card           | Interactive artist cards | framer-motion | https://reactbits.dev/components/spotlight-card |
| Artist Portfolio     | Carousel                 | Ordered gallery in profile | framer-motion | https://reactbits.dev/components/carousel |
| Global Cursor Effect | Star Border / Splash Cursor | Artistic cursor | framer-motion | https://reactbits.dev/animated-content/star-border |
| Studio Visuals       | Model Viewer             | Immersive 3D/AR (if available) | @google/model-viewer | https://reactbits.dev/components/model-viewer |
