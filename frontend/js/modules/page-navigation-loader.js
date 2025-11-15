/**
 * ============================================================================
 * PAGE NAVIGATION LOADING HANDLER
 * Handles loading indicators for page navigation and section transitions
 * ============================================================================
 */

class PageNavigationLoader {
    constructor() {
        this.isNavigating = false;
        this.navigationTimeout = null;
        this.init();
    }

    init() {
        this.setupInternalNavigation();
        this.setupExternalLinkNavigation();
        this.setupAjaxIntegration();
    }

    /**
     * Setup listeners for internal page navigation (anchor links)
     */
    setupInternalNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link || this.isNavigating) return;

            const href = link.getAttribute('href');
            const target = document.querySelector(href);

            // Only show loading for valid anchor targets
            if (target && href !== '#' && href !== '') {
                this.handleInternalNavigation(link, target, href);
            }
        });
    }

    /**
     * Handle internal anchor navigation with loading indicator
     */
    handleInternalNavigation(link, target, href) {
        this.isNavigating = true;

        // Get the section type to determine skeleton
        const sectionType = this.determineSectionType(target);

        // Show loading indicator
        if (loadingManager) {
            loadingManager.show();
        }

        // Simulate loading time (in real scenarios, this would be actual content loading)
        this.navigationTimeout = setTimeout(() => {
            // Smooth scroll to target
            target.scrollIntoView({ behavior: 'smooth' });

            // Hide loading indicator
            if (loadingManager) {
                loadingManager.hide();
            }

            this.isNavigating = false;
        }, 300);
    }

    /**
     * Setup listeners for external link navigation
     */
    setupExternalLinkNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a:not([href^="#"])');
            if (!link || !link.href || this.isNavigating) return;

            // Skip special links
            if (
                link.target === '_blank' ||
                link.target === '_new' ||
                link.href.includes('javascript:') ||
                link.classList.contains('no-loading-indicator')
            ) {
                return;
            }

            // Check if it's an external link to a different page
            const currentHost = window.location.hostname;
            const linkHost = new URL(link.href, window.location.origin).hostname;

            if (
                linkHost === currentHost &&
                !link.href.includes('javascript:') &&
                link.pathname !== window.location.pathname
            ) {
                this.handleExternalNavigation(link);
            }
        });
    }

    /**
     * Handle navigation to external pages with loading indicator
     */
    handleExternalNavigation(link) {
        this.isNavigating = true;

        // Show loading indicator
        if (loadingManager) {
            loadingManager.show();
        }

        // Allow some time for the page transition
        this.navigationTimeout = setTimeout(() => {
            // Page will navigate via browser default behavior
            // But we ensure loading indicator shows during transition
        }, 100);
    }

    /**
     * Setup AJAX/dynamic content loading integration
     */
    setupAjaxIntegration() {
        // Intercept fetch calls
        const originalFetch = window.fetch;

        window.fetch = async function (...args) {
            // Show loading indicator for fetch requests (optional - can be customized)
            const showLoading =
                args[1]?.showLoading !== false && args[0].includes('api');

            if (showLoading && loadingManager) {
                loadingManager.show();
            }

            try {
                const response = await originalFetch.apply(this, args);
                if (showLoading && loadingManager) {
                    loadingManager.hide();
                }
                return response;
            } catch (error) {
                if (showLoading && loadingManager) {
                    loadingManager.hide();
                }
                throw error;
            }
        };
    }

    /**
     * Determine section type from DOM element
     */
    determineSectionType(element) {
        if (!element) return 'default';

        const id = element.id || '';
        const classList = element.className || '';

        if (id.includes('service') || classList.includes('service')) {
            return 'service';
        } else if (id.includes('test') || classList.includes('test')) {
            return 'testimonial';
        } else if (id.includes('book') || classList.includes('book')) {
            return 'form';
        } else if (id.includes('contact') || classList.includes('contact')) {
            return 'form';
        } else if (id.includes('gallery') || classList.includes('gallery')) {
            return 'gallery';
        } else if (id.includes('pricing') || classList.includes('pricing')) {
            return 'pricing';
        }

        return 'default';
    }

    /**
     * Show loading for a specific section
     */
    showSectionLoading(selector, skeletonType = 'default') {
        const section = document.querySelector(selector);
        if (!section) return;

        if (loadingManager) {
            let skeleton;

            switch (skeletonType) {
                case 'service':
                    skeleton = SkeletonGenerator.generateServiceSkeleton();
                    break;
                case 'testimonial':
                    skeleton = SkeletonGenerator.generateTestimonialSkeleton();
                    break;
                case 'form':
                    skeleton = SkeletonGenerator.generateFormSkeleton();
                    break;
                case 'card':
                    skeleton = SkeletonGenerator.generateCardSkeleton();
                    break;
                default:
                    skeleton = SkeletonGenerator.generateCardSkeleton();
            }

            loadingManager.showSkeleton(selector, skeleton);
        }
    }

    /**
     * Restore section content
     */
    restoreSectionContent(selector) {
        const section = document.querySelector(selector);
        if (!section && loadingManager) {
            loadingManager.restoreContent(section, '');
        }
    }

    /**
     * Cancel current navigation loading
     */
    cancel() {
        if (this.navigationTimeout) {
            clearTimeout(this.navigationTimeout);
        }

        if (loadingManager) {
            loadingManager.hide();
        }

        this.isNavigating = false;
    }
}

/**
 * ============================================================================
 * SECTION-SPECIFIC LOADING HANDLERS
 * ============================================================================
 */

class SectionLoadingHandler {
    /**
     * Show loading for booking section
     */
    static showBookingLoading() {
        if (!loadingManager) return;

        const skeleton = SkeletonGenerator.generateFormSkeleton();
        loadingManager.showSkeleton('.booking-form', skeleton);
    }

    /**
     * Hide loading for booking section
     */
    static hideBookingLoading() {
        if (!loadingManager) return;
        const section = document.querySelector('.booking-form');
        if (section) {
            loadingManager.restoreContent(section, section.innerHTML);
        }
    }

    /**
     * Show loading for services section
     */
    static showServicesLoading() {
        if (!loadingManager) return;

        const skeleton = SkeletonGenerator.generateServiceSkeleton();
        loadingManager.showSkeleton('#services', skeleton);
    }

    /**
     * Show loading for testimonials
     */
    static showTestimonialsLoading() {
        if (!loadingManager) return;

        const skeleton = SkeletonGenerator.generateTestimonialSkeleton();
        loadingManager.showSkeleton('.testimonials', skeleton);
    }

    /**
     * Show loading for gallery
     */
    static showGalleryLoading() {
        if (!loadingManager) return;

        const skeleton = SkeletonGenerator.generateCardSkeleton(6);
        loadingManager.showSkeleton('.gallery-container', skeleton);
    }

    /**
     * Show loading for pricing
     */
    static showPricingLoading() {
        if (!loadingManager) return;

        const skeleton = SkeletonGenerator.generateCardSkeleton(3);
        loadingManager.showSkeleton('.pricing-container', skeleton);
    }
}

/**
 * ============================================================================
 * LAZY LOADING INTEGRATION
 * ============================================================================
 */

class LazyLoadingManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupImageLazyLoading();
    }

    /**
     * Setup Intersection Observer for lazy loading
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Show loading for coming into view
                    const section = entry.target;

                    // Add loading class temporarily
                    section.classList.add('section-loading');

                    // Simulate loading
                    setTimeout(() => {
                        section.classList.remove('section-loading');
                    }, 300);

                    observer.unobserve(section);
                }
            });
        }, options);

        // Observe all main sections
        document.querySelectorAll('section').forEach((section) => {
            observer.observe(section);
        });
    }

    /**
     * Setup image lazy loading with loading indicator
     */
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-lazy]');

        images.forEach((img) => {
            const src = img.getAttribute('data-lazy');
            if (!src) return;

            // Create image load wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'image-loading-wrapper';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);

            // Show skeleton while loading
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-image';
            wrapper.appendChild(skeleton);

            // Load image
            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = src;
                img.removeAttribute('data-lazy');
                skeleton.remove();
            };
            tempImg.onerror = () => {
                skeleton.remove();
            };
            tempImg.src = src;
        });
    }
}

/**
 * ============================================================================
 * INITIALIZE ON PAGE READY
 * ============================================================================
 */

let pageNavigationLoader = null;
let lazyLoadingManager = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        pageNavigationLoader = new PageNavigationLoader();
        lazyLoadingManager = new LazyLoadingManager();
    });
} else {
    pageNavigationLoader = new PageNavigationLoader();
    lazyLoadingManager = new LazyLoadingManager();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PageNavigationLoader,
        SectionLoadingHandler,
        LazyLoadingManager
    };
}
