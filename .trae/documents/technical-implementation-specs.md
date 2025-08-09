# Especificaciones Técnicas de Implementación

## 1. Variables SCSS

### _variables.scss
```scss
// Colors - Professional Dark Theme
:root {
  // Backgrounds
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --bg-tertiary: #21262d;
  --bg-hover: #30363d;
  --bg-active: #282e33;
  
  // Text
  --text-primary: #f0f6fc;
  --text-secondary: #8b949e;
  --text-muted: #6e7681;
  --text-inverse: #0d1117;
  
  // Accents
  --accent-blue: #58a6ff;
  --accent-blue-hover: #4493f8;
  --accent-green: #3fb950;
  --accent-orange: #d29922;
  --accent-red: #f85149;
  
  // Borders
  --border-default: #30363d;
  --border-muted: #21262d;
  --border-subtle: #484f58;
  
  // Shadows
  --shadow-small: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.16);
  --shadow-large: 0 10px 25px rgba(0, 0, 0, 0.2);
  
  // Layout
  --header-height: 64px;
  --sidebar-width: 280px;
  --toc-width: 240px;
  --content-max-width: 800px;
  --container-padding: 24px;
  
  // Typography
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace;
  --font-heading: 'Inter', sans-serif;
  
  // Font sizes
  --text-xs: 0.75rem;    // 12px
  --text-sm: 0.875rem;   // 14px
  --text-base: 1rem;     // 16px
  --text-lg: 1.125rem;   // 18px
  --text-xl: 1.25rem;    // 20px
  --text-2xl: 1.5rem;    // 24px
  --text-3xl: 1.875rem;  // 30px
  --text-4xl: 2.25rem;   // 36px
  
  // Line heights
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  // Spacing
  --space-1: 0.25rem;   // 4px
  --space-2: 0.5rem;    // 8px
  --space-3: 0.75rem;   // 12px
  --space-4: 1rem;      // 16px
  --space-5: 1.25rem;   // 20px
  --space-6: 1.5rem;    // 24px
  --space-8: 2rem;      // 32px
  --space-10: 2.5rem;   // 40px
  --space-12: 3rem;     // 48px
  --space-16: 4rem;     // 64px
  
  // Border radius
  --radius-sm: 0.25rem;  // 4px
  --radius-md: 0.375rem; // 6px
  --radius-lg: 0.5rem;   // 8px
  --radius-xl: 0.75rem;  // 12px
  
  // Transitions
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  
  // Z-index
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal: 1040;
  --z-popover: 1050;
  --z-tooltip: 1060;
}

// Breakpoints
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px
);

// Mixins
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

@mixin focus-ring {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
}

@mixin button-reset {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
```

## 2. Layout Styles

### _layout.scss
```scss
// Base layout
.docs-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  line-height: var(--leading-normal);
}

// Header
.docs-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--container-padding);
  z-index: var(--z-fixed);
  
  .header-left {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    
    .logo {
      height: 32px;
      width: auto;
    }
    
    .docs-title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--text-primary);
    }
  }
  
  .header-center {
    flex: 1;
    max-width: 400px;
    margin: 0 var(--space-8);
    
    .search-container {
      position: relative;
      
      input {
        width: 100%;
        padding: var(--space-2) var(--space-4);
        padding-right: var(--space-12);
        background-color: var(--bg-tertiary);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-md);
        color: var(--text-primary);
        font-size: var(--text-sm);
        transition: var(--transition-fast);
        
        &:focus {
          @include focus-ring;
          border-color: var(--accent-blue);
        }
        
        &::placeholder {
          color: var(--text-muted);
        }
      }
      
      kbd {
        position: absolute;
        right: var(--space-2);
        top: 50%;
        transform: translateY(-50%);
        padding: var(--space-1) var(--space-2);
        background-color: var(--bg-hover);
        border: 1px solid var(--border-default);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        color: var(--text-muted);
      }
    }
  }
  
  .header-right {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    
    .main-nav {
      display: flex;
      gap: var(--space-6);
      
      a {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: var(--text-sm);
        font-weight: 500;
        transition: var(--transition-fast);
        
        &:hover {
          color: var(--text-primary);
        }
        
        &.active {
          color: var(--accent-blue);
        }
      }
    }
    
    .theme-toggle,
    .github-link {
      @include button-reset;
      padding: var(--space-2);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      transition: var(--transition-fast);
      
      &:hover {
        background-color: var(--bg-hover);
        color: var(--text-primary);
      }
      
      &:focus {
        @include focus-ring;
      }
      
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}

// Sidebar
.docs-sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-default);
  overflow-y: auto;
  z-index: var(--z-sticky);
  
  .sidebar-nav {
    padding: var(--space-6) 0;
    
    .nav-section {
      margin-bottom: var(--space-8);
      
      .nav-section-title {
        padding: 0 var(--container-padding);
        margin-bottom: var(--space-4);
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-primary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          margin-bottom: var(--space-1);
        }
        
        .nav-link {
          display: block;
          padding: var(--space-2) var(--container-padding);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: var(--text-sm);
          transition: var(--transition-fast);
          border-left: 3px solid transparent;
          
          &:hover {
            background-color: var(--bg-hover);
            color: var(--text-primary);
          }
          
          &.active {
            background-color: var(--bg-tertiary);
            color: var(--accent-blue);
            border-left-color: var(--accent-blue);
            font-weight: 500;
          }
          
          &:focus {
            @include focus-ring;
          }
        }
      }
    }
  }
}

// Main content
.docs-main {
  margin-left: var(--sidebar-width);
  margin-right: var(--toc-width);
  margin-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
  
  .content-wrapper {
    max-width: var(--content-max-width);
    padding: var(--space-8) var(--container-padding);
    margin: 0 auto;
  }
}

// Table of Contents
.docs-toc {
  position: fixed;
  top: var(--header-height);
  right: 0;
  width: var(--toc-width);
  height: calc(100vh - var(--header-height));
  padding: var(--space-8) var(--container-padding);
  overflow-y: auto;
  
  .toc-container {
    position: sticky;
    top: var(--space-8);
    
    .toc-title {
      font-size: var(--text-sm);
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: var(--space-4);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .toc-nav {
      .toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          margin-bottom: var(--space-2);
        }
        
        .toc-link {
          display: block;
          padding: var(--space-1) 0;
          color: var(--text-muted);
          text-decoration: none;
          font-size: var(--text-sm);
          line-height: var(--leading-tight);
          transition: var(--transition-fast);
          border-left: 2px solid transparent;
          padding-left: var(--space-3);
          
          &:hover {
            color: var(--text-secondary);
          }
          
          &.active {
            color: var(--accent-blue);
            border-left-color: var(--accent-blue);
          }
        }
        
        .toc-sublist {
          margin-top: var(--space-2);
          margin-left: var(--space-4);
          
          .toc-link {
            font-size: var(--text-xs);
            padding-left: var(--space-2);
          }
        }
      }
    }
  }
}

// Responsive
@include respond-to('lg') {
  .docs-toc {
    display: none;
  }
  
  .docs-main {
    margin-right: 0;
  }
}

@include respond-to('md') {
  .docs-sidebar {
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
    
    &.open {
      transform: translateX(0);
    }
  }
  
  .docs-main {
    margin-left: 0;
  }
  
  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: calc(var(--z-sticky) - 1);
    opacity: 0;
    visibility: hidden;
    transition: var(--transition-normal);
    
    &.active {
      opacity: 1;
      visibility: visible;
    }
  }
  
  .mobile-menu-toggle {
    @include button-reset;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 24px;
    height: 24px;
    
    .hamburger-line {
      width: 100%;
      height: 2px;
      background-color: var(--text-primary);
      margin: 2px 0;
      transition: var(--transition-fast);
    }
    
    &.active {
      .hamburger-line:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      
      .hamburger-line:nth-child(2) {
        opacity: 0;
      }
      
      .hamburger-line:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
    }
  }
}
```

## 3. Component Styles

### _components.scss
```scss
// Breadcrumbs
.breadcrumbs {
  margin-bottom: var(--space-6);
  
  .breadcrumb-list {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: var(--text-sm);
    
    li {
      display: flex;
      align-items: center;
      
      &:not(:last-child)::after {
        content: '/';
        margin: 0 var(--space-2);
        color: var(--text-muted);
      }
      
      a {
        color: var(--text-secondary);
        text-decoration: none;
        transition: var(--transition-fast);
        
        &:hover {
          color: var(--accent-blue);
        }
      }
      
      &[aria-current="page"] {
        color: var(--text-primary);
        font-weight: 500;
      }
    }
  }
}

// Page header
.page-header {
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--border-default);
  
  .page-title {
    font-size: var(--text-4xl);
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: var(--space-4);
    line-height: var(--leading-tight);
  }
  
  .page-description {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    line-height: var(--leading-relaxed);
    max-width: 600px;
  }
}

// Code blocks
.code-block {
  margin: var(--space-6) 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-default);
  
  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3) var(--space-4);
    background-color: var(--bg-hover);
    border-bottom: 1px solid var(--border-default);
    
    .code-language {
      font-size: var(--text-xs);
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    
    .copy-button {
      @include button-reset;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-3);
      background-color: var(--bg-tertiary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: var(--text-xs);
      transition: var(--transition-fast);
      
      &:hover {
        background-color: var(--bg-primary);
        color: var(--text-primary);
      }
      
      &:focus {
        @include focus-ring;
      }
      
      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
  
  .code-content {
    padding: var(--space-4);
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
    
    code {
      color: var(--text-primary);
    }
  }
}

// Callout boxes
.callout {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  margin: var(--space-6) 0;
  border-radius: var(--radius-lg);
  border-left: 4px solid;
  
  .callout-icon {
    flex-shrink: 0;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
  
  .callout-content {
    flex: 1;
    
    p {
      margin: 0;
      
      &:not(:last-child) {
        margin-bottom: var(--space-3);
      }
    }
    
    strong {
      font-weight: 600;
    }
  }
  
  &.callout-info {
    background-color: rgba(88, 166, 255, 0.1);
    border-left-color: var(--accent-blue);
    
    .callout-icon {
      color: var(--accent-blue);
    }
  }
  
  &.callout-warning {
    background-color: rgba(210, 153, 34, 0.1);
    border-left-color: var(--accent-orange);
    
    .callout-icon {
      color: var(--accent-orange);
    }
  }
  
  &.callout-error {
    background-color: rgba(248, 81, 73, 0.1);
    border-left-color: var(--accent-red);
    
    .callout-icon {
      color: var(--accent-red);
    }
  }
  
  &.callout-success {
    background-color: rgba(63, 185, 80, 0.1);
    border-left-color: var(--accent-green);
    
    .callout-icon {
      color: var(--accent-green);
    }
  }
}

// Page navigation
.page-nav {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--border-default);
  
  .nav-prev,
  .nav-next {
    display: flex;
    flex-direction: column;
    padding: var(--space-4);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition: var(--transition-fast);
    max-width: 250px;
    
    &:hover {
      background-color: var(--bg-tertiary);
      border-color: var(--border-subtle);
    }
    
    .nav-direction {
      font-size: var(--text-xs);
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-1);
    }
    
    .nav-title {
      font-size: var(--text-sm);
      color: var(--text-primary);
      font-weight: 500;
    }
  }
  
  .nav-prev {
    text-align: left;
  }
  
  .nav-next {
    text-align: right;
    margin-left: auto;
  }
}

// Search results
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-large);
  max-height: 400px;
  overflow-y: auto;
  z-index: var(--z-dropdown);
  
  .search-result {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border-muted);
    cursor: pointer;
    transition: var(--transition-fast);
    
    &:hover,
    &.highlighted {
      background-color: var(--bg-hover);
    }
    
    &:last-child {
      border-bottom: none;
    }
    
    .result-title {
      font-size: var(--text-sm);
      font-weight: 500;
      color: var(--text-primary);
      margin-bottom: var(--space-1);
    }
    
    .result-excerpt {
      font-size: var(--text-xs);
      color: var(--text-muted);
      line-height: var(--leading-normal);
    }
    
    .result-path {
      font-size: var(--text-xs);
      color: var(--text-secondary);
      margin-top: var(--space-1);
    }
  }
  
  .no-results {
    padding: var(--space-6) var(--space-4);
    text-align: center;
    color: var(--text-muted);
    font-size: var(--text-sm);
  }
}
```

## 4. JavaScript Functionality

### search.js
```javascript
class DocsSearch {
  constructor() {
    this.searchInput = document.querySelector('.search-container input');
    this.searchResults = document.querySelector('.search-results');
    this.searchData = [];
    this.currentIndex = -1;
    
    this.init();
  }
  
  async init() {
    if (!this.searchInput) return;
    
    // Load search data
    try {
      const response = await fetch('/search-data.json');
      this.searchData = await response.json();
    } catch (error) {
      console.error('Failed to load search data:', error);
    }
    
    // Event listeners
    this.searchInput.addEventListener('input', this.handleSearch.bind(this));
    this.searchInput.addEventListener('keydown', this.handleKeydown.bind(this));
    this.searchInput.addEventListener('focus', this.handleFocus.bind(this));
    this.searchInput.addEventListener('blur', this.handleBlur.bind(this));
    
    // Global keyboard shortcut
    document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
    
    // Click outside to close
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }
  
  handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      this.hideResults();
      return;
    }
    
    const results = this.searchContent(query);
    this.displayResults(results);
  }
  
  searchContent(query) {
    const results = [];
    
    this.searchData.forEach(item => {
      let score = 0;
      
      // Title match (highest priority)
      if (item.title.toLowerCase().includes(query)) {
        score += 10;
      }
      
      // Content match
      if (item.content.toLowerCase().includes(query)) {
        score += 5;
      }
      
      // Tags match
      if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query))) {
        score += 7;
      }
      
      if (score > 0) {
        results.push({ ...item, score });
      }
    });
    
    // Sort by score and limit results
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }
  
  displayResults(results) {
    if (!this.searchResults) {
      this.createResultsContainer();
    }
    
    if (results.length === 0) {
      this.searchResults.innerHTML = `
        <div class="no-results">
          No results found. Try a different search term.
        </div>
      `;
    } else {
      this.searchResults.innerHTML = results.map((result, index) => `
        <div class="search-result" data-index="${index}" data-url="${result.url}">
          <div class="result-title">${this.highlightQuery(result.title, this.searchInput.value)}</div>
          <div class="result-excerpt">${this.getExcerpt(result.content, this.searchInput.value)}</div>
          <div class="result-path">${result.path}</div>
        </div>
      `).join('');
      
      // Add click listeners
      this.searchResults.querySelectorAll('.search-result').forEach(result => {
        result.addEventListener('click', () => {
          window.location.href = result.dataset.url;
        });
      });
    }
    
    this.showResults();
    this.currentIndex = -1;
  }
  
  highlightQuery(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  getExcerpt(content, query, maxLength = 150) {
    if (!query) return content.substring(0, maxLength) + '...';
    
    const index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return content.substring(0, maxLength) + '...';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, start + maxLength);
    
    let excerpt = content.substring(start, end);
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';
    
    return this.highlightQuery(excerpt, query);
  }
  
  handleKeydown(e) {
    if (!this.searchResults || this.searchResults.style.display === 'none') return;
    
    const results = this.searchResults.querySelectorAll('.search-result');
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.currentIndex = Math.min(this.currentIndex + 1, results.length - 1);
        this.updateHighlight(results);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.currentIndex = Math.max(this.currentIndex - 1, -1);
        this.updateHighlight(results);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (this.currentIndex >= 0 && results[this.currentIndex]) {
          window.location.href = results[this.currentIndex].dataset.url;
        }
        break;
        
      case 'Escape':
        this.hideResults();
        this.searchInput.blur();
        break;
    }
  }
  
  updateHighlight(results) {
    results.forEach((result, index) => {
      result.classList.toggle('highlighted', index === this.currentIndex);
    });
  }
  
  handleGlobalKeydown(e) {
    // Cmd/Ctrl + K to focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.searchInput.focus();
      this.searchInput.select();
    }
  }
  
  handleFocus() {
    if (this.searchInput.value.length >= 2) {
      this.handleSearch({ target: this.searchInput });
    }
  }
  
  handleBlur() {
    // Delay hiding to allow clicks on results
    setTimeout(() => {
      this.hideResults();
    }, 200);
  }
  
  handleClickOutside(e) {
    if (!this.searchInput.contains(e.target) && 
        (!this.searchResults || !this.searchResults.contains(e.target))) {
      this.hideResults();
    }
  }
  
  createResultsContainer() {
    this.searchResults = document.createElement('div');
    this.searchResults.className = 'search-results';
    this.searchResults.style.display = 'none';
    this.searchInput.parentNode.appendChild(this.searchResults);
  }
  
  showResults() {
    if (this.searchResults) {
      this.searchResults.style.display = 'block';
    }
  }
  
  hideResults() {
    if (this.searchResults) {
      this.searchResults.style.display = 'none';
    }
    this.currentIndex = -1;
  }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DocsSearch();
});
```

### navigation.js
```javascript
class DocsNavigation {
  constructor() {
    this.sidebar = document.querySelector('.docs-sidebar');
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.overlay = document.querySelector('.mobile-overlay');
    
    this.init();
  }
  
  init() {
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
    }
    
    if (this.overlay) {
      this.overlay.addEventListener('click', this.closeMobileMenu.bind(this));
    }
    
    // Close mobile menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Set active navigation item
    this.setActiveNavItem();
  }
  
  toggleMobileMenu() {
    const isOpen = this.sidebar.classList.contains('open');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  openMobileMenu() {
    this.sidebar.classList.add('open');
    this.mobileToggle.classList.add('active');
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  closeMobileMenu() {
    this.sidebar.classList.remove('open');
    this.mobileToggle.classList.remove('active');
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  handleResize() {
    if (window.innerWidth >= 768) {
      this.closeMobileMenu();
    }
  }
  
  setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      if (linkPath === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DocsNavigation();
});
```

### toc.js
```javascript
class TableOfContents {
  constructor() {
    this.tocContainer = document.querySelector('.docs-toc');
    this.tocNav = document.querySelector('.toc-nav');
    this.headings = [];
    this.activeHeading = null;
    
    this.init();
  }
  
  init() {
    if (!this.tocContainer) return;
    
    this.generateTOC();
    this.setupScrollSpy();
  }
  
  generateTOC() {
    // Find all headings in the main content
    const content = document.querySelector('.page-content');
    if (!content) return;
    
    this.headings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    if (this.headings.length === 0) {
      this.tocContainer.style.display = 'none';
      return;
    }
    
    // Generate IDs for headings if they don't have them
    this.headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = this.generateId(heading.textContent);
      }
    });
    
    // Build TOC HTML
    const tocHTML = this.buildTOCHTML(this.headings);
    
    if (this.tocNav) {
      this.tocNav.innerHTML = tocHTML;
      
      // Add click listeners
      this.tocNav.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', this.handleTOCClick.bind(this));
      });
    }
  }
  
  generateId(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  
  buildTOCHTML(headings) {
    let html = '<ul class="toc-list">';
    let currentLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent;
      const id = heading.id;
      
      if (level > currentLevel) {
        // Open new nested list
        if (currentLevel > 0) {
          html += '<ul class="toc-sublist">';
        }
      } else if (level < currentLevel) {
        // Close nested lists
        const diff = currentLevel - level;
        for (let i = 0; i < diff; i++) {
          html += '</ul></li>';
        }
      } else if (index > 0) {
        // Close previous item
        html += '</li>';
      }
      
      html += `<li><a href="#${id}" class="toc-link" data-heading="${id}">${text}</a>`;
      currentLevel = level;
    });
    
    // Close remaining open tags
    for (let i = 0; i < currentLevel; i++) {
      html += '</li>';
    }
    html += '</ul>';
    
    return html;
  }
  
  handleTOCClick(e) {
    e.preventDefault();
    
    const targetId = e.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Smooth scroll to target
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update active state
      this.setActiveHeading(targetId);
      
      // Update URL without triggering scroll
      history.replaceState(null, null, `#${targetId}`);
    }
  }
  
  setupScrollSpy() {
    // Intersection Observer for scroll spy
    const observerOptions = {
      rootMargin: '-20% 0px -35% 0px',
      threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setActiveHeading(entry.target.id);
        }
      });
    }, observerOptions);
    
    // Observe all headings
    this.headings.forEach(heading => {
      observer.observe(heading);
    });
    
    // Handle initial state
    if (window.location.hash) {
      const initialId = window.location.hash.substring(1);
      this.setActiveHeading(initialId);
    }
  }
  
  setActiveHeading(headingId) {
    if (this.activeHeading === headingId) return;
    
    // Remove previous active state
    const previousActive = this.tocNav.querySelector('.toc-link.active');
    if (previousActive) {
      previousActive.classList.remove('active');
    }
    
    // Set new active state
    const newActive = this.tocNav.querySelector(`[data-heading="${headingId}"]`);
    if (newActive) {
      newActive.classList.add('active');
      this.activeHeading = headingId;
    }
  }
}

// Initialize TOC when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TableOfContents();
});
```

## 5. Jekyll Configuration

### _config.yml
```yaml
# Site settings
title: "Cuba Tattoo Studio Documentation"
description: "Professional documentation for Cuba Tattoo Studio components and development"
baseurl: "/docs"
url: "https://cubatattoostudio.github.io"

# Build settings
markdown: kramdown
highlighter: rouge
theme: minima

# Kramdown settings
kramdown:
  input: GFM
  syntax_highlighter: rouge
  syntax_highlighter_opts:
    css_class: 'highlight'
    span:
      line_numbers: false
    block:
      line_numbers: true
      start_line: 1

# Collections
collections:
  docs:
    output: true
    permalink: /:collection/:name/

# Defaults
defaults:
  - scope:
      path: ""
      type: "docs"
    values:
      layout: "docs"
  - scope:
      path: ""
      type: "pages"
    values:
      layout: "page"

# Plugins
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag
  - jekyll-redirect-from

# Exclude from processing
exclude:
  - Gemfile
  - Gemfile.lock
  - node_modules
  - vendor/bundle/
  - vendor/cache/
  - vendor/gems/
  - vendor/ruby/
  - README.md

# Include
include:
  - _pages

# Sass
sass:
  sass_dir: _sass
  style: compressed

# Navigation structure
navigation:
  - title: "Getting Started"
    items:
      - title: "Introduction"
        url: "/docs/"
      - title: "Installation"
        url: "/docs/installation/"
      - title: "Setup Guide"
        url: "/docs/setup/"
  
  - title: "Components"
    items:
      - title: "Overview"
        url: "/docs/components/"
      - title: "Animation Gallery"
        url: "/docs/animation-gallery/"
      - title: "UI Components"
        url: "/docs/components/ui/"
  
  - title: "Advanced"
    items:
      - title: "GSAP Guide"
        url: "/docs/gsap/"
      - title: "Architecture"
        url: "/docs/architecture/"
      - title: "Contributing"
        url: "/docs/contributing/"

# Search settings
search:
  enabled: true
  collections:
    - docs
    - pages
```

Este documento técnico proporciona todas las especificaciones necesarias para implementar el diseño de documentación clásica y profesional, incluyendo estilos SCSS completos, funcionalidad JavaScript avanzada y configuración de Jekyll optimizada.