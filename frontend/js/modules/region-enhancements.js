// Region Section Visual Enhancements and Mobile Features

// Grid/List View Toggle
function initViewToggle() {
  const viewBtns = document.querySelectorAll('.view-btn');
  let regionGrid = document.getElementById('regionGrid');

  // If grid doesn't exist yet, wait for region section to load
  if (!regionGrid) {
    console.log('Region grid not found, waiting for region section to load...');
    document.addEventListener('regionSectionLoaded', initViewToggle);
    return;
  }

  if (!viewBtns.length) {
    console.log('View buttons not found');
    return;
  }

  console.log('✅ Initializing view toggle with', viewBtns.length, 'buttons');

  viewBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Get view type
      const viewType = this.getAttribute('data-view');
      console.log('View toggle clicked:', viewType);

      // Refresh grid reference in case it was reloaded
      regionGrid = document.getElementById('regionGrid');
      if (!regionGrid) {
        console.error('Region grid element not found');
        return;
      }

      // Remove active class from all buttons
      viewBtns.forEach(b => b.classList.remove('active'));

      // Add active class to clicked button
      this.classList.add('active');

      // Toggle list-view class on grid
      if (viewType === 'list') {
        regionGrid.classList.add('list-view');
        console.log('✅ Switched to LIST view');
      } else {
        regionGrid.classList.remove('list-view');
        console.log('✅ Switched to GRID view');
      }

      // Store preference in localStorage
      localStorage.setItem('regionViewPreference', viewType);

      // Dispatch event for other modules
      document.dispatchEvent(new CustomEvent('viewChanged', { detail: { view: viewType } }));
    });
  });

  // Load saved preference on initial load
  const savedView = localStorage.getItem('regionViewPreference');
  if (savedView === 'list') {
    const listBtn = document.querySelector('.view-btn[data-view="list"]');
    if (listBtn) {
      console.log('Loading saved preference: list view');
      setTimeout(() => listBtn.click(), 100);
    }
  } else {
    // Ensure grid view is active by default
    const gridBtn = document.querySelector('.view-btn[data-view="grid"]');
    if (gridBtn && !gridBtn.classList.contains('active')) {
      gridBtn.classList.add('active');
    }
  }
}

// Dynamic City Counter
function initCityCounter() {
  const cityCounter = document.getElementById('cityCounter');
  const regionGrid = document.getElementById('regionGrid');

  if (!cityCounter || !regionGrid) return;

  function updateCounter() {
    const allCards = regionGrid.querySelectorAll('.region-card.enhanced');
    // Count cards that are NOT hidden (search and pagination compatible)
    const visibleCards = regionGrid.querySelectorAll('.region-card.enhanced:not(.hidden):not([style*="display: none"])');
    const totalCards = allCards.length;
    const visibleCount = visibleCards.length;

    // Update counter text
    if (visibleCount === totalCards) {
      cityCounter.textContent = `All ${totalCards} cities`;
    } else if (visibleCount > 0) {
      cityCounter.textContent = `Showing ${visibleCount} of ${totalCards} cities`;
    } else {
      cityCounter.textContent = `0 cities found`;
    }
  }

  // Initial update
  setTimeout(updateCounter, 500);

  // Update on any filter/search change - listen to custom event
  document.addEventListener('regionFilterChanged', updateCounter);

  // Update on filter tab clicks
  const filterTabs = document.querySelectorAll('.filter-tab, .mobile-filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setTimeout(updateCounter, 100);
    });
  });

  // Update on search input
  const searchInputs = document.querySelectorAll('#regionSearch, #mobileSearch');
  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      setTimeout(updateCounter, 100);
    });
  });

  // Update periodically (for dynamic changes and pagination)
  setInterval(updateCounter, 1000);
}

// Mobile Bottom Sheet Filter Panel
function initBottomSheet() {
  const bottomSheet = document.getElementById('bottomSheet');
  const bottomSheetOverlay = document.getElementById('bottomSheetOverlay');
  const mobileFilterBtn = document.getElementById('mobileFilterBtn');
  const bottomSheetClose = document.getElementById('bottomSheetClose');
  const applyFiltersBtn = document.getElementById('applyFilters');
  const resetFiltersBtn = document.getElementById('resetFilters');

  if (!bottomSheet || !mobileFilterBtn) return;

  // Open bottom sheet
  function openBottomSheet() {
    bottomSheet.classList.add('active');
    bottomSheetOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close bottom sheet
  function closeBottomSheet() {
    bottomSheet.classList.remove('active');
    bottomSheetOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  mobileFilterBtn.addEventListener('click', openBottomSheet);
  bottomSheetClose.addEventListener('click', closeBottomSheet);
  bottomSheetOverlay.addEventListener('click', closeBottomSheet);

  // Mobile filter tabs
  const mobileFilterTabs = document.querySelectorAll('.mobile-filter-tab');
  const desktopFilterTabs = document.querySelectorAll('.filter-tab');

  mobileFilterTabs.forEach((tab, index) => {
    tab.addEventListener('click', function () {
      // Update mobile tabs
      mobileFilterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Apply filters
  applyFiltersBtn.addEventListener('click', function () {
    // Get selected filter
    const selectedTab = document.querySelector('.mobile-filter-tab.active');
    if (selectedTab) {
      const filterValue = selectedTab.getAttribute('data-filter');

      // Trigger corresponding desktop filter
      const desktopTab = document.querySelector(`.filter-tab[data-filter="${filterValue}"]`);
      if (desktopTab) {
        desktopTab.click();
      }
    }

    // Get search value and update desktop search
    const mobileSearch = document.getElementById('mobileSearch');
    const desktopSearch = document.getElementById('regionSearch');
    if (mobileSearch && desktopSearch) {
      desktopSearch.value = mobileSearch.value;
      desktopSearch.dispatchEvent(new Event('input'));
    }

    closeBottomSheet();

    // Scroll to results
    const regionGrid = document.getElementById('regionGrid');
    if (regionGrid) {
      setTimeout(() => {
        regionGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  });

  // Reset filters
  resetFiltersBtn.addEventListener('click', function () {
    // Reset mobile tabs
    mobileFilterTabs.forEach(t => t.classList.remove('active'));
    const allTab = document.querySelector('.mobile-filter-tab[data-filter="all"]');
    if (allTab) allTab.classList.add('active');

    // Reset search
    const mobileSearch = document.getElementById('mobileSearch');
    if (mobileSearch) mobileSearch.value = '';

    // Reset desktop
    const desktopAllTab = document.querySelector('.filter-tab[data-filter="all"]');
    if (desktopAllTab) desktopAllTab.click();

    const desktopSearch = document.getElementById('regionSearch');
    if (desktopSearch) {
      desktopSearch.value = '';
      desktopSearch.dispatchEvent(new Event('input'));
    }
  });

  // Sync desktop filters with mobile
  desktopFilterTabs.forEach((tab, index) => {
    tab.addEventListener('click', function () {
      const filterValue = this.getAttribute('data-filter');
      const mobileTab = document.querySelector(`.mobile-filter-tab[data-filter="${filterValue}"]`);
      if (mobileTab) {
        mobileFilterTabs.forEach(t => t.classList.remove('active'));
        mobileTab.classList.add('active');
      }
    });
  });

  // Sync search inputs
  const mobileSearch = document.getElementById('mobileSearch');
  const desktopSearch = document.getElementById('regionSearch');

  if (mobileSearch && desktopSearch) {
    desktopSearch.addEventListener('input', function () {
      mobileSearch.value = this.value;
    });
  }
}

// Mobile Swipeable Cards
function initMobileSwipe() {
  if (window.innerWidth > 768) return; // Only on mobile

  const cards = document.querySelectorAll('.region-card.enhanced');

  cards.forEach(card => {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    card.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
      this.style.transition = 'none';
    });

    card.addEventListener('touchmove', function (e) {
      if (!isDragging) return;

      currentX = e.touches[0].clientX;
      const diff = currentX - startX;

      // Limit swipe distance
      if (Math.abs(diff) < 100) {
        this.style.transform = `translateX(${diff}px) scale(${1 - Math.abs(diff) / 500})`;
        this.style.opacity = 1 - Math.abs(diff) / 300;
      }
    });

    card.addEventListener('touchend', function (e) {
      if (!isDragging) return;

      const diff = currentX - startX;
      this.style.transition = 'all 0.3s ease';

      // If swiped more than 80px, navigate
      if (Math.abs(diff) > 80) {
        const href = this.getAttribute('href');
        if (href) {
          window.location.href = href;
        }
      }

      // Reset position
      this.style.transform = '';
      this.style.opacity = '';
      isDragging = false;
      startX = 0;
      currentX = 0;
    });
  });
}

// Sticky Search on Mobile Scroll
function initStickySearch() {
  if (window.innerWidth > 768) return; // Only on mobile

  const searchContainer = document.querySelector('.region-filters-search');
  if (!searchContainer) return;

  let lastScroll = 0;
  const navbar = document.querySelector('nav, .navbar, header');
  const navbarHeight = navbar ? navbar.offsetHeight : 70;

  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    // Update sticky position based on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scrolling down
      searchContainer.style.top = '10px';
    } else {
      // Scrolling up
      searchContainer.style.top = `${navbarHeight}px`;
    }

    lastScroll = currentScroll;
  });
}

// Initialize all enhancements
function initAllEnhancements() {
  console.log('🎨 Initializing region enhancements...');

  // Call all enhancement functions
  initViewToggle();
  initCityCounter();
  initBottomSheet();
  initMobileSwipe();
  initStickySearch();

  console.log('✅ All enhancements initialized');
}

// Initialize on DOM load or when region section is loaded
document.addEventListener('DOMContentLoaded', initAllEnhancements);
document.addEventListener('regionSectionLoaded', initAllEnhancements);

// Re-initialize on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Re-init mobile-specific features if needed
    if (window.innerWidth <= 768) {
      initMobileSwipe();
      initStickySearch();
    }
  }, 250);
});
