/**
 * Review Form Modal
 * Opens a modal for writing/editing reviews — no login required
 * Saves to localStorage via review.js
 */

import { StarRating } from './components/starRating.js';
import { createReview, updateReview, showToast } from './review.js';

export class ReviewFormModal {
  constructor() {
    this.modalOverlay = null;
    this.modal = null;
    this.starRating = null;
    this.editMode = false;
    this.reviewId = null;
    this.init();
  }

  init() {
    this.createModal();
    this.attachEvents();
  }

  createModal() {
    const modalHTML = `
      <div class="review-modal-overlay" id="reviewModalOverlay">
        <div class="review-modal">
          <div class="review-modal-header">
            <h3 class="review-modal-title">Write a Review</h3>
            <button class="review-modal-close" id="closeReviewModal">&times;</button>
          </div>
          
          <div class="review-modal-body" id="reviewModalBody">
            <!-- Name -->
            <div class="review-form-group">
              <label class="review-form-label" for="reviewName">
                Your Name <span class="required">*</span>
              </label>
              <input 
                type="text" 
                id="reviewName" 
                class="review-form-input"
                placeholder="Enter your name"
                maxlength="50"
                required
              >
              <div class="review-form-error" id="nameError">Please enter your name</div>
            </div>

            <!-- Rating -->
            <div class="review-form-group">
              <label class="review-form-label">
                Your Rating <span class="required">*</span>
              </label>
              <div class="review-rating-selector">
                <span class="review-rating-label">Rate your experience:</span>
                <div id="reviewStarRating"></div>
              </div>
              <div class="review-form-error" id="ratingError">Please select a rating</div>
            </div>
            
            <!-- Title (optional) -->
            <div class="review-form-group">
              <label class="review-form-label" for="reviewTitle">
                Review Title (Optional)
              </label>
              <input 
                type="text" 
                id="reviewTitle" 
                class="review-form-input"
                placeholder="Sum up your experience in a line"
                maxlength="100"
              >
              <div class="review-form-hint">Max 100 characters</div>
            </div>
            
            <!-- Comment -->
            <div class="review-form-group">
              <label class="review-form-label" for="reviewComment">
                Your Review <span class="required">*</span>
              </label>
              <textarea 
                id="reviewComment" 
                class="review-form-textarea"
                placeholder="Tell us about your experience with our service..."
                maxlength="1000"
              ></textarea>
              <div class="review-char-counter">
                <span class="review-form-hint">Minimum 10 characters</span>
                <span class="review-char-count" id="reviewCharCount">0/1000</span>
              </div>
              <div class="review-form-error" id="commentError">Review must be at least 10 characters</div>
            </div>
          </div>
          
          <div class="review-modal-footer">
            <button class="review-modal-btn review-modal-btn-cancel" id="cancelReviewBtn">
              Cancel
            </button>
            <button class="review-modal-btn review-modal-btn-submit" id="submitReviewBtn">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    document.body.appendChild(tempDiv.firstElementChild);

    this.modalOverlay = document.getElementById('reviewModalOverlay');
    this.modal = this.modalOverlay.querySelector('.review-modal');

    // Initialize interactive star rating
    this.starRating = new StarRating('#reviewStarRating', {
      interactive: true,
      size: 'large',
      onChange: () => {
        document.getElementById('ratingError').classList.remove('show');
      },
    });
  }

  attachEvents() {
    // Close modal
    document.getElementById('closeReviewModal').addEventListener('click', () => this.close());
    document.getElementById('cancelReviewBtn').addEventListener('click', () => this.close());

    // Click outside to close
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) this.close();
    });

    // Name field — clear error on input
    document.getElementById('reviewName').addEventListener('input', () => {
      const name = document.getElementById('reviewName').value.trim();
      if (name.length >= 2) {
        document.getElementById('nameError').classList.remove('show');
      }
    });

    // Character counter for comment
    const commentTextarea = document.getElementById('reviewComment');
    const charCount = document.getElementById('reviewCharCount');

    commentTextarea.addEventListener('input', () => {
      const length = commentTextarea.value.length;
      charCount.textContent = `${length}/1000`;

      charCount.classList.remove('warn', 'error');
      if (length > 900) charCount.classList.add('error');
      else if (length > 800) charCount.classList.add('warn');

      if (length >= 10) {
        document.getElementById('commentError').classList.remove('show');
      }
    });

    // Submit
    document.getElementById('submitReviewBtn').addEventListener('click', () => this.submitReview());

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOverlay.classList.contains('active')) {
        this.close();
      }
    });
  }

  open(review = null) {
    this.editMode = !!review;
    this.reviewId = review?._id || null;

    // Title
    document.querySelector('.review-modal-title').textContent = this.editMode
      ? 'Edit Your Review'
      : 'Write a Review';

    // Submit button text
    document.getElementById('submitReviewBtn').textContent = this.editMode
      ? 'Update Review'
      : 'Submit Review';

    // Restore modal body if it was replaced with success message
    this.restoreFormBody();

    // Populate if editing
    if (review) {
      document.getElementById('reviewName').value = review.user?.name || '';
      this.starRating.setRating(review.rating);
      document.getElementById('reviewTitle').value = review.title || '';
      document.getElementById('reviewComment').value = review.comment || '';
      const commentLength = review.comment?.length || 0;
      document.getElementById('reviewCharCount').textContent = `${commentLength}/1000`;
    } else {
      // Load saved name from previous submission
      const savedName = localStorage.getItem('cargo_reviewer_name') || '';
      document.getElementById('reviewName').value = savedName;
      this.starRating.reset();
      document.getElementById('reviewTitle').value = '';
      document.getElementById('reviewComment').value = '';
      document.getElementById('reviewCharCount').textContent = '0/1000';
    }

    // Clear errors
    document.querySelectorAll('.review-form-error').forEach((el) => el.classList.remove('show'));

    // Show modal
    this.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus name field
    setTimeout(() => document.getElementById('reviewName')?.focus(), 200);
  }

  close() {
    this.modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    this.editMode = false;
    this.reviewId = null;
  }

  restoreFormBody() {
    const modalBody = document.getElementById('reviewModalBody');
    const footer = document.querySelector('.review-modal-footer');

    // If the body was replaced with success message, recreate the form
    if (!document.getElementById('reviewName')) {
      modalBody.innerHTML = `
        <div class="review-form-group">
          <label class="review-form-label" for="reviewName">
            Your Name <span class="required">*</span>
          </label>
          <input type="text" id="reviewName" class="review-form-input"
            placeholder="Enter your name" maxlength="50" required>
          <div class="review-form-error" id="nameError">Please enter your name</div>
        </div>
        <div class="review-form-group">
          <label class="review-form-label">
            Your Rating <span class="required">*</span>
          </label>
          <div class="review-rating-selector">
            <span class="review-rating-label">Rate your experience:</span>
            <div id="reviewStarRating"></div>
          </div>
          <div class="review-form-error" id="ratingError">Please select a rating</div>
        </div>
        <div class="review-form-group">
          <label class="review-form-label" for="reviewTitle">Review Title (Optional)</label>
          <input type="text" id="reviewTitle" class="review-form-input"
            placeholder="Sum up your experience in a line" maxlength="100">
          <div class="review-form-hint">Max 100 characters</div>
        </div>
        <div class="review-form-group">
          <label class="review-form-label" for="reviewComment">
            Your Review <span class="required">*</span>
          </label>
          <textarea id="reviewComment" class="review-form-textarea"
            placeholder="Tell us about your experience with our service..." maxlength="1000"></textarea>
          <div class="review-char-counter">
            <span class="review-form-hint">Minimum 10 characters</span>
            <span class="review-char-count" id="reviewCharCount">0/1000</span>
          </div>
          <div class="review-form-error" id="commentError">Review must be at least 10 characters</div>
        </div>
      `;

      // Re-init star rating
      this.starRating = new StarRating('#reviewStarRating', {
        interactive: true,
        size: 'large',
        onChange: () => document.getElementById('ratingError').classList.remove('show'),
      });

      // Re-attach name input listener
      document.getElementById('reviewName').addEventListener('input', () => {
        if (document.getElementById('reviewName').value.trim().length >= 2) {
          document.getElementById('nameError').classList.remove('show');
        }
      });

      // Re-attach char counter
      const commentTextarea = document.getElementById('reviewComment');
      const charCount = document.getElementById('reviewCharCount');
      commentTextarea.addEventListener('input', () => {
        const length = commentTextarea.value.length;
        charCount.textContent = `${length}/1000`;
        charCount.classList.remove('warn', 'error');
        if (length > 900) charCount.classList.add('error');
        else if (length > 800) charCount.classList.add('warn');
        if (length >= 10) document.getElementById('commentError').classList.remove('show');
      });

      footer.style.display = '';
    }
  }

  validateForm() {
    let isValid = true;

    // Validate name
    const name = document.getElementById('reviewName').value.trim();
    if (name.length < 2) {
      document.getElementById('nameError').classList.add('show');
      isValid = false;
    }

    // Validate rating
    const rating = this.starRating.getRating();
    if (rating === 0) {
      document.getElementById('ratingError').classList.add('show');
      isValid = false;
    }

    // Validate comment
    const comment = document.getElementById('reviewComment').value.trim();
    if (comment.length < 10 || comment.length > 1000) {
      document.getElementById('commentError').classList.add('show');
      isValid = false;
    }

    return isValid;
  }

  async submitReview() {
    if (!this.validateForm()) return;

    const submitBtn = document.getElementById('submitReviewBtn');
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.textContent = this.editMode ? 'Updating...' : 'Submitting...';

    try {
      const name = document.getElementById('reviewName').value.trim();
      const reviewData = {
        name,
        rating: this.starRating.getRating(),
        title: document.getElementById('reviewTitle').value.trim(),
        comment: document.getElementById('reviewComment').value.trim(),
      };

      // Remember name for next time
      localStorage.setItem('cargo_reviewer_name', name);

      if (this.editMode) {
        await updateReview(this.reviewId, reviewData);
      } else {
        await createReview(reviewData);
      }

      // Show success
      this.showSuccess();

      // Notify other modules to refresh
      window.dispatchEvent(
        new CustomEvent('reviewSubmitted', {
          detail: { editMode: this.editMode },
        })
      );

      // Close after delay
      setTimeout(() => this.close(), 2000);
    } catch (error) {
      console.error('Submit review error:', error);
      showToast(error.message || 'Failed to submit review. Please try again.', 'error');

      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = this.editMode ? 'Update Review' : 'Submit Review';
    }
  }

  showSuccess() {
    const modalBody = document.getElementById('reviewModalBody');
    const modalFooter = document.querySelector('.review-modal-footer');

    modalBody.innerHTML = `
      <div class="review-success-message">
        <div class="review-success-icon">✓</div>
        <h4 class="review-success-title">
          ${this.editMode ? 'Review Updated!' : 'Thank You!'}
        </h4>
        <p class="review-success-text">
          ${this.editMode
        ? 'Your review has been updated successfully.'
        : 'Your review has been submitted successfully. Thank you for sharing your experience!'
      }
        </p>
      </div>
    `;
    modalFooter.style.display = 'none';
  }
}

// ── Initialize & export ─────────────────────────────────────

let reviewFormModal;
document.addEventListener('DOMContentLoaded', () => {
  reviewFormModal = new ReviewFormModal();
});

/** Open review modal from anywhere */
export function openReviewModal(review = null) {
  if (reviewFormModal) {
    reviewFormModal.open(review);
  }
}
