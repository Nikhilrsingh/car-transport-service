/**
 * Dashboard My Reviews Module
 * Handles user's review management in dashboard
 */

import { getMyReviews, deleteReview, createReviewCardHTML, showToast } from '../review.js';
import { openReviewModal } from '../reviewForm.js';

// Load user's reviews
async function loadMyReviews() {
  try {
    const response = await getMyReviews();
    const reviews = response.data;

    const reviewsList = document.getElementById('myReviewsList');
    const noReviewsMessage = document.getElementById('noReviewsMessage');

    if (!reviews || reviews.length === 0) {
      reviewsList.style.display = 'none';
      noReviewsMessage.style.display = 'block';
      return;
    }

    reviewsList.style.display = 'block';
    noReviewsMessage.style.display = 'none';

    // Create review cards with action buttons
    const reviewsHTML = reviews
      .map((review) => {
        const booking = review.booking;
        const canEdit = isEditable(review.createdAt);

        return `
          <div class="review-card" data-review-id="${review._id}">
            <div class="review-header">
              <div class="review-booking-info" style="background: rgba(255,99,71,0.1); padding: 12px; border-radius: 8px; margin-bottom: 12px; border: 1px solid rgba(255,99,71,0.3);">
                <div style="font-size: 12px; color: #ff6347; font-weight: 600; margin-bottom: 4px;">
                  Booking: ${booking?.bookingReference || review.booking}
                </div>
                ${booking ? `
                  <div style="font-size: 14px; color: #999;">
                    ${booking.pickupLocation} → ${booking.deliveryLocation}
                  </div>
                  <div style="font-size: 12px; color: #666;">
                    ${booking.vehicleType || 'Vehicle'}
                  </div>
                ` : ''}
              </div>
            </div>
            
            <div class="review-rating">
              <div class="star-rating size-small">
                ${Array.from({ length: 5 }, (_, i) =>
          `<span class="star ${i < review.rating ? 'filled' : ''}">${i < review.rating ? '★' : '☆'}</span>`
        ).join('')}
              </div>
              <span class="review-rating-number">${review.rating}.0</span>
              <span style="margin-left: 12px; padding: 4px 8px; background: ${getStatusColor(review.status)}; border-radius: 12px; font-size: 11px; font-weight: 600;">
                ${review.status.toUpperCase()}
              </span>
            </div>
            
            ${review.title ? `<h5 class="review-title">${review.title}</h5>` : ''}
            
            <p class="review-comment" style="margin: 12px 0;">
              ${review.comment}
            </p>
            
            <div class="review-footer">
              <div class="review-date" style="font-size: 13px; color: #999;">
                Posted ${formatDate(review.createdAt)}
                ${!canEdit ? ' <span style="color: #ff9500;">(Edit window expired)</span>' : ''}
              </div>
              <div class="review-actions">
                ${canEdit ? `
                  <button class="review-action-btn edit-review-btn" data-review-id="${review._id}" data-booking='${JSON.stringify(booking)}'>
                    ✏️ Edit
                  </button>
                ` : ''}
                <button class="review-action-btn delete delete-review-btn" data-review-id="${review._id}">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    reviewsList.innerHTML = reviewsHTML;

    // Attach event listeners
    attachActionListeners();
  } catch (error) {
    console.error('Error loading reviews:', error);
    const reviewsList = document.getElementById('myReviewsList');
    if (reviewsList) {
      reviewsList.innerHTML = `
        <div class="reviews-empty">
          <div class="reviews-empty-icon">❌</div>
          <h3 class="reviews-empty-title">Unable to load reviews</h3>
          <p class="reviews-empty-text">${error.message || 'Please try again later'}</p>
        </div>
      `;
    }
  }
}

// Attach event listeners to action buttons
function attachActionListeners() {
  // Edit buttons
  document.querySelectorAll('.edit-review-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const reviewId = btn.getAttribute('data-review-id');
      const bookingData = btn.getAttribute('data-booking');

      try {
        const booking = JSON.parse(bookingData);

        // Get the review data from the card
        const card = btn.closest('.review-card');
        const ratingStars = card.querySelectorAll('.star.filled').length;
        const title = card.querySelector('.review-title')?.textContent || '';
        const comment = card.querySelector('.review-comment').textContent.trim();

        const review = {
          _id: reviewId,
          rating: ratingStars,
          title,
          comment,
        };

        openReviewModal(review);
      } catch (error) {
        console.error('Error opening edit modal:', error);
        showToast('Failed to open edit form', 'error');
      }
    });
  });

  // Delete buttons
  document.querySelectorAll('.delete-review-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const reviewId = btn.getAttribute('data-review-id');

      if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
        return;
      }

      try {
        await deleteReview(reviewId);
        showToast('Review deleted successfully', 'success');

        // Reload reviews
        loadMyReviews();

        // Trigger event for other components
        window.dispatchEvent(new CustomEvent('reviewDeleted', { detail: { reviewId } }));
      } catch (error) {
        console.error('Error deleting review:', error);
        showToast(error.message || 'Failed to delete review', 'error');
      }
    });
  });
}

// Check if review is editable (within 7 days)
function isEditable(createdAt) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const reviewDate = new Date(createdAt);
  return reviewDate > sevenDaysAgo;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return date.toLocaleDateString();
}

// Get status color
function getStatusColor(status) {
  const colors = {
    approved: 'rgba(52, 199, 89, 0.2)',
    pending: 'rgba(255, 149, 0, 0.2)',
    rejected: 'rgba(255, 59, 48, 0.2)',
  };
  return colors[status] || 'rgba(255, 255, 255, 0.1)';
}

// Initialize when tab is shown
function initReviewsTab() {
  const reviewsTab = document.querySelector('[data-tab="reviews"]');
  if (!reviewsTab) return;

  // Load reviews when tab is clicked
  reviewsTab.addEventListener('click', () => {
    const reviewsList = document.getElementById('myReviewsList');
    // Only load if not already loaded or if empty
    if (reviewsList && reviewsList.innerHTML.includes('Loading')) {
      loadMyReviews();
    }
  });
}

// Listen for review submissions/updates
window.addEventListener('reviewSubmitted', (e) => {
  const currentTab = document.querySelector('.tab-content.active');
  if (currentTab && currentTab.id === 'reviews-tab') {
    loadMyReviews();
  }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initReviewsTab();
});
