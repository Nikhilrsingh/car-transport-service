/**
 * Star Rating Component
 * Reusable star rating component for display and input
 */

export class StarRating {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      maxStars: options.maxStars || 5,
      rating: options.rating || 0,
      interactive: options.interactive || false,
      size: options.size || 'medium', // small, medium, large, xlarge
      showText: options.showText || false,
      onChange: options.onChange || null,
    };
    this.currentRating = this.options.rating;
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.classList.add('star-rating', `size-${this.options.size}`);
    if (this.options.interactive) {
      this.container.classList.add('interactive');
    }

    this.render();
    if (this.options.interactive) {
      this.attachEvents();
    }
  }

  render() {
    this.container.innerHTML = '';

    // Create stars
    for (let i = 1; i <= this.options.maxStars; i++) {
      const star = document.createElement('span');
      star.classList.add('star');
      star.setAttribute('data-rating', i);
      star.innerHTML = i <= this.currentRating ? '★' : '☆';
      if (i <= this.currentRating) {
        star.classList.add('filled');
      }

      if (this.options.interactive) {
        star.setAttribute('role', 'button');
        star.setAttribute('aria-label', `Rate ${i} out of ${this.options.maxStars} stars`);
        star.setAttribute('tabindex', '0');
      }

      this.container.appendChild(star);
    }

    // Add rating text if enabled
    if (this.options.showText) {
      const text = document.createElement('span');
      text.classList.add('star-rating-text');
      text.textContent = this.currentRating > 0 ? `${this.currentRating}/${this.options.maxStars}` : 'Not rated';
      this.container.appendChild(text);
    }
  }

  attachEvents() {
    // Use event delegation on the container so events survive re-renders
    this.container.addEventListener('click', (e) => {
      const star = e.target.closest('.star');
      if (!star) return;
      const rating = parseInt(star.getAttribute('data-rating'));
      if (rating) this.setRating(rating);
    });

    this.container.addEventListener('mouseenter', (e) => {
      const star = e.target.closest('.star');
      if (!star) return;
      const rating = parseInt(star.getAttribute('data-rating'));
      if (rating) this.highlightStars(rating);
    }, true);

    this.container.addEventListener('mouseover', (e) => {
      const star = e.target.closest('.star');
      if (!star) return;
      const rating = parseInt(star.getAttribute('data-rating'));
      if (rating) this.highlightStars(rating);
    });

    this.container.addEventListener('keydown', (e) => {
      const star = e.target.closest('.star');
      if (!star) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const rating = parseInt(star.getAttribute('data-rating'));
        if (rating) this.setRating(rating);
      }
    });

    // Remove hover effect when mouse leaves container
    this.container.addEventListener('mouseleave', () => {
      this.highlightStars(this.currentRating);
    });
  }

  highlightStars(rating) {
    const stars = this.container.querySelectorAll('.star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('hover');
        star.innerHTML = '★';
      } else {
        star.classList.remove('hover');
        star.innerHTML = '☆';
      }
    });
  }

  setRating(rating) {
    this.currentRating = rating;
    this.render();

    // Add pulse animation
    const stars = this.container.querySelectorAll('.star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('pulse');
        setTimeout(() => star.classList.remove('pulse'), 300);
      }
    });

    // Trigger callback
    if (this.options.onChange) {
      this.options.onChange(rating);
    }
  }

  getRating() {
    return this.currentRating;
  }

  reset() {
    this.setRating(0);
  }

  destroy() {
    this.container.innerHTML = '';
    this.container.classList.remove('star-rating', 'interactive', `size-${this.options.size}`);
  }
}

// Helper function to create star rating display (read-only)
export function createStarRatingDisplay(rating, maxStars = 5, size = 'medium') {
  const container = document.createElement('div');
  new StarRating(container, {
    rating,
    maxStars,
    size,
    interactive: false,
  });
  return container;
}

// Helper function to get star rating HTML (for static display)
export function getStarRatingHTML(rating, maxStars = 5, size = 'medium') {
  let html = `<div class="star-rating size-${size}">`;
  for (let i = 1; i <= maxStars; i++) {
    const filled = i <= rating ? 'filled' : '';
    const icon = i <= rating ? '★' : '☆';
    html += `<span class="star ${filled}">${icon}</span>`;
  }
  html += '</div>';
  return html;
}
