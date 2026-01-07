/**
 * Preloader functionality
 * Handles the preloader fade-out animation on page load
 */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("fade-out");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 800);
    }, 1000);
  }
});


