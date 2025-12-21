(function () {
  const updateStatus = () => {
    const isOnline = navigator.onLine;
    document.body.classList.toggle("offline", !isOnline);

    const banner = document.getElementById("offline-banner");
    if (banner) {
      banner.style.display = isOnline ? "none" : "flex";
    }
  };

  window.addEventListener("online", updateStatus);
  window.addEventListener("offline", updateStatus);

  // Run once on page load
  document.addEventListener("DOMContentLoaded", updateStatus);
})();
