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
  }
});

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

// Testimonial Slider Functionality
document.addEventListener("DOMContentLoaded", function () {
  const sliderContainer = document.getElementById("sliderContainer");
  const slides = document.querySelectorAll(".testimonial-card");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  let currentSlide = 0;
  const totalSlides = slides.length;

  // Update slider position
  function updateSlider() {
    sliderContainer.style.transform = `translateX(-${currentSlide * 100
      }%)`;

    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  // Next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }

  // Previous slide
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
  }

  // Event listeners
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Dot click events
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      updateSlider();
    });
  });

  // Auto slide every 5 seconds
  setInterval(nextSlide, 5000);

  // Pause auto-slide on hover
  const slider = document.querySelector(".testimonial-slider");
  slider.addEventListener("mouseenter", () => {
    clearInterval(autoSlide);
  });

  let autoSlide = setInterval(nextSlide, 5000);
});

// Load shared footer dynamically
fetch('pages/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer-container').innerHTML = data;
  })
  .catch(error => console.error('Error loading footer:', error));

// Contact Form Functionality
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");

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
  phoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 0) {
      value = value.match(/.{1,5}/g).join(" ");
    }
    e.target.value = value;
  });
});

// Load shared footer dynamically
fetch('pages/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer-container').innerHTML = data;
  })
  .catch(error => console.error('Error loading footer:', error));

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

// Phone number formatting
const phoneInput = contactForm.querySelector('input[type="tel"]');
phoneInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 0) {
    value = value.match(/.{1,5}/g).join(" ");
  }
  e.target.value = value;
});


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


// <!-- Load Footer -->
// Load footer
fetch('./footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer-container').innerHTML = data;
  })
  .catch(error => {
    console.error('Error loading footer:', error);
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

// 🌿 Slider Script
let slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function nextSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

setInterval(nextSlide, 5000); // changes every 5 seconds

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

