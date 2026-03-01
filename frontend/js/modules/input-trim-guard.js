/**
 * Input Trimming Guard - Issue #1157
 * Automatically removes leading/trailing whitespace from sensitive input fields
 * Prevents users from being locked out due to accidental spaces in email/password
 */

function initializeInputTrimmingGuard() {
  console.log('[Input Trim Guard] Initializing...');

  /**
   * Apply trimming to a specific form or all forms with email/password
   * @param {Element} container - Form element or document
   */
  const trimInputFields = (container = document) => {
    const emailInputs = container.querySelectorAll('input[type="email"]');
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    const telInputs = container.querySelectorAll('input[type="tel"]');
    const nameInputs = container.querySelectorAll('input[placeholder*="name" i], input[placeholder*="Name" i]');

    // Combine all sensitive fields
    const allInputs = [...emailInputs, ...passwordInputs, ...telInputs, ...nameInputs];

    allInputs.forEach((input) => {
      // Real-time trimming as user types
      input.addEventListener('input', handleInputTrim);

      // Also trim on blur (when user leaves field)
      input.addEventListener('blur', handleInputBlur);

      // Prevent accidental space with space key check
      input.addEventListener('keydown', handleSpaceKey);
    });
  };

  /**
   * Handle real-time input trimming
   */
  const handleInputTrim = (e) => {
    const originalValue = e.target.value;
    const trimmedValue = originalValue.trim();

    // Only update if whitespace was actually removed
    if (originalValue !== trimmedValue && originalValue.length > trimmedValue.length) {
      e.target.value = trimmedValue;
      console.log('[Input Trim] Auto-trimmed whitespace:', {
        fieldType: e.target.type,
        field: e.target.placeholder || e.target.name || 'unknown',
        removedChars: originalValue.length - trimmedValue.length,
        hasLeadingSpace: originalValue[0] === ' ',
        hasTrailingSpace: originalValue[originalValue.length - 1] === ' '
      });
    }
  };

  /**
   * Handle blur event - final trim before submission
   */
  const handleInputBlur = (e) => {
    e.target.value = e.target.value.trim();
  };

  /**
   * Warn user if they paste text with surrounding spaces
   */
  const handleSpaceKey = (e) => {
    // Warn if user tries to paste at start (space is rarely needed at beginning)
    if (e.key === ' ' && e.target.value.length === 0) {
      console.warn('[Input Trim] User typed space at beginning of field');
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      trimInputFields();
      console.log('[Input Trim Guard] ✓ Initialized successfully');
    });
  } else {
    trimInputFields();
    console.log('[Input Trim Guard] ✓ Initialized successfully');
  }

  // Support dynamic forms (if new forms are added)
  const observeNewForms = () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && (node.tagName === 'FORM' || node.tagName === 'INPUT')) {
              // Apply trimming to newly added elements
              if (node.tagName === 'FORM') {
                trimInputFields(node);
              } else if (node.type === 'email' || node.type === 'password' || node.type === 'tel') {
                trimInputFields(node.parentElement);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  // Optional: Observe for dynamically added forms
  // observeNewForms();

  // Expose function globally for manual use on specific forms
  window.applyInputTrimming = trimInputFields;
}

// Auto-initialize on script load
initializeInputTrimmingGuard();
