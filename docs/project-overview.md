# Project Overview - Cuba Tattoo Studio

## 🎯 Project Vision

Cuba Tattoo Studio's website represents the digital embodiment of a premium tattoo studio located in Albuquerque, New Mexico. The project aims to create a visually stunning, highly performant web experience that showcases the artistry and professionalism of the studio while facilitating seamless customer interactions.

## 🏢 Business Context

### Studio Information
- **Name**: Cuba Tattoo Studio
- **Location**: Albuquerque, New Mexico
- **Established**: 2014
- **Specialization**: High-quality tattoo artistry across multiple styles
- **Target Audience**: Individuals seeking professional, artistic tattoo work

### Business Objectives
1. **Showcase Artistry** - Display high-quality portfolio work
2. **Generate Leads** - Convert visitors into booking appointments
3. **Build Trust** - Establish credibility and professionalism
4. **Improve Discoverability** - Enhance local SEO presence
5. **Streamline Operations** - Automate booking and inquiry processes

## 🎨 Design Philosophy

### Visual Identity
The website employs a **monochromatic design system** that reflects the bold, artistic nature of tattoo culture:

- **Color Palette**: Strictly black and white with grayscale accents
- **Typography**: Bebas Neue for impact, Inter for readability
- **Aesthetic**: Clean, modern, professional with artistic flair

### Animation Strategy
Inspired by **Rockstar Games' GTA VI website**, the site features:

- **Cinematic Loading Sequences** - Immersive entry experience
- **Scroll-Triggered Animations** - GSAP-powered interactions
- **Smooth Transitions** - 60fps performance target
- **Progressive Enhancement** - Graceful degradation without JavaScript

## 🏗️ Technical Architecture

### Technology Stack

#### Frontend Framework
- **Astro 5.x** - Static site generator with islands architecture
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.x** - Utility-first styling
- **GSAP 3.x** - Professional animations

#### Build & Deployment
- **Vite** - Fast development and build tooling
- **Cloudflare Pages** - Edge deployment platform
- **Sharp** - High-performance image optimization
- **Astro Compress** - Asset optimization

#### Development Environment
- **DevContainer** - Consistent development setup
- **Docker** - Containerized development
- **pnpm** - Efficient package management

### Architecture Principles

1. **Performance First** - Optimized for Core Web Vitals
2. **Accessibility** - WCAG 2.1 AA compliance
3. **SEO Optimized** - Schema.org markup and meta optimization
4. **Mobile First** - Responsive design approach
5. **Progressive Enhancement** - Works without JavaScript

## 📱 Site Structure

### Page Hierarchy

```
Cuba Tattoo Studio Website
├── Homepage (/) 
│   ├── Hero Section with Cinematic Animation
│   ├── Featured Artists Preview
│   ├── Portfolio Highlights
│   └── Call-to-Action Sections
├── Artists (/artistas)
│   ├── Artist Grid Overview
│   └── Individual Artist Pages (/artistas/[slug])
│       ├── Artist Biography
│       ├── Specialties & Experience
│       ├── Portfolio Gallery
│       └── Booking CTA
├── Portfolio (/portfolio)
│   ├── Complete Work Gallery
│   ├── Filter by Artist
│   ├── Filter by Style
│   └── Lightbox Viewing
├── Studio Information (/estudio)
│   ├── About Us Section
│   ├── Studio Philosophy
│   ├── Process Overview
│   └── Frequently Asked Questions
└── Booking & Contact (/reservas)
    ├── Appointment Booking Form
    ├── Contact Information
    ├── Studio Location & Map
    └── Social Media Links
```

### Content Strategy

#### Artist Profiles
- **Individual Pages** for each artist
- **Portfolio Galleries** showcasing their best work
- **Specialization Tags** (Japanese, Blackwork, Traditional, etc.)
- **Experience Levels** and background information
- **Direct Booking Links** for preferred artist selection

#### Portfolio Management
- **Filterable Gallery** by artist and style
- **High-Quality Images** with optimization
- **Detailed Descriptions** for each piece
- **Style Categorization** for easy browsing

## 🎯 User Experience Goals

### Primary User Journeys

1. **Discovery Journey**
   - User discovers site through search/social
   - Impressed by visual design and animations
   - Explores portfolio and artist work
   - Books consultation or appointment

2. **Research Journey**
   - User researches tattoo styles and artists
   - Compares different artists' work
   - Reads about studio process and safety
   - Makes informed booking decision

3. **Booking Journey**
   - User ready to book appointment
   - Fills out detailed booking form
   - Receives confirmation and next steps
   - Follows up with studio directly

### Success Metrics

#### Engagement Metrics
- **Time on Site** - Target: 3+ minutes average
- **Pages per Session** - Target: 4+ pages
- **Bounce Rate** - Target: <40%
- **Portfolio Interaction** - High gallery engagement

#### Conversion Metrics
- **Booking Form Completions** - Primary conversion goal
- **Contact Form Submissions** - Secondary conversion
- **Phone Calls Generated** - Offline conversion tracking
- **Social Media Follows** - Brand awareness metric

#### Technical Metrics
- **Page Load Speed** - Target: <2.5s LCP
- **Mobile Performance** - Target: 90+ Lighthouse score
- **Accessibility Score** - Target: 95+ Lighthouse score
- **SEO Performance** - Target: Top 3 local search results

## 🔧 Technical Requirements

### Performance Requirements

#### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: <2.5 seconds
- **First Input Delay (FID)**: <100 milliseconds
- **Cumulative Layout Shift (CLS)**: <0.1

#### Lighthouse Score Targets
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Basic functionality in older browsers

### Accessibility Requirements
- **WCAG 2.1 AA Compliance**
- **Keyboard Navigation** support
- **Screen Reader** compatibility
- **Color Contrast** ratios meeting standards
- **Alternative Text** for all images

## 📊 Analytics & Tracking

### Analytics Implementation
- **Google Analytics 4** - User behavior tracking
- **Google Search Console** - Search performance monitoring
- **Core Web Vitals** - Performance tracking
- **Conversion Tracking** - Form submissions and calls

### Key Performance Indicators (KPIs)

#### Business KPIs
- Monthly booking form submissions
- Phone call conversions
- Email inquiries generated
- Social media engagement growth

#### Technical KPIs
- Average page load times
- Mobile vs desktop performance
- Search engine ranking positions
- Accessibility audit scores

## 🚀 Development Phases

### Phase 1: Foundation (Completed)
- ✅ Project setup and configuration
- ✅ Basic page structure and routing
- ✅ Design system implementation
- ✅ Core component library

### Phase 2: Content & Features (Completed)
- ✅ Artist profiles and portfolio system
- ✅ Booking form implementation
- ✅ SEO optimization and meta tags
- ✅ Responsive design implementation

### Phase 3: Animations & Polish (Completed)
- ✅ GSAP animation system
- ✅ Cinematic homepage experience
- ✅ Scroll-triggered interactions
- ✅ Performance optimization

### Phase 4: Launch & Optimization (Current)
- 🔄 Final testing and QA
- 🔄 Performance monitoring setup
- 🔄 SEO implementation and tracking
- 🔄 Production deployment

## 🎨 Brand Guidelines

### Visual Elements
- **Logo Usage**: Clean, minimal presentation
- **Color Application**: Strict monochromatic palette
- **Typography Hierarchy**: Clear information architecture
- **Image Treatment**: High-contrast, professional photography

### Tone of Voice
- **Professional** yet approachable
- **Confident** in artistic abilities
- **Welcoming** to new clients
- **Educational** about the tattoo process

### Content Principles
- **Quality over Quantity** - Curated, high-impact content
- **Visual Storytelling** - Let the artwork speak first
- **Transparency** - Clear process and pricing information
- **Expertise** - Demonstrate knowledge and experience

## 🔮 Future Enhancements

### Planned Features
- **Online Booking System** - Real-time appointment scheduling
- **Client Portal** - Aftercare instructions and follow-up
- **Artist Availability** - Real-time calendar integration
- **Virtual Consultations** - Video call booking system

### Technical Improvements
- **Progressive Web App** - Offline functionality
- **Advanced Analytics** - Heat mapping and user flow analysis
- **A/B Testing** - Conversion optimization
- **Multilingual Support** - Spanish language option

---

*This project overview serves as the foundational document for understanding the Cuba Tattoo Studio website project. It should be referenced by all team members and stakeholders involved in the project's development and maintenance.*