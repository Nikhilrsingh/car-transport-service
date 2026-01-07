/**
 * Cookie Popup functionality
 * Handles cookie consent popup display and user interaction
 */
(function() {
  const popup = document.getElementById("cookie-popup");
  const acceptBtn = document.getElementById("accept-cookie");
  const rejectBtn = document.getElementById("reject-cookie");

  if (!popup || !acceptBtn || !rejectBtn) {
    return;
  }

  // Show popup if user hasn't made a decision
  if (!localStorage.getItem("cookieDecision")) {
    popup.style.display = "flex";
  }

  // Handle accept button click
  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieDecision", "accepted");
    popup.style.display = "none";
  });

  // Handle reject button click
  rejectBtn.addEventListener("click", () => {
    localStorage.setItem("cookieDecision", "rejected");
    popup.style.display = "none";
  });
})();


