// Render posts
function renderPosts() {
  const grid = document.getElementById('blog-grid');
  const noResults = document.getElementById('noResults');

  if (filteredPosts.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
  } else {
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    grid.innerHTML = filteredPosts.map(createCard).join('');
  }
}

// Filter posts
function filterPosts() {
  filteredPosts = BLOG_POSTS.filter(post => {
    // Category filter
    const categoryMatch = currentCategory === 'all' || post.category === currentCategory;

    // Search filter
    const searchMatch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && searchMatch;
  });

  // Sort posts
  sortPosts();
  renderPosts();
}

// Sort posts
function sortPosts() {
  switch (currentSort) {
    case 'latest':
      filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'popular':
      filteredPosts.sort((a, b) => b.views - a.views);
      break;
    case 'trending':
      filteredPosts.sort((a, b) => {
        if (a.trending === b.trending) return b.views - a.views;
        return b.trending ? 1 : -1;
      });
      break;
  }
}

// Bookmark functionality
function toggleBookmark(postId, event) {
  event.stopPropagation();
  const index = bookmarkedPosts.indexOf(postId);

  if (index > -1) {
    bookmarkedPosts.splice(index, 1);
  } else {
    bookmarkedPosts.push(postId);
  }

  localStorage.setItem('bookmarkedPosts', JSON.stringify(bookmarkedPosts));
  renderPosts();
}

// Update category counts
function updateCategoryCounts() {
  const counts = {
    all: BLOG_POSTS.length,
    tips: BLOG_POSTS.filter(p => p.category === 'tips').length,
    guide: BLOG_POSTS.filter(p => p.category === 'guide').length,
    tech: BLOG_POSTS.filter(p => p.category === 'tech').length,
    sustainability: BLOG_POSTS.filter(p => p.category === 'sustainability').length,
  };

  Object.keys(counts).forEach(category => {
    const countEl = document.getElementById(`count-${category}`);
    if (countEl) countEl.textContent = counts[category];
  });
}

// Event listeners
function setupEventListeners() {
  // Search
  const searchInput = document.getElementById('blogSearch');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterPosts();
  });

  // Sort
  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    filterPosts();
  });

  // Category sidebar
  const categoryItems = document.querySelectorAll('.category-item');
  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      categoryItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      currentCategory = item.dataset.category;
      filterPosts();
    });
  });

  // Tag badges
  const tagBadges = document.querySelectorAll('.tag-badge[data-tag]');
  tagBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      const tag = badge.dataset.tag;
      const isActive = badge.classList.contains('active');

      tagBadges.forEach(b => b.classList.remove('active'));

      if (!isActive) {
        badge.classList.add('active');
        searchQuery = tag;
        document.getElementById('blogSearch').value = tag;
      } else {
        searchQuery = '';
        document.getElementById('blogSearch').value = '';
      }

      filterPosts();
    });
  });
}
  </script>
