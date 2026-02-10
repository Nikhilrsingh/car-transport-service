/**
 * Home Page Reviews Module
 * Loads reviews & stats from localStorage and displays on homepage
 */

import { getAllReviews, getReviewStats, createReviewStatsHTML, createReviewCardHTML } from '../review.js';
import { openReviewModal } from '../reviewForm.js';

// Load review stats into sidebar
async function loadReviewStats() {
  try {
    const response = await getReviewStats();
    const stats = response.data;

    const statsContainer = document.getElementById('homeReviewStats');
    if (statsContainer) {
      statsContainer.innerHTML = createReviewStatsHTML(stats);
    }
  } catch (error) {
    console.error('Error loading review stats:', error);
  }
}

// Load featured reviews (top 6 highest rated)
async function loadFeaturedReviews() {
  try {
    const response = await getAllReviews({
      page: 1,
      limit: 6,
      sort: 'highest',
    });

    const reviewsContainer = document.getElementById('homeFeaturedReviews');
    if (!reviewsContainer) return;

    if (response.data.reviews.length === 0) {
      reviewsContainer.innerHTML = `
        <div class="reviews-empty">
          <div class="reviews-empty-icon">⭐</div>
          <h3 class="reviews-empty-title">No reviews yet</h3>
          <p class="reviews-empty-text">Be the first to share your experience!</p>
        </div>
      `;
      return;
    }

    const reviewsHTML = response.data.reviews
      .map((review) => createReviewCardHTML(review, { truncateLength: 150 }))
      .join('');

    reviewsContainer.innerHTML = reviewsHTML;
    attachReadMoreListeners();
  } catch (error) {
    console.error('Error loading featured reviews:', error);
  }
}

// Read more toggle on review cards
function attachReadMoreListeners() {
  const readMoreLinks = document.querySelectorAll('.review-read-more');
  readMoreLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const commentElement = link.previousElementSibling;
      const fullComment = commentElement.getAttribute('data-full-comment');

      if (commentElement.classList.contains('truncated')) {
        commentElement.textContent = fullComment;
        commentElement.classList.remove('truncated');
        link.textContent = 'Show less';
      } else {
        const truncatedText = fullComment.substring(0, 150) + '...';
        commentElement.textContent = truncatedText;
        commentElement.classList.add('truncated');
        link.textContent = 'Read more';
      }
    });
  });
}

// Responsive grid
function adjustReviewsGrid() {
  const reviewsGrid = document.querySelector('.reviews-grid');
  if (!reviewsGrid) return;

  if (window.innerWidth <= 768) {
    reviewsGrid.style.gridTemplateColumns = '1fr';
  } else {
    reviewsGrid.style.gridTemplateColumns = '1fr 2fr';
  }
}

// Attach "Write a Review" button handler
function attachWriteReviewButton() {
  const writeBtn = document.getElementById('writeReviewBtn');
  if (writeBtn) {
    writeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openReviewModal();
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadReviewStats();
  loadFeaturedReviews();
  adjustReviewsGrid();
  attachWriteReviewButton();

  // Refresh reviews after new submission
  window.addEventListener('reviewSubmitted', () => {
    loadReviewStats();
    loadFeaturedReviews();
  });

  window.addEventListener('resize', adjustReviewsGrid);
});
