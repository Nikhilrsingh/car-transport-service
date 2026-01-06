/**
 * Auto Slider Module
 * Handles the automatic image slider in the hero section
 */

(function() {
  'use strict';

  let currentSlide = 0;
  let autoSlideInterval = null;
  const SLIDE_INTERVAL = 4000; // 4 seconds between slides

  function initAutoSlider() {
    const sliderContainer = document.querySelector('.auto-slider .slider-container');
    const slides = document.querySelectorAll('.auto-slider .slide');
    
    if (!sliderContainer || slides.length === 0) return;

    const totalSlides = slides.length;

    function showSlide(index) {
      // Remove active class from all slides
      slides.forEach(slide => slide.classList.remove('active'));
      
      // Handle wrap-around
      currentSlide = (index + totalSlides) % totalSlides;
      
      // Add active class to current slide
      slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(nextSlide, SLIDE_INTERVAL);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    // Pause on hover
    const slider = document.querySelector('.auto-slider');
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoSlide);
      slider.addEventListener('mouseleave', startAutoSlide);
    }

    // Start the auto-slide
    startAutoSlide();

    // Expose controls globally if needed
    window.autoSlider = {
      next: nextSlide,
      prev: prevSlide,
      goTo: showSlide,
      start: startAutoSlide,
      stop: stopAutoSlide
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoSlider);
  } else {
    initAutoSlider();
  }

})();
