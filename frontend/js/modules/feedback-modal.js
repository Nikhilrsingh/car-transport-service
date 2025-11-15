document.addEventListener("DOMContentLoaded", () => {
  const feedbackBtn = document.getElementById("feedbackBtn");
  const feedbackModal = document.getElementById("feedbackModal");
  const closeFeedback = document.getElementById("closeFeedback");
  const feedbackForm = document.getElementById("feedbackForm");

  // Open modal
  feedbackBtn.addEventListener("click", () => {
    feedbackModal.style.display = "flex";
  });

  // Close modal
  closeFeedback.addEventListener("click", () => {
    feedbackModal.style.display = "none";
  });

  // Close when clicking outside modal box
  window.addEventListener("click", (e) => {
    if (e.target === feedbackModal) {
      feedbackModal.style.display = "none";
    }
  });

  // ⭐ Star rating logic
  const stars = document.querySelectorAll(".star");
  let selectedRating = 0;

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.getAttribute("data-value"));

      // Reset all stars
      stars.forEach((s) => {
        s.classList.remove("active");
        s.classList.replace("fas", "far");
      });

      // Highlight up to clicked star
      for (let i = 0; i < selectedRating; i++) {
        stars[i].classList.add("active");
        stars[i].classList.replace("far", "fas"); // fill the star
      }
    });

    star.addEventListener("mouseover", () => {
      stars.forEach((s, i) => {
        s.style.color = i < star.dataset.value ? "#ff9800" : "#ccc";
      });
    });

    star.addEventListener("mouseout", () => {
      stars.forEach((s, i) => {
        s.style.color = i < selectedRating ? "#ff9800" : "#ccc";
      });
    });
  });

  // Handle feedback submission
  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const feedback = document.getElementById("feedbackText").value.trim();

    alert(`⭐ Thanks, ${name}!\nRating: ${selectedRating} stars\n\nYour feedback:\n${feedback}`);

    // Reset modal
    feedbackModal.style.display = "none";
    feedbackForm.reset();
    stars.forEach((s) => {
      s.classList.remove("active");
      s.classList.replace("fas", "far");
      s.style.color = "#ccc";
    });
    selectedRating = 0;
  });
});
