document.addEventListener("DOMContentLoaded", () => {
  if (!window.CITY_NETWORK) return;

  const map = L.map("networkMap").setView([22.5937, 78.9629], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const hubIcon = L.divIcon({
    className: "hub-marker",
    html: "⬤",
    iconSize: [14, 14]
  });

  const cityIcon = L.divIcon({
    className: "city-marker",
    html: "●",
    iconSize: [10, 10]
  });

  window.cityMarkers = {};

  Object.entries(window.CITY_NETWORK).forEach(([key, city]) => {
  const marker = L.marker(
    [city.lat, city.lon],
    { icon: city.role === "Hub" ? hubIcon : cityIcon }
  ).addTo(map);

  window.cityMarkers[key] = marker;

  marker.on("click", () => {
    window.openCityDrawer(key);
  });
});
});
