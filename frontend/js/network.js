(function () {
  function emitStatus() {
    window.dispatchEvent(
      new CustomEvent("network-status-change", {
        detail: { online: navigator.onLine }
      })
    );
  }

  window.addEventListener("online", emitStatus);
  window.addEventListener("offline", emitStatus);
  emitStatus();
})();
