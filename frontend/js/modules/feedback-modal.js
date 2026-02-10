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

  // Handle feedback submission — also saves as a review in localStorage
  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const feedback = document.getElementById("feedbackText").value.trim();

    if (!name || !feedback || selectedRating === 0) {
      alert("Please fill in your name, select a rating, and write your feedback.");
      return;
    }

    // Save to localStorage as a review
    try {
      const STORAGE_KEY = "cargo_customer_reviews";
      let reviews = [];
      try {
        reviews = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch { reviews = []; }

      const newReview = {
        _id: "fb_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8),
        user: { name: name },
        rating: selectedRating,
        title: "",
        comment: feedback,
        isVerified: false,
        status: "approved",
        helpfulCount: 0,
        isOwn: true,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      reviews.unshift(newReview);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

      // Remember name for review modal too
      localStorage.setItem("cargo_reviewer_name", name);

      // Notify review modules to refresh
      window.dispatchEvent(new CustomEvent("reviewSubmitted", { detail: { review: newReview } }));
    } catch (err) {
      console.error("Error saving feedback to localStorage:", err);
    }

    alert(`⭐ Thanks, ${name}!\nRating: ${selectedRating} stars\n\nYour feedback has been saved!`);

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
