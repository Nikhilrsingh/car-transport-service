/**
 * Performance Monitoring Module
 * Tracks image loading performance and provides metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      imagesLoaded: 0,
      totalImages: 0,
      loadingTimes: [],
      cacheHits: 0,
      cacheMisses: 0
    };
    
    this.init();
  }

  init() {
    // Track image loading performance
    this.trackImageLoading();
    
    // Report performance on page unload
    window.addEventListener('beforeunload', () => {
      this.reportPerformance();
    });
    
    // Log initial metrics
    this.logInitialMetrics();
  }

  /**
   * Track image loading performance
   */
  trackImageLoading() {
    // Count total images with data-src
    const images = document.querySelectorAll('img[data-src]');
    this.metrics.totalImages = images.length;
    
    // Track when images are loaded
    document.addEventListener('lazyloaded', (event) => {
      this.metrics.imagesLoaded++;
      this.logImageLoad(event.target);
    });
    
    // Track image loading errors
    document.addEventListener('lazyerror', (event) => {
      this.logImageError(event.target);
    });
  }

  /**
   * Log when an image is loaded
   */
  logImageLoad(img) {
    const startTime = img.dataset.loadStartTime;
    if (startTime) {
      const loadTime = Date.now() - parseInt(startTime);
      this.metrics.loadingTimes.push(loadTime);
      
      console.log(`Image loaded: ${img.src}`, {
        loadTime: `${loadTime}ms`,
        size: img.naturalWidth + 'x' + img.naturalHeight
      });
    }
  }

  /**
   * Log when an image fails to load
   */
  logImageError(img) {
    console.warn(`Image failed to load: ${img.src}`);
  }

  /**
   * Log initial metrics
   */
  logInitialMetrics() {
    console.log('Performance Monitor initialized', {
      totalImages: this.metrics.totalImages
    });
  }

  /**
   * Calculate average loading time
   */
  getAverageLoadTime() {
    if (this.metrics.loadingTimes.length === 0) return 0;
    
    const sum = this.metrics.loadingTimes.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.metrics.loadingTimes.length);
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    return {
      imagesLoaded: this.metrics.imagesLoaded,
      totalImages: this.metrics.totalImages,
      loadProgress: this.metrics.totalImages > 0 
        ? Math.round((this.metrics.imagesLoaded / this.metrics.totalImages) * 100) 
        : 0,
      averageLoadTime: this.getAverageLoadTime(),
      cacheHitRate: this.metrics.cacheHits + this.metrics.cacheMisses > 0
        ? Math.round((this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100)
        : 0
    };
  }

  /**
   * Report performance metrics
   */
  reportPerformance() {
    const summary = this.getPerformanceSummary();
    
    console.table({
      'Images Loaded': `${summary.imagesLoaded}/${summary.totalImages} (${summary.loadProgress}%)`,
      'Average Load Time': `${summary.averageLoadTime}ms`,
      'Cache Hit Rate': `${summary.cacheHitRate}%`
    });
    
    // Send to analytics (in a real implementation)
    // this.sendToAnalytics(summary);
  }

  /**
   * Send metrics to analytics service
   */
  sendToAnalytics(metrics) {
    // In a real implementation, this would send data to an analytics service
    // fetch('/api/performance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ metrics, timestamp: Date.now() })
    // });
  }

  /**
   * Force report performance
   */
  forceReport() {
    this.reportPerformance();
  }
}

/**
 * Initialize performance monitor when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  window.performanceMonitor = new PerformanceMonitor();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceMonitor;
}