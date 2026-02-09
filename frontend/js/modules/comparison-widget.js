/* ====================================
   COMPETITOR COMPARISON WIDGET MODULE
   Dynamic "Us vs Them" Module
   ==================================== */

const ComparisonWidget = (function () {
  'use strict';

  // Comparison Data - Harihar vs Competitors
  const COMPARISON_DATA = {
    title: "Why Choose Harihar Car Carriers?",
    subtitle: "See how we compare to other transport services",
    features: [
      {
        feature: "Insurance Coverage",
        harihar: { text: "Fully Included", icon: "shield-alt", included: true },
        competitors: { text: "Extra ₹500-800", icon: "times-circle", included: false }
      },
      {
        feature: "Door-to-Door Service",
        harihar: { text: "Free Pickup & Drop", icon: "home", included: true },
        competitors: { text: "₹300-500 Extra", icon: "times-circle", included: false }
      },
      {
        feature: "Real-Time Tracking",
        harihar: { text: "GPS Live Tracking", icon: "map-marker-alt", included: true },
        competitors: { text: "Basic/Limited", icon: "exclamation-triangle", included: false }
      },
      {
        feature: "Customer Support",
        harihar: { text: "24/7 Available", icon: "headset", included: true },
        competitors: { text: "Limited Hours", icon: "clock", included: false }
      },
      {
        feature: "Vehicle Inspection",
        harihar: { text: "Before & After", icon: "clipboard-check", included: true },
        competitors: { text: "Basic Only", icon: "minus-circle", included: false }
      },
      {
        feature: "Damage Claims",
        harihar: { text: "Quick Resolution", icon: "bolt", included: true },
        competitors: { text: "Slow Process", icon: "hourglass-half", included: false }
      }
    ],
    savings: {
      message: "You save an average of ₹1,200 with our all-inclusive pricing!",
      highlight: "No Hidden Charges"
    }
  };

  /**
   * Generate HTML for comparison widget
   */
  function generateHTML() {
    const featuresHTML = COMPARISON_DATA.features.map(item => {
      return `
                <div class="comparison-row">
                    <div class="feature-name">
                        <span>${item.feature}</span>
                    </div>
                    <div class="harihar-value ${item.harihar.included ? 'included' : ''}">
                        <i class="fas fa-${item.harihar.icon}"></i>
                        <span>${item.harihar.text}</span>
                    </div>
                    <div class="competitor-value ${item.competitors.included ? 'included' : 'not-included'}">
                        <i class="fas fa-${item.competitors.icon}"></i>
                        <span>${item.competitors.text}</span>
                    </div>
                </div>
            `;
    }).join('');

    return `
            <div class="comparison-widget" id="comparisonWidget">
                <div class="comparison-widget-inner">
                    <div class="comparison-header">
                        <h3>${COMPARISON_DATA.title}</h3>
                        <p>${COMPARISON_DATA.subtitle}</p>
                    </div>

                    <div class="comparison-table">
                        <div class="comparison-table-header">
                            <div class="header-feature">Features</div>
                            <div class="header-harihar">
                                <i class="fas fa-check-circle"></i>
                                <span>Harihar Car Carriers</span>
                            </div>
                            <div class="header-competitor">
                                <i class="fas fa-building"></i>
                                <span>Other Services</span>
                            </div>
                        </div>

                        <div class="comparison-body">
                            ${featuresHTML}
                        </div>
                    </div>

                    <div class="comparison-savings">
                        <div class="savings-badge">
                            <i class="fas fa-tags"></i>
                            <div class="savings-text">
                                <strong>${COMPARISON_DATA.savings.highlight}</strong>
                                <span>${COMPARISON_DATA.savings.message}</span>
                            </div>
                        </div>
                    </div>

                    <div class="comparison-cta">
                        <button class="comparison-book-btn" id="comparisonBookBtn">
                            <i class="fas fa-check-circle"></i>
                            <span>Book with Confidence</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * Inject widget into the DOM after quote result
   */
  function inject(targetSelector = '#quoteResult') {
    const target = document.querySelector(targetSelector);

    if (!target) {
      console.warn('ComparisonWidget: Target element not found');
      return false;
    }

    // Check if widget already exists
    if (document.getElementById('comparisonWidget')) {
      console.log('ComparisonWidget: Already exists, skipping injection');
      return true;
    }

    const widgetHTML = generateHTML();
    target.insertAdjacentHTML('afterend', widgetHTML);

    // Setup event listeners
    setupEventListeners();

    // Animate entrance
    setTimeout(() => {
      const widget = document.getElementById('comparisonWidget');
      if (widget) {
        widget.classList.add('visible');
      }
    }, 100);

    console.log('ComparisonWidget: Injected successfully');
    return true;
  }

  /**
   * Remove widget from DOM
   */
  function remove() {
    const widget = document.getElementById('comparisonWidget');
    if (widget) {
      widget.classList.remove('visible');
      setTimeout(() => {
        widget.remove();
        console.log('ComparisonWidget: Removed');
      }, 300);
    }
  }

  /**
   * Setup event listeners for widget interactions
   */
  function setupEventListeners() {
    const bookBtn = document.getElementById('comparisonBookBtn');

    if (bookBtn) {
      bookBtn.addEventListener('click', handleBookingClick);
    }
  }

  /**
   * Handle booking button click
   */
  function handleBookingClick() {
    console.log('ComparisonWidget: Book button clicked');

    // Trigger existing book now functionality
    const mainBookBtn = document.getElementById('bookNowBtn');
    if (mainBookBtn) {
      mainBookBtn.click();
    } else {
      // Fallback: redirect to booking page
      const currentPath = window.location.pathname;
      if (currentPath.includes('/pages/')) {
        window.location.href = 'booking.html';
      } else {
        window.location.href = 'pages/booking.html';
      }
    }
  }

  /**
   * Update widget with dynamic data (optional)
   */
  function updateSavings(amount) {
    const savingsText = document.querySelector('.savings-text span');
    if (savingsText) {
      savingsText.textContent = `You save an average of ₹${amount.toLocaleString('en-IN')} with our all-inclusive pricing!`;
    }
  }

  // Public API
  return {
    inject,
    remove,
    updateSavings,
    getData: () => COMPARISON_DATA
  };

})();

// Export to window for global access
window.ComparisonWidget = ComparisonWidget;

// Auto-initialize when DOM is ready
(function () {
  'use strict';

  function autoInit() {
    // Check if we're on a page with quote results
    const quoteResult = document.getElementById('quoteResult');

    if (quoteResult) {
      // Listen for when quote is calculated and displayed
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            const resultAmount = document.getElementById('resultAmount');

            if (resultAmount && resultAmount.textContent !== '₹0') {
              // Quote is displayed, inject comparison widget
              const step3 = document.querySelector('.form-step[data-step="3"]');

              if (step3 && step3.classList.contains('active')) {
                setTimeout(() => {
                  ComparisonWidget.inject('#quoteResult');
                }, 500);
              }
            }
          }
        });
      });

      // Start observing
      observer.observe(quoteResult.parentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

})();
