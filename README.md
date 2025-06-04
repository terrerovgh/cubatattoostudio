# Cuba Tattoo Studio - Website & Automated Management System

<div align="center">
  <img src="src/assets/logo.svg" alt="Cuba Tattoo Studio Logo" width="400"/>
  <h1>Cuba Tattoo Studio</h1>
  <p><strong>Professional Tattoo Studio & Automated Management System</strong></p>
  <p>Authentic Cuban artistry in Albuquerque, New Mexico</p>
</div>

## Overview

Welcome to the official repository of Cuba Tattoo Studio! This project combines rich Cuban artistic tradition with modern technology to create a unique experience for both our clients and studio management. Our website and management system aim to showcase our artists' work while providing efficient booking and operational tools.

## Features <a name="features"></a>

### Immersive Web Experience
- **Responsive Design** with authentic Cuban visual identity
- **Fluid Animations** using anime.js for a memorable experience
- **Interactive Gallery** with filters by style and artist
- **Smart Forms** with real-time validation

### Intelligent Booking System
- **Integrated Calendar** for appointments and consultations
- **Automated Notifications** via email and SMS
- **Real-time Artist Availability** management
- **Personalized Reminders** for clients

### Advanced Design Collaboration
- **Automated Concept Generation** based on client preferences
- **Style Analysis** and personalized recommendations
- **Digital Visualization** of designs on different body parts
- **Smart Library** of Cuban cultural references

### Efficient Studio Operations
- **Administrative Dashboard** with real-time metrics
- **Automated Inventory Management**
- **Performance Analysis** of artists and services
- **Financial Integration** for billing and payments

## Tech Stack <a name="tech-stack"></a>

### Frontend
- **HTML5** - Semantic and accessible structure
- **CSS3** - Modern styles with CSS variables and Grid/Flexbox
- **JavaScript ES6+** - Interactive functionality
- **anime.js** - Fluid and professional animations

### Backend & Automation
- **n8n** - Visual automation workflows
- **Docker** - Containerization for consistent deployment
- **GitHub Pages** - Frontend MVP hosting

### Automation & Integration
- **Advanced Design Tools** - Automated design assistance
- **Natural Language Processing** - Smart text understanding
- **Image Processing** - Automated image generation and manipulation
- **Content Processing** - Advanced text and image workflows

### Development Tools
- **Git & GitHub** - Version control and collaboration
- **ESLint & Prettier** - Code quality and formatting
- **GitHub Actions** - CI/CD automation
- **GitHub Projects** - Kanban-style project management

## Project Status <a name="project-status"></a>

### Completed
- Initial design system and branding
- Responsive layout structure
- Core animations and interactions
- Basic form validation

### In Progress
- Gallery implementation with filtering
- Artist profiles and portfolios
- Contact form with validation
- Tattoo machine animation

### Next Iterations
- Booking system integration
- Admin dashboard
- Automated design assistant
- Mobile app development

## Installation <a name="installation"></a>

### Prerequisites
- Node.js (v18 or higher)
- Git
- Modern web browser

### Quick Start

```bash
# Clone the repository
git clone https://github.com/terrerovgh/cubatattoostudio.git

# Navigate to project directory
cd cubatattoostudio

# Install dependencies (if using npm packages)
npm install

# Start development server
python3 -m http.server 8000
# or
npx serve src
```

## Usage <a name="usage"></a>

### Development

```bash
# Start local development server
cd src
python3 -m http.server 8000

# Open browser to http://localhost:8000
```

### Testing

```bash
# Run linting
npx eslint src/js/

# Format code
npx prettier --write src/
```

## Project Structure <a name="project-structure"></a>

```
cubatattoostudio/
├── README.md
├── src/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
├── docs/
│   ├── project_rules.md
│   └── design/
└── .github/
    └── workflows/
```

## Roadmap <a name="roadmap"></a>

### Phase 1: MVP Frontend (Current)
- Static website with core functionality
- Responsive design and animations
- Gallery and contact forms
- GitHub Pages deployment

### Phase 2: Backend Integration
- n8n workflow automation
- Database integration
- User authentication
- Booking system

### Phase 3: Advanced Automation
- Automated design generation
- Style recommendations
- Virtual tattoo preview
- Automated customer service

## Contributing <a name="contributing"></a>

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License <a name="license"></a>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Visual Identity

Our design system reflects the rich Cuban cultural heritage:
- **Colors**: Warm earth tones with vibrant accent colors
- **Typography**: Modern fonts with Cuban-inspired elements
- **Imagery**: Authentic Cuban art and cultural references
- **Animations**: Smooth, professional transitions using anime.js

## Documentation

Detailed documentation is available in the `docs/` directory:
- [Project Rules](docs/project_rules.md) - Development guidelines and standards
- [Style Guide](docs/design/style-guide.md) - Visual design guidelines
- [Architecture](docs/architecture/) - System architecture documentation
- [API Documentation](docs/api/) - Backend API reference

## Development Setup

### Prerequisites
- Node.js 18+
- Git
- Code editor (VS Code recommended)
- Modern web browser

### Environment Setup

```bash
# Clone repository
git clone https://github.com/terrerovgh/cubatattoostudio.git
cd cubatattoostudio

# Install dependencies
npm install

# Start development server
npm run dev
```

## Testing

- Unit tests for JavaScript functionality
- Cross-browser compatibility testing
- Performance testing
- Accessibility testing

## Deployment

### MVP Deployment (GitHub Pages)

```bash
# Build and deploy to GitHub Pages
# (Automated through GitHub Actions - coming soon)
```

### Production Deployment (Docker)

```bash
# Build Docker image
docker build -t cubatattoostudio .

# Run container
docker run -p 80:80 cubatattoostudio
```

## Performance

- **Lighthouse Score**: Target 90+ for all metrics
- **Page Load Time**: < 3 seconds
- **Mobile Optimization**: Fully responsive design
- **SEO Optimized**: Semantic HTML and meta tags

## Security

- Input validation on all forms
- HTTPS enforcement
- Secure headers implementation
- Regular dependency updates

## Acknowledgments

- Cuban artistic community for inspiration
- Open source libraries and frameworks
- Development team and contributors

---

<div align="center">
  <p>Made with passion by the Cuba Tattoo Studio team</p>
  <p>Albuquerque, New Mexico</p>
</div>

## Project Management

We use **GitHub Projects** with Kanban methodology:
- **[Main Board](https://github.com/users/terrerovgh/projects/3)** - Tracking all tasks
- **Columns**: Ideas → To Do → In Progress → Done
- **Labels**: Effort (XS, S, M, L, XL), Type (feature, bug, docs), Priority

## Contact

**Cuba Tattoo Studio**
- Location: Albuquerque, New Mexico
- Website: [https://terrerovgh.github.io/cubatattoostudio/](https://terrerovgh.github.io/cubatattoostudio/) (Coming Soon)
- Email: info@cubatattoostudio.com
- Instagram: @cubatattoostudio

## Links

- [Live Demo](https://terrerovgh.github.io/cubatattoostudio/) (Coming Soon)
- [Project Board](https://github.com/users/terrerovgh/projects/3)
- [Documentation](docs/)
- [Style Guide](docs/diseno/guia-estilos.md)

## Project Stats

![GitHub last commit](https://img.shields.io/github/last-commit/terrerovgh/cubatattoostudio)
![GitHub issues](https://img.shields.io/github/issues/terrerovgh/cubatattoostudio)
![GitHub pull requests](https://img.shields.io/github/issues-pr/terrerovgh/cubatattoostudio)
![GitHub stars](https://img.shields.io/github/stars/terrerovgh/cubatattoostudio)

---

<div align="center">
  <p><strong>Cuban Art on Your Skin</strong></p>
  <p><em>Where tradition meets innovation</em></p>
</div>