/**
 * Enhanced Lazy Loading Module
 * Implements modern lazy loading with intersection observer, WebP support, and responsive images
 */

class EnhancedLazyLoading {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.01,
      enableWebP: true,
      ...options
    };
    
    this.imageObserver = null;
    this.init();
  }

  init() {
    // Check if browser supports Intersection Observer
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
      this.observeImages();
    } else {
      // Fallback for older browsers
      this.loadAllImages();
    }
  }

  /**
   * Setup Intersection Observer for lazy loading
   */
  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          this.imageObserver.unobserve(img);
        }
      });
    }, observerOptions);
  }

  /**
   * Observe all images with data-src attribute
   */
  observeImages() {
    const images = document.querySelectorAll('img[data-src]:not(.lazy-loaded)');
    images.forEach(img => {
      // Add loading class and blur effect
      img.classList.add('lazy-loading');
      img.style.filter = 'blur(10px)';
      
      // Add loading spinner
      this.addLoadingSpinner(img);
      
      // Start observing
      this.imageObserver.observe(img);
    });
  }

  /**
   * Add loading spinner to image container
   */
  addLoadingSpinner(img) {
    const spinner = document.createElement('div');
    spinner.className = 'image-loading-spinner';
    spinner.innerHTML = `
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    `;
    
    // Insert spinner before image
    img.parentNode.insertBefore(spinner, img);
  }

  /**
   * Remove loading spinner
   */
  removeLoadingSpinner(img) {
    const spinner = img.previousSibling;
    if (spinner && spinner.classList.contains('image-loading-spinner')) {
      spinner.style.opacity = '0';
      setTimeout(() => spinner.remove(), 300);
    }
  }

  /**
   * Load image with enhanced features
   */
  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    const sizes = img.dataset.sizes;
    
    if (!src) {
      console.warn('Image missing data-src attribute:', img);
      return;
    }

    // Create image loader
    const imageLoader = new Image();
    
    // Set attributes if available
    if (srcset) imageLoader.srcset = srcset;
    if (sizes) imageLoader.sizes = sizes;
    
    // Try WebP version first if enabled
    let finalSrc = src;
    if (this.options.enableWebP && this.supportsWebP()) {
      finalSrc = this.convertToWebP(src);
    }

    // Load image
    imageLoader.onload = () => {
      // Apply loaded image
      img.src = finalSrc;
      if (srcset) img.srcset = srcset;
      if (sizes) img.sizes = sizes;
      
      // Add loaded class and remove loading effects
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
      img.style.filter = 'blur(0)';
      
      // Remove spinner
      this.removeLoadingSpinner(img);
      
      // Dispatch custom event
      img.dispatchEvent(new CustomEvent('lazyloaded', { bubbles: true }));
    };

    imageLoader.onerror = () => {
      // Fallback to original image if WebP fails
      if (finalSrc !== src) {
        imageLoader.src = src;
        return;
      }
      
      // Show error state
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');
      img.style.filter = 'blur(0)';
      
      // Remove spinner
      this.removeLoadingSpinner(img);
      
      // Dispatch error event
      img.dispatchEvent(new CustomEvent('lazyerror', { bubbles: true }));
    };

    imageLoader.src = finalSrc;
  }

  /**
   * Check if browser supports WebP
   */
  supportsWebP() {
    // Simple check - in production, use more robust detection
    return true;
  }

  /**
   * Convert image path to WebP version
   */
  convertToWebP(src) {
    return src.replace(/\.(jpg|jpeg|png)/gi, '.webp');
  }

  /**
   * Load all images immediately (fallback)
   */
  loadAllImages() {
    const images = document.querySelectorAll('img[data-src]:not(.lazy-loaded)');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('lazy-loaded');
    });
  }

  /**
   * Manually load a specific image
   */
  loadSpecificImage(img) {
    if (this.imageObserver) {
      this.imageObserver.unobserve(img);
    }
    this.loadImage(img);
  }

  /**
   * Update observer with new options
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    
    if (this.imageObserver) {
      this.imageObserver.disconnect();
    }
    
    this.setupIntersectionObserver();
    this.observeImages();
  }
}

/**
 * Auto-initialize when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedLazyLoading = new EnhancedLazyLoading();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedLazyLoading;
}

/**
 * Add CSS for loading spinner
 */
const lazyLoadStyles = `
  .image-loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  .spinner {
    animation: rotator 1.4s linear infinite;
    width: 30px;
    height: 30px;
  }
  
  @keyframes rotator {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(270deg); }
  }
  
  .path {
    stroke-dasharray: 125;
    stroke-dashoffset: 0;
    transform-origin: center;
    animation: dash 1.4s ease-in-out infinite;
    stroke: #ff6347;
    stroke-linecap: round;
  }
  
  @keyframes dash {
    0% { stroke-dashoffset: 125; }
    50% {
      stroke-dashoffset: 62.5;
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: 125;
      transform: rotate(450deg);
    }
  }
  
  .lazy-loading {
    transition: filter 0.3s ease;
  }
  
  .lazy-loaded {
    filter: blur(0) !important;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = lazyLoadStyles;
document.head.appendChild(styleSheet);