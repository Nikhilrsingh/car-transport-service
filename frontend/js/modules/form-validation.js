function isOffline() {
  return;
}

let isOffline = false;

window.addEventListener("network-status-change", (e) => {
  isOffline = !e.detail.online;
});

if (isOffline()) {
  alert("You are offline. Please reconnect to continue.");
  return;
}
