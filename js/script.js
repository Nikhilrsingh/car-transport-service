// Enhanced Hero Section Functionality
document.addEventListener('DOMContentLoaded', function () {
  // Animated counters for stats
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value + (element.getAttribute('data-target') === '98' ? '%' : '+');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // Start counters when hero section is in view
  if (statNumbers.length > 0) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            animateValue(stat, 0, target, 2000);
          });
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const heroElement = document.querySelector('.hero');
    if (heroElement) {
      heroObserver.observe(heroElement);
    }
  }
});

// Quick quote form functionality
const quickQuoteForm = document.getElementById('quickQuoteForm');
const quoteResult = document.getElementById('quoteResult');

if (quickQuoteForm) {
  quickQuoteForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const fromCity = document.getElementById('fromCity').value;
    const toCity = document.getElementById('toCity').value;
    const vehicleType = document.getElementById('vehicleType').value;

    if (fromCity && toCity && vehicleType) {
      // Simulate price calculation
      const basePrice = 5000;
      const distanceMultiplier = 1.2;
      const vehicleMultipliers = {
        hatchback: 1.0,
        sedan: 1.2,
        suv: 1.5,
        luxury: 2.0
      };

      const calculatedPrice = Math.floor(basePrice * distanceMultiplier * (vehicleMultipliers[vehicleType] || 1));
      const formattedPrice = calculatedPrice.toLocaleString('en-IN');

      document.querySelector('.amount').textContent = `₹${formattedPrice}`;
      quoteResult.style.display = 'block';

      // Smooth scroll to result
      quoteResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}

// Parallax effect for background
window.addEventListener('scroll', function () {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  const video = document.querySelector('.hero-video');

  if (video) {
    video.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Smooth scroll for CTA buttons
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Video fallback for mobile
const video = document.querySelector('.hero-video');
if (video) {
  video.addEventListener('error', function () {
    this.style.display = 'none';
    document.querySelector('.hero-fallback').style.display = 'block';
  });
}

// Testimonial Slider Functionality now created seperately in js/modules/testimonial.js




// Contact Form Functionality
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const phone = contactForm.querySelector('input[type="tel"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const vehicleType = contactForm.querySelector("select").value;

    // Simulate form submission
    const submitBtn = contactForm.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i><span>Processing...</span>';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Show success message
      alert(
        `Thank you ${name}! Your quote request has been received. We'll contact you at ${phone} within 30 minutes.`
      );

      // Reset form
      contactForm.reset();

      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });


    // Phone number formatting
    const phoneInput = contactForm.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 0) {
          value = value.match(/.{1,5}/g).join(" ");
        }
        e.target.value = value;
      });
    }
  }
});



//    <!-- Preloader fade-out script -->
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("fade-out");

    setTimeout(() => {
      preloader.style.display = "none";
    }, 100);
  }, 100);
});

// Back to Top Functionality - Moved to js/modules/back-to-top-button.js

// Add input animations
const inputs = document.querySelectorAll(
  ".input-group input, .input-group select"
);
inputs.forEach((input) => {
  input.addEventListener("focus", function () {
    this.parentElement.style.transform = "scale(1.02)";
  });

  input.addEventListener("blur", function () {
    this.parentElement.style.transform = "scale(1)";
  });
});

// Phone number formatting (duplicate code - should be removed)
const contactFormDup = document.getElementById("contactForm");
if (contactFormDup) {
  const phoneInput = contactFormDup.querySelector('input[type="tel"]');
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 0) {
        value = value.match(/.{1,5}/g).join(" ");
      }
      e.target.value = value;
    });
  }
}


//Keypress-Activated Easter Egg 
document.addEventListener("DOMContentLoaded", () => {
  const car = document.querySelector(".car");
  if (!car) return;

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && (event.key === "?" || event.key === "/")) {
      car.classList.remove("animate");
      void car.offsetWidth;
      car.classList.add("animate");
    }
  });
});




window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");

  // Small delay for smooth fade-out
  setTimeout(() => {
    preloader.classList.add("fade-out");
    setTimeout(() => {
      preloader.style.display = "none";
    }, 800);
  }, 1000); // delay before hiding
});

// 🌿 Slider Script - Enhanced with controls and accessibility
(function() {
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.getElementById("sliderDots");
  const controlBtn = document.getElementById("sliderControl");
  
  let currentSlide = 0;
  let isPlaying = true;
  let sliderInterval = null;

  // Create navigation dots
  function createDots() {
    if (!dotsContainer || slides.length === 0) return;
    
    slides.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.classList.add("slider-dot");
      if (index === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  // Update active dot
  function updateDots() {
    if (!dotsContainer) return;
    
    const dots = dotsContainer.querySelectorAll(".slider-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    if (slides.length === 0) return;
    
    slides[currentSlide].classList.remove("active");
    currentSlide = index;
    slides[currentSlide].classList.add("active");
    updateDots();
  }

  // Next slide
  function nextSlide() {
    if (slides.length === 0) return;
    
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
  }

  // Start auto-play
  function startSlider() {
    if (slides.length === 0) return;
    
    isPlaying = true;
    sliderInterval = setInterval(nextSlide, 5000); // changes every 5 seconds
    
    if (controlBtn) {
      controlBtn.innerHTML = '<i class="fas fa-pause"></i>';
      controlBtn.setAttribute("aria-label", "Pause slider");
    }
  }

  // Pause auto-play
  function pauseSlider() {
    isPlaying = false;
    if (sliderInterval) {
      clearInterval(sliderInterval);
      sliderInterval = null;
    }
    
    if (controlBtn) {
      controlBtn.innerHTML = '<i class="fas fa-play"></i>';
      controlBtn.setAttribute("aria-label", "Play slider");
    }
  }

  // Toggle play/pause
  function toggleSlider() {
    if (isPlaying) {
      pauseSlider();
    } else {
      startSlider();
    }
  }

  // Initialize slider
  function init() {
    if (slides.length === 0) return;
    
    createDots();
    startSlider();
    
    // Add control button listener
    if (controlBtn) {
      controlBtn.addEventListener("click", toggleSlider);
    }

    // Pause on hover for accessibility
    const sliderContainer = document.querySelector(".auto-slider");
    if (sliderContainer) {
      sliderContainer.addEventListener("mouseenter", () => {
        if (isPlaying) pauseSlider();
      });
      
      sliderContainer.addEventListener("mouseleave", () => {
        if (!isPlaying) startSlider();
      });
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!sliderContainer) return;
      
      const sliderRect = sliderContainer.getBoundingClientRect();
      const isInView = sliderRect.top < window.innerHeight && sliderRect.bottom > 0;
      
      if (isInView) {
        if (e.key === "ArrowLeft") {
          const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
          goToSlide(prevIndex);
        } else if (e.key === "ArrowRight") {
          nextSlide();
        } else if (e.key === " " && e.target.tagName !== "INPUT") {
          e.preventDefault();
          toggleSlider();
        }
      }
    });
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// Enhanced Hero Section Functionality
document.addEventListener('DOMContentLoaded', function () {
  // Animated counters for stats
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value + (element.getAttribute('data-target') === '98' ? '%' : '+');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  // Start counters when hero section is in view
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          animateValue(stat, 0, target, 2000);
        });
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  heroObserver.observe(document.querySelector('.hero'));

  // Quick quote form functionality
  const quickQuoteForm = document.getElementById('quickQuoteForm');
  const quoteResult = document.getElementById('quoteResult');

  if (quickQuoteForm) {
    quickQuoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const fromCity = document.getElementById('fromCity').value;
      const toCity = document.getElementById('toCity').value;
      const vehicleType = document.getElementById('vehicleType').value;

      if (fromCity && toCity && vehicleType) {
        // Simulate price calculation
        const basePrice = 5000;
        const distanceMultiplier = 1.2;
        const vehicleMultipliers = {
          hatchback: 1.0,
          sedan: 1.2,
          suv: 1.5,
          luxury: 2.0
        };

        const calculatedPrice = Math.floor(basePrice * distanceMultiplier * (vehicleMultipliers[vehicleType] || 1));
        const formattedPrice = calculatedPrice.toLocaleString('en-IN');

        document.querySelector('.amount').textContent = `₹${formattedPrice}`;
        quoteResult.style.display = 'block';

        // Smooth scroll to result
        quoteResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Parallax effect for background
  window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const video = document.querySelector('.hero-video');

    if (video) {
      video.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
  });

  // Smooth scroll for CTA buttons
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Video fallback for mobile
  const video = document.querySelector('.hero-video');
  if (video) {
    video.addEventListener('error', function () {
      this.style.display = 'none';
      document.querySelector('.hero-fallback').style.display = 'block';
    });
  }
});
window.addEventListener("scroll", function() {
  const scrollProgress = document.getElementById("scroll-progress");
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + "%";
});