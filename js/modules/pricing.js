/**
 * ========================================
 * PRICING PAGE INTERACTIVE FEATURES
 * Modern UX enhancements and animations
 * ========================================
 */

(function () {
    'use strict';

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    const PricingState = {
        currentPlan: 'local',
        isTransitioning: false,
        comparisonExpanded: []
    };

    // ========================================
    // PRICING TOGGLE WITH ENHANCED UX
    // ========================================
    function initPricingToggle() {
        const toggleOptions = document.querySelectorAll('.pricing-page .toggle-option');
        const saveBadge = document.querySelector('.pricing-page .save-badge');

        toggleOptions.forEach(option => {
            option.addEventListener('click', function () {
                if (PricingState.isTransitioning) return;

                const planType = this.getAttribute('data-plan');
                if (PricingState.currentPlan === planType) return;

                PricingState.isTransitioning = true;

                // Haptic feedback simulation (visual pulse)
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);

                // Remove active class from all options
                toggleOptions.forEach(opt => opt.classList.remove('active'));

                // Add active class to clicked option with slide animation
                this.classList.add('active');

                // Show savings badge with bounce effect
                if (planType === 'interstate' && saveBadge) {
                    saveBadge.style.animation = 'none';
                    setTimeout(() => {
                        saveBadge.style.animation = 'badgePulse 1.5s ease-in-out infinite';
                    }, 10);
                }

                // Update prices with smooth transition
                updatePrices(planType);

                // Update state
                PricingState.currentPlan = planType;

                setTimeout(() => {
                    PricingState.isTransitioning = false;
                }, 600);
            });

            // Add hover effect
            option.addEventListener('mouseenter', function () {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'scale(1.02)';
                }
            });

            option.addEventListener('mouseleave', function () {
                if (!this.classList.contains('active')) {
                    this.style.transform = '';
                }
            });
        });
    }

    // ========================================
    // SMOOTH PRICE TRANSITION
    // ========================================
    function updatePrices(planType) {
        const priceElements = document.querySelectorAll('.pricing-page .amount');
        const pricingCards = document.querySelectorAll('.pricing-page .pricing-card');

        pricingCards.forEach((card, index) => {
            // Add updating class for animation
            card.classList.add('price-updating');

            setTimeout(() => {
                const priceElement = card.querySelector('.pricing-page .amount');
                if (priceElement) {
                    const newPrice = priceElement.getAttribute(`data-${planType}`);
                    if (newPrice) {
                        // Format the price with commas
                        const formattedPrice = parseInt(newPrice).toLocaleString('en-IN');

                        // Animate number change
                        animateNumberChange(priceElement, formattedPrice);
                    }
                }

                // Remove updating class after animation
                setTimeout(() => {
                    card.classList.remove('price-updating');
                }, 300);
            }, index * 100);
        });
    }

    // ========================================
    // ANIMATED NUMBER COUNTER
    // ========================================
    function animateNumberChange(element, targetValue) {
        const currentValue = element.textContent.replace(/,/g, '');
        const target = parseInt(targetValue.replace(/,/g, ''));
        const current = parseInt(currentValue);
        const duration = 400;
        const steps = 20;
        const stepValue = (target - current) / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newValue = Math.round(current + (stepValue * currentStep));

            if (currentStep >= steps) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = newValue.toLocaleString('en-IN');
            }
        }, duration / steps);
    }

    // ========================================
    // PRICING CARD INTERACTIONS
    // ========================================
    function initPricingCards() {
        const pricingCards = document.querySelectorAll('.pricing-page .pricing-card');

        pricingCards.forEach(card => {
            // Animate features on card hover
            card.addEventListener('mouseenter', function () {
                const features = card.querySelectorAll('.pricing-page .feature-icon i');
                features.forEach((icon, index) => {
                    setTimeout(() => {
                        icon.style.animation = 'none';
                        setTimeout(() => {
                            icon.style.animation = 'checkmarkReveal 0.6s ease-out forwards';
                        }, 10);
                    }, index * 50);
                });
            });
        });
    }

    // ========================================
    // COMPARISON TABLE ENHANCEMENTS
    // ========================================
    function initComparisonTable() {
        const comparisonRows = document.querySelectorAll('.pricing-page .comparison-table tbody tr');

        comparisonRows.forEach(row => {
            row.addEventListener('mouseenter', function () {
                // Highlight corresponding column
                const cells = this.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (index > 0) {
                        cell.style.background = 'rgba(255, 107, 53, 0.05)';
                    }
                });
            });

            row.addEventListener('mouseleave', function () {
                const cells = this.querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.background = '';
                });
            });
        });

        // Sticky header detection
        const comparisonSection = document.querySelector('.pricing-page .comparison-section');
        if (comparisonSection) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    const thead = document.querySelector('.pricing-page .comparison-table thead');
                    if (thead) {
                        if (!entry.isIntersecting) {
                            thead.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
                        } else {
                            thead.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
                        }
                    }
                },
                { threshold: 0.1 }
            );

            observer.observe(comparisonSection);
        }
    }

    // ========================================
    // MOBILE COMPARISON CARDS
    // ========================================
    function initMobileComparison() {
        if (window.innerWidth > 768) return;

        const comparisonSection = document.querySelector('.pricing-page .comparison-section');
        if (!comparisonSection) return;

        const tableWrapper = comparisonSection.querySelector('.pricing-page .comparison-table-wrapper');
        if (!tableWrapper) return;

        // Create mobile cards from table data
        const table = tableWrapper.querySelector('.pricing-page .comparison-table');
        const headers = Array.from(table.querySelectorAll('thead th')).slice(1);
        const rows = table.querySelectorAll('tbody tr');

        const mobileContainer = document.createElement('div');
        mobileContainer.className = 'comparison-mobile-container';

        headers.forEach((header, planIndex) => {
            const card = document.createElement('div');
            card.className = 'comparison-mobile-card';
            card.innerHTML = `
                <div class="comparison-mobile-header">
                    <h3>${header.textContent}</h3>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="comparison-mobile-content">
                    ${Array.from(rows).map(row => {
                        const cells = row.querySelectorAll('td');
                        return `
                            <div class="comparison-mobile-item">
                                <span class="comparison-mobile-label">${cells[0].textContent}</span>
                                <span class="comparison-mobile-value">${cells[planIndex + 1].innerHTML}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            // Add click handler for expand/collapse
            const cardHeader = card.querySelector('.comparison-mobile-header');
            cardHeader.addEventListener('click', function () {
                card.classList.toggle('expanded');
            });

            mobileContainer.appendChild(card);
        });

        // Replace table with mobile cards
        tableWrapper.style.display = 'none';
        comparisonSection.appendChild(mobileContainer);
    }

    // ========================================
    // SCROLL ANIMATIONS - DISABLED
    // ========================================
    function initScrollAnimations() {
        // All scroll animations disabled for pricing cards
        return;
    }

    // ========================================
    // CTA BUTTON RIPPLE EFFECT
    // ========================================
    function initCtaButtons() {
        const ctaButtons = document.querySelectorAll('.pricing-page .cta-button');

        ctaButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                button.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation to stylesheet if not exists
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ========================================
    // POPULAR BADGE GLOW EFFECT
    // ========================================
    function initPopularBadge() {
        const popularBadge = document.querySelector('.pricing-page .popular-badge');
        if (popularBadge) {
            // Add particle effect on hover
            popularBadge.addEventListener('mouseenter', function () {
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        createSparkle(this);
                    }, i * 100);
                }
            });
        }
    }

    function createSparkle(element) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            animation: sparkleFloat 1s ease-out forwards;
        `;

        const rect = element.getBoundingClientRect();
        sparkle.style.left = `${Math.random() * rect.width}px`;
        sparkle.style.top = `${rect.height / 2}px`;

        element.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);

        // Add sparkle animation if not exists
        if (!document.querySelector('#sparkle-animation')) {
            const style = document.createElement('style');
            style.id = 'sparkle-animation';
            style.textContent = `
                @keyframes sparkleFloat {
                    0% {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-20px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ========================================
    // KEYBOARD NAVIGATION
    // ========================================
    function initKeyboardNavigation() {
        const toggleOptions = document.querySelectorAll('.pricing-page .toggle-option');

        toggleOptions.forEach((option, index) => {
            option.setAttribute('tabindex', '0');
            option.setAttribute('role', 'button');
            option.setAttribute('aria-pressed', option.classList.contains('active'));

            option.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                } else if (e.key === 'ArrowLeft' && index > 0) {
                    toggleOptions[index - 1].focus();
                } else if (e.key === 'ArrowRight' && index < toggleOptions.length - 1) {
                    toggleOptions[index + 1].focus();
                }
            });
        });
    }

    // ========================================
    // PRICE CALCULATOR TOOLTIP
    // ========================================
    function initPriceTooltips() {
        const priceAmounts = document.querySelectorAll('.pricing-page .price-amount');

        priceAmounts.forEach(amount => {
            amount.setAttribute('title', 'Click to see detailed breakdown');
            amount.style.cursor = 'help';

            amount.addEventListener('click', function (e) {
                e.preventDefault();
                showPriceBreakdown(this);
            });
        });
    }

    function showPriceBreakdown(element) {
        // Create a simple tooltip showing price breakdown
        const tooltip = document.createElement('div');
        tooltip.className = 'price-breakdown-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: #1a1a1a;
            border: 2px solid #ff6b35;
            border-radius: 10px;
            padding: 15px;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            animation: fadeIn 0.3s ease-out;
            min-width: 200px;
        `;

        const card = element.closest('.pricing-card');
        const planName = card.querySelector('.plan-name').textContent;
        const price = element.querySelector('.amount').textContent;

        tooltip.innerHTML = `
            <h4 style="color: #ff6b35; margin-bottom: 10px;">${planName} Plan</h4>
            <div style="color: #cccccc; font-size: 0.9em;">
                <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                    <span>Base Price:</span>
                    <span>₹${price}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                    <span>GST (18%):</span>
                    <span>Included</span>
                </div>
                <div style="border-top: 1px solid #3d3d3d; margin-top: 10px; padding-top: 10px;">
                    <small style="color: #888;">* Prices may vary based on distance and vehicle type</small>
                </div>
            </div>
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 10}px`;

        // Remove on click outside
        const removeTooltip = (e) => {
            if (!tooltip.contains(e.target) && !element.contains(e.target)) {
                tooltip.remove();
                document.removeEventListener('click', removeTooltip);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', removeTooltip);
        }, 100);
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAll);
        } else {
            initializeAll();
        }
    }

    function initializeAll() {
        console.log('Initializing Pricing Page Enhancements...');

        initPricingToggle();
        initPricingCards();
        initComparisonTable();
        initMobileComparison();
        // initScrollAnimations(); // Disabled - no animations on cards
        initCtaButtons();
        initPopularBadge();
        initKeyboardNavigation();
        initPriceTooltips();

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth <= 768) {
                    initMobileComparison();
                }
            }, 250);
        });

        console.log('Pricing Page Enhancements Initialized Successfully!');
    }

    // Start initialization
    init();

})();



