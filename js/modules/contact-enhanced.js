// Enhanced Contact Page Module
(function () {
  'use strict';

  // Initialize all enhanced features
  document.addEventListener('DOMContentLoaded', function () {
    initInteractiveMap();
    initFAQEnhancements();
    initContactCards();
    initEnhancedForm();
  });

  // ==================== INTERACTIVE MAP ====================
  function initInteractiveMap() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;

    const mapEmbed = mapContainer.querySelector('.map-embed');
    const mapLoading = mapContainer.querySelector('.map-loading');
    
    // Hide loading when map loads
    if (mapEmbed && mapLoading) {
      mapEmbed.addEventListener('load', () => {
        setTimeout(() => {
          mapLoading.classList.add('hidden');
        }, 500);
      });
    }

    // Map style switcher
    const styleSwitcher = document.getElementById('mapStyleSwitcher');
    if (styleSwitcher) {
      styleSwitcher.addEventListener('click', function () {
        const currentSrc = mapEmbed.src;
        
        if (currentSrc.includes('&t=m')) {
          // Switch to satellite
          mapEmbed.src = currentSrc.replace('&t=m', '&t=k');
          styleSwitcher.innerHTML = '<i class="fas fa-map"></i><span>Roadmap</span>';
        } else {
          // Switch to roadmap
          mapEmbed.src = currentSrc.includes('&t=k') 
            ? currentSrc.replace('&t=k', '&t=m')
            : currentSrc + '&t=m';
          styleSwitcher.innerHTML = '<i class="fas fa-satellite"></i><span>Satellite</span>';
        }
        
        styleSwitcher.classList.toggle('active');
        if (mapLoading) mapLoading.classList.remove('hidden');
      });
    }

    // Marker info window toggle
    const mapMarker = document.querySelector('.map-marker');
    const infoWindow = document.querySelector('.map-info-window');
    
    if (mapMarker && infoWindow) {
      mapMarker.addEventListener('click', function () {
        infoWindow.classList.toggle('active');
      });

      // Close info window when clicking outside
      document.addEventListener('click', function (e) {
        if (!mapMarker.contains(e.target) && !infoWindow.contains(e.target)) {
          infoWindow.classList.remove('active');
        }
      });
    }

    // Directions button
    const directionsBtn = document.querySelector('.directions-btn');
    if (directionsBtn) {
      directionsBtn.addEventListener('click', function () {
        const destination = '21.1458,79.0882'; // Nagpur coordinates
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
      });
    }
  }

  // ==================== FAQ ENHANCEMENTS ====================
  function initFAQEnhancements() {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchInput = document.getElementById('faqSearch');
    const categoryBtns = document.querySelectorAll('.faq-category-btn');

    // FAQ Accordion with smooth transitions
    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });

        // Toggle current item
        item.classList.toggle('active');
      });
    });

    // FAQ Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();

        faqItems.forEach((item) => {
          const question = item.querySelector('.faq-question h4').textContent.toLowerCase();
          const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();

          if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.classList.remove('hidden');
            
            // Highlight search term
            if (searchTerm.length > 0) {
              item.style.borderLeftWidth = '6px';
            } else {
              item.style.borderLeftWidth = '4px';
            }
          } else {
            item.classList.add('hidden');
          }
        });
      });
    }

    // Category filtering
    categoryBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const category = this.dataset.category;

        // Update active button
        categoryBtns.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');

        // Filter FAQs
        faqItems.forEach((item) => {
          if (category === 'all' || item.dataset.category === category) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });

    // FAQ Rating buttons
    const ratingBtns = document.querySelectorAll('.rating-btn');
    ratingBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const parent = this.closest('.faq-rating-buttons');
        const siblings = parent.querySelectorAll('.rating-btn');

        // Remove selected from siblings
        siblings.forEach((sibling) => sibling.classList.remove('selected'));

        // Add selected to clicked button
        this.classList.add('selected');

        // Show feedback message
        const feedbackType = this.dataset.rating;
        showNotification(
          feedbackType === 'yes'
            ? 'Thank you for your feedback! 😊'
            : 'We\'ll improve this answer. Thank you!'
        );
      });
    });
  }

  // ==================== CONTACT CARDS ENHANCEMENTS ====================
  function initContactCards() {
    // Click to call/email animations
    const callButtons = document.querySelectorAll('[data-action="call"]');
    const emailButtons = document.querySelectorAll('[data-action="email"]');
    const copyButtons = document.querySelectorAll('[data-action="copy"]');
    const qrButtons = document.querySelectorAll('[data-action="qr"]');

    callButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const phone = this.dataset.value;
        animateIcon(this);
        window.location.href = `tel:${phone}`;
      });
    });

    emailButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const email = this.dataset.value;
        animateIcon(this);
        window.location.href = `mailto:${email}`;
      });
    });

    // Copy to clipboard
    copyButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const text = this.dataset.value;
        copyToClipboard(text);
        animateIcon(this);
      });
    });

    // QR Code generation
    qrButtons.forEach((btn) => {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const card = this.closest('.info-card');
        let qrContainer = card.querySelector('.qr-code-container');

        // Close all other QR codes
        document.querySelectorAll('.qr-code-container').forEach((qr) => {
          if (qr !== qrContainer) {
            qr.classList.remove('active');
          }
        });

        // Toggle current QR code
        if (qrContainer) {
          qrContainer.classList.toggle('active');
        } else {
          qrContainer = createQRCode(this.dataset.value, card);
        }
      });
    });

    // Close QR codes when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.info-card')) {
        document.querySelectorAll('.qr-code-container').forEach((qr) => {
          qr.classList.remove('active');
        });
      }
    });
  }

  // Animate icon on click
  function animateIcon(button) {
    const icon = button.closest('.info-card').querySelector('.info-icon');
    icon.classList.add('animated');
    setTimeout(() => {
      icon.classList.remove('animated');
    }, 600);
  }

  // Copy to clipboard
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showNotification(`Copied: ${text}`);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        showNotification(`Copied: ${text}`);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
      
      document.body.removeChild(textArea);
    }
  }

  // Create QR Code
  function createQRCode(text, card) {
    const qrContainer = document.createElement('div');
    qrContainer.className = 'qr-code-container';

    // Use a simple QR code generator (you'd need to include QRCode.js library)
    // For now, we'll create a visual representation
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    
    // Simple QR code placeholder using Google Charts API
    const qrImage = document.createElement('img');
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
    qrImage.alt = 'QR Code';
    qrImage.style.width = '200px';
    qrImage.style.height = '200px';

    const qrText = document.createElement('div');
    qrText.className = 'qr-code-text';
    qrText.textContent = 'Scan to get contact info';

    qrContainer.appendChild(qrImage);
    qrContainer.appendChild(qrText);
    card.appendChild(qrContainer);

    setTimeout(() => {
      qrContainer.classList.add('active');
    }, 10);

    return qrContainer;
  }

  // ==================== ENHANCED FORM ====================
  function initEnhancedForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // File upload with drag & drop
    initFileUpload();

    // Character counter for textarea
    initCharCounter();

    // Email suggestion
    initEmailSuggestion();

    // Form submission with typing indicator
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      handleFormSubmit(form);
    });
  }

  // File upload with drag & drop
  function initFileUpload() {
    const uploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('fileUpload');
    const previewContainer = document.querySelector('.file-preview-container');

    if (!uploadArea || !fileInput) return;

    // Click to upload
    uploadArea.addEventListener('click', () => {
      fileInput.click();
    });

    // Drag & drop
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');

      const files = e.dataTransfer.files;
      handleFiles(files, previewContainer);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      handleFiles(files, previewContainer);
    });
  }

  // Handle file uploads
  function handleFiles(files, previewContainer) {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const preview = createFilePreview(e.target.result, file.name);
          previewContainer.appendChild(preview);
        };

        reader.readAsDataURL(file);
      }
    });
  }

  // Create file preview
  function createFilePreview(src, name) {
    const preview = document.createElement('div');
    preview.className = 'file-preview';

    const img = document.createElement('img');
    img.src = src;
    img.alt = name;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'file-remove';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      preview.remove();
    });

    preview.appendChild(img);
    preview.appendChild(removeBtn);

    return preview;
  }

  // Character counter for textarea
  function initCharCounter() {
    const textarea = document.getElementById('message');
    const counter = document.querySelector('.char-counter');

    if (!textarea || !counter) return;

    const maxLength = 500;

    textarea.addEventListener('input', function () {
      const length = this.value.length;
      counter.textContent = `${length}/${maxLength} characters`;

      counter.classList.remove('warning', 'error');
      if (length > maxLength * 0.9) {
        counter.classList.add('error');
      } else if (length > maxLength * 0.75) {
        counter.classList.add('warning');
      }
    });
  }

  // Email suggestion
  function initEmailSuggestion() {
    const emailInput = document.getElementById('email');
    const suggestionDiv = document.querySelector('.email-suggestion');

    if (!emailInput || !suggestionDiv) return;

    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

    emailInput.addEventListener('blur', function () {
      const email = this.value.trim();
      const atIndex = email.indexOf('@');

      if (atIndex > 0) {
        const domain = email.substring(atIndex + 1);
        let suggestion = null;

        // Find similar domain
        for (const commonDomain of commonDomains) {
          if (domain !== commonDomain && isSimilar(domain, commonDomain)) {
            suggestion = email.substring(0, atIndex + 1) + commonDomain;
            break;
          }
        }

        if (suggestion) {
          suggestionDiv.textContent = `Did you mean ${suggestion}?`;
          suggestionDiv.classList.add('show');

          suggestionDiv.onclick = () => {
            emailInput.value = suggestion;
            suggestionDiv.classList.remove('show');
          };
        } else {
          suggestionDiv.classList.remove('show');
        }
      }
    });
  }

  // Check if two strings are similar (simple Levenshtein-like check)
  function isSimilar(str1, str2) {
    if (Math.abs(str1.length - str2.length) > 2) return false;

    let differences = 0;
    const minLength = Math.min(str1.length, str2.length);

    for (let i = 0; i < minLength; i++) {
      if (str1[i] !== str2[i]) differences++;
      if (differences > 2) return false;
    }

    return differences <= 2;
  }

  // Handle form submission
  function handleFormSubmit(form) {
    const submitBtn = form.querySelector('.submit-btn');
    const typingIndicator = document.querySelector('.typing-indicator');
    const successMessage = document.querySelector('.form-success-message');
    const originalBtnText = submitBtn.innerHTML;

    // Show typing indicator
    if (typingIndicator) {
      typingIndicator.classList.add('show');
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending...</span>';

    // Simulate API call
    setTimeout(() => {
      // Hide typing indicator
      if (typingIndicator) {
        typingIndicator.classList.remove('show');
      }

      // Show success message
      if (successMessage) {
        successMessage.classList.add('show');

        setTimeout(() => {
          successMessage.classList.remove('show');
        }, 5000);
      }

      // Reset form
      form.reset();

      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Clear file previews
      const previewContainer = document.querySelector('.file-preview-container');
      if (previewContainer) {
        previewContainer.innerHTML = '';
      }

      // Reset character counter
      const counter = document.querySelector('.char-counter');
      if (counter) {
        counter.textContent = '0/500 characters';
        counter.classList.remove('warning', 'error');
      }

      // Show notification
      showNotification('Message sent successfully! We\'ll get back to you soon.');
    }, 2000);
  }

  // Show notification
  function showNotification(message) {
    let notification = document.querySelector('.copy-notification');

    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'copy-notification';
      document.body.appendChild(notification);
    }

    notification.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    `;

    notification.classList.add('show');

    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
})();
