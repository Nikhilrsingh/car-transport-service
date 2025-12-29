// frontend/js/network.js

(function () {
  const offlineClass = "app-offline";

  function updateNetworkStatus() {
    const isOnline = navigator.onLine;

    document.body.classList.toggle(offlineClass, !isOnline);

    window.dispatchEvent(
      new CustomEvent("network-status-change", {
        detail: { online: isOnline }
      })
    );
  }

  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);

  document.addEventListener("DOMContentLoaded", updateNetworkStatus);
})();
