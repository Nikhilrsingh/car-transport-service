/**
 * Review Management — localStorage-based
 * Stores reviews in browser localStorage (no backend required)
 * Reviews persist for 30 days, default reviews persist forever
 */

const STORAGE_KEY = 'cargo_customer_reviews';
const STORAGE_VERSION_KEY = 'cargo_reviews_version';
const CURRENT_VERSION = '2';
const EXPIRY_DAYS = 30;

// ── Default seeded reviews ──────────────────────────────────
const DEFAULT_REVIEWS = [
  {
    _id: 'default_1',
    user: { name: 'Rahul Sharma' },
    rating: 5,
    title: 'Excellent Service!',
    comment:
      'The car transport service was exceptional. My vehicle arrived on time and in perfect condition. Highly recommend Harihar Carriers!',
    isVerified: true,
    status: 'approved',
    helpfulCount: 14,
    isDefault: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'default_2',
    user: { name: 'Priya Patel' },
    rating: 4,
    title: 'Great Experience',
    comment:
      'Good service with timely delivery. The pickup and drop-off were smooth. Would recommend to others looking for vehicle transport.',
    isVerified: true,
    status: 'approved',
    helpfulCount: 8,
    isDefault: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ── localStorage helpers ────────────────────────────────────

function getStoredReviews() {
  try {
    // Force reset if version changed (e.g. reduced default reviews)
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    }

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REVIEWS));
      return [...DEFAULT_REVIEWS];
    }

    let reviews = JSON.parse(data);

    // Remove expired user-submitted reviews (defaults stay forever)
    const now = Date.now();
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const filtered = reviews.filter((r) => {
      if (r.isDefault) return true;
      return now - new Date(r.createdAt).getTime() < expiryMs;
    });

    if (filtered.length !== reviews.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    return filtered;
  } catch {
    return [...DEFAULT_REVIEWS];
  }
}

function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

// ── Public API ──────────────────────────────────────────────

/**
 * Get all approved reviews with filtering, sorting, pagination
 */
export async function getAllReviews(params = {}) {
  let reviews = getStoredReviews().filter((r) => r.status === 'approved');

  // Filter by rating
  if (params.rating) {
    reviews = reviews.filter((r) => r.rating === Number(params.rating));
  }

  // Sort
  const sort = params.sort || 'recent';
  switch (sort) {
    case 'highest':
      reviews.sort((a, b) => b.rating - a.rating || new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'lowest':
      reviews.sort((a, b) => a.rating - b.rating || new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'helpful':
      reviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
      break;
    default:
      reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Pagination
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const total = reviews.length;
  const pages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paged = reviews.slice(start, start + limit);

  return {
    success: true,
    message: 'Reviews fetched successfully',
    data: {
      reviews: paged,
      pagination: { page, limit, total, pages },
    },
  };
}

/**
 * Get review statistics
 */
export async function getReviewStats() {
  const reviews = getStoredReviews().filter((r) => r.status === 'approved');

  if (reviews.length === 0) {
    return {
      success: true,
      data: {
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      },
    };
  }

  const totalReviews = reviews.length;
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  const averageRating = +(sum / totalReviews).toFixed(1);
  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    ratingBreakdown[r.rating] = (ratingBreakdown[r.rating] || 0) + 1;
  });

  return {
    success: true,
    message: 'Review stats fetched successfully',
    data: { averageRating, totalReviews, ratingBreakdown },
  };
}

/**
 * Create a new review (saves to localStorage)
 */
export async function createReview(reviewData) {
  const reviews = getStoredReviews();

  const newReview = {
    _id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
    user: { name: reviewData.name || 'Anonymous' },
    rating: Number(reviewData.rating),
    title: reviewData.title || '',
    comment: reviewData.comment,
    isVerified: false,
    status: 'approved',
    helpfulCount: 0,
    isOwn: true,
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  reviews.unshift(newReview);
  saveReviews(reviews);

  return { success: true, message: 'Review submitted successfully', data: newReview };
}

/**
 * Update an existing review
 */
export async function updateReview(reviewId, reviewData) {
  const reviews = getStoredReviews();
  const index = reviews.findIndex((r) => r._id === reviewId);

  if (index === -1) throw new Error('Review not found');

  reviews[index] = {
    ...reviews[index],
    rating: Number(reviewData.rating) || reviews[index].rating,
    title: reviewData.title ?? reviews[index].title,
    comment: reviewData.comment ?? reviews[index].comment,
    updatedAt: new Date().toISOString(),
  };

  saveReviews(reviews);
  return { success: true, data: reviews[index] };
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId) {
  const reviews = getStoredReviews();
  const filtered = reviews.filter((r) => r._id !== reviewId);
  saveReviews(filtered);
  return { success: true, message: 'Review deleted' };
}

/**
 * Get own reviews (submitted from this browser)
 */
export async function getMyReviews() {
  const reviews = getStoredReviews().filter((r) => r.isOwn === true);
  return { success: true, data: reviews };
}

// ── HTML Generators ─────────────────────────────────────────

/** Format time ago */
export function formatTimeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  if (diffDay < 7) return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  if (diffWeek < 4) return `${diffWeek} ${diffWeek === 1 ? 'week' : 'weeks'} ago`;
  if (diffMonth < 12) return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
  return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
}

/** Get user initials from name */
export function getUserInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/** Create review card HTML */
export function createReviewCardHTML(review, options = {}) {
  const showActions = options.showActions || false;
  const timeAgo = formatTimeAgo(review.createdAt);
  const initials = getUserInitials(review.user?.name);
  const truncateLength = options.truncateLength || 200;
  const shouldTruncate = review.comment.length > truncateLength;
  const displayComment = shouldTruncate ? review.comment.substring(0, truncateLength) + '...' : review.comment;

  return `
    <div class="premium-review-card" data-review-id="${review._id}">
      <div class="card-header">
        <div class="reviewer-info">
          <div class="review-avatar-placeholder">${initials}</div>
          <div class="reviewer-meta">
            <h3 class="reviewer-name">${review.user?.name || 'Anonymous'}</h3>
            ${review.isVerified ? '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
          </div>
        </div>
        <span class="review-date">${timeAgo}</span>
      </div>
      
      <div class="review-rating">
        ${Array.from(
    { length: 5 },
    (_, i) => `<i class="fas fa-star" style="color: ${i < review.rating ? '#ffac33' : 'rgba(255,255,255,0.2)'}"></i>`
  ).join('')}
        <span class="rating-text">${review.rating}.0</span>
      </div>
      
      ${review.title ? `<h4 class="review-title">${review.title}</h4>` : ''}
      
      <div class="review-content">
        <p class="review-comment ${shouldTruncate ? 'truncated' : ''}" data-full-comment="${review.comment}">
          ${displayComment}
        </p>
        ${shouldTruncate ? '<a href="#" class="review-read-more">Read more</a>' : ''}
        <div class="review-loader">
          <div class="loader-line"></div>
          <div class="loader-line"></div>
          <div class="loader-line short"></div>
        </div>
      </div>

      ${showActions
      ? `
        <div class="review-footer">
          <button class="helpful-btn"><i class="fas fa-thumbs-up"></i> Helpful</button>
          <div class="review-actions">
            <button class="review-action-btn edit-review-btn" data-review-id="${review._id}">✏️ Edit</button>
            <button class="review-action-btn delete delete-review-btn" data-review-id="${review._id}">🗑️ Delete</button>
          </div>
        </div>
      `
      : `
        <div class="review-footer">
          <button class="helpful-btn"><i class="fas fa-thumbs-up"></i> Helpful</button>
        </div>
      `
    }
    </div>
  `;
}

/** Create review stats HTML */
export function createReviewStatsHTML(stats) {
  if (!stats || stats.totalReviews === 0) {
    return `
      <div class="review-stats-container">
        <div class="review-stats-overall">
          <div class="review-stats-number">0.0</div>
          <div class="review-stats-stars">
            <div class="star-rating size-medium">
              ${Array.from({ length: 5 }, () => '<span class="star">☆</span>').join('')}
            </div>
          </div>
          <div class="review-stats-total">No reviews yet</div>
        </div>
      </div>
    `;
  }

  const breakdown = stats.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const total = stats.totalReviews;

  return `
    <div class="review-stats-container">
      <div class="review-stats-overall">
        <div class="review-stats-number">
          ${stats.averageRating}
          <span class="review-stats-max">/5.0</span>
        </div>
        <div class="review-stats-stars">
          <div class="star-rating size-medium">
            ${Array.from(
    { length: 5 },
    (_, i) =>
      `<span class="star ${i < Math.round(stats.averageRating) ? 'filled' : ''}">${i < Math.round(stats.averageRating) ? '★' : '☆'}</span>`
  ).join('')}
          </div>
        </div>
        <div class="review-stats-total">Based on ${total} ${total === 1 ? 'review' : 'reviews'}</div>
      </div>
      
      <div class="review-stats-breakdown">
        ${[5, 4, 3, 2, 1]
      .map((rating) => {
        const count = breakdown[rating] || 0;
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return `
            <div class="review-stats-row">
              <div class="review-stats-label">
                <span class="stars">${'★'.repeat(rating)}</span>
                <span>${rating}</span>
              </div>
              <div class="review-stats-bar-container">
                <div class="review-stats-bar" style="width: ${percentage}%"></div>
              </div>
              <div class="review-stats-count">
                <span class="review-stats-percentage">${percentage}%</span> (${count})
              </div>
            </div>
          `;
      })
      .join('')}
      </div>
    </div>
  `;
}

/** Show toast notification */
export function showToast(message, type = 'success') {
  let toast = document.querySelector('.review-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'review-toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `review-toast ${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
