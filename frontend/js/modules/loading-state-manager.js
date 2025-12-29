/**
 * ============================================================================
 * LOADING STATE MANAGER
 * Manages global loading states and skeleton placeholders
 * ============================================================================
 */

class LoadingStateManager {
    constructor() {
        this.isLoading = false;
        this.currentLoadingType = 'spinner'; // 'spinner', 'skeleton', 'progress'
        this.loadingOverlay = null;
        this.navigationDelay = 100; // ms
        this.init();
    }

    /**
     * Initialize the loading state manager
     */
    init() {
        this.createLoadingOverlay();
        this.setupNavigationListeners();
        this.setupPageLoadListeners();
    }

    /**
     * Create the global loading overlay
     */
    createLoadingOverlay() {
        // Check if overlay already exists
        if (document.querySelector('.loading-overlay')) {
            this.loadingOverlay = document.querySelector('.loading-overlay');
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-text animated">Loading</div>
      <div class="spinner-progress">
        <div class="spinner-progress-bar"></div>
      </div>
    `;

        document.body.appendChild(overlay);
        this.loadingOverlay = overlay;
    }    /**
     * Show the loading overlay
     */
    show() {
        if (this.loadingOverlay) {
            this.isLoading = true;
            this.loadingOverlay.classList.add('active');
        }
    }

    /**
     * Hide the loading overlay
     */
    hide() {
        if (this.loadingOverlay) {
            this.isLoading = false;
            this.loadingOverlay.classList.remove('active');
        }
    }

    /**
     * Toggle loading state
     */
    toggle(show) {
        if (show) {
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * Setup listeners for internal page navigation (anchor links)
     */
    setupNavigationListeners() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            const href = link.getAttribute('href');
            // Don't show loading for hash navigation within the same page
            if (href !== '#' && href !== '') {
                this.show();
                setTimeout(() => this.hide(), this.navigationDelay);
            }
        });
    }

    /**
     * Setup page load listeners
     */
    setupPageLoadListeners() {
        // Show loading when page starts loading
        window.addEventListener('beforeunload', () => {
            this.show();
        });

        // Hide loading when page fully loads
        window.addEventListener('load', () => {
            setTimeout(() => this.hide(), 500);
        });

        // Hide on navigation away
        window.addEventListener('pagehide', () => {
            this.show();
        });
    }

    /**
     * Show skeleton loader for a specific section
     */
    showSkeleton(selector, skeletonHTML) {
        const section = document.querySelector(selector);
        if (!section) return;

        // Hide original content
        const originalContent = section.innerHTML;
        section.classList.add('content-loading');

        // Show skeleton
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-placeholder active';
        skeleton.innerHTML = skeletonHTML;

        section.prepend(skeleton);

        return {
            element: section,
            skeleton: skeleton,
            originalContent: originalContent,
            restore: () => this.restoreContent(section, originalContent)
        };
    }

    /**
     * Restore content after skeleton
     */
    restoreContent(section, originalContent) {
        const skeleton = section.querySelector('.skeleton-placeholder');
        if (skeleton) {
            skeleton.remove();
        }
        section.classList.remove('content-loading');
    }

    /**
     * Show loading on a specific section
     */
    showSectionLoading(selector) {
        const section = document.querySelector(selector);
        if (section) {
            section.classList.add('section-loading', 'loading');
        }
    }

    /**
     * Hide loading on a specific section
     */
    hideSectionLoading(selector) {
        const section = document.querySelector(selector);
        if (section) {
            section.classList.remove('loading');
        }
    }

    /**
     * Create a spinner element
     */
    createSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        return spinner;
    }

    /**
     * Create a pulse spinner element
     */
    createPulseSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'spinner-pulse';
        return spinner;
    }

    /**
     * Simulate content loading with callback
     */
    async loadContent(callback, duration = 1000) {
        this.show();
        try {
            await new Promise((resolve) => setTimeout(resolve, duration));
            if (callback && typeof callback === 'function') {
                callback();
            }
        } finally {
            this.hide();
        }
    }
}

/**
 * ============================================================================
 * SKELETON TEMPLATE GENERATORS
 * ============================================================================
 */

class SkeletonGenerator {
    /**
     * Generate service card skeleton
     */
    static generateServiceSkeleton() {
        return `
      <div class="skeleton-services">
        <div class="skeleton-service-card">
          <div class="skeleton-icon"></div>
          <div class="skeleton-text skeleton-heading"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
        </div>
        <div class="skeleton-service-card">
          <div class="skeleton-icon"></div>
          <div class="skeleton-text skeleton-heading"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
        </div>
        <div class="skeleton-service-card">
          <div class="skeleton-icon"></div>
          <div class="skeleton-text skeleton-heading"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
        </div>
      </div>
    `;
    }

    /**
     * Generate card skeleton
     */
    static generateCardSkeleton(count = 3) {
        let html = '<div class="skeleton-services">';
        for (let i = 0; i < count; i++) {
            html += `
        <div class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-heading"></div>
          <div class="skeleton-paragraph">
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>
      `;
        }
        html += '</div>';
        return html;
    }

    /**
     * Generate testimonial skeleton
     */
    static generateTestimonialSkeleton(count = 3) {
        let html = '<div class="skeleton-testimonials">';
        for (let i = 0; i < count; i++) {
            html += `
        <div class="skeleton-testimonial-card">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-paragraph">
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
          </div>
          <div style="display: flex; gap: 4px; margin-top: 12px;">
            <div class="skeleton-text" style="width: 60px;"></div>
          </div>
        </div>
      `;
        }
        html += '</div>';
        return html;
    }

    /**
     * Generate form skeleton
     */
    static generateFormSkeleton() {
        return `
      <div class="skeleton-form">
        <div class="skeleton-input"></div>
        <div class="skeleton-input"></div>
        <div class="skeleton-textarea"></div>
        <div class="skeleton-input" style="width: 150px;"></div>
      </div>
    `;
    }

    /**
     * Generate list item skeleton
     */
    static generateListItemSkeleton(count = 3) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
        <div class="skeleton-item">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-content">
            <div class="skeleton-text skeleton-heading" style="width: 150px;"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>
      `;
        }
        return html;
    }

    /**
     * Generate image skeleton
     */
    static generateImageSkeleton() {
        return '<div class="skeleton-image"></div>';
    }
}

/**
 * ============================================================================
 * NETWORK STATE DETECTOR
 * Detects slow networks and shows appropriate loading indicators
 * ============================================================================
 */

class NetworkDetector {
    constructor() {
        this.isSlowNetwork = false;
        this.init();
    }

    init() {
        // Check using Navigation Timing API
        if (window.performance && window.performance.navigation) {
            this.checkNetworkSpeed();
        }

        // Listen for online/offline events
        window.addEventListener('online', () => this.onOnline());
        window.addEventListener('offline', () => this.onOffline());
    }

    checkNetworkSpeed() {
        const navigation = window.performance.navigation;
        const timing = window.performance.timing;

        if (timing.loadEventEnd > 0) {
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            this.isSlowNetwork = loadTime > 3000; // More than 3 seconds = slow
        }
    }

    onOnline() {
        console.log('Network: Online');
        // Optionally reload content if needed
    }

    onOffline() {
        console.log('Network: Offline');
        // Show offline indicator
        this.showOfflineIndicator();
    }

    showOfflineIndicator() {
        if (document.querySelector('.offline-indicator')) return;

        const indicator = document.createElement('div');
        indicator.className = 'offline-indicator';
        indicator.innerHTML = `
      <div style="padding: 12px; background: #f39c12; color: white; text-align: center;">
        You are offline. Some features may be limited.
      </div>
    `;
        document.body.insertBefore(indicator, document.body.firstChild);

        setTimeout(() => {
            if (navigator.onLine) {
                indicator.remove();
            }
        }, 5000);
    }
}

/**
 * ============================================================================
 * INITIALIZE MANAGERS ON DOCUMENT READY
 * ============================================================================
 */

// Create global instances
let loadingManager = null;
let networkDetector = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadingManager = new LoadingStateManager();
        networkDetector = new NetworkDetector();
    });
} else {
    // DOM is already loaded
    loadingManager = new LoadingStateManager();
    networkDetector = new NetworkDetector();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LoadingStateManager,
        SkeletonGenerator,
        NetworkDetector
    };
}

window.addEventListener("network-status-change", (e) => {
  if (e.detail.online) {
    document.querySelectorAll(".loading").forEach(el => {
      el.classList.remove("loading");
    });
  }
});

