
import BLOG_POSTS from '../data/blog-data.js';

(function () {
  'use strict';

  // State
  let currentCategory = 'all';
  let searchQuery = '';
  let bookmarkedPosts = JSON.parse(localStorage.getItem('bookmarkedPosts') || '[]');

  // DOM Elements
  const grid = document.getElementById('blog-grid');
  const searchInput = document.getElementById('blogSearch');
  const pillsContainer = document.getElementById('categoryPills');

  // Dynamic Reading Time Helper
  function calculateReadTime(content) {
    if (!content) return "1 min read";
    const div = document.createElement("div");
    div.innerHTML = content;
    const text = div.textContent || div.innerText || "";
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    return Math.ceil(words / 200) + " min read";
  }

  // Create Clear Button
  const clearBtn = document.createElement('button');
  clearBtn.className = 'clear-filters-btn';
  clearBtn.innerText = 'Clear all';

  // Initialize
  function init() {
    if (!grid) return; // Guard clause

    renderPills();

    // Append Clear Button after pills
    if (pillsContainer) {
      pillsContainer.parentElement.appendChild(clearBtn);
    }

    renderPosts();
    setupEventListeners();

    // Check for URL params (e.g. ?category=tips)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      activateCategory(catParam);
    }

    updateClearButton();
  }

  // 1. Render Category Pills
  function renderPills() {
    if (!pillsContainer) return;

    const categories = ['all', ...new Set(BLOG_POSTS.map(post => post.category))];

    pillsContainer.innerHTML = categories.map(cat => {
      // Calculate count
      const count = cat === 'all'
        ? BLOG_POSTS.length
        : BLOG_POSTS.filter(p => p.category === cat).length;

      return `
                <button class="pill ${cat === 'all' ? 'active' : ''}" data-category="${cat}">
                    ${capitalize(cat)}
                    <span class="pill-count">${count}</span>
                </button>
            `;
    }).join('');
  }

  // 2. Render Posts
  function renderPosts() {
    // FILTERING LOGIC
    let filtered = BLOG_POSTS.filter(post => {
      const matchesCategory = currentCategory === 'all' || post.category === currentCategory;
      const matchesSearch = performSearch(post, searchQuery);
      return matchesCategory && matchesSearch;
    });

    // SORTING (Default: Newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // RENDER GRID
    if (filtered.length > 0) {
      grid.innerHTML = filtered.map(createCardHTML).join('');
      grid.classList.remove('no-results-mode');
    } else {
      renderNoResults();
    }

    // Re-attach event listeners for dynamic content (bookmarks)
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', handleBookmarkClick);
    });
  }

  // Helper: Smart Search
  function performSearch(post, query) {
    if (!query) return true;
    const q = query.toLowerCase();

    // 1. Title Match (High Priority)
    if (post.title.toLowerCase().includes(q)) return true;

    // 2. Tag Match
    if (post.tags.some(tag => tag.toLowerCase().includes(q))) return true;

    // 3. Excerpt Match (Low priority)
    if (post.excerpt.toLowerCase().includes(q)) return true;

    return false;
  }

  // Helper: Card HTML Generator
  function createCardHTML(post) {
    const isBookmarked = bookmarkedPosts.includes(post.id);

    return `
            <article class="card">
                <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-id="${post.id}" aria-label="Bookmark this post">
                    <i class="${isBookmarked ? 'fas' : 'far'} fa-bookmark"></i>
                </button>
                <div class="card-figure">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <div class="card-overlay">
                        <div class="overlay-info">
                            <span><i class="fas fa-eye"></i> ${post.views}</span>
                            ${post.trending ? '<span style="margin-left:auto"><i class="fas fa-fire"></i> Trending</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="category-badges">
                        <span class="category-badge">${post.category}</span>
                    </div>
                    <h3 class="card-title">${post.title}</h3>
                    <div class="card-meta">
                        <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
                        <span class="read-time-badge">
                            <i class="far fa-clock"></i> ${calculateReadTime(post.contentHTML)}
                        </span>
                    </div>
                    <p class="card-excerpt">${post.excerpt}</p>
                    <div class="card-actions">
                        <a href="blog-post.html?id=${post.id}" class="btn-read-more">
                            Read Article <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </article>
        `;
  }

  // 3. No Results & "Smart Fallback"
  function renderNoResults() {
    // Find trending posts as recommendations
    const trending = BLOG_POSTS.filter(p => p.trending).slice(0, 3);

    grid.innerHTML = `
            <div class="no-results-state">
                <div class="no-results-icon"><i class="fas fa-search"></i></div>
                <h3>No articles found for "${searchQuery}"</h3>
                <p>We couldn't find an exact match, but here are some popular reads:</p>
            </div>
            
            <h4 class="recommendations-title">Recommended for you</h4>
            
            ${trending.map(createCardHTML).join('')}
        `;
  }

  // Bookmark Handler
  function handleBookmarkClick(e) {
    e.stopPropagation();
    e.preventDefault();

    const btn = e.currentTarget;
    const id = parseInt(btn.dataset.id);
    const icon = btn.querySelector('i');

    if (bookmarkedPosts.includes(id)) {
      // Remove
      bookmarkedPosts = bookmarkedPosts.filter(postId => postId !== id);
      btn.classList.remove('bookmarked');
      icon.classList.remove('fas');
      icon.classList.add('far');
    } else {
      // Add
      bookmarkedPosts.push(id);
      btn.classList.add('bookmarked');
      icon.classList.remove('far');
      icon.classList.add('fas');
    }

    localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));

    // Animation effect
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = 'scale(1)', 200);
  }

  // 4. Event Listeners
  function setupEventListeners() {
    // Search Input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderPosts();
        updateClearButton();
      });
    }

    // Pill Clicks
    if (pillsContainer) {
      pillsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.pill');
        if (!btn) return;

        activateCategory(btn.dataset.category);
      });
    }

    // Clear Button
    clearBtn.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      activateCategory('all');
    });
  }

  function activateCategory(category) {
    currentCategory = category;

    // Update UI
    document.querySelectorAll('.pill').forEach(p => {
      p.classList.toggle('active', p.dataset.category === category);
    });

    renderPosts();
    updateClearButton();
  }

  function updateClearButton() {
    const hasFilter = currentCategory !== 'all' || searchQuery.length > 0;
    if (hasFilter) {
      clearBtn.classList.add('visible');
    } else {
      clearBtn.classList.remove('visible');
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Run
  document.addEventListener('DOMContentLoaded', init);

})();
