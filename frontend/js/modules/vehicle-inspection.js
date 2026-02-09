(function () {
  'use strict';

  // Configuration
  const API_BASE = 'http://localhost:3000/api/inspections';
  const STORAGE_KEY = 'vehicle_inspections';

  // State
  const state = {
    photos: {}, // { photoType: File }
    photoDataUrls: {}, // { photoType: base64 string } for localStorage
    annotations: {}, // { photoType: [{x, y, note}] }
    currentAnnotatingType: null,
  };

  // ===================== LOCAL STORAGE HELPERS =====================

  function getLocalInspections() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveLocalInspection(inspection) {
    const inspections = getLocalInspections();
    inspections.unshift(inspection);
    // Keep max 50 inspections to avoid storage limits
    if (inspections.length > 50) inspections.length = 50;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inspections));
  }

  function getLocalInspectionById(id) {
    return getLocalInspections().find(i => i._id === id) || null;
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Compress image to a smaller size for localStorage
  function compressImage(dataUrl, maxWidth = 400, quality = 0.6) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(dataUrl); // fallback to original
      img.src = dataUrl;
    });
  }

  // DOM Elements
  const els = {};

  // Past inspections state
  const historyState = {
    inspections: [],
    loading: false,
    currentPage: 1,
    totalPages: 1,
  };

  // Initialize
  function init() {
    cacheDOMElements();
    bindEvents();
    updateCharCount();
    loadPastInspections();
  }

  function cacheDOMElements() {
    els.form = document.getElementById('inspection-form');
    els.inputCard = document.getElementById('inputCard');
    els.loadingState = document.getElementById('loadingState');
    els.successState = document.getElementById('successState');
    els.errorState = document.getElementById('errorState');
    els.submitBtn = document.getElementById('submit-btn');
    els.resetBtn = document.getElementById('reset-btn');
    els.newInspectionBtn = document.getElementById('newInspectionBtn');
    els.retryBtn = document.getElementById('retryBtn');
    els.errorMessage = document.getElementById('errorMessage');
    els.generalNotes = document.getElementById('generalNotes');
    els.charCount = document.querySelector('.char-count');

    // Photo inputs
    els.photoInputs = document.querySelectorAll('.photo-input');
    els.photoSlots = document.querySelectorAll('.photo-slot');

    // Modal
    els.modal = document.getElementById('annotation-modal');
    els.closeModal = document.getElementById('close-modal');
    els.annotationImage = document.getElementById('annotation-image');
    els.annotationLayer = document.getElementById('annotation-layer');
    els.annotationList = document.getElementById('annotation-list');
    els.saveAnnotations = document.getElementById('save-annotations');

    // History section
    els.historySection = document.getElementById('historySection');
    els.historyGrid = document.getElementById('historyGrid');
    els.historyLoading = document.getElementById('historyLoading');
    els.historyEmpty = document.getElementById('historyEmpty');
    els.refreshHistoryBtn = document.getElementById('refreshHistoryBtn');
    els.prevPageBtn = document.getElementById('prevPageBtn');
    els.nextPageBtn = document.getElementById('nextPageBtn');
    els.pageInfo = document.getElementById('pageInfo');
  }

  function bindEvents() {
    // Photo upload
    els.photoInputs.forEach(input => {
      input.addEventListener('change', handlePhotoSelect);
    });

    // Remove photo buttons (delegated)
    document.addEventListener('click', e => {
      if (e.target.closest('.btn-remove')) {
        const photoSlot = e.target.closest('.photo-slot');
        const photoType = photoSlot.dataset.photoType;
        removePhoto(photoType);
      }
    });

    // Annotate buttons (delegated)
    document.addEventListener('click', e => {
      if (e.target.closest('.btn-annotate')) {
        const photoSlot = e.target.closest('.photo-slot');
        const photoType = photoSlot.dataset.photoType;
        openAnnotationModal(photoType);
      }
    });

    // Form submission
    els.form.addEventListener('submit', handleSubmit);

    // Reset button
    els.resetBtn.addEventListener('click', resetForm);

    // New inspection button
    els.newInspectionBtn.addEventListener('click', () => {
      resetForm();
      setView('input');
    });

    // Retry button
    els.retryBtn.addEventListener('click', () => {
      setView('input');
      handleSubmit({ preventDefault: () => { } }); // Retry submission
    });

    // Modal close
    els.closeModal.addEventListener('click', closeAnnotationModal);
    els.modal.addEventListener('click', e => {
      if (e.target === els.modal) closeAnnotationModal();
    });

    // Annotation canvas click
    els.annotationLayer.addEventListener('click', handleCanvasClick);

    // Save annotations
    els.saveAnnotations.addEventListener('click', saveAnnotations);

    // Character count
    if (els.generalNotes) {
      els.generalNotes.addEventListener('input', updateCharCount);
    }

    // History controls
    if (els.refreshHistoryBtn) {
      els.refreshHistoryBtn.addEventListener('click', () => loadPastInspections());
    }
    if (els.prevPageBtn) {
      els.prevPageBtn.addEventListener('click', () => {
        if (historyState.currentPage > 1) {
          historyState.currentPage--;
          loadPastInspections();
        }
      });
    }
    if (els.nextPageBtn) {
      els.nextPageBtn.addEventListener('click', () => {
        if (historyState.currentPage < historyState.totalPages) {
          historyState.currentPage++;
          loadPastInspections();
        }
      });
    }

    // Detail modal close
    const detailModal = document.getElementById('detail-modal');
    const closeDetailModal = document.getElementById('close-detail-modal');
    if (closeDetailModal) {
      closeDetailModal.addEventListener('click', () => {
        detailModal.style.display = 'none';
      });
    }
    if (detailModal) {
      detailModal.addEventListener('click', e => {
        if (e.target === detailModal) detailModal.style.display = 'none';
      });
    }
  }

  // Photo Handling
  function handlePhotoSelect(e) {
    const input = e.target;
    const file = input.files[0];
    const photoSlot = input.closest('.photo-slot');
    const photoType = photoSlot.dataset.photoType;

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Store file
    state.photos[photoType] = file;

    // Show preview
    const reader = new FileReader();
    reader.onload = function (e) {
      const dataUrl = e.target.result;
      // Store data URL for localStorage fallback
      state.photoDataUrls[photoType] = dataUrl;

      const uploadLabel = photoSlot.querySelector('.upload-label');
      const photoPreview = photoSlot.querySelector('.photo-preview');
      const previewImage = photoPreview.querySelector('.preview-image');

      previewImage.src = dataUrl;
      uploadLabel.style.display = 'none';
      photoPreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  function removePhoto(photoType) {
    const photoSlot = document.querySelector(`.photo-slot[data-photo-type="${photoType}"]`);
    const uploadLabel = photoSlot.querySelector('.upload-label');
    const photoPreview = photoSlot.querySelector('.photo-preview');
    const photoInput = photoSlot.querySelector('.photo-input');

    // Clear state
    delete state.photos[photoType];
    delete state.photoDataUrls[photoType];
    delete state.annotations[photoType];

    // Reset UI
    photoInput.value = '';
    uploadLabel.style.display = 'flex';
    photoPreview.style.display = 'none';

    // Clear canvas
    const canvas = photoPreview.querySelector('.annotation-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  // Annotation Modal
  function openAnnotationModal(photoType) {
    if (!state.photos[photoType]) return;

    state.currentAnnotatingType = photoType;

    // Load photo into modal
    const reader = new FileReader();
    reader.onload = function (e) {
      els.annotationImage.src = e.target.result;
      els.annotationImage.onload = function () {
        setupAnnotationCanvas();
        renderAnnotations();
      };
    };
    reader.readAsDataURL(state.photos[photoType]);

    // Show modal
    els.modal.style.display = 'flex';
  }

  function closeAnnotationModal() {
    els.modal.style.display = 'none';
    state.currentAnnotatingType = null;
  }

  function setupAnnotationCanvas() {
    const img = els.annotationImage;
    const canvas = els.annotationLayer;

    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;

    // Clear canvas
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing annotations
    drawAnnotations();
  }

  function handleCanvasClick(e) {
    const rect = els.annotationLayer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const note = prompt('Enter note for this marker (e.g., "Scratch on door", "Dent here"):');

    if (note && note.trim()) {
      const photoType = state.currentAnnotatingType;

      if (!state.annotations[photoType]) {
        state.annotations[photoType] = [];
      }

      state.annotations[photoType].push({
        x: x / els.annotationLayer.width,
        y: y / els.annotationLayer.height,
        note: note.trim(),
      });

      drawAnnotations();
      renderAnnotations();
    }
  }

  function drawAnnotations() {
    const photoType = state.currentAnnotatingType;
    const annotations = state.annotations[photoType] || [];

    const canvas = els.annotationLayer;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    annotations.forEach((ann, index) => {
      const x = ann.x * canvas.width;
      const y = ann.y * canvas.height;

      // Draw circle
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 99, 71, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw number
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(index + 1, x, y);
    });
  }

  function renderAnnotations() {
    const photoType = state.currentAnnotatingType;
    const annotations = state.annotations[photoType] || [];

    els.annotationList.innerHTML = '';

    if (annotations.length === 0) {
      els.annotationList.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">No annotations yet. Click on the image to add markers.</p>';
      return;
    }

    annotations.forEach((ann, index) => {
      const item = document.createElement('div');
      item.className = 'annotation-item';
      item.innerHTML = `
        <div class="annotation-item-content">
          <div class="annotation-marker">Marker ${index + 1}</div>
          <div class="annotation-note">${escapeHtml(ann.note)}</div>
        </div>
        <div class="annotation-item-actions">
          <button type="button" class="btn-delete-annotation" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      els.annotationList.appendChild(item);
    });

    // Bind delete buttons
    els.annotationList.querySelectorAll('.btn-delete-annotation').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.index);
        deleteAnnotation(index);
      });
    });
  }

  function deleteAnnotation(index) {
    const photoType = state.currentAnnotatingType;
    state.annotations[photoType].splice(index, 1);
    drawAnnotations();
    renderAnnotations();
  }

  function saveAnnotations() {
    const photoType = state.currentAnnotatingType;
    const annotations = state.annotations[photoType] || [];

    // Update photo slot canvas
    const photoSlot = document.querySelector(`.photo-slot[data-photo-type="${photoType}"]`);
    const photoCanvas = photoSlot.querySelector('.annotation-canvas');
    const photoPreview = photoSlot.querySelector('.photo-preview');
    const previewImage = photoPreview.querySelector('.preview-image');

    if (photoCanvas && previewImage.complete) {
      photoCanvas.width = previewImage.clientWidth;
      photoCanvas.height = previewImage.clientHeight;

      const ctx = photoCanvas.getContext('2d');
      ctx.clearRect(0, 0, photoCanvas.width, photoCanvas.height);

      annotations.forEach((ann, index) => {
        const x = ann.x * photoCanvas.width;
        const y = ann.y * photoCanvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 99, 71, 0.7)';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index + 1, x, y);
      });
    }

    closeAnnotationModal();
  }

  // Form Submission
  async function handleSubmit(e) {
    e.preventDefault();

    // Validate at least one photo
    const photoTypes = ['front', 'rear', 'leftSide', 'rightSide', 'interior', 'dashboard'];
    const uploadedPhotos = photoTypes.filter(type => state.photos[type]);

    if (uploadedPhotos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    // Collect form fields
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const inspectionType = document.getElementById('inspectionType').value;
    const driverName = document.getElementById('driverName').value;
    const customerName = document.getElementById('customerName').value;
    const odometerReading = document.getElementById('odometerReading').value;
    const fuelLevel = document.getElementById('fuelLevel').value;
    const generalNotes = document.getElementById('generalNotes').value;

    // Show loading
    setView('loading');

    try {
      // Try backend API first
      const formData = new FormData();
      if (vehicleNumber) formData.append('vehicleNumber', vehicleNumber);
      if (inspectionType) formData.append('inspectionType', inspectionType);
      if (driverName) formData.append('driverName', driverName);
      if (customerName) formData.append('customerName', customerName);
      if (odometerReading) formData.append('odometerReading', odometerReading);
      if (fuelLevel) formData.append('fuelLevel', fuelLevel);
      if (generalNotes) formData.append('generalNotes', generalNotes);

      photoTypes.forEach(type => {
        if (state.photos[type]) formData.append(type, state.photos[type]);
      });
      formData.append('annotations', JSON.stringify(state.annotations));

      const response = await fetch(API_BASE, { method: 'POST', body: formData });
      const result = await response.json();

      if (response.ok && result.success) {
        console.log('Inspection saved to server:', result.data);
        setView('success');
        return;
      }
      throw new Error(result.message || 'Server error');
    } catch (networkErr) {
      // Backend unavailable — save to localStorage as fallback
      console.warn('Backend unavailable, saving locally:', networkErr.message);
      saveToLocalStorageSync({
        vehicleNumber, inspectionType, driverName, customerName,
        odometerReading, fuelLevel, generalNotes,
      });
      setView('success');
    }
  }

  function saveToLocalStorageSync({ vehicleNumber, inspectionType, driverName, customerName, odometerReading, fuelLevel, generalNotes }) {
    // Build photos object using already-stored data URLs
    const photoTypesList = ['front', 'rear', 'leftSide', 'rightSide', 'interior', 'dashboard'];
    const photos = {};
    photoTypesList.forEach(type => {
      if (state.photoDataUrls[type]) {
        photos[type] = {
          url: state.photoDataUrls[type],
          annotations: state.annotations[type] || [],
        };
      }
    });

    const inspection = {
      _id: 'local_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
      vehicleNumber: vehicleNumber || 'N/A',
      inspectionType: inspectionType || 'pickup',
      driverName: driverName || '',
      customerName: customerName || '',
      odometerReading: odometerReading || '',
      fuelLevel: fuelLevel || '',
      generalNotes: generalNotes || '',
      photos,
      createdAt: new Date().toISOString(),
      _isLocal: true,
    };

    // Try to save, handle quota errors
    try {
      saveLocalInspection(inspection);
    } catch (e) {
      // Storage full — clear old and retry with compressed photos
      console.warn('Storage full, compressing and retrying...');
      // Reduce image quality by re-encoding through canvas
      photoTypesList.forEach(type => {
        if (photos[type] && photos[type].url) {
          try {
            const canvas = document.createElement('canvas');
            const img = new Image();
            img.src = photos[type].url;
            canvas.width = 200;
            canvas.height = 150;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 200, 150);
            photos[type].url = canvas.toDataURL('image/jpeg', 0.3);
          } catch (compErr) {
            // Remove photo data if compression fails
            photos[type].url = '';
          }
        }
      });
      inspection.photos = photos;
      localStorage.removeItem(STORAGE_KEY);
      saveLocalInspection(inspection);
    }
    console.log('Inspection saved locally:', inspection._id);
  }

  // Form Reset
  function resetForm() {
    // Reset form
    els.form.reset();

    // Clear state
    state.photos = {};
    state.photoDataUrls = {};
    state.annotations = {};

    // Reset photo slots
    const photoTypes = ['front', 'rear', 'leftSide', 'rightSide', 'interior', 'dashboard'];
    photoTypes.forEach(type => {
      const photoSlot = document.querySelector(`.photo-slot[data-photo-type="${type}"]`);
      const uploadLabel = photoSlot.querySelector('.upload-label');
      const photoPreview = photoSlot.querySelector('.photo-preview');
      const photoInput = photoSlot.querySelector('.photo-input');

      photoInput.value = '';
      uploadLabel.style.display = 'flex';
      photoPreview.style.display = 'none';

      // Clear canvas
      const canvas = photoPreview.querySelector('.annotation-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    updateCharCount();
  }

  // View Management
  function setView(view) {
    els.inputCard.style.display = 'none';
    els.loadingState.style.display = 'none';
    els.successState.style.display = 'none';
    els.errorState.style.display = 'none';

    switch (view) {
      case 'input':
        els.inputCard.style.display = 'block';
        break;
      case 'loading':
        els.loadingState.style.display = 'block';
        break;
      case 'success':
        els.successState.style.display = 'block';
        loadPastInspections(); // Refresh history after successful submission
        break;
      case 'error':
        els.errorState.style.display = 'block';
        break;
    }
  }

  // ===================== PAST INSPECTIONS =====================

  async function loadPastInspections() {
    if (!els.historyGrid) return;

    // Show loading
    els.historyLoading.style.display = 'flex';
    els.historyGrid.style.display = 'none';
    els.historyEmpty.style.display = 'none';

    try {
      // Try API first
      const url = `${API_BASE}?page=${historyState.currentPage}&limit=6`;
      const response = await fetch(url);
      const result = await response.json();

      if (response.ok && result.success) {
        // Merge with local inspections on page 1
        let allData = result.data || [];
        if (historyState.currentPage === 1) {
          const localInspections = getLocalInspections();
          if (localInspections.length > 0) {
            allData = [...localInspections, ...allData];
          }
        }
        historyState.inspections = allData;
        historyState.totalPages = result.pagination?.pages || 1;
        historyState.currentPage = result.pagination?.page || 1;
        renderHistory();
        return;
      }
    } catch (err) {
      console.warn('API unavailable, loading from localStorage:', err.message);
    }

    // Fallback: load from localStorage only
    const localInspections = getLocalInspections();
    const perPage = 6;
    const start = (historyState.currentPage - 1) * perPage;
    historyState.inspections = localInspections.slice(start, start + perPage);
    historyState.totalPages = Math.max(1, Math.ceil(localInspections.length / perPage));
    renderHistory();
  }

  function renderHistory() {
    els.historyLoading.style.display = 'none';

    if (historyState.inspections.length === 0) {
      els.historyGrid.style.display = 'none';
      els.historyEmpty.style.display = 'flex';
      updatePagination();
      return;
    }

    els.historyEmpty.style.display = 'none';
    els.historyGrid.style.display = 'grid';

    els.historyGrid.innerHTML = historyState.inspections.map(inspection => {
      const date = new Date(inspection.createdAt);
      const formattedDate = date.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit'
      });

      // Find first available photo for thumbnail
      const photoTypes = ['front', 'rear', 'leftSide', 'rightSide', 'interior', 'dashboard'];
      let thumbnailUrl = '';
      let photoCount = 0;
      photoTypes.forEach(type => {
        if (inspection.photos && inspection.photos[type] && inspection.photos[type].url) {
          photoCount++;
          if (!thumbnailUrl) thumbnailUrl = inspection.photos[type].url;
        }
      });

      const typeLabel = inspection.inspectionType === 'pickup' ? 'Pickup' : 'Delivery';
      const typeIcon = inspection.inspectionType === 'pickup' ? 'fa-arrow-up' : 'fa-arrow-down';
      const typeClass = inspection.inspectionType === 'pickup' ? 'type-pickup' : 'type-delivery';

      return `
        <div class="history-card" data-id="${inspection._id}">
          <div class="history-card-thumbnail">
            ${thumbnailUrl
          ? `<img src="${thumbnailUrl}" alt="Vehicle ${inspection.vehicleNumber}" loading="lazy">`
          : `<div class="history-no-photo"><i class="fas fa-car"></i></div>`
        }
            <span class="history-type-badge ${typeClass}">
              <i class="fas ${typeIcon}"></i> ${typeLabel}
            </span>
          </div>
          <div class="history-card-body">
            <div class="history-vehicle-number">${escapeHtml(inspection.vehicleNumber || 'N/A')}</div>
            <div class="history-meta">
              <span><i class="fas fa-user"></i> ${escapeHtml(inspection.driverName || 'Unknown')}</span>
              <span><i class="fas fa-images"></i> ${photoCount} photo${photoCount !== 1 ? 's' : ''}</span>
            </div>
            <div class="history-date">
              <i class="fas fa-calendar"></i> ${formattedDate} at ${formattedTime}
            </div>
          </div>
          <button type="button" class="btn-view-inspection" data-id="${inspection._id}" title="View Details">
            <i class="fas fa-eye"></i> View
          </button>
        </div>
      `;
    }).join('');

    // Bind view buttons
    els.historyGrid.querySelectorAll('.btn-view-inspection').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        openInspectionDetail(id);
      });
    });

    updatePagination();
  }

  function updatePagination() {
    if (els.pageInfo) {
      els.pageInfo.textContent = `Page ${historyState.currentPage} of ${historyState.totalPages}`;
    }
    if (els.prevPageBtn) {
      els.prevPageBtn.disabled = historyState.currentPage <= 1;
    }
    if (els.nextPageBtn) {
      els.nextPageBtn.disabled = historyState.currentPage >= historyState.totalPages;
    }
  }

  async function openInspectionDetail(id) {
    const detailModal = document.getElementById('detail-modal');
    const detailContent = document.getElementById('detail-content');
    if (!detailModal || !detailContent) return;

    detailContent.innerHTML = '<div class="detail-loading"><div class="inspection-spinner"></div><p>Loading inspection...</p></div>';
    detailModal.style.display = 'flex';

    // Check localStorage first for local inspections
    if (id.startsWith('local_')) {
      const localData = getLocalInspectionById(id);
      if (localData) {
        renderInspectionDetail(localData, detailContent);
      } else {
        detailContent.innerHTML = '<p class="detail-error">Inspection not found.</p>';
      }
      return;
    }

    // Try backend API
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      const result = await response.json();

      if (response.ok && result.success) {
        renderInspectionDetail(result.data, detailContent);
      } else {
        detailContent.innerHTML = '<p class="detail-error">Failed to load inspection details.</p>';
      }
    } catch (err) {
      console.error('Failed to load inspection detail:', err);
      detailContent.innerHTML = '<p class="detail-error">Network error. Please try again.</p>';
    }
  }

  function renderInspectionDetail(inspection, container) {
    const date = new Date(inspection.createdAt);
    const formattedDate = date.toLocaleDateString('en-IN', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit'
    });

    const photoTypes = [
      { key: 'front', label: 'Front View' },
      { key: 'rear', label: 'Rear View' },
      { key: 'leftSide', label: 'Left Side' },
      { key: 'rightSide', label: 'Right Side' },
      { key: 'interior', label: 'Interior' },
      { key: 'dashboard', label: 'Dashboard' },
    ];

    const typeLabel = inspection.inspectionType === 'pickup' ? 'Pickup Inspection' : 'Delivery Inspection';

    const photosHTML = photoTypes.map(({ key, label }) => {
      const photo = inspection.photos && inspection.photos[key];
      if (!photo || !photo.url) return '';
      const annotationCount = photo.annotations ? photo.annotations.length : 0;
      return `
        <div class="detail-photo">
          <img src="${photo.url}" alt="${label}" loading="lazy">
          <div class="detail-photo-label">${label}</div>
          ${annotationCount > 0 ? `<div class="detail-annotation-badge">${annotationCount} annotation${annotationCount > 1 ? 's' : ''}</div>` : ''}
        </div>
      `;
    }).filter(Boolean).join('');

    container.innerHTML = `
      <div class="detail-header">
        <h3><i class="fas fa-clipboard-check"></i> ${typeLabel}</h3>
        <span class="detail-date">${formattedDate} at ${formattedTime}</span>
      </div>
      <div class="detail-info-grid">
        <div class="detail-info-item">
          <i class="fas fa-car"></i>
          <div>
            <span class="detail-label">Vehicle</span>
            <span class="detail-value">${escapeHtml(inspection.vehicleNumber || 'N/A')}</span>
          </div>
        </div>
        <div class="detail-info-item">
          <i class="fas fa-user"></i>
          <div>
            <span class="detail-label">Driver</span>
            <span class="detail-value">${escapeHtml(inspection.driverName || 'N/A')}</span>
          </div>
        </div>
        <div class="detail-info-item">
          <i class="fas fa-user-tie"></i>
          <div>
            <span class="detail-label">Customer</span>
            <span class="detail-value">${escapeHtml(inspection.customerName || 'N/A')}</span>
          </div>
        </div>
        <div class="detail-info-item">
          <i class="fas fa-tachometer-alt"></i>
          <div>
            <span class="detail-label">Odometer</span>
            <span class="detail-value">${inspection.odometerReading ? inspection.odometerReading + ' km' : 'N/A'}</span>
          </div>
        </div>
        <div class="detail-info-item">
          <i class="fas fa-gas-pump"></i>
          <div>
            <span class="detail-label">Fuel Level</span>
            <span class="detail-value">${escapeHtml(inspection.fuelLevel || 'N/A')}</span>
          </div>
        </div>
      </div>
      ${photosHTML ? `
        <div class="detail-photos-section">
          <h4><i class="fas fa-images"></i> Vehicle Photos</h4>
          <div class="detail-photos-grid">${photosHTML}</div>
        </div>
      ` : ''}
      ${inspection.generalNotes ? `
        <div class="detail-notes">
          <h4><i class="fas fa-sticky-note"></i> Notes</h4>
          <p>${escapeHtml(inspection.generalNotes)}</p>
        </div>
      ` : ''}
    `;
  }

  // Character Count
  function updateCharCount() {
    if (els.generalNotes && els.charCount) {
      const count = els.generalNotes.value.length;
      els.charCount.textContent = `${count} / 1000`;
    }
  }

  // Utility Functions
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
