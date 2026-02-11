/**
 * Services Page Reviews Module
 * Handles review display with filters, sorting, and pagination
 */

import { getAllReviews, getReviewStats, createReviewStatsHTML, createReviewCardHTML } from '../review.js';
import { openReviewModal } from '../reviewForm.js';

let currentPage = 1;
let currentRating = 'all';
let currentSort = 'recent';
const reviewsPerPage = 10;

// Load review stats
async function loadReviewStats() {
  try {
    const response = await getReviewStats();
    const stats = response.data;

    const statsContainer = document.getElementById('servicesReviewStats');
    if (statsContainer) {
      statsContainer.innerHTML = createReviewStatsHTML(stats);
    }
  } catch (error) {
    console.error('Error loading review stats:', error);
    const statsContainer = document.getElementById('servicesReviewStats');
    if (statsContainer) {
      statsContainer.innerHTML = '<p style="color: #999;">Unable to load statistics</p>';
    }
  }
}

// Load reviews with current filters
async function loadReviews() {
  try {
    const params = {
      page: currentPage,
      limit: reviewsPerPage,
      sort: currentSort,
    };

    if (currentRating !== 'all') {
      params.rating = currentRating;
    }

    const response = await getAllReviews(params);
    const reviewsContainer = document.getElementById('servicesReviewsList');
    if (!reviewsContainer) return;

    if (response.data.reviews.length === 0) {
      reviewsContainer.innerHTML = `
        <div class="reviews-empty">
          <div class="reviews-empty-icon">⭐</div>
          <h3 class="reviews-empty-title">No reviews found</h3>
          <p class="reviews-empty-text">
            ${currentRating !== 'all'
          ? 'Try adjusting your filters'
          : 'Be the first to share your experience!'}
          </p>
        </div>
      `;

      // Hide pagination
      document.getElementById('reviewPagination').style.display = 'none';
      return;
    }

    // Create review cards
    const reviewsHTML = response.data.reviews
      .map((review) => createReviewCardHTML(review, { truncateLength: 200 }))
      .join('');

    reviewsContainer.innerHTML = reviewsHTML;

    // Add read more functionality
    attachReadMoreListeners();

    // Render pagination
    renderPagination(response.data.pagination);

    // Scroll to reviews section
    if (currentPage > 1) {
      document.getElementById('reviews').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (error) {
    console.error('Error loading reviews:', error);
    const reviewsContainer = document.getElementById('servicesReviewsList');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = `
        <div class="reviews-empty">
          <div class="reviews-empty-icon">❌</div>
          <h3 class="reviews-empty-title">Unable to load reviews</h3>
          <p class="reviews-empty-text">Please try again later</p>
        </div>
      `;
    }
  }
}

// Render pagination controls
function renderPagination(pagination) {
  const paginationContainer = document.getElementById('reviewPagination');
  if (!paginationContainer) return;

  if (pagination.pages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }

  paginationContainer.style.display = 'flex';

  let html = '';

  // Previous button
  html += `
    <button class="review-pagination-btn" ${pagination.page === 1 ? 'disabled' : ''} data-page="${pagination.page - 1}">
      ‹
    </button>
  `;

  // Page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(pagination.pages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    html += `<button class="review-pagination-btn" data-page="1">1</button>`;
    if (startPage > 2) {
      html += `<span style="color: #999;">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `
      <button class="review-pagination-btn ${i === pagination.page ? 'active' : ''}" data-page="${i}">
        ${i}
      </button>
    `;
  }

  if (endPage < pagination.pages) {
    if (endPage < pagination.pages - 1) {
      html += `<span style="color: #999;">...</span>`;
    }
    html += `<button class="review-pagination-btn" data-page="${pagination.pages}">${pagination.pages}</button>`;
  }

  // Next button
  html += `
    <button class="review-pagination-btn" ${pagination.page === pagination.pages ? 'disabled' : ''} data-page="${pagination.page + 1}">
      ›
    </button>
  `;

  paginationContainer.innerHTML = html;

  // Attach pagination click events
  paginationContainer.querySelectorAll('.review-pagination-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.getAttribute('data-page'));
      if (page && !btn.disabled) {
        currentPage = page;
        loadReviews();
      }
    });
  });
}

// Attach read more functionality
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
        const truncatedText = fullComment.substring(0, 200) + '...';
        commentElement.textContent = truncatedText;
        commentElement.classList.add('truncated');
        link.textContent = 'Read more';
      }
    });
  });
}

// Setup filter buttons
function setupFilters() {
  const filterButtons = document.querySelectorAll('.review-filter-btn');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      // Update filter and reload
      currentRating = btn.getAttribute('data-rating');
      currentPage = 1; // Reset to first page
      loadReviews();
    });
  });
}

// Setup sort dropdown
function setupSort() {
  const sortSelect = document.getElementById('reviewSort');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      currentPage = 1; // Reset to first page
      loadReviews();
    });
  }
}

// Responsive adjustments
function adjustReviewsLayout() {
  const reviewsControls = document.querySelector('.reviews-controls');
  if (!reviewsControls) return;

  if (window.innerWidth <= 768) {
    reviewsControls.style.gridTemplateColumns = '1fr';
  } else {
    reviewsControls.style.gridTemplateColumns = '1fr 2fr';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadReviewStats();
  loadReviews();
  setupFilters();
  setupSort();
  adjustReviewsLayout();

  // Write a Review button
  const writeBtn = document.getElementById('writeReviewBtnServices');
  if (writeBtn) {
    writeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openReviewModal();
    });
  }

  // Listen for review submissions
  window.addEventListener('reviewSubmitted', () => {
    loadReviewStats();
    loadReviews();
  });

  // Adjust layout on resize
  window.addEventListener('resize', adjustReviewsLayout);

  // Check if should scroll to reviews (from homepage link)
  if (window.location.hash === '#reviews') {
    setTimeout(() => {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }
});
