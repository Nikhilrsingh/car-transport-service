/**
 * Hero Section Scroll-Triggered Animations
 * Animations trigger once when hero section comes into view
 */

(function() {
  'use strict';

  // Check if animations have already been triggered
  const ANIMATION_KEY = 'heroAnimationsTriggered';
  let animationsTriggered = sessionStorage.getItem(ANIMATION_KEY) === 'true';

  // Elements to animate
  const animatedElements = {
    badge: '.hero-badge',
    titleLines: '.title-line',
    description: '.hero-description',
    stats: '.stat',
    actions: '.hero-actions .cta-btn',
    quoteCard: '.quote-card',
    quoteHeader: '.quote-header h3',
    quoteSubtext: '.quote-header p',
    formGroups: '.form-group',
    submitBtn: '.quote-submit'
  };

  // Remove initial animations from CSS by adding a class
  function disableInitialAnimations() {
    const style = document.createElement('style');
    style.id = 'disable-hero-animations';
    style.textContent = `
      .hero-badge,
      .title-line,
      .hero-description,
      .stat,
      .hero-actions .cta-btn,
      .quote-card,
      .quote-header h3,
      .quote-header p,
      .form-group,
      .quote-submit {
        animation: none !important;
        opacity: 0;
      }
      
      .hero-badge.animate,
      .title-line.animate,
      .hero-description.animate,
      .stat.animate,
      .hero-actions .cta-btn.animate,
      .quote-card.animate,
      .quote-header h3.animate,
      .quote-header p.animate,
      .form-group.animate,
      .quote-submit.animate {
        opacity: 1;
      }
      
      .hero-badge.animate {
        animation: bloom 1s ease-out forwards !important;
      }
      
      .title-line.animate {
        animation: slideInLeft 0.8s ease-out forwards !important;
      }
      
      .title-line.animate:nth-child(2) {
        animation-delay: 0.2s !important;
      }
      
      .title-line.animate:nth-child(3) {
        animation-delay: 0.4s !important;
      }
      
      .title-line.highlight.animate {
        animation: slideInLeft 0.8s ease-out 0.2s forwards, glow 2s ease-in-out infinite alternate !important;
      }
      
      .hero-description.animate {
        animation: fadeInUp 1s ease-out 0.6s forwards !important;
      }
      
      .stat.animate {
        animation: popupFromDot 0.8s ease-out forwards !important;
      }
      
      .stat.animate:nth-child(1) {
        animation-delay: 0.8s !important;
      }
      
      .stat.animate:nth-child(2) {
        animation-delay: 1s !important;
      }
      
      .stat.animate:nth-child(3) {
        animation-delay: 1.2s !important;
      }
      
      .hero-actions .cta-btn.animate {
        animation: bloom 0.6s ease-out forwards !important;
      }
      
      .hero-actions .cta-btn.animate:nth-child(1) {
        animation-delay: 1s !important;
      }
      
      .hero-actions .cta-btn.animate:nth-child(2) {
        animation-delay: 1.2s !important;
      }
      
      .hero-actions .cta-btn.animate:nth-child(3) {
        animation-delay: 1.4s !important;
      }
      
      .quote-card.animate {
        animation: scaleUp 0.8s ease-out 0.5s forwards !important;
      }
      
      .quote-header h3.animate {
        animation: popupFromDot 0.6s ease-out 0.8s forwards !important;
      }
      
      .quote-header p.animate {
        animation: fadeInUp 0.6s ease-out 1s forwards !important;
      }
      
      .form-group.animate {
        animation: slideInRight 0.5s ease-out forwards !important;
      }
      
      .form-group.animate:nth-child(1) {
        animation-delay: 1.1s !important;
      }
      
      .form-group.animate:nth-child(2) {
        animation-delay: 1.2s !important;
      }
      
      .form-group.animate:nth-child(3) {
        animation-delay: 1.3s !important;
      }
      
      .quote-submit.animate {
        animation: bloom 0.6s ease-out 1.4s forwards !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Trigger animations for all hero elements
  function triggerAnimations() {
    if (animationsTriggered) return;

    // Add animate class to all elements
    const badge = document.querySelector(animatedElements.badge);
    const titleLines = document.querySelectorAll(animatedElements.titleLines);
    const description = document.querySelector(animatedElements.description);
    const stats = document.querySelectorAll(animatedElements.stats);
    const actions = document.querySelectorAll(animatedElements.actions);
    const quoteCard = document.querySelector(animatedElements.quoteCard);
    const quoteHeader = document.querySelector(animatedElements.quoteHeader);
    const quoteSubtext = document.querySelector(animatedElements.quoteSubtext);
    const formGroups = document.querySelectorAll(animatedElements.formGroups);
    const submitBtn = document.querySelector(animatedElements.submitBtn);

    if (badge) badge.classList.add('animate');
    titleLines.forEach(line => line.classList.add('animate'));
    if (description) description.classList.add('animate');
    stats.forEach(stat => stat.classList.add('animate'));
    actions.forEach(action => action.classList.add('animate'));
    if (quoteCard) quoteCard.classList.add('animate');
    if (quoteHeader) quoteHeader.classList.add('animate');
    if (quoteSubtext) quoteSubtext.classList.add('animate');
    formGroups.forEach(group => group.classList.add('animate'));
    if (submitBtn) submitBtn.classList.add('animate');

    // Mark animations as triggered
    animationsTriggered = true;
    sessionStorage.setItem(ANIMATION_KEY, 'true');
  }

  // Intersection Observer to detect when hero section is in view
  function setupIntersectionObserver() {
    const heroSection = document.querySelector('.hero');
    
    if (!heroSection) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2 // Trigger when 20% of hero section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationsTriggered) {
          triggerAnimations();
          // Optionally unobserve after triggering
          observer.unobserve(heroSection);
        }
      });
    }, observerOptions);

    observer.observe(heroSection);
  }

  // Initialize on DOM ready
  function init() {
    // If animations haven't been triggered yet, disable them initially
    if (!animationsTriggered) {
      disableInitialAnimations();
      setupIntersectionObserver();
    } else {
      // If already triggered (page refresh or back navigation), show everything
      const allElements = [
        ...document.querySelectorAll(animatedElements.badge),
        ...document.querySelectorAll(animatedElements.titleLines),
        ...document.querySelectorAll(animatedElements.description),
        ...document.querySelectorAll(animatedElements.stats),
        ...document.querySelectorAll(animatedElements.actions),
        ...document.querySelectorAll(animatedElements.quoteCard),
        ...document.querySelectorAll(animatedElements.quoteHeader),
        ...document.querySelectorAll(animatedElements.quoteSubtext),
        ...document.querySelectorAll(animatedElements.formGroups),
        ...document.querySelectorAll(animatedElements.submitBtn)
      ];
      
      allElements.forEach(el => {
        if (el) el.style.opacity = '1';
      });
    }
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Reset animations on page refresh
  window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem(ANIMATION_KEY);
  });

})();
