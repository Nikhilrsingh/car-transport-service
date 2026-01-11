/* ====================================
   STICKY TABLE OF CONTENTS (TOC)
   Global "On This Page" Navigation
   Works on all pages with sections
   ==================================== */

(() => {
  'use strict';

  // Configuration
  const CONFIG = {
    minSections: 2,           // Minimum sections required to show TOC
    scrollOffset: 100,        // Offset for scroll position detection
    sidebarWidth: '260px',
    maxHeight: '70vh',
    storageKey: 'tocSidebarCollapsed',
    accentColor: '#ff6347',
    showOnMobile: false,      // Hide on mobile by default
    mobileBreakpoint: 768
  };

  // Find all navigable sections on the page
  function findSections() {
    const sections = [];
    
    // Special handling for homepage
    const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
    
    if (isHomepage) {
      // Homepage-specific sections with custom titles
      const homepageSections = [
        { id: 'features', title: 'Features' },
        { id: 'quote', title: 'Get Instant Quote' },
        { id: 'pricing', title: 'Compare Our Pricing Plans' },
        { id: 'testimonials', title: 'What Our Customers Say' },
        { id: 'contact', title: 'Get In Touch' },
        { id: 'region-container', title: 'Our Pan-India Presence' }
      ];
      
      homepageSections.forEach(sectionInfo => {
        const element = document.getElementById(sectionInfo.id);
        if (element) {
          sections.push({
            id: sectionInfo.id,
            title: sectionInfo.title,
            element: element,
            type: 'homepage'
          });
        }
      });
      
      // If we found homepage sections, return them
      if (sections.length >= CONFIG.minSections) {
        return sections;
      }
    }
    
    // Strategy 1: Find sections with IDs that have h2 headings
    document.querySelectorAll('section[id]').forEach((section) => {
      const heading = section.querySelector('h2, .section-title h2');
      if (heading) {
        sections.push({
          id: section.id,
          title: heading.textContent.trim(),
          element: section,
          type: 'section'
        });
      }
    });

    // Strategy 2: Find standalone h2 headings with IDs (if not enough sections found)
    if (sections.length < CONFIG.minSections) {
      document.querySelectorAll('h2[id]').forEach((heading) => {
        // Skip if already captured via section
        if (!sections.find(s => s.id === heading.id)) {
          sections.push({
            id: heading.id,
            title: heading.textContent.trim(),
            element: heading,
            type: 'heading'
          });
        }
      });
    }

    // Strategy 3: Find h2 headings inside sections and auto-generate IDs
    if (sections.length < CONFIG.minSections) {
      let autoIdCounter = 0;
      document.querySelectorAll('section h2, .section-title h2').forEach((heading) => {
        // Skip if heading or its parent section already has an ID we captured
        const parentSection = heading.closest('section');
        if (parentSection && sections.find(s => s.id === parentSection.id)) {
          return;
        }
        if (sections.find(s => s.id === heading.id)) {
          return;
        }

        // Generate ID if needed
        let targetElement = parentSection || heading;
        if (!targetElement.id) {
          targetElement.id = `toc-section-${autoIdCounter++}`;
        }

        // Skip duplicates
        if (sections.find(s => s.id === targetElement.id)) {
          return;
        }

        sections.push({
          id: targetElement.id,
          title: heading.textContent.trim(),
          element: targetElement,
          type: parentSection ? 'section' : 'heading'
        });
      });
    }

    // Strategy 4: Look for common section patterns (hero, about, services, etc.)
    if (sections.length < CONFIG.minSections) {
      const commonPatterns = [
        { selector: '.hero, #hero, [class*="hero"]', title: 'Hero' },
        { selector: '#home', title: 'Home' },
        { selector: '#about, .about', title: 'About' },
        { selector: '#services, .services', title: 'Services' },
        { selector: '#testimonials, .testimonials', title: 'Testimonials' },
        { selector: '#contact, .contact', title: 'Contact' },
        { selector: '#team, .team', title: 'Team' },
        { selector: '#pricing, .pricing', title: 'Pricing' },
        { selector: '#faq, .faq', title: 'FAQ' },
        { selector: '#features, .features', title: 'Features' }
      ];

      commonPatterns.forEach(pattern => {
        const element = document.querySelector(pattern.selector);
        if (element && !sections.find(s => s.element === element)) {
          if (!element.id) {
            element.id = pattern.title.toLowerCase().replace(/\s+/g, '-');
          }
          
          // Try to get a better title from the section
          const heading = element.querySelector('h1, h2, h3');
          const title = heading ? heading.textContent.trim() : pattern.title;
          
          sections.push({
            id: element.id,
            title: title,
            element: element,
            type: 'pattern'
          });
        }
      });
    }

    // Filter out empty titles and duplicates
    const uniqueSections = [];
    const seenIds = new Set();
    
    sections.forEach(section => {
      if (section.title && section.title.length > 0 && !seenIds.has(section.id)) {
        seenIds.add(section.id);
        uniqueSections.push(section);
      }
    });

    // Sort by document position
    uniqueSections.sort((a, b) => {
      const posA = a.element.getBoundingClientRect().top + window.scrollY;
      const posB = b.element.getBoundingClientRect().top + window.scrollY;
      return posA - posB;
    });

    return uniqueSections;
  }

  // Check if we should show TOC on this page
  function shouldShowTOC() {
    // Don't show on mobile if configured
    if (!CONFIG.showOnMobile && window.innerWidth < CONFIG.mobileBreakpoint) {
      return false;
    }
    
    // Check if TOC already exists
    if (document.getElementById('toc-wrapper')) {
      return false;
    }

    return true;
  }

  // Create the TOC UI
  function createTOC(sections) {
    if (sections.length < CONFIG.minSections) {
      console.log('TOC: Not enough sections found (' + sections.length + ')');
      return null;
    }

    const isCollapsed = localStorage.getItem(CONFIG.storageKey) === 'true';

    // Create wrapper container
    const wrapper = document.createElement('div');
    wrapper.id = 'toc-wrapper';
    wrapper.className = 'toc-wrapper';
    Object.assign(wrapper.style, {
      position: 'fixed',
      top: '100px',
      right: '0',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'flex-start',
      transition: 'transform 0.3s ease, opacity 0.4s ease, visibility 0.4s ease',
      transform: isCollapsed ? 'translateX(calc(100% - 32px))' : 'translateX(0)',
      opacity: '0',
      visibility: 'hidden'
    });

    // Create toggle tab (arrow button)
    const toggleTab = document.createElement('div');
    toggleTab.id = 'toc-toggle-tab';
    toggleTab.setAttribute('aria-label', 'Toggle table of contents');
    toggleTab.setAttribute('role', 'button');
    toggleTab.setAttribute('tabindex', '0');
    Object.assign(toggleTab.style, {
      width: '32px',
      height: '40px',
      background: CONFIG.accentColor,
      borderRadius: '8px 0 0 8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '-2px 2px 8px rgba(0,0,0,0.15)',
      flexShrink: '0'
    });

    const arrow = document.createElement('span');
    arrow.innerHTML = '&#9664;'; // Left arrow
    Object.assign(arrow.style, {
      color: '#fff',
      fontSize: '14px',
      transition: 'transform 0.3s ease',
      transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'
    });
    toggleTab.appendChild(arrow);

    // Create sidebar
    const toc = document.createElement('div');
    toc.id = 'toc-sidebar';
    toc.setAttribute('role', 'navigation');
    toc.setAttribute('aria-label', 'On this page');
    Object.assign(toc.style, {
      width: CONFIG.sidebarWidth,
      maxHeight: CONFIG.maxHeight,
      overflowY: 'auto',
      background: '#ffffff',
      border: '1px solid #ddd',
      borderRadius: '8px 0 0 8px',
      padding: '12px',
      fontSize: '14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    });

    // Title
    const title = document.createElement('div');
    title.textContent = 'On this page';
    title.id = 'toc-title';
    Object.assign(title.style, {
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
      borderBottom: `2px solid ${CONFIG.accentColor}`,
      paddingBottom: '8px'
    });
    toc.appendChild(title);

    // Section counter
    const counter = document.createElement('div');
    counter.textContent = `${sections.length} sections`;
    Object.assign(counter.style, {
      fontSize: '11px',
      color: '#888',
      marginBottom: '10px'
    });
    toc.appendChild(counter);

    // Create links
    const links = [];
    const linkList = document.createElement('div');
    linkList.setAttribute('role', 'list');

    sections.forEach((section, index) => {
      const item = document.createElement('div');
      item.setAttribute('role', 'listitem');
      item.textContent = section.title.length > 30 
        ? section.title.substring(0, 30) + '...' 
        : section.title;
      item.dataset.target = section.id;
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `Navigate to ${section.title}`);

      Object.assign(item.style, {
        cursor: 'pointer',
        padding: '8px 6px',
        borderRadius: '4px',
        transition: 'background 0.2s, color 0.2s',
        color: '#555',
        borderLeft: '3px solid transparent',
        marginBottom: '2px'
      });

      // Click handler
      item.addEventListener('click', () => {
        const targetElement = document.getElementById(section.id);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });

      // Keyboard handler
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });

      // Hover effects
      item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('active')) {
          item.style.background = '#f5f5f5';
        }
      });
      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('active')) {
          item.style.background = 'transparent';
        }
      });

      linkList.appendChild(item);
      links.push({ item, section });
    });

    toc.appendChild(linkList);

    // Assemble wrapper
    wrapper.appendChild(toggleTab);
    wrapper.appendChild(toc);

    return { wrapper, toggleTab, arrow, links, toc };
  }

  // Initialize TOC
  function initTOC() {
    if (!shouldShowTOC()) {
      return;
    }

    const sections = findSections();
    console.log('TOC: Found', sections.length, 'sections');

    if (sections.length < CONFIG.minSections) {
      console.log('TOC: Not enough sections to display');
      return;
    }

    const tocElements = createTOC(sections);
    if (!tocElements) {
      return;
    }

    const { wrapper, toggleTab, arrow, links, toc } = tocElements;
    document.body.appendChild(wrapper);

    // Show TOC function
    function showToc() {
      wrapper.style.opacity = '1';
      wrapper.style.visibility = 'visible';
    }

    // Check if page is already loaded
    if (document.body.classList.contains('loaded') || document.readyState === 'complete') {
      setTimeout(showToc, 500);
    } else {
      // Listen for when preloader finishes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.target === document.body && document.body.classList.contains('loaded')) {
            showToc();
            observer.disconnect();
          }
        });
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

      // Fallback: show after window load
      window.addEventListener('load', () => {
        setTimeout(showToc, 1000);
      });
    }

    // Toggle functionality
    let collapsed = localStorage.getItem(CONFIG.storageKey) === 'true';

    function toggleToc() {
      collapsed = !collapsed;
      localStorage.setItem(CONFIG.storageKey, collapsed);

      if (collapsed) {
        wrapper.style.transform = 'translateX(calc(100% - 32px))';
        arrow.style.transform = 'rotate(180deg)';
      } else {
        wrapper.style.transform = 'translateX(0)';
        arrow.style.transform = 'rotate(0deg)';
      }
    }

    toggleTab.addEventListener('click', toggleToc);
    toggleTab.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleToc();
      }
    });

    // Highlight active section while scrolling
    function onScroll() {
      let currentSection = null;
      let minDistance = Infinity;

      links.forEach(({ section }) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - CONFIG.scrollOffset);
          
          // Find the section closest to the scroll offset
          if (rect.top <= CONFIG.scrollOffset + 50 && distance < minDistance) {
            minDistance = distance;
            currentSection = section;
          }
        }
      });

      // If no section is above the offset, use the first one
      if (!currentSection && links.length > 0) {
        currentSection = links[0].section;
      }

      // Update active states
      links.forEach(({ item, section }) => {
        if (currentSection && section.id === currentSection.id) {
          item.classList.add('active');
          item.style.background = '#e3f2fd';
          item.style.fontWeight = 'bold';
          item.style.color = CONFIG.accentColor;
          item.style.borderLeftColor = CONFIG.accentColor;
        } else {
          item.classList.remove('active');
          item.style.background = 'transparent';
          item.style.fontWeight = 'normal';
          item.style.color = '#555';
          item.style.borderLeftColor = 'transparent';
        }
      });
    }

    // Throttled scroll handler
    let scrollTimeout;
    document.addEventListener('scroll', () => {
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = requestAnimationFrame(onScroll);
    });

    // Initial highlight
    onScroll();

    // Watch for dynamically loaded content (like region-container)
    const contentObserver = new MutationObserver((mutations) => {
      let shouldRescan = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if region-container got content
          const regionContainer = document.getElementById('region-container');
          if (regionContainer && regionContainer.innerHTML.trim().length > 0) {
            shouldRescan = true;
          }
        }
      });
      
      if (shouldRescan) {
        console.log('TOC: Dynamic content detected, rescanning sections...');
        setTimeout(() => {
          // Re-initialize TOC with new content
          const newSections = findSections();
          if (newSections.length > sections.length) {
            console.log('TOC: Found new sections, reinitializing...');
            // Remove existing TOC and reinitialize
            const existingWrapper = document.getElementById('toc-wrapper');
            if (existingWrapper) {
              existingWrapper.remove();
            }
            setTimeout(initTOC, 100);
          }
        }, 1000);
      }
    });

    // Observe the document body for changes
    contentObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!CONFIG.showOnMobile && window.innerWidth < CONFIG.mobileBreakpoint) {
          wrapper.style.display = 'none';
        } else {
          wrapper.style.display = 'flex';
        }
      }, 250);
    });

    // Apply dark mode styles if needed
    function applyThemeStyles() {
      const isDarkMode = document.body.classList.contains('dark-mode') || 
                         document.documentElement.getAttribute('data-theme') === 'dark';
      
      if (isDarkMode) {
        toc.style.background = '#1e1e1e';
        toc.style.borderColor = '#333';
        const titleEl = document.getElementById('toc-title');
        if (titleEl) titleEl.style.color = '#fff';
        links.forEach(({ item }) => {
          if (!item.classList.contains('active')) {
            item.style.color = '#ccc';
          }
        });
      } else {
        toc.style.background = '#ffffff';
        toc.style.borderColor = '#ddd';
        const titleEl = document.getElementById('toc-title');
        if (titleEl) titleEl.style.color = '#333';
        links.forEach(({ item }) => {
          if (!item.classList.contains('active')) {
            item.style.color = '#555';
          }
        });
      }
    }

    // Watch for theme changes
    const themeObserver = new MutationObserver(applyThemeStyles);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    // Initial theme application
    applyThemeStyles();

    console.log('TOC: Initialized successfully with', links.length, 'items');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initTOC, 100);
    });
  } else {
    setTimeout(initTOC, 100);
  }

  // Export for manual initialization
  window.StickyTOC = {
    init: initTOC,
    findSections: findSections
  };
})();
