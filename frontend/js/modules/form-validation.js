function isOffline() {
  return document.body.classList.contains("app-offline");
}

if (isOffline()) {
  alert("You are offline. Please reconnect to continue.");
  return;
}
