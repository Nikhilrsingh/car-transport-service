// Back to Top Functionality (defensive)
// Attach handlers after DOM is ready and guard against missing element or duplicate IDs.
document.addEventListener('DOMContentLoaded', () => {
  const backToTopButton = document.getElementById('backToTop');
  if (!backToTopButton) return; // nothing to do

  // Show/hide on scroll
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  };

  // Initial check
  toggleVisibility();

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  // Click -> smooth scroll to top
  backToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});