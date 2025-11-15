// Website Rating Module
(function() {
  'use strict';

  // Configuration
  const STORAGE_KEY = 'websiteRating';
  const RATING_LABELS = {
    1: 'Poor - We\'ll do better! 😞',
    2: 'Fair - We appreciate your feedback! 🤔',
    3: 'Good - Thanks for rating! 😊',
    4: 'Very Good - We\'re glad you enjoyed it! 😃',
    5: 'Excellent - Thank you so much! ⭐'
  };

  // Initialize when DOM is loaded
  function init() {
    const ratingContainer = document.getElementById('websiteRating');
    const feedbackElement = document.getElementById('ratingFeedback');
    const messageElement = document.getElementById('ratingMessage');

    if (!ratingContainer || !feedbackElement || !messageElement) {
      return;
    }

    const stars = ratingContainer.querySelectorAll('i');
    
    // Load saved rating
    loadSavedRating(stars, feedbackElement, messageElement);

    // Add event listeners
    setupEventListeners(stars, feedbackElement, messageElement);
  }

  // Load saved rating from localStorage
  function loadSavedRating(stars, feedbackElement, messageElement) {
    const savedRating = localStorage.getItem(STORAGE_KEY);
    
    if (savedRating) {
      const rating = parseInt(savedRating);
      updateStars(stars, rating);
      showFeedback(feedbackElement, rating);
      showMessage(messageElement, `You previously rated us ${rating} star${rating > 1 ? 's' : ''}!`, 'info');
    }
  }

  // Setup event listeners for stars
  function setupEventListeners(stars, feedbackElement, messageElement) {
    stars.forEach((star, index) => {
      // Hover effect
      star.addEventListener('mouseenter', () => {
        const rating = index + 1;
        updateStars(stars, rating, true);
        showFeedback(feedbackElement, rating);
      });

      // Click to rate
      star.addEventListener('click', () => {
        const rating = index + 1;
        saveRating(rating);
        updateStars(stars, rating);
        showFeedback(feedbackElement, rating);
        showMessage(messageElement, `Thank you for rating us ${rating} star${rating > 1 ? 's' : ''}!`, 'success');
      });
    });

    // Reset hover effect when mouse leaves the rating container
    const ratingContainer = stars[0].parentElement;
    ratingContainer.addEventListener('mouseleave', () => {
      const savedRating = localStorage.getItem(STORAGE_KEY);
      if (savedRating) {
        updateStars(stars, parseInt(savedRating));
        showFeedback(feedbackElement, parseInt(savedRating));
      } else {
        updateStars(stars, 0);
        feedbackElement.textContent = '';
        feedbackElement.classList.remove('show');
      }
    });
  }

  // Update star appearance
  function updateStars(stars, rating, isHover = false) {
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.remove('far');
        star.classList.add('fas');
        if (!isHover) {
          star.classList.add('active');
        } else {
          star.classList.add('hover');
        }
      } else {
        star.classList.remove('fas', 'active', 'hover');
        star.classList.add('far');
      }
    });
  }

  // Show feedback text
  function showFeedback(element, rating) {
    element.textContent = RATING_LABELS[rating] || '';
    element.classList.add('show');
  }

  // Show message
  function showMessage(element, text, type) {
    element.textContent = text;
    element.className = 'rating-message show ' + type;
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      element.classList.remove('show');
    }, 5000);
  }

  // Save rating to localStorage
  function saveRating(rating) {
    try {
      localStorage.setItem(STORAGE_KEY, rating.toString());
      
      // Optional: Also save timestamp
      const timestamp = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY + '_timestamp', timestamp);
      
      console.log(`Rating saved: ${rating} stars at ${timestamp}`);
    } catch (error) {
      console.error('Error saving rating:', error);
    }
  }

  // Utility function to get rating statistics (optional - for future use)
  function getRatingData() {
    const rating = localStorage.getItem(STORAGE_KEY);
    const timestamp = localStorage.getItem(STORAGE_KEY + '_timestamp');
    
    return {
      rating: rating ? parseInt(rating) : null,
      timestamp: timestamp || null
    };
  }

  // Utility function to clear rating (optional - for testing)
  function clearRating() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '_timestamp');
    console.log('Rating cleared');
  }

  // Make clearRating available globally for testing
  window.clearWebsiteRating = clearRating;
  window.getWebsiteRating = getRatingData;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
