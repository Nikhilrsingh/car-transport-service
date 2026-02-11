// Enhanced Contact Page Module
(function () {
  'use strict';

  // Initialize all enhanced features
  document.addEventListener('DOMContentLoaded', function () {
    initInteractiveMap();
    initContactCards();
    initEnhancedForm();
    initOfficeHours();
    initLiveChat();
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

    // Real-time validation
    initRealTimeValidation();

    // File upload with drag & drop
    initFileUpload();

    // Character counter for textarea
    initCharCounter();

    // Email suggestion
    initEmailSuggestion();

    // Form submission with typing indicator
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm()) {
        handleFormSubmit(form);
      }
    });
  }

  // Real-time form validation
  function initRealTimeValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const vehicleSelect = document.getElementById('vehicle');
    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');

    // Name validation
    if (nameInput) {
      nameInput.addEventListener('input', function () {
        validateField(this, validateName(this.value));
      });

      nameInput.addEventListener('blur', function () {
        validateField(this, validateName(this.value));
      });
    }

    // Phone validation
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        // Allow only numbers
        this.value = this.value.replace(/[^0-9]/g, '');
        validateField(this, validatePhone(this.value));
      });

      phoneInput.addEventListener('blur', function () {
        validateField(this, validatePhone(this.value));
      });
    }

    // Email validation
    if (emailInput) {
      emailInput.addEventListener('input', function () {
        validateField(this, validateEmail(this.value));
      });

      emailInput.addEventListener('blur', function () {
        validateField(this, validateEmail(this.value));
      });
    }

    // Select validation
    if (vehicleSelect) {
      vehicleSelect.addEventListener('change', function () {
        validateField(this, this.value !== '');
      });
    }

    if (serviceSelect) {
      serviceSelect.addEventListener('change', function () {
        validateField(this, this.value !== '');
      });
    }

    // Message validation
    if (messageTextarea) {
      messageTextarea.addEventListener('input', function () {
        validateField(this, this.value.trim().length >= 10);
      });

      messageTextarea.addEventListener('blur', function () {
        validateField(this, this.value.trim().length >= 10);
      });
    }
  }

  // Validation helper functions
  function validateName(name) {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  }

  function validatePhone(phone) {
    return /^[0-9]{10}$/.test(phone);
  }

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateField(field, isValid) {
    const inputGroup = field.closest('.input-group');
    const errorMessage = inputGroup.querySelector('.error-message');

    if (isValid) {
      field.classList.remove('error');
      field.classList.add('success');
      if (errorMessage) {
        errorMessage.classList.remove('show');
        errorMessage.textContent = '';
      }

      // Add success icon if not exists
      if (!inputGroup.querySelector('.success-icon')) {
        const successIcon = document.createElement('i');
        successIcon.className = 'fas fa-check-circle success-icon';
        inputGroup.appendChild(successIcon);
      }
      inputGroup.classList.add('valid');
    } else if (field.value.length > 0) {
      field.classList.add('error');
      field.classList.remove('success');
      inputGroup.classList.remove('valid');

      if (errorMessage) {
        errorMessage.classList.add('show');
        errorMessage.textContent = getErrorMessage(field);
      }
    } else {
      field.classList.remove('error', 'success');
      inputGroup.classList.remove('valid');
      if (errorMessage) {
        errorMessage.classList.remove('show');
        errorMessage.textContent = '';
      }
    }
  }

  function getErrorMessage(field) {
    const fieldName = field.name || field.id;

    switch (fieldName) {
      case 'name':
        return 'Please enter a valid name (letters only, min 2 characters)';
      case 'phone':
        return 'Please enter a valid 10-digit phone number';
      case 'email':
        return 'Please enter a valid email address';
      case 'password':
        return 'Please enter a valid password (min 8 characters)';
      case 'vehicle':
        return 'Please select a vehicle type';
      case 'service':
        return 'Please select a service type';
      case 'message':
        return 'Please enter a message (min 10 characters)';
      default:
        return 'This field is required';
    }
  }

  function validateForm() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const vehicleSelect = document.getElementById('vehicle');
    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');

    let isValid = true;

    if (!validateName(nameInput.value)) {
      validateField(nameInput, false);
      isValid = false;
    }

    if (!validatePhone(phoneInput.value)) {
      validateField(phoneInput, false);
      isValid = false;
    }

    if (!validateEmail(emailInput.value.trim())) {
      validateField(emailInput, false);
      isValid = false;
    }

    if (vehicleSelect.value === '') {
      validateField(vehicleSelect, false);
      isValid = false;
    }

    if (serviceSelect.value === '') {
      validateField(serviceSelect, false);
      isValid = false;
    }

    if (messageTextarea.value.trim().length < 10) {
      validateField(messageTextarea, false);
      isValid = false;
    }

    return isValid;
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

  // Email format validation helper
  function isValidEmail(email) {
  // requires username + @ + domain (.com, .in, etc.)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
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

  // ==================== OFFICE HOURS STATUS ====================
  function initOfficeHours() {
    updateOfficeHoursStatus();
    // Update every minute
    setInterval(updateOfficeHoursStatus, 60000);
  }

  function updateOfficeHoursStatus() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Minutes since midnight

    const hoursItems = document.querySelectorAll('.hours-list li[data-day]');

    hoursItems.forEach(item => {
      const dayRange = item.dataset.day;
      const timeElement = item.querySelector('.time');
      const statusBadge = item.querySelector('.status-badge');

      if (!timeElement || !statusBadge) return;

      const openTime = timeElement.dataset.open;
      const closeTime = timeElement.dataset.close;

      // Parse time strings (HH:MM format)
      const openMinutes = parseTime(openTime);
      const closeMinutes = parseTime(closeTime);

      // Check if current day matches
      const isDayMatch = checkDayMatch(dayRange, currentDay);

      // Check if currently open
      let isOpen = false;
      if (isDayMatch) {
        if (closeMinutes >= openMinutes) {
          // Normal case (e.g., 9:00 - 18:00)
          isOpen = currentTime >= openMinutes && currentTime <= closeMinutes;
        } else {
          // Overnight case (e.g., 22:00 - 02:00)
          isOpen = currentTime >= openMinutes || currentTime <= closeMinutes;
        }
      }

      // Update status badge
      if (dayRange === '0-6') {
        // 24/7 service
        statusBadge.textContent = 'Open Now';
        statusBadge.className = 'status-badge open';
      } else if (isOpen) {
        statusBadge.textContent = 'Open Now';
        statusBadge.className = 'status-badge open';
      } else {
        statusBadge.textContent = 'Closed';
        statusBadge.className = 'status-badge closed';
      }
    });
  }

  function parseTime(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }

  function checkDayMatch(dayRange, currentDay) {
    if (dayRange.includes('-')) {
      const parts = dayRange.split('-');
      const start = parseInt(parts[0]);
      const end = parseInt(parts[1]);

      if (start <= end) {
        return currentDay >= start && currentDay <= end;
      } else {
        // Wraps around week (e.g., Sat-Sun = 6-0)
        return currentDay >= start || currentDay <= end;
      }
    } else {
      return currentDay === parseInt(dayRange);
    }
  }

  // ==================== LIVE CHAT ====================
  function initLiveChat() {
    const liveChatBtn = document.getElementById('liveChatBtn');

    if (liveChatBtn) {
      liveChatBtn.addEventListener('click', function () {
        // Open chatbot modal or redirect to live chat
        const chatbotBtn = document.querySelector('.floating-chatbot-button');
        if (chatbotBtn) {
          chatbotBtn.click();
        } else {
          showNotification('Live chat is currently unavailable. Please use the contact form or call us directly.');
        }
      });
    }
  }
})();
