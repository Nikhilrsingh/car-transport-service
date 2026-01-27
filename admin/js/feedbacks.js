// feedbacks.js - Feedbacks page logic

let allFeedbacks = [];
let currentFeedbackId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadFeedbacks();
  setupModalClose('viewFeedbackModal');
});

// Load all feedbacks
async function loadFeedbacks() {
  const containerId = 'feedbacksGrid';
  showLoading(containerId);

  try {
    const feedbacks = await apiCall(API_CONFIG.endpoints.getAllFeedbacks);
    allFeedbacks = feedbacks || [];
    
    if (allFeedbacks.length === 0) {
      showEmptyState(containerId, 'No feedbacks found yet', 'comment-dots');
      updateStats([]);
      return;
    }

    updateStats(allFeedbacks);
    renderFeedbacksGrid(allFeedbacks);

  } catch (error) {
    console.error('Error loading feedbacks:', error);
    showError(containerId, 'Failed to load feedbacks. Please try again.');
  }
}

// Update statistics
function updateStats(feedbacks) {
  const total = feedbacks.length;
  document.getElementById('totalFeedbacks').textContent = total;

  if (total === 0) {
    document.getElementById('avgRating').textContent = '0.0';
    document.getElementById('starsDisplay').innerHTML = renderStars(0);
    document.getElementById('positiveFeedbacks').textContent = '0';
    document.getElementById('positivePercentage').textContent = '0%';
    document.getElementById('recentFeedbacks').textContent = '0';
    return;
  }

  // Calculate average rating
  const avgRating = feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / total;
  document.getElementById('avgRating').textContent = avgRating.toFixed(1);
  document.getElementById('starsDisplay').innerHTML = renderStars(avgRating);

  // Calculate positive feedbacks (4+ stars)
  const positive = feedbacks.filter(f => (f.rating || 0) >= 4).length;
  document.getElementById('positiveFeedbacks').textContent = positive;
  const positivePercent = ((positive / total) * 100).toFixed(0);
  document.getElementById('positivePercentage').textContent = `${positivePercent}%`;

  // Calculate recent feedbacks (this month)
  const now = new Date();
  const thisMonth = feedbacks.filter(f => {
    const feedbackDate = new Date(f.createdAt || f.date);
    return feedbackDate.getMonth() === now.getMonth() && 
           feedbackDate.getFullYear() === now.getFullYear();
  }).length;
  document.getElementById('recentFeedbacks').textContent = thisMonth;
}

// Render stars for rating
function renderStars(rating, size = '1rem') {
  let starsHTML = '<div style="color: #ffc107; font-size: ' + size + ';">';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  starsHTML += '</div>';
  return starsHTML;
}

// Render feedbacks grid
function renderFeedbacksGrid(feedbacks) {
  const containerId = 'feedbacksGrid';
  
  if (feedbacks.length === 0) {
    showEmptyState(containerId, 'No feedbacks match your criteria', 'comment-dots');
    return;
  }

  let gridHTML = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">';

  feedbacks.forEach(feedback => {
    const rating = feedback.rating || 0;
    const sentiment = rating >= 4 ? 'positive' : rating >= 3 ? 'neutral' : 'negative';
    const borderColor = sentiment === 'positive' ? 'var(--success)' : 
                       sentiment === 'neutral' ? 'var(--warning)' : 'var(--error)';

    gridHTML += `
      <div class="feedback-card" style="
        background: white;
        padding: 20px;
        border-radius: 12px;
        border-left: 4px solid ${borderColor};
        box-shadow: var(--shadow-sm);
        transition: all 0.3s ease;
        cursor: pointer;
      " onclick="viewFeedback('${feedback._id}')" 
         onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='var(--shadow-lg)';"
         onmouseout="this.style.transform=''; this.style.boxShadow='var(--shadow-sm)';">
        
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
          <div>
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 5px;">
              ${feedback.name || 'Anonymous'}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              ${formatDate(feedback.createdAt || feedback.date)}
            </div>
          </div>
          <div>
            ${renderStars(rating, '0.9rem')}
          </div>
        </div>

        ${feedback.serviceType ? `
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px;">
          <i class="fas fa-tag"></i> ${feedback.serviceType}
        </div>
        ` : ''}

        <div style="color: var(--text-secondary); margin-bottom: 15px; line-height: 1.6;">
          ${truncateText(feedback.comment || feedback.message || feedback.feedback || 'No comment provided', 150)}
        </div>

        ${feedback.email ? `
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          <i class="fas fa-envelope"></i> ${feedback.email}
        </div>
        ` : ''}

        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--gray-200); display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">
            ${getSentimentBadge(sentiment)}
          </span>
          <button class="action-btn btn-delete" onclick="event.stopPropagation(); deleteFeedback('${feedback._id}')" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  gridHTML += '</div>';
  document.getElementById(containerId).innerHTML = gridHTML;
}

// Get sentiment badge
function getSentimentBadge(sentiment) {
  const badges = {
    'positive': '<span class="status-badge status-completed"><i class="fas fa-smile"></i> Positive</span>',
    'neutral': '<span class="status-badge status-pending"><i class="fas fa-meh"></i> Neutral</span>',
    'negative': '<span class="status-badge status-cancelled"><i class="fas fa-frown"></i> Negative</span>'
  };
  return badges[sentiment] || badges['neutral'];
}

// View feedback details
async function viewFeedback(id) {
  currentFeedbackId = id;
  const feedback = allFeedbacks.find(f => f._id === id);
  
  if (!feedback) {
    alert('Feedback not found');
    return;
  }

  const rating = feedback.rating || 0;
  const sentiment = rating >= 4 ? 'positive' : rating >= 3 ? 'neutral' : 'negative';

  const detailsHTML = `
    <div class="detail-row">
      <div class="detail-label">Customer Name:</div>
      <div class="detail-value">${feedback.name || 'Anonymous'}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Email:</div>
      <div class="detail-value">
        ${feedback.email ? `<a href="mailto:${feedback.email}" style="color: var(--primary-color);">${feedback.email}</a>` : 'Not provided'}
      </div>
    </div>
    ${feedback.phone ? `
    <div class="detail-row">
      <div class="detail-label">Phone:</div>
      <div class="detail-value">
        <a href="tel:${feedback.phone}" style="color: var(--primary-color); font-weight: 600;">${feedback.phone}</a>
      </div>
    </div>
    ` : ''}
    ${feedback.serviceType ? `
    <div class="detail-row">
      <div class="detail-label">Service Type:</div>
      <div class="detail-value">${feedback.serviceType}</div>
    </div>
    ` : ''}
    <div class="detail-row">
      <div class="detail-label">Rating:</div>
      <div class="detail-value">
        ${renderStars(rating, '1.2rem')}
        <span style="margin-left: 10px; font-weight: 600; color: var(--text-primary);">${rating.toFixed(1)} / 5.0</span>
      </div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Sentiment:</div>
      <div class="detail-value">${getSentimentBadge(sentiment)}</div>
    </div>
    <div class="detail-row">
      <div class="detail-label">Feedback:</div>
      <div class="detail-value" style="white-space: pre-wrap; line-height: 1.8;">
        ${feedback.comment || feedback.message || feedback.feedback || 'No comment provided'}
      </div>
    </div>
    ${feedback.suggestions ? `
    <div class="detail-row">
      <div class="detail-label">Suggestions:</div>
      <div class="detail-value" style="white-space: pre-wrap;">${feedback.suggestions}</div>
    </div>
    ` : ''}
    ${feedback.wouldRecommend !== undefined ? `
    <div class="detail-row">
      <div class="detail-label">Would Recommend:</div>
      <div class="detail-value">
        ${feedback.wouldRecommend ? 
          '<span style="color: var(--success);"><i class="fas fa-check-circle"></i> Yes</span>' : 
          '<span style="color: var(--error);"><i class="fas fa-times-circle"></i> No</span>'}
      </div>
    </div>
    ` : ''}
    <div class="detail-row">
      <div class="detail-label">Submitted On:</div>
      <div class="detail-value">${formatDate(feedback.createdAt || feedback.date)}</div>
    </div>
  `;

  document.getElementById('feedbackDetails').innerHTML = detailsHTML;
  showModal('viewFeedbackModal');
}

// Delete feedback
async function deleteFeedback(id) {
  if (!confirmDelete('this feedback')) {
    return;
  }

  try {
    await apiCall(`${API_CONFIG.endpoints.feedbacks}/${id}`, {
      method: 'DELETE'
    });

    showSuccess('Feedback deleted successfully');
    loadFeedbacks();

  } catch (error) {
    console.error('Error deleting feedback:', error);
    alert('Failed to delete feedback. Please try again.');
  }
}

// Delete feedback from modal
function deleteFeedbackFromModal() {
  if (currentFeedbackId) {
    hideModal('viewFeedbackModal');
    deleteFeedback(currentFeedbackId);
  }
}

// Handle search
const handleSearch = debounce(function() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  const filtered = allFeedbacks.filter(feedback => {
    return (feedback.name?.toLowerCase().includes(searchTerm) ||
            feedback.email?.toLowerCase().includes(searchTerm) ||
            feedback.comment?.toLowerCase().includes(searchTerm) ||
            feedback.message?.toLowerCase().includes(searchTerm) ||
            feedback.feedback?.toLowerCase().includes(searchTerm) ||
            feedback.serviceType?.toLowerCase().includes(searchTerm));
  });

  renderFeedbacksGrid(filtered);
}, 300);

// Handle filter
function handleFilter() {
  const rating = document.getElementById('ratingFilter').value;
  
  let filtered = [...allFeedbacks];
  
  if (rating !== 'all') {
    const ratingNum = parseInt(rating);
    filtered = filtered.filter(f => Math.floor(f.rating || 0) === ratingNum);
  }

  renderFeedbacksGrid(filtered);
}

// Handle sort
function handleSort() {
  const sortBy = document.getElementById('sortFilter').value;
  let sorted = [...allFeedbacks];

  switch(sortBy) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date));
      break;
    case 'highest':
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'lowest':
      sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      break;
  }

  renderFeedbacksGrid(sorted);
}