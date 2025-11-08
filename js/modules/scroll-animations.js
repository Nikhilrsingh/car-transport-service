/**
 * Scroll Animations Module
 * Handles smooth scrolling and scroll-triggered entry animations
 * Uses Intersection Observer API for performance
 */

(function() {
  'use strict';

  // ============================================
  // Smooth Scrolling for Anchor Links
  // ============================================
  
  function initSmoothScrolling() {
    // Get all anchor links (both hash links and section links)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip empty hash or just '#'
        if (!href || href === '#') {
          return;
        }
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          e.preventDefault();
          
          // Calculate offset for fixed navbar
          const header = document.querySelector('.header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
          
          // Smooth scroll with offset
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without triggering scroll
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  // ============================================
  // Scroll-Triggered Entry Animations
  // ============================================
  
  function initScrollAnimations() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right, .scale-in');
      animatedElements.forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    // Configuration for Intersection Observer
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px 0px -50px 0px', // trigger when element is 50px from bottom of viewport
      threshold: 0.1 // trigger when 10% of element is visible
    };

    // Create observer instance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class to trigger animation
          entry.target.classList.add('visible');
          
          // Unobserve after animation (performance optimization)
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
      '.fade-in, .slide-up, .slide-left, .slide-right, .scale-in, ' +
      '.features-container .feature-box, ' +
      '.services-grid .service-card, ' +
      '.testimonial-slider, .testimonials-grid, ' +
      '.contact-content > *, ' +
      '.value-card, .team-member, .info-card, ' +
      '.reveal-on-scroll'
    );

    animatedElements.forEach(el => {
      observer.observe(el);
    });

    // Special handling for staggered animations (child elements)
    const containersWithStagger = document.querySelectorAll(
      '.features-container, .services-grid, .values-grid, .team-grid, .contact-info'
    );

    containersWithStagger.forEach((container, containerIndex) => {
      const children = container.children;
      Array.from(children).forEach((child, childIndex) => {
        // Add delay classes for staggered effect
        if (childIndex > 0) {
          child.classList.add(`fade-in-delay-${Math.min(childIndex, 4)}`);
        }
      });
    });
  }

  // ============================================
  // Initialize on DOM Ready
  // ============================================
  
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initSmoothScrolling();
        initScrollAnimations();
      });
    } else {
      // DOM already loaded
      initSmoothScrolling();
      initScrollAnimations();
    }
  }

  // Start initialization
  init();

  // Re-initialize for dynamically loaded content (e.g., footer loaded via fetch)
  window.addEventListener('load', function() {
    // Small delay to ensure all dynamic content is loaded
    setTimeout(() => {
      initScrollAnimations();
    }, 100);
  });

  // Export functions for potential external use
  window.scrollAnimations = {
    init: init,
    initSmoothScrolling: initSmoothScrolling,
    initScrollAnimations: initScrollAnimations
  };

})();

