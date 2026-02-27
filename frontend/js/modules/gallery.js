/* ========================================
   ENHANCED GALLERY MODULE WITH ALL FEATURES
   ======================================== */

class EnhancedGallery {
  constructor() {
    this.currentImageIndex = 0;
    this.images = [];
    this.filteredImages = [];
    this.currentFilter = 'all';
    this.currentZoom = 1;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.currentRotation = 0;

    console.log('Enhanced Gallery initializing...');
    this.init();
  }

  init() {
    console.log('Gallery init started');
    this.setupGalleryItems();
    this.setupFilters();
    this.setupSearch();
    this.setupLazyLoading();
    this.setupLightbox();
    this.setupKeyboardNavigation();
    this.setupSwipeGestures();
    this.setup360View();
    this.setupBeforeAfter();
    this.setupCarousel();
    console.log('Gallery init completed');
  }

  /* ========================================
     GALLERY ITEMS SETUP
     ======================================== */
  setupGalleryItems() {
    const galleryItems = document.querySelectorAll('.enhanced-gallery-item');
    this.images = Array.from(galleryItems).map((item, index) => {
      const img = item.querySelector('img');
      return {
        element: item,
        index: index,
        category: item.dataset.category || 'all',
        title: item.dataset.title || 'Untitled',
        description: item.dataset.description || '',
        date: item.dataset.date || '',
        location: item.dataset.location || '',
        tags: item.dataset.tags ? item.dataset.tags.split(',') : [],
        src: img?.src || img?.dataset.src || '',
        thumbnail: img?.dataset.thumbnail || img?.src || img?.dataset.src || ''
      };
    });

    this.filteredImages = [...this.images];

    // Add click handlers
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => this.openLightbox(index));
    });

    this.updateMasonryLayout();
  }

  /* ========================================
     MASONRY LAYOUT
     ======================================== */
  updateMasonryLayout() {
    const grid = document.querySelector('.enhanced-gallery-grid');
    if (!grid) return;

    // Check if browser supports CSS Grid masonry
    const supportsMasonry = CSS.supports('grid-template-rows', 'masonry');

    // Apply fallback layout (Simple and stable)
    const items = grid.querySelectorAll('.enhanced-gallery-item');
    items.forEach((item) => {
      item.style.gridRow = 'auto';
    });
  }

  /* ========================================
     ISOTOPE FILTERING
     ======================================== */
  setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.applyFilter(filter);

        // Update active state
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Update filter counts
    this.updateFilterCounts();
  }

  applyFilter(filter) {
    this.currentFilter = filter;
    const items = document.querySelectorAll('.enhanced-gallery-item');

    let visibleCount = 0;
    items.forEach((item, index) => {
      const category = item.dataset.category;
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, visibleCount * 50);
        visibleCount++;
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });

    // Update filtered images array
    if (filter === 'all') {
      this.filteredImages = [...this.images];
    } else {
      this.filteredImages = this.images.filter(img => img.category === filter);
    }

    this.updateMasonryLayout();
  }

  updateFilterCounts() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
      const filter = btn.dataset.filter;
      const count = filter === 'all'
        ? this.images.length
        : this.images.filter(img => img.category === filter).length;

      const countSpan = btn.querySelector('.filter-count');
      if (countSpan) {
        countSpan.textContent = count;
      }
    });
  }

  /* ========================================
     SEARCH FUNCTIONALITY
     ======================================== */
  setupSearch() {
    const searchInput = document.getElementById('gallerySearch');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.searchImages(e.target.value.toLowerCase());
      }, 300);
    });
  }

  searchImages(query) {
    const items = document.querySelectorAll('.enhanced-gallery-item');

    if (!query) {
      this.applyFilter(this.currentFilter);
      return;
    }

    let visibleCount = 0;
    items.forEach((item) => {
      const title = (item.dataset.title || '').toLowerCase();
      const description = (item.dataset.description || '').toLowerCase();
      const tags = (item.dataset.tags || '').toLowerCase();
      const location = (item.dataset.location || '').toLowerCase();

      const matches = title.includes(query) ||
        description.includes(query) ||
        tags.includes(query) ||
        location.includes(query);

      if (matches) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, visibleCount * 30);
        visibleCount++;
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });

    // Update filtered images for lightbox
    this.filteredImages = this.images.filter(img => {
      const title = img.title.toLowerCase();
      const description = img.description.toLowerCase();
      const tags = img.tags.join(',').toLowerCase();
      const location = img.location.toLowerCase();

      return title.includes(query) ||
        description.includes(query) ||
        tags.includes(query) ||
        location.includes(query);
    });
  }

  /* ========================================
     LAZY LOADING WITH BLUR-UP PLACEHOLDERS
     ======================================== */
  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px'
    });

    const images = document.querySelectorAll('.enhanced-gallery-item img[data-src]');
    images.forEach(img => {
      // Add blur placeholder
      img.style.filter = 'blur(20px)';
      img.style.transform = 'scale(1.1)';
      img.classList.add('lazy-loading');
      imageObserver.observe(img);
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    const tempImg = new Image();
    tempImg.onload = () => {
      img.src = src;

      // Remove blur effect
      img.style.filter = 'blur(0)';
      img.style.transform = 'scale(1)';
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');

      // Remove loading spinner
      const spinner = img.parentElement.querySelector('.loading-spinner');
      if (spinner) {
        spinner.style.opacity = '0';
        setTimeout(() => spinner.remove(), 300);
      }

      // Update masonry layout after image loads
      setTimeout(() => this.updateMasonryLayout(), 100);
    };
    tempImg.src = src;
  }

  /* ========================================
     ENHANCED LIGHTBOX WITH IMAGE COUNTER
     ======================================== */
  setupLightbox() {
    const lightbox = document.getElementById('enhancedLightbox');
    if (!lightbox) return;

    // Close button
    const closeBtn = lightbox.querySelector('.lightbox-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLightbox());
    }

    // Navigation buttons
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateLightbox(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateLightbox(1));
    }

    // Zoom controls
    const zoomInBtn = lightbox.querySelector('.zoom-in');
    const zoomOutBtn = lightbox.querySelector('.zoom-out');
    const zoomResetBtn = lightbox.querySelector('.zoom-reset');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => this.zoomImage(0.2));
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => this.zoomImage(-0.2));
    }
    if (zoomResetBtn) {
      zoomResetBtn.addEventListener('click', () => this.resetZoom());
    }

    // Fullscreen button
    const fullscreenBtn = lightbox.querySelector('.lightbox-fullscreen');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // Share buttons
    const shareButtons = lightbox.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
      btn.addEventListener('click', () => this.shareImage(btn.dataset.platform));
    });

    // Download button
    const downloadBtn = lightbox.querySelector('.lightbox-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.downloadImage());
    }

    // Click outside to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        this.closeLightbox();
      }
    });

    // Image drag for panning when zoomed
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    if (lightboxImg) {
      this.setupImagePanning(lightboxImg);
    }
  }

  setupImagePanning(img) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;

    img.addEventListener('mousedown', (e) => {
      if (this.currentZoom > 1) {
        isDragging = true;
        startX = e.pageX;
        startY = e.pageY;
        img.style.cursor = 'grabbing';
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = e.pageX - startX;
      const deltaY = e.pageY - startY;

      const wrapper = img.parentElement;
      if (wrapper) {
        wrapper.scrollLeft = scrollLeft - deltaX;
        wrapper.scrollTop = scrollTop - deltaY;
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      if (this.currentZoom > 1) {
        img.style.cursor = 'grab';
      } else {
        img.style.cursor = 'default';
      }
    });
  }

  openLightbox(index) {
    const lightbox = document.getElementById('enhancedLightbox');
    if (!lightbox) return;

    // Find the correct index in filtered images
    const clickedImage = this.images[index];
    const filteredIndex = this.filteredImages.findIndex(img => img.index === clickedImage.index);

    this.currentImageIndex = filteredIndex >= 0 ? filteredIndex : 0;
    const imageData = this.filteredImages[this.currentImageIndex];

    if (!imageData) return;

    // Update image
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    if (lightboxImg) {
      lightboxImg.src = imageData.src;
      lightboxImg.alt = imageData.title;
    }

    // Update image counter
    this.updateImageCounter();

    // Update caption
    const titleEl = lightbox.querySelector('.lightbox-caption h3');
    const descEl = lightbox.querySelector('.lightbox-caption p');

    if (titleEl) titleEl.textContent = imageData.title;
    if (descEl) descEl.textContent = imageData.description;

    // Update metadata
    const dateEl = lightbox.querySelector('.meta-date');
    const locationEl = lightbox.querySelector('.meta-location');
    const categoryEl = lightbox.querySelector('.meta-category');

    if (dateEl && imageData.date) dateEl.textContent = imageData.date;
    if (locationEl && imageData.location) locationEl.textContent = imageData.location;
    if (categoryEl && imageData.category) {
      categoryEl.textContent = imageData.category.charAt(0).toUpperCase() + imageData.category.slice(1);
    }

    // Update thumbnails
    this.updateLightboxThumbnails();

    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset zoom
    this.currentZoom = 1;
    this.resetZoom();
  }

  updateImageCounter() {
    const currentEl = document.querySelector('.lightbox-counter .current-image');
    const totalEl = document.querySelector('.lightbox-counter .total-images');

    if (currentEl) {
      currentEl.textContent = this.currentImageIndex + 1;
    }
    if (totalEl) {
      totalEl.textContent = this.filteredImages.length;
    }
  }

  closeLightbox() {
    const lightbox = document.getElementById('enhancedLightbox');
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';

      // Exit fullscreen if active
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  }

  navigateLightbox(direction) {
    this.currentImageIndex += direction;

    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.filteredImages.length - 1;
    } else if (this.currentImageIndex >= this.filteredImages.length) {
      this.currentImageIndex = 0;
    }

    const imageData = this.filteredImages[this.currentImageIndex];
    if (!imageData) return;

    // Update image with fade effect
    const lightboxImg = document.querySelector('.lightbox-image');
    if (lightboxImg) {
      lightboxImg.style.opacity = '0';

      setTimeout(() => {
        lightboxImg.src = imageData.src;
        lightboxImg.alt = imageData.title;
        lightboxImg.style.opacity = '1';
      }, 150);
    }

    // Update counter
    this.updateImageCounter();

    // Update caption
    const titleEl = document.querySelector('.lightbox-caption h3');
    const descEl = document.querySelector('.lightbox-caption p');

    if (titleEl) titleEl.textContent = imageData.title;
    if (descEl) descEl.textContent = imageData.description;

    // Update metadata
    const dateEl = document.querySelector('.meta-date');
    const locationEl = document.querySelector('.meta-location');
    const categoryEl = document.querySelector('.meta-category');

    if (dateEl && imageData.date) dateEl.textContent = imageData.date;
    if (locationEl && imageData.location) locationEl.textContent = imageData.location;
    if (categoryEl && imageData.category) {
      categoryEl.textContent = imageData.category.charAt(0).toUpperCase() + imageData.category.slice(1);
    }

    // Update thumbnails
    this.updateLightboxThumbnails();

    // Reset zoom
    this.resetZoom();
  }

  zoomImage(delta) {
    this.currentZoom = Math.max(1, Math.min(3, this.currentZoom + delta));
    const lightboxImg = document.querySelector('.lightbox-image');

    if (lightboxImg) {
      lightboxImg.style.transform = `scale(${this.currentZoom})`;
      lightboxImg.style.cursor = this.currentZoom > 1 ? 'grab' : 'default';
    }
  }

  resetZoom() {
    this.currentZoom = 1;
    const lightboxImg = document.querySelector('.lightbox-image');

    if (lightboxImg) {
      lightboxImg.style.transform = 'scale(1)';
      lightboxImg.style.cursor = 'default';

      const wrapper = lightboxImg.parentElement;
      if (wrapper) {
        wrapper.scrollLeft = 0;
        wrapper.scrollTop = 0;
      }
    }
  }

  toggleFullscreen() {
    const lightbox = document.getElementById('enhancedLightbox');

    if (!document.fullscreenElement) {
      lightbox.requestFullscreen().catch(err => {
        console.log('Fullscreen error:', err);
      });

      const fullscreenBtn = lightbox.querySelector('.lightbox-fullscreen i');
      if (fullscreenBtn) {
        fullscreenBtn.className = 'fas fa-compress';
      }
    } else {
      document.exitFullscreen();

      const fullscreenBtn = lightbox.querySelector('.lightbox-fullscreen i');
      if (fullscreenBtn) {
        fullscreenBtn.className = 'fas fa-expand';
      }
    }
  }

  updateLightboxThumbnails() {
    const thumbnailsContainer = document.querySelector('.lightbox-thumbnails');
    if (!thumbnailsContainer) return;

    thumbnailsContainer.innerHTML = '';

    this.filteredImages.forEach((img, index) => {
      const thumb = document.createElement('img');
      thumb.src = img.thumbnail;
      thumb.alt = img.title;
      thumb.className = 'lightbox-thumbnail';

      if (index === this.currentImageIndex) {
        thumb.classList.add('active');
      }

      thumb.addEventListener('click', () => {
        this.currentImageIndex = index;
        this.navigateLightbox(0); // Refresh without changing index
      });

      thumbnailsContainer.appendChild(thumb);
    });

    // Scroll active thumbnail into view
    const activeThumb = thumbnailsContainer.querySelector('.lightbox-thumbnail.active');
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  /* ========================================
     SHARE FUNCTIONALITY
     ======================================== */
  shareImage(platform) {
    const imageData = this.filteredImages[this.currentImageIndex];
    if (!imageData) return;

    const url = window.location.href;
    const title = imageData.title;
    const text = imageData.description;

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageData.src)}&description=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      case 'copy':
        this.copyToClipboard(imageData.src);
        return;
      case 'link':
        this.copyToClipboard(url);
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showNotification('Copied to clipboard!');
    }).catch(err => {
      console.error('Copy failed:', err);
      this.showNotification('Failed to copy');
    });
  }

  downloadImage() {
    const imageData = this.filteredImages[this.currentImageIndex];
    if (!imageData) return;

    const link = document.createElement('a');
    link.href = imageData.src;
    link.download = `${imageData.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showNotification('Image downloaded!');
  }

  /* ========================================
     ENHANCED KEYBOARD NAVIGATION
     ======================================== */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      const lightbox = document.getElementById('enhancedLightbox');
      if (!lightbox || !lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.navigateLightbox(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.navigateLightbox(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.zoomImage(0.2);
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.zoomImage(-0.2);
          break;
        case '+':
        case '=':
          e.preventDefault();
          this.zoomImage(0.2);
          break;
        case '-':
        case '_':
          e.preventDefault();
          this.zoomImage(-0.2);
          break;
        case '0':
          e.preventDefault();
          this.resetZoom();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;
        case 'd':
        case 'D':
          e.preventDefault();
          this.downloadImage();
          break;
        case 'Home':
          e.preventDefault();
          this.currentImageIndex = 0;
          this.navigateLightbox(0);
          break;
        case 'End':
          e.preventDefault();
          this.currentImageIndex = this.filteredImages.length - 1;
          this.navigateLightbox(0);
          break;
      }
    });
  }

  /* ========================================
     SWIPE GESTURES
     ======================================== */
  setupSwipeGestures() {
    const lightbox = document.getElementById('enhancedLightbox');
    if (!lightbox) return;

    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
    }, { passive: true });
  }

  handleSwipe(startX, endX, startY, endY) {
    const threshold = 50;
    const diffX = startX - endX;
    const diffY = startY - endY;

    // Horizontal swipe (must be more horizontal than vertical)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe left - next image
        this.navigateLightbox(1);
      } else {
        // Swipe right - previous image
        this.navigateLightbox(-1);
      }
    }
    // Vertical swipe down to close
    else if (diffY < -threshold && Math.abs(diffY) > Math.abs(diffX)) {
      this.closeLightbox();
    }
  }

  /* ========================================
     360° VIEW
     ======================================== */
  setup360View() {
    const view360Containers = document.querySelectorAll('.view-360-container');

    view360Containers.forEach(container => {
      const images = JSON.parse(container.dataset.images || '[]');
      if (images.length === 0) return;

      let currentFrame = 0;
      let isDragging = false;
      let startX = 0;
      let isAutoRotating = false;
      let autoRotateInterval;

      const img = container.querySelector('.view-360-image');
      const playBtn = container.querySelector('.view-360-play');
      const indicator = container.querySelector('.view-360-indicator');

      if (img) {
        img.src = images[0];
        img.style.transition = 'none';
      }

      const startAutoRotate = () => {
        isAutoRotating = true;
        autoRotateInterval = setInterval(() => {
          currentFrame = (currentFrame + 1) % images.length;
          if (img) img.src = images[currentFrame];
          if (indicator) {
            const angle = Math.round((currentFrame / images.length) * 360);
            indicator.textContent = `Drag to rotate • ${angle}°`;
          }
        }, 200);
      };

      const stopAutoRotate = () => {
        isAutoRotating = false;
        clearInterval(autoRotateInterval);
      };

      container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        stopAutoRotate();
        if (img) img.style.cursor = 'grabbing';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.pageX - startX;
        const sensitivity = 10;

        if (Math.abs(deltaX) > sensitivity) {
          const direction = deltaX > 0 ? 1 : -1;
          currentFrame = (currentFrame + direction + images.length) % images.length;
          if (img) img.src = images[currentFrame];
          if (indicator) {
            const angle = Math.round((currentFrame / images.length) * 360);
            indicator.textContent = `Drag to rotate • ${angle}°`;
          }
          startX = e.pageX;
        }
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
        if (img) img.style.cursor = 'grab';
      });

      if (playBtn) {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';

        playBtn.addEventListener('click', () => {
          if (isAutoRotating) {
            stopAutoRotate();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
          } else {
            startAutoRotate();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
          }
        });
      }
    });
  }

  /* ========================================
     BEFORE/AFTER SLIDER
     ======================================== */
  setupBeforeAfter() {
    const beforeAfterContainers = document.querySelectorAll('.before-after-slider');

    beforeAfterContainers.forEach(container => {
      const handle = container.querySelector('.slider-handle');
      const afterImage = container.querySelector('.after-image');

      if (!handle || !afterImage) return;

      let isDragging = false;

      const updateSlider = (x) => {
        const rect = container.getBoundingClientRect();
        const position = Math.max(0, Math.min(x - rect.left, rect.width));
        const percentage = (position / rect.width) * 100;

        handle.style.left = `${percentage}%`;
        afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      };

      handle.addEventListener('mousedown', () => {
        isDragging = true;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.pageX);
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });

      container.addEventListener('click', (e) => {
        updateSlider(e.pageX);
      });
    });
  }

  /* ========================================
     IMAGE CAROUSEL
     ======================================== */
  setupCarousel() {
    const carousels = document.querySelectorAll('.journey-carousel');

    carousels.forEach(carousel => {
      const track = carousel.querySelector('.carousel-track');
      const slides = carousel.querySelectorAll('.carousel-slide');
      const prevBtn = carousel.querySelector('.carousel-prev');
      const nextBtn = carousel.querySelector('.carousel-next');
      const indicators = carousel.querySelectorAll('.carousel-indicator');

      let currentSlide = 0;
      let autoPlayInterval;

      const updateCarousel = (index) => {
        currentSlide = index;
        const offset = -currentSlide * 100;

        if (track) {
          track.style.transform = `translateX(${offset}%)`;
        }

        indicators.forEach((indicator, i) => {
          indicator.classList.toggle('active', i === currentSlide);
        });
      };

      const nextSlide = () => {
        const next = (currentSlide + 1) % slides.length;
        updateCarousel(next);
      };

      const prevSlide = () => {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        updateCarousel(prev);
      };

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          resetAutoPlay();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          resetAutoPlay();
        });
      }

      indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
          updateCarousel(index);
          resetAutoPlay();
        });
      });

      const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
      };

      const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
      };

      startAutoPlay();

      carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
      });

      carousel.addEventListener('mouseleave', () => {
        startAutoPlay();
      });
    });
  }

  /* ========================================
     UTILITY FUNCTIONS
     ======================================== */
  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'enhanced-gallery-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: linear-gradient(135deg, #ff6347, #ff4500);
      color: white;
      padding: 15px 25px;
      border-radius: 50px;
      box-shadow: 0 5px 20px rgba(255, 99, 71, 0.4);
      z-index: 10001;
      animation: slideInRight 0.3s ease;
      font-size: 0.9rem;
      font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

/* ========================================
   INITIALIZE GALLERY
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedGallery();
});

/* ========================================
   ADDITIONAL ANIMATIONS
   ======================================== */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .lightbox-image {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .loading-spinner {
    transition: opacity 0.3s ease;
  }
`;
document.head.appendChild(style);
