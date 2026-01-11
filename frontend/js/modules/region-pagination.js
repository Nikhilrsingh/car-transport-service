(function() {
  const ITEMS_PER_PAGE = 6;
  const LOAD_MORE_THRESHOLD = 12;
  let currentPage = 1;
  let currentFilter = 'all';
  let currentLoadedCount = ITEMS_PER_PAGE;
  let allCards = [];
  let usePagination = false;
  let isInitialized = false;

  function initPagination() {
    if (isInitialized) return;
    
    const regionContainer = document.getElementById('region-container');
    if (!regionContainer) {
      setTimeout(initPagination, 500);
      return;
    }

    const observer = new MutationObserver(() => {
      const regionGrid = regionContainer.querySelector('.region-grid');
      if (regionGrid && !regionGrid.dataset.paginationInit) {
        regionGrid.dataset.paginationInit = 'true';
        setTimeout(() => setupPagination(), 500);
      }
    });

    observer.observe(regionContainer, { childList: true, subtree: true });

    if (regionContainer.querySelector('.region-grid')) {
      setTimeout(() => setupPagination(), 500);
    }
  }

  function setupPagination() {
    if (isInitialized) return;
    
    const regionGrid = document.querySelector('#region-container .region-grid');
    if (!regionGrid) {
      console.log('Region grid not found');
      return;
    }

    // Get ALL region cards regardless of their display state
    allCards = Array.from(regionGrid.querySelectorAll('.region-card'));
    console.log('Total cards found:', allCards.length);
    
    if (allCards.length === 0) {
      console.log('No cards found, retrying...');
      setTimeout(setupPagination, 500);
      return;
    }

    isInitialized = true;
    console.log('Pagination initialized successfully');
    console.log('All card cities:', allCards.map(c => c.querySelector('.city-name')?.textContent));
    
    removeAllOldButtons();
    addControls();
    setupFilterListeners();
    
    // Don't hide cards initially - let the render function handle it
    renderCards();
  }

  function removeAllOldButtons() {
    const regionContainer = document.getElementById('region-container');
    if (!regionContainer) return;

    const selectorsToRemove = [
      '.load-more-btn',
      'button[class*="load"]',
      '.pagination-info',
      '.pagination-controls',
      '.load-more-container'
    ];

    selectorsToRemove.forEach(selector => {
      const elements = regionContainer.querySelectorAll(selector);
      elements.forEach(el => {
        if (!el.id || !el.id.includes('New')) {
          el.remove();
        }
      });
    });

    const allButtons = regionContainer.querySelectorAll('button');
    allButtons.forEach(btn => {
      const text = btn.textContent.toLowerCase();
      if ((text.includes('load') && text.includes('more')) || text.includes('cities')) {
        if (!btn.id || btn.id !== 'loadMoreBtnNew') {
          btn.remove();
        }
      }
    });

    const allDivs = regionContainer.querySelectorAll('div');
    allDivs.forEach(div => {
      const text = div.textContent.toLowerCase();
      if (text.includes('showing') && text.includes('of') && text.includes('cities')) {
        if (!div.closest('#paginationWrapper')) {
          div.remove();
        }
      }
    });
  }

  function addControls() {
    const regionSection = document.querySelector('#region-container .region-section');
    if (!regionSection) {
      console.log('Region section not found');
      return;
    }
    
    if (document.getElementById('paginationWrapper')) {
      console.log('Pagination wrapper already exists');
      return;
    }

    const controlsHTML = `
      <div id="paginationWrapper" style="text-align: center; margin: 40px 0; padding: 20px; background: var(--bg-primary, #fff); border-radius: 12px;">
        <div style="margin-bottom: 20px; font-size: 1rem; color: var(--text-secondary, #666); font-weight: 500;">
          Showing <strong id="pageInfo" style="color: var(--primary-color, #0056b3);">1-6</strong> of <strong id="totalCities" style="color: var(--primary-color, #0056b3);">0</strong> cities
        </div>
        
        <div id="loadMoreSection" style="display: block;">
          <button id="loadMoreBtnNew" style="padding: 14px 32px; background: linear-gradient(135deg, #ff6b35, #ff8c42); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 1.05rem; font-weight: 600; transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 4px 15px rgba(255,107,53,0.35); text-transform: uppercase; letter-spacing: 0.5px;">
            <i class="fas fa-plus-circle"></i> Load More Cities
          </button>
        </div>

        <div id="paginationSection" style="display: none;">
          <div style="display: flex; gap: 12px; justify-content: center; align-items: center; flex-wrap: wrap;">
            <button id="prevPage" style="padding: 12px 24px; background: var(--primary-color, #0056b3); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1rem; font-weight: 500; transition: all 0.3s; box-shadow: 0 3px 10px rgba(0,86,179,0.25);" disabled>
              <i class="fas fa-chevron-left"></i> Previous
            </button>
            <div id="pageNumbers" style="display: flex; gap: 8px; align-items: center;"></div>
            <button id="nextPage" style="padding: 12px 24px; background: var(--primary-color, #0056b3); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1rem; font-weight: 500; transition: all 0.3s; box-shadow: 0 3px 10px rgba(0,86,179,0.25);">
              Next <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    regionSection.insertAdjacentHTML('beforeend', controlsHTML);
    console.log('Controls added');

    const loadMoreBtn = document.getElementById('loadMoreBtnNew');
    if (loadMoreBtn) {
      console.log('Load More button found, attaching listener');
      loadMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔥 Load More button CLICKED!');
        handleLoadMore();
      });
      
      loadMoreBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.02)';
        this.style.boxShadow = '0 6px 20px rgba(255,107,53,0.45)';
      });
      
      loadMoreBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 15px rgba(255,107,53,0.35)';
      });
    } else {
      console.log('❌ Load More button NOT found!');
    }

    document.getElementById('prevPage')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderCards();
        scrollToCityGrid();
      }
    });

    document.getElementById('nextPage')?.addEventListener('click', () => {
      const totalPages = getTotalPages();
      if (currentPage < totalPages) {
        currentPage++;
        renderCards();
        scrollToCityGrid();
      }
    });
  }

  function handleLoadMore() {
    console.log('📊 BEFORE Load More:');
    console.log('  - currentLoadedCount:', currentLoadedCount);
    console.log('  - Total cards:', allCards.length);
    
    currentLoadedCount += ITEMS_PER_PAGE;
    
    console.log('📊 AFTER Load More:');
    console.log('  - NEW currentLoadedCount:', currentLoadedCount);
    
    const filteredCards = getFilteredCards();
    console.log('  - Filtered cards:', filteredCards.length);
    
    if (currentLoadedCount >= LOAD_MORE_THRESHOLD) {
      usePagination = true;
      currentPage = 1;
      console.log('  - ✅ Switching to PAGINATION mode');
    }
    
    renderCards();
  }

  function setupFilterListeners() {
    const filterTabs = document.querySelectorAll('#region-container .filter-tab');
    console.log('Filter tabs found:', filterTabs.length);
    
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        console.log('Filter changed to:', currentFilter);
        resetToInitialState();
        renderCards();
      });
    });

    const searchInput = document.querySelector('#region-container .region-search');
    if (searchInput) {
      console.log('Search input found');
      searchInput.addEventListener('input', () => {
        console.log('Search changed:', searchInput.value);
        resetToInitialState();
        renderCards();
      });
    }
  }

  function resetToInitialState() {
    currentPage = 1;
    currentLoadedCount = ITEMS_PER_PAGE;
    usePagination = false;
    console.log('Reset to initial state');
  }

  function getFilteredCards() {
    const searchInput = document.querySelector('#region-container .region-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const filtered = allCards.filter(card => {
      const region = card.dataset.region || '';
      const name = card.querySelector('.city-name')?.textContent.toLowerCase() || '';
      
      const matchesFilter = (currentFilter === 'all') || (region === currentFilter);
      const matchesSearch = !searchTerm || name.includes(searchTerm);
      
      return matchesFilter && matchesSearch;
    });
    
    console.log('Filtered card cities:', filtered.map(c => c.querySelector('.city-name')?.textContent));
    return filtered;
  }

  function getTotalPages() {
    const filtered = getFilteredCards();
    return Math.ceil(filtered.length / ITEMS_PER_PAGE);
  }

  function renderCards() {
    console.log('🎨 RENDERING CARDS...');
    const filteredCards = getFilteredCards();
    console.log('  - Total filtered cards:', filteredCards.length);
    console.log('  - Pagination mode:', usePagination);
    console.log('  - Current loaded count:', currentLoadedCount);
    
    // Hide ALL cards first
    allCards.forEach(card => {
      card.style.display = 'none';
    });
    
    let cardsToShow;
    let startIndex, endIndex;

    if (usePagination) {
      startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      endIndex = startIndex + ITEMS_PER_PAGE;
      cardsToShow = filteredCards.slice(startIndex, endIndex);
      console.log('  - Pagination: showing cards', startIndex, 'to', endIndex);
    } else {
      startIndex = 0;
      endIndex = Math.min(currentLoadedCount, filteredCards.length);
      cardsToShow = filteredCards.slice(0, endIndex);
      console.log('  - Load More: showing 0 to', endIndex, 'from', filteredCards.length, 'total');
    }
    
    console.log('  - Cards to show:', cardsToShow.length);
    console.log('  - Showing cities:', cardsToShow.map(c => c.querySelector('.city-name')?.textContent));
    
    // Show the selected cards with animation
    cardsToShow.forEach((card, index) => {
      card.style.display = 'block';
      card.style.opacity = '0';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transition = 'opacity 0.4s ease-out';
      }, index * 50);
    });

    updateUI(filteredCards.length, startIndex, endIndex);
  }

  function updateUI(totalCities, startIndex, endIndex) {
    const pageInfo = document.getElementById('pageInfo');
    const totalCitiesEl = document.getElementById('totalCities');
    const loadMoreSection = document.getElementById('loadMoreSection');
    const paginationSection = document.getElementById('paginationSection');
    const loadMoreBtn = document.getElementById('loadMoreBtnNew');

    if (pageInfo) {
      const showing = totalCities === 0 ? '0' : `${startIndex + 1}-${Math.min(endIndex, totalCities)}`;
      pageInfo.textContent = showing;
    }

    if (totalCitiesEl) {
      totalCitiesEl.textContent = totalCities;
    }

    const filteredCards = getFilteredCards();

    if (usePagination) {
      if (loadMoreSection) loadMoreSection.style.display = 'none';
      if (paginationSection) paginationSection.style.display = 'block';
      updatePaginationButtons();
    } else {
      if (loadMoreSection) loadMoreSection.style.display = 'block';
      if (paginationSection) paginationSection.style.display = 'none';
      
      if (loadMoreBtn) {
        if (currentLoadedCount >= filteredCards.length) {
          console.log('  - Hiding Load More (all cards shown)');
          loadMoreBtn.style.display = 'none';
        } else {
          console.log('  - Showing Load More button');
          loadMoreBtn.style.display = 'inline-flex';
        }
      }
    }
  }

  function updatePaginationButtons() {
    const totalPages = getTotalPages();
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

    if (prevBtn) {
      prevBtn.disabled = currentPage === 1;
      prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';
      prevBtn.style.cursor = currentPage === 1 ? 'not-allowed' : 'pointer';
    }

    if (nextBtn) {
      nextBtn.disabled = currentPage === totalPages || totalPages === 0;
      nextBtn.style.opacity = (currentPage === totalPages || totalPages === 0) ? '0.5' : '1';
      nextBtn.style.cursor = (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer';
    }

    if (pageNumbers) {
      pageNumbers.innerHTML = '';
      
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
          const pageBtn = document.createElement('button');
          pageBtn.textContent = i;
          pageBtn.style.cssText = `
            padding: 10px 16px;
            border: 2px solid var(--primary-color, #0056b3);
            background: ${i === currentPage ? 'var(--primary-color, #0056b3)' : 'white'};
            color: ${i === currentPage ? 'white' : 'var(--primary-color, #0056b3)'};
            border-radius: 8px;
            cursor: pointer;
            font-weight: ${i === currentPage ? '700' : '500'};
            font-size: 0.95rem;
            transition: all 0.3s;
            min-width: 40px;
          `;
          
          pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderCards();
            scrollToCityGrid();
          });

          pageBtn.addEventListener('mouseenter', () => {
            if (i !== currentPage) {
              pageBtn.style.background = 'var(--primary-color, #0056b3)';
              pageBtn.style.color = 'white';
            }
          });

          pageBtn.addEventListener('mouseleave', () => {
            if (i !== currentPage) {
              pageBtn.style.background = 'white';
              pageBtn.style.color = 'var(--primary-color, #0056b3)';
            }
          });

          pageNumbers.appendChild(pageBtn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
          const ellipsis = document.createElement('span');
          ellipsis.textContent = '...';
          ellipsis.style.cssText = 'padding: 10px 8px; color: var(--text-secondary, #666); font-weight: 600;';
          pageNumbers.appendChild(ellipsis);
        }
      }
    }
  }

  function scrollToCityGrid() {
    const regionGrid = document.querySelector('#region-container .region-grid');
    if (regionGrid) {
      const firstVisibleCard = regionGrid.querySelector('.region-card[style*="display: block"]');
      if (firstVisibleCard) {
        const yOffset = -130;
        const y = firstVisibleCard.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPagination);
  } else {
    initPagination();
  }

  setTimeout(initPagination, 1000);
  setTimeout(initPagination, 2500);
})();
