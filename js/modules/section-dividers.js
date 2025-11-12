/**
 * Section Dividers Module
 * Dynamically adds decorative section dividers between major content sections
 */

(function() {
  'use strict';

  function initSectionDividers() {
    // Get all main sections (excluding hero, navbar, footer)
    const sections = document.querySelectorAll('section:not(.hero):not(.auto-slider):not(.footer)');
    
    // Create divider elements between sections
    sections.forEach((section, index) => {
      // Skip the last section (no divider after it)
      if (index === sections.length - 1) return;
      
      // Check if divider already exists
      const nextElement = section.nextElementSibling;
      if (nextElement && nextElement.classList.contains('section-divider')) {
        return; // Divider already exists
      }
      
      // Create divider element
      const divider = document.createElement('div');
      divider.className = 'section-divider fade-in';
      
      // Insert divider after current section
      section.parentNode.insertBefore(divider, section.nextSibling);
    });
    
    // Add subtle parallax effect to dividers on scroll
    addParallaxEffect();
  }

  function addParallaxEffect() {
    const dividers = document.querySelectorAll('.section-divider');
    
    if (dividers.length === 0) return;
    
    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, {
        threshold: 0.5
      });
      
      dividers.forEach(divider => {
        observer.observe(divider);
      });
    } else {
      // Fallback: show all dividers
      dividers.forEach(divider => {
        divider.classList.add('visible');
      });
    }
  }

  // Initialize on DOM ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSectionDividers);
    } else {
      initSectionDividers();
    }
  }

  // Re-initialize after dynamic content loads
  window.addEventListener('load', function() {
    setTimeout(initSectionDividers, 200);
  });

  // Start initialization
  init();

  // Export for external use
  window.sectionDividers = {
    init: initSectionDividers
  };

})();
