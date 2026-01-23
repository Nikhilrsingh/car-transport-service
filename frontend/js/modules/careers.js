// Careers Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
  initJobFilters();
  initApplicationForm();
  initFranchiseForm();
  initSaveJobButtons();
  initTestimonialsCarousel(); // NEW: Initialize Swiper carousel
});

// =========================
// Saved Jobs storage
// =========================

const SAVED_JOBS_KEY = 'cts_saved_jobs';

function getSavedJobs() {
  try {
    const raw = localStorage.getItem(SAVED_JOBS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setSavedJobs(jobs) {
  localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(jobs));
}

// =========================
// Job Filter Functionality
// =========================

function initJobFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const jobCards = document.querySelectorAll('.job-card');

  function applyFilter(category) {
    const savedJobs = getSavedJobs();

    jobCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category') || 'all';
      const id = card.getAttribute('data-id') || '';
      const titleEl = card.querySelector('.job-title');
      const title = titleEl ? titleEl.textContent.trim() : '';

      // match saved by id OR title
      const isSaved = savedJobs.some(
        (j) => j.id === id || j.id === title
      );

      let show = false;

      if (category === 'all') {
        show = true;
      } else if (category === 'saved') {
        show = isSaved;
      } else {
        show = cardCategory === category;
      }

      // use default display from CSS; hide with none
      card.style.display = show ? '' : 'none';
      if (show) {
        card.style.animation = 'fadeInUp 0.5s ease';
      }
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', function () {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      this.classList.add('active');

      const category = this.getAttribute('data-category') || 'all';
      applyFilter(category);
    });
  });

  // initial
  applyFilter('all');
}

// =========================
// Application Modal Functions
// =========================

function openApplicationModal(position) {
  const modal = document.getElementById('applicationModal');
  const positionName = document.getElementById('positionName');

  if (positionName) {
    positionName.textContent = position;
  }

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeApplicationModal() {
  const modal = document.getElementById('applicationModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';

  const form = document.getElementById('applicationForm');
  if (form) form.reset();
}

// =========================
// Franchise Modal Functions
// =========================

function openFranchiseModal() {
  const modal = document.getElementById('franchiseModal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeFranchiseModal() {
  const modal = document.getElementById('franchiseModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';

  const form = document.getElementById('franchiseForm');
  if (form) form.reset();
}

// Close modals when clicking outside
window.addEventListener('click', function (event) {
  const applicationModal = document.getElementById('applicationModal');
  const franchiseModal = document.getElementById('franchiseModal');

  if (event.target === applicationModal) {
    closeApplicationModal();
  }

  if (event.target === franchiseModal) {
    closeFranchiseModal();
  }
});

// Close modals with Escape key
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeApplicationModal();
    closeFranchiseModal();
  }
});

// =========================
// Application Form Submission
// =========================

function initApplicationForm() {
  const form = document.getElementById('applicationForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateApplicationForm()) {
      return;
    }

    const formData = new FormData(form);
    const position =
      document.getElementById('positionName')?.textContent || '';

    const applicationData = {
      position: position,
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zip: formData.get('zip'),
      experience: formData.get('experience'),
      availability: formData.get('availability'),
      coverLetter: formData.get('coverLetter'),
      references: formData.get('references'),
      authorized: formData.get('authorized') === 'on',
      consent: formData.get('consent') === 'on',
      submittedAt: new Date().toISOString(),
    };

    console.log('Application submitted:', applicationData);

    showSuccessMessage(
      'Application submitted successfully! We will review your application and contact you soon.'
    );

    closeApplicationModal();
  });
}

// =========================
// Franchise Form Submission
// =========================

function initFranchiseForm() {
  const form = document.getElementById('franchiseForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validateFranchiseForm()) {
      return;
    }

    const formData = new FormData(form);

    const franchiseData = {
      firstName: formData.get('franchiseFirstName'),
      lastName: formData.get('franchiseLastName'),
      email: formData.get('franchiseEmail'),
      phone: formData.get('franchisePhone'),
      targetLocation: formData.get('targetLocation'),
      investment: formData.get('investment'),
      businessExperience: formData.get('businessExperience'),
      timeline: formData.get('timeline'),
      additionalInfo: formData.get('additionalInfo'),
      submittedAt: new Date().toISOString(),
    };

    console.log('Franchise inquiry submitted:', franchiseData);

    showSuccessMessage(
      'Thank you for your interest! Our franchise team will contact you within 2 business days.'
    );

    closeFranchiseModal();
  });
}

// =========================
// Form Validation Functions
// =========================

function validateApplicationForm() {
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const resume = document.getElementById('resume').files[0];
  const authorized = document.getElementById('authorized').checked;
  const consent = document.getElementById('consent').checked;

  if (!isValidEmail(email)) {
    showError('Please enter a valid email address.');
    return false;
  }

  if (!isValidPhone(phone)) {
    showError('Please enter a valid phone number.');
    return false;
  }

  if (resume) {
    const fileSize = resume.size / 1024 / 1024;
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (fileSize > 5) {
      showError('Resume file size must be less than 5MB.');
      return false;
    }

    if (!allowedTypes.includes(resume.type)) {
      showError('Resume must be in PDF, DOC, or DOCX format.');
      return false;
    }
  }

  if (!authorized) {
    showError(
      'You must confirm that you are authorized to work in the United States.'
    );
    return false;
  }

  if (!consent) {
    showError(
      'You must consent to a background check and drug screening.'
    );
    return false;
  }

  return true;
}

function validateFranchiseForm() {
  const email = document.getElementById('franchiseEmail').value;
  const phone = document.getElementById('franchisePhone').value;

  if (!isValidEmail(email)) {
    showError('Please enter a valid email address.');
    return false;
  }

  if (!isValidPhone(phone)) {
    showError('Please enter a valid phone number.');
    return false;
  }

  return true;
}

// =========================
// Validation Helper Functions
// =========================

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// =========================
// Message Functions
// =========================

function showError(message) {
  alert('Error: ' + message);
}

function showSuccessMessage(message) {
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>${message}</span>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    gap: 15px;
    z-index: 10000;
    animation: slideInRight 0.5s ease;
    max-width: 400px;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 500);
  }, 5000);
}

// =========================
// Saved Jobs Feature
// =========================

function extractJobFromCard(card) {
  const titleEl = card.querySelector('.job-title');
  const locationEl = card.querySelector('.job-location');
  const typeEl = card.querySelector('.job-type');
  const salaryEl = card.querySelector('.job-salary');

  return {
    id:
      card.getAttribute('data-id') ||
      (titleEl ? titleEl.textContent.trim() : ''),
    title: titleEl ? titleEl.textContent.trim() : '',
    location: locationEl ? locationEl.textContent.trim() : '',
    type: typeEl ? typeEl.textContent.trim() : '',
    salary: salaryEl ? salaryEl.textContent.trim() : '',
    category: card.getAttribute('data-category'),
  };
}

function setSaveButtonState(button, isSaved) {
  if (isSaved) {
    button.textContent = 'Saved';
    button.classList.add('saved');
  } else {
    button.textContent = 'Save Job';
    button.classList.remove('saved');
  }
}

function initSaveJobButtons() {
  const savedJobs = getSavedJobs();
  const jobCards = document.querySelectorAll('.job-card');

  jobCards.forEach((card) => {
    const job = extractJobFromCard(card);
    if (!job.id) return;

    const btn = card.querySelector('.save-job-btn');
    if (!btn) return;

    // recognize previously-saved-by-title entries too
    const isAlreadySaved = savedJobs.some(
      (j) => j.id === job.id || j.id === job.title
    );
    setSaveButtonState(btn, isAlreadySaved);

    btn.addEventListener('click', () => {
      let currentSaved = getSavedJobs();
      const index = currentSaved.findIndex(
        (j) => j.id === job.id || j.id === job.title
      );

      if (index === -1) {
        currentSaved.push(job);
        setSavedJobs(currentSaved);
        setSaveButtonState(btn, true);
        showSuccessMessage('Job saved successfully!');
      } else {
        currentSaved.splice(index, 1);
        setSavedJobs(currentSaved);
        setSaveButtonState(btn, false);
        showSuccessMessage('Job removed from saved jobs.');
      }

      const activeFilter = document
        .querySelector('.filter-btn.active')
        ?.getAttribute('data-category');
      if (activeFilter === 'saved') {
        initJobFilters();
      }
    });
  });
}

// =========================
// Testimonials Carousel (Swiper)
// =========================

function initTestimonialsCarousel() {
  // Ensure Swiper library is loaded
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper is not loaded. Testimonials carousel will not initialize.');
    return;
  }

  const carouselElement = document.querySelector('.testimonials-carousel');
  if (!carouselElement) return;

  const testimonialSwiper = new Swiper('.testimonials-carousel', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    grabCursor: true,

    // Auto-rotation
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true // pause on hover for better UX
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },

    // Pagination dots
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },

    // Keyboard control for accessibility
    keyboard: {
      enabled: true,
      onlyInViewport: true
    },

    // Responsive breakpoints
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 24
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24
      }
    },

    // Smooth animations
    speed: 600,
    effect: 'slide'
  });

  return testimonialSwiper;
}

// =========================
// Smooth Scroll for CTA Button
// =========================

document
  .querySelector('.cta-button')
  ?.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  });

// =========================
// Animate elements on scroll
// =========================

function animateOnScroll() {
  const elements = document.querySelectorAll(
    '.benefit-card, .job-card, .training-card, .culture-card, .testimonial-card'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  elements.forEach((element) => {
    element.style.opacity = '0';
    observer.observe(element);
  });
}

animateOnScroll();

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
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
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Make functions globally available
window.openApplicationModal = openApplicationModal;
window.closeApplicationModal = closeApplicationModal;
window.openFranchiseModal = openFranchiseModal;
window.closeFranchiseModal = closeFranchiseModal;
