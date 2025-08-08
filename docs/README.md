# 📚 Cuba Tattoo Studio - Documentation Site

> Comprehensive documentation for the Cuba Tattoo Studio website project, hosted at [docs.cubatattoostudio.com](https://docs.cubatattoostudio.com)

## 🎯 About This Documentation

This documentation site provides complete technical and user guides for the Cuba Tattoo Studio website project. Built with Jekyll and hosted on GitHub Pages, it serves as the central knowledge base for developers, designers, product managers, and end users.

## 📖 Documentation Structure

### 📋 Product Documentation

| Document | Purpose | Target Audience |
|----------|---------|----------------|
| **[Product Requirements](./product-requirements.md)** | Complete product specifications, features, and user flows | Product Managers, Stakeholders |
| **[Technical Architecture](./technical-architecture.md)** | System architecture, technology stack, and data models | Developers, Tech Leads |

### 🛠️ Technical Guides

| Document | Purpose | Target Audience |
|----------|---------|----------------|
| **[Installation Guide](./installation-guide.md)** | Complete setup and configuration instructions | Developers, DevOps |
| **[Component Guide](./component-guide.md)** | Detailed component documentation and usage | Frontend Developers |
| **[GSAP Animation Guide](./gsap-animation-guide.md)** | Animation implementation inspired by rockstargames.com/VI | Frontend Developers, Animators |

### 👥 Collaboration Guides

| Document | Purpose | Target Audience |
|----------|---------|----------------|
| **[Contribution Guide](./contribution-guide.md)** | Code standards, Git workflow, and collaboration guidelines | All Development Team |
| **[User Guide](./user-guide.md)** | End-user documentation for the website | Clients, End Users |

## 🚀 Quick Navigation

### For New Team Members
1. Start with [Product Requirements](./product-requirements.md) to understand the project
2. Follow the [Installation Guide](./installation-guide.md) to set up your environment
3. Review [Contribution Guide](./contribution-guide.md) for development standards
4. Explore [Component Guide](./component-guide.md) for implementation details

### For Developers
- **Getting Started:** [Installation Guide](./installation-guide.md)
- **Architecture:** [Technical Architecture](./technical-architecture.md)
- **Components:** [Component Guide](./component-guide.md)
- **Animations:** [GSAP Animation Guide](./gsap-animation-guide.md)
- **Standards:** [Contribution Guide](./contribution-guide.md)

### For Product Managers
- **Requirements:** [Product Requirements](./product-requirements.md)
- **Architecture:** [Technical Architecture](./technical-architecture.md)
- **User Experience:** [User Guide](./user-guide.md)

### For End Users
- **Website Usage:** [User Guide](./user-guide.md)

## 🏗️ Site Architecture

### Technology Stack
- **Static Site Generator:** Jekyll 4.x
- **Styling:** GitHub Pages default theme with custom CSS
- **Hosting:** GitHub Pages
- **Domain:** docs.cubatattoostudio.com
- **Deployment:** GitHub Actions

### File Structure
```
docs/
├── README.md                    # This file - documentation overview
├── _config.yml                  # Jekyll configuration
├── CNAME                        # Custom domain configuration
├── Gemfile                      # Ruby dependencies
├── product-requirements.md      # Product specifications
├── technical-architecture.md    # System architecture
├── installation-guide.md        # Setup instructions
├── component-guide.md           # Component documentation
├── gsap-animation-guide.md      # Animation implementation
├── contribution-guide.md        # Development standards
└── user-guide.md               # End-user documentation
```

## 📝 Contributing to Documentation

### Making Changes

1. **Edit Documentation Files**
   ```bash
   # Navigate to docs folder
   cd docs/
   
   # Edit any .md file
   vim product-requirements.md
   ```

2. **Preview Changes Locally**
   ```bash
   # Install Jekyll (first time only)
   gem install bundler jekyll
   bundle install
   
   # Serve locally
   bundle exec jekyll serve
   
   # View at http://localhost:4000
   ```

3. **Commit and Push**
   ```bash
   git add docs/
   git commit -m "docs: update installation guide"
   git push origin main
   ```

### Documentation Standards

#### Markdown Guidelines
- Use clear, descriptive headings with proper hierarchy
- Include table of contents for long documents
- Use code blocks with language specification
- Add emoji icons for visual hierarchy (📚 🎯 🚀 etc.)
- Include cross-references between related documents

#### Content Structure
```markdown
# Document Title

> Brief description of the document's purpose

## 📋 Table of Contents
1. [Section One](#section-one)
2. [Section Two](#section-two)

## 🎯 Section One
Content here...

### Subsection
More detailed content...
```

#### Code Examples
- Always include language specification in code blocks
- Provide complete, runnable examples
- Include comments for complex code
- Show both correct ✅ and incorrect ❌ examples when helpful

#### Images and Diagrams
- Use Mermaid diagrams for architecture and flow charts
- Include alt text for all images
- Keep file sizes optimized
- Store images in appropriate folders

### Review Process

1. **Self-Review Checklist**
   - [ ] Content is accurate and up-to-date
   - [ ] Links work correctly
   - [ ] Code examples are tested
   - [ ] Grammar and spelling checked
   - [ ] Follows documentation standards

2. **Peer Review**
   - Create pull request for significant changes
   - Request review from relevant team members
   - Address feedback before merging

## 🚀 GitHub Pages Deployment

### Automatic Deployment

The documentation site automatically deploys when changes are pushed to the `main` branch:

1. **GitHub Actions Workflow** (`.github/workflows/docs.yml`)
   - Triggers on push to `main` branch affecting `docs/` folder
   - Builds Jekyll site
   - Deploys to GitHub Pages

2. **Deployment Process**
   ```yaml
   # Simplified workflow
   - Checkout code
   - Setup Ruby and Jekyll
   - Install dependencies
   - Build site
   - Deploy to GitHub Pages
   ```

3. **Live Site**
   - URL: https://docs.cubatattoostudio.com
   - Updates typically live within 2-5 minutes
   - SSL certificate automatically managed

### Manual Deployment

If needed, you can trigger deployment manually:

1. **Via GitHub Interface**
   - Go to Actions tab in repository
   - Select "Deploy Documentation" workflow
   - Click "Run workflow"

2. **Via Git**
   ```bash
   # Create empty commit to trigger deployment
   git commit --allow-empty -m "trigger docs deployment"
   git push origin main
   ```

### Configuration Files

#### Jekyll Configuration (`_config.yml`)
```yaml
# Site settings
title: "Cuba Tattoo Studio Documentation"
description: "Comprehensive documentation for Cuba Tattoo Studio website"
url: "https://docs.cubatattoostudio.com"
baseurl: ""

# Build settings
markdown: kramdown
highlighter: rouge
theme: minima

# Plugins
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag

# GitHub Pages specific
github:
  repository_url: "https://github.com/cubatattoostudio/website"
```

#### Custom Domain (`CNAME`)
```
docs.cubatattoostudio.com
```

#### Dependencies (`Gemfile`)
```ruby
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
gem "jekyll-feed"
gem "jekyll-sitemap"
gem "jekyll-seo-tag"
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build status
gh workflow list
gh run list --workflow="Deploy Documentation"

# View build logs
gh run view [run-id]
```

#### Local Development Issues
```bash
# Update dependencies
bundle update

# Clear Jekyll cache
bundle exec jekyll clean

# Rebuild site
bundle exec jekyll build
```

#### Domain Issues
- Verify CNAME file contains correct domain
- Check DNS settings point to GitHub Pages
- Ensure custom domain is configured in repository settings

### Getting Help

1. **Check Build Status**
   - GitHub Actions tab shows deployment status
   - Build logs provide detailed error information

2. **Documentation Issues**
   - Create issue in main repository
   - Tag with "documentation" label
   - Provide specific details about the problem

3. **Contact Team**
   - Technical issues: Development team
   - Content issues: Product team
   - Deployment issues: DevOps team

## 📊 Analytics and Monitoring

### Site Performance
- **Lighthouse Scores:** Monitored automatically
- **Load Times:** Optimized for fast loading
- **Mobile Responsiveness:** Fully responsive design

### Content Analytics
- **Page Views:** Tracked via GitHub Pages insights
- **Popular Content:** Most accessed documentation
- **User Feedback:** Collected via issues and discussions

## 🎯 Best Practices

### Writing Documentation
1. **Clarity First:** Write for your audience's skill level
2. **Examples:** Include practical, working examples
3. **Updates:** Keep content current with code changes
4. **Cross-References:** Link related documentation
5. **Feedback:** Encourage and respond to user feedback

### Maintenance
1. **Regular Reviews:** Monthly documentation audits
2. **Link Checking:** Verify all links work correctly
3. **Content Updates:** Sync with code changes
4. **User Testing:** Validate documentation with new team members

## 📞 Support

### Documentation Team
- **Technical Writing:** [Team Lead]
- **Development:** [Dev Team]
- **Product:** [Product Manager]

### Getting Help
- **Issues:** Create GitHub issue with "documentation" label
- **Questions:** Use GitHub Discussions
- **Urgent:** Contact team directly

---

## 🚀 Quick Start for Contributors

```bash
# 1. Clone repository
git clone https://github.com/cubatattoostudio/website.git
cd website/docs

# 2. Install Jekyll
bundle install

# 3. Start local server
bundle exec jekyll serve

# 4. Open browser
open http://localhost:4000

# 5. Edit documentation files
# 6. Commit and push changes
git add .
git commit -m "docs: update [description]"
git push origin main
```

**The documentation will automatically deploy to [docs.cubatattoostudio.com](https://docs.cubatattoostudio.com) within minutes!**

---

*This documentation site is maintained by the Cuba Tattoo Studio development team. For questions or contributions, please see our [Contribution Guide](./contribution-guide.md).*

*Last updated: December 2024*