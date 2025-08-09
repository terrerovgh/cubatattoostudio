// Documentation JavaScript functionality
(function() {
  'use strict';
  
  // DOM elements
  const elements = {
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    sidebar: document.getElementById('docs-sidebar'),
    mobileOverlay: document.getElementById('mobile-overlay'),
    searchInput: document.getElementById('search-input'),
    searchResults: document.getElementById('search-results'),
    searchResultsList: document.getElementById('search-results-list'),
    searchClose: document.getElementById('search-close'),
    themeToggle: document.getElementById('theme-toggle'),
    tocNav: document.getElementById('toc-nav')
  };
  
  // State
  let searchData = [];
  let currentTheme = localStorage.getItem('theme') || 'dark';
  let tocItems = [];
  
  // Initialize
  function init() {
    setupMobileNavigation();
    setupSearch();
    setupTheme();
    generateTableOfContents();
    setupScrollSpy();
    setupCopyButtons();
    setupKeyboardShortcuts();
    loadSearchData();
  }
  
  // Mobile Navigation
  function setupMobileNavigation() {
    if (!elements.mobileMenuToggle || !elements.sidebar || !elements.mobileOverlay) return;
    
    elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    elements.mobileOverlay.addEventListener('click', closeMobileMenu);
    
    // Close mobile menu when clicking on a nav link
    elements.sidebar.addEventListener('click', function(e) {
      if (e.target.classList.contains('nav-link')) {
        closeMobileMenu();
      }
    });
  }
  
  function toggleMobileMenu() {
    const isOpen = elements.sidebar.classList.contains('open');
    
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
  
  function openMobileMenu() {
    elements.sidebar.classList.add('open');
    elements.mobileOverlay.classList.add('active');
    elements.mobileMenuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMobileMenu() {
    elements.sidebar.classList.remove('open');
    elements.mobileOverlay.classList.remove('active');
    elements.mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Search functionality
  function setupSearch() {
    if (!elements.searchInput || !elements.searchResults) return;
    
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    elements.searchInput.addEventListener('focus', showSearchResults);
    elements.searchClose.addEventListener('click', hideSearchResults);
    
    // Close search when clicking outside
    elements.searchResults.addEventListener('click', function(e) {
      if (e.target === elements.searchResults) {
        hideSearchResults();
      }
    });
  }
  
  function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
      hideSearchResults();
      return;
    }
    
    const results = searchData.filter(item => {
      return item.title.toLowerCase().includes(query) ||
             item.content.toLowerCase().includes(query) ||
             item.tags.some(tag => tag.toLowerCase().includes(query));
    }).slice(0, 10);
    
    displaySearchResults(results, query);
    showSearchResults();
  }
  
  function displaySearchResults(results, query) {
    if (!elements.searchResultsList) return;
    
    if (results.length === 0) {
      elements.searchResultsList.innerHTML = `
        <div class="no-results">
          <p>No results found for "${escapeHtml(query)}"</p>
        </div>
      `;
      return;
    }
    
    elements.searchResultsList.innerHTML = results.map(result => {
      const excerpt = highlightSearchTerm(result.excerpt, query);
      const title = highlightSearchTerm(result.title, query);
      
      return `
        <a href="${result.url}" class="search-result">
          <div class="result-title">${title}</div>
          <div class="result-excerpt">${excerpt}</div>
          <div class="result-path">${result.path}</div>
        </a>
      `;
    }).join('');
  }
  
  function highlightSearchTerm(text, term) {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  function showSearchResults() {
    if (elements.searchResults) {
      elements.searchResults.classList.add('active');
    }
  }
  
  function hideSearchResults() {
    if (elements.searchResults) {
      elements.searchResults.classList.remove('active');
    }
    if (elements.searchInput) {
      elements.searchInput.blur();
    }
  }
  
  // Theme functionality
  function setupTheme() {
    if (!elements.themeToggle) return;
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    elements.themeToggle.addEventListener('click', toggleTheme);
  }
  
  function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
  }
  
  function updateThemeIcon() {
    const lightIcon = elements.themeToggle.querySelector('.theme-icon-light');
    const darkIcon = elements.themeToggle.querySelector('.theme-icon-dark');
    
    if (currentTheme === 'dark') {
      lightIcon.style.display = 'none';
      darkIcon.style.display = 'block';
    } else {
      lightIcon.style.display = 'block';
      darkIcon.style.display = 'none';
    }
  }
  
  // Table of Contents
  function generateTableOfContents() {
    if (!elements.tocNav) return;
    
    const headings = document.querySelectorAll('.page-content h2, .page-content h3, .page-content h4');
    
    if (headings.length === 0) {
      elements.tocNav.innerHTML = '<p class="no-toc">No headings found</p>';
      return;
    }
    
    // Generate IDs for headings if they don't have them
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}-${slugify(heading.textContent)}`;
      }
    });
    
    // Build TOC structure
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      const listItem = document.createElement('li');
      
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.className = 'toc-link';
      link.textContent = heading.textContent;
      link.setAttribute('data-level', level);
      
      listItem.appendChild(link);
      
      if (level === 3 || level === 4) {
        listItem.classList.add('toc-subitem');
      }
      
      tocList.appendChild(listItem);
      
      tocItems.push({
        id: heading.id,
        element: heading,
        link: link
      });
    });
    
    elements.tocNav.appendChild(tocList);
    
    // Add click handlers for smooth scrolling
    tocList.addEventListener('click', function(e) {
      if (e.target.classList.contains('toc-link')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.docs-header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  }
  
  // Scroll Spy for TOC
  function setupScrollSpy() {
    if (tocItems.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const tocItem = tocItems.find(item => item.id === entry.target.id);
          if (tocItem) {
            if (entry.isIntersecting) {
              // Remove active class from all TOC links
              tocItems.forEach(item => item.link.classList.remove('active'));
              // Add active class to current TOC link
              tocItem.link.classList.add('active');
            }
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0
      }
    );
    
    tocItems.forEach(item => {
      observer.observe(item.element);
    });
  }
  
  // Copy buttons for code blocks
  function setupCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
      const pre = codeBlock.parentElement;
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';
      
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';
      copyButton.setAttribute('aria-label', 'Copy code to clipboard');
      
      copyButton.addEventListener('click', function() {
        const code = codeBlock.textContent;
        
        navigator.clipboard.writeText(code).then(() => {
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 2000);
        }).catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = code;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 2000);
        });
      });
      
      wrapper.appendChild(copyButton);
    });
  }
  
  // Keyboard shortcuts
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Search shortcut: /
      if (e.key === '/' && !isInputFocused()) {
        e.preventDefault();
        if (elements.searchInput) {
          elements.searchInput.focus();
        }
      }
      
      // Escape key
      if (e.key === 'Escape') {
        hideSearchResults();
        closeMobileMenu();
      }
      
      // Theme toggle: Ctrl/Cmd + Shift + L
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        toggleTheme();
      }
    });
  }
  
  // Load search data
  async function loadSearchData() {
    try {
      const response = await fetch('/search.json');
      if (response.ok) {
        searchData = await response.json();
      }
    } catch (error) {
      console.warn('Could not load search data:', error);
      // Fallback: generate search data from current page
      generateFallbackSearchData();
    }
  }
  
  function generateFallbackSearchData() {
    const content = document.querySelector('.page-content');
    if (!content) return;
    
    const title = document.querySelector('.page-title')?.textContent || document.title;
    const text = content.textContent || '';
    const excerpt = text.substring(0, 200) + (text.length > 200 ? '...' : '');
    
    searchData = [{
      title: title,
      content: text,
      excerpt: excerpt,
      url: window.location.pathname,
      path: window.location.pathname,
      tags: []
    }];
  }
  
  // Utility functions
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();