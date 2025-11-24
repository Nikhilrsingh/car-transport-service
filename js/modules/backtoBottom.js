// 🔝 Back to Bottom Button (Scrolls from Top → Bottom)
const backToBottomButton = (() => {
  const BUTTON_ID = "backToBottom";
  const VISIBLE_CLASS = "visible";
  const SCROLL_THRESHOLD = 300; // Hide after scrolling down
  const SMOOTH_SCROLL_DURATION = 800; // Duration for smooth scroll in ms

  /* Initialize button*/
  function init() {
    const button = document.getElementById(BUTTON_ID);
    if (!button) return; // If button not found

    attachEventListeners(button);
    handleScroll(button);
  }

  /* Event listeners*/
  function attachEventListeners(button) {
    // Scroll smoothly to bottom on click
    button.addEventListener("click", scrollToBottom);

    // Toggle visibility based on scroll position
    window.addEventListener("scroll", () => handleScroll(button), {
      passive: true,
    });
  }

  /*Show button only when near top*/
  function handleScroll(button) {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    // Show when user is near the top
    if (scrollTop < SCROLL_THRESHOLD) {
      showButton(button);
    } else {
      hideButton(button);
    }
  }

  function showButton(button) {
    if (!button.classList.contains(VISIBLE_CLASS)) {
      button.classList.add(VISIBLE_CLASS);
    }
  }

  function hideButton(button) {
    if (button.classList.contains(VISIBLE_CLASS)) {
      button.classList.remove(VISIBLE_CLASS);
    }
  }

  /*Smooth scroll to bottom*/
  function scrollToBottom(e) {
    e.preventDefault();

    const startPosition = window.scrollY || document.documentElement.scrollTop;
    const targetPosition =
      document.documentElement.scrollHeight - window.innerHeight;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    function easeOutQuad(t) {
      return t * (2 - t);
    }

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / SMOOTH_SCROLL_DURATION, 1);
      const ease = easeOutQuad(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }
    requestAnimationFrame(animateScroll);
  }

  return { init };
})();

// Initialize when DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", backToBottomButton.init);
} else {
  backToBottomButton.init();
}
