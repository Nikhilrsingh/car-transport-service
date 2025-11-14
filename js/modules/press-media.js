// Press & Media Kit JavaScript
(function() {
    'use strict';

    // Download Asset Function
    window.downloadAsset = function(assetType) {
        // Show notification
        showNotification('Preparing download...', 'info');

        // Simulate download process
        setTimeout(() => {
            showNotification(`${getAssetName(assetType)} download started!`, 'success');
            
            // In a real implementation, this would trigger actual file download
            console.log(`Downloading asset: ${assetType}`);
            
            // Track download analytics
            trackDownload(assetType);
        }, 500);
    };

    // Download Press Release Function
    window.downloadPressRelease = function(releaseId) {
        showNotification('Preparing press release download...', 'info');

        setTimeout(() => {
            showNotification('Press release downloaded successfully!', 'success');
            console.log(`Downloading press release: ${releaseId}`);
            trackDownload('press-release-' + releaseId);
        }, 500);
    };

    // Get Asset Name
    function getAssetName(assetType) {
        const assetNames = {
            'logo-package': 'Company Logo Package',
            'brand-guidelines': 'Brand Guidelines',
            'press-photos': 'Press Photos',
            'fact-sheet': 'Company Fact Sheet',
            'infographics': 'Infographics',
            'company-video': 'Company Video'
        };
        return assetNames[assetType] || 'Asset';
    }

    // Track Downloads
    function trackDownload(assetType) {
        // In real implementation, send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'asset_type': assetType,
                'page_location': window.location.href
            });
        }
        console.log('Download tracked:', assetType);
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.media-notification');
        if (existing) {
            existing.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `media-notification ${type}`;
        
        const icon = getNotificationIcon(type);
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Add show class for animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Get Notification Icon
    function getNotificationIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Media Inquiry Form Submission
    const mediaForm = document.getElementById('mediaInquiryForm');
    if (mediaForm) {
        mediaForm.addEventListener('submit', handleMediaInquiry);
    }

    function handleMediaInquiry(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        // Validate form
        if (!validateMediaForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('.submit-inquiry-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        // Simulate form submission
        setTimeout(() => {
            // In real implementation, send to server
            console.log('Media inquiry submitted:', data);

            // Show success message
            showNotification('Your inquiry has been submitted successfully! We\'ll get back to you within 24 hours.', 'success');

            // Reset form
            e.target.reset();

            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Send confirmation email (in real implementation)
            sendConfirmationEmail(data);
        }, 1500);
    }

    // Validate Media Form
    function validateMediaForm(data) {
        // Check required fields
        if (!data.mediaName || !data.mediaOrg || !data.mediaEmail || !data.inquiryType || !data.mediaMessage) {
            showNotification('Please fill in all required fields', 'error');
            return false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.mediaEmail)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }

        // Validate message length
        if (data.mediaMessage.length < 20) {
            showNotification('Please provide more details in your message (minimum 20 characters)', 'error');
            return false;
        }

        return true;
    }

    // Send Confirmation Email
    function sendConfirmationEmail(data) {
        console.log('Sending confirmation email to:', data.mediaEmail);
        // In real implementation, call backend API
    }

    // Smooth Scroll for Quick Links
    const quickLinks = document.querySelectorAll('.quick-link-card');
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80; // Account for fixed header
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add CSS for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .media-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
        }

        .media-notification.show {
            transform: translateX(0);
        }

        .media-notification i {
            font-size: 1.3rem;
        }

        .media-notification.success {
            border-left: 4px solid #28a745;
        }

        .media-notification.success i {
            color: #28a745;
        }

        .media-notification.error {
            border-left: 4px solid #dc3545;
        }

        .media-notification.error i {
            color: #dc3545;
        }

        .media-notification.warning {
            border-left: 4px solid #ffc107;
        }

        .media-notification.warning i {
            color: #ffc107;
        }

        .media-notification.info {
            border-left: 4px solid #17a2b8;
        }

        .media-notification.info i {
            color: #17a2b8;
        }

        .media-notification span {
            color: #333;
            font-weight: 500;
            line-height: 1.4;
        }

        @media (max-width: 480px) {
            .media-notification {
                right: 10px;
                left: 10px;
                max-width: calc(100% - 20px);
            }
        }
    `;
    document.head.appendChild(notificationStyles);

    // View Counter for Press Releases
    function incrementViewCount(releaseId) {
        // In real implementation, update database
        console.log('View count incremented for:', releaseId);
    }

    // Print functionality for press releases
    window.printPressRelease = function(releaseId) {
        showNotification('Preparing print view...', 'info');
        // In real implementation, open print-friendly version
        setTimeout(() => {
            window.print();
        }, 500);
    };

    // Copy media contact to clipboard
    window.copyMediaContact = function(contactInfo) {
        navigator.clipboard.writeText(contactInfo).then(() => {
            showNotification('Contact information copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Failed to copy. Please try again.', 'error');
        });
    };

    // Track page views
    function trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                'page_title': 'Press & Media Kit',
                'page_location': window.location.href
            });
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        trackPageView();
        console.log('Press & Media Kit page initialized');
    });

    // Handle external link clicks
    const externalLinks = document.querySelectorAll('.media-link');
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track external link clicks
            const url = this.getAttribute('href');
            if (url && url !== '#') {
                console.log('External link clicked:', url);
                // In real implementation, track with analytics
            }
        });
    });

})();
