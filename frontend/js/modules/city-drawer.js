const drawer = document.getElementById("cityDrawer");

function getRoleDescription(role) {
  if (role === "Hub") return "Major logistics hub connecting multiple regions.";
  if (role === "Transit") return "Intermediate routing city for vehicle movement.";
  if (role === "Endpoint") return "Final destination with limited onward routes.";
  return "";
}

function openCityDrawer(cityKey) {
  const city = window.CITY_NETWORK?.[cityKey];
  if (!city) {
    console.warn("City data not found:", cityKey);
    return;
  }

  document.querySelectorAll(".leaflet-marker-icon")
    .forEach(el => el.classList.remove("active-pin"));

  document.querySelectorAll(".region-card")
    .forEach(card => card.classList.remove("active-city"));

  document.getElementById("drawerCityName").textContent = city.name;
  document.getElementById("drawerCityRegion").textContent = city.region;

  const roleEl = document.getElementById("drawerCityRole");
  roleEl.textContent = city.role + " City";
  roleEl.className = `city-role role-${city.role.toLowerCase()}`;

  document.getElementById("drawerRoleDescription").textContent =
    getRoleDescription(city.role);

  const outgoing = document.getElementById("drawerOutgoing");
  outgoing.innerHTML = "";

  if (!city.outgoing?.length) {
    outgoing.innerHTML = `
      <p class="no-routes">
        No scheduled outgoing routes from this city at the moment.
      </p>`;
  } else {
    city.outgoing.forEach(r => {
      outgoing.innerHTML += `
        <div class="route-item outgoing">
          <span>${city.name} → ${r.to}</span>
          <span>ETA: ${r.eta}</span>
        </div>`;
    });
  }

  const incoming = document.getElementById("drawerIncoming");
  incoming.innerHTML = "";

  if (!city.incoming?.length) {
    incoming.innerHTML = `
      <p class="no-routes">
        No inbound vehicle routes currently mapped to this city.
      </p>`;
  } else {
    city.incoming.forEach(r => {
      incoming.innerHTML += `
        <div class="route-item incoming">
          <span>${r.from} → ${city.name}</span>
          <span>ETA: ${r.eta}</span>
        </div>`;
    });
  }

  drawer.classList.add("open");

  if (window.cityMarkers?.[cityKey]) {
    const markerEl = window.cityMarkers[cityKey].getElement();
    if (markerEl) markerEl.classList.add("active-pin");
  }

  const activeCard = document.querySelector(
    `.region-card[data-city="${cityKey}"],
     .region-card[href*="city=${cityKey}"]`
  );
  if (activeCard) activeCard.classList.add("active-city");
}

document.querySelector(".drawer-close")
  .addEventListener("click", () => {
    drawer.classList.remove("open");

    document.querySelectorAll(".active-pin")
      .forEach(el => el.classList.remove("active-pin"));

    document.querySelectorAll(".active-city")
      .forEach(el => el.classList.remove("active-city"));
  });

document.querySelectorAll(".region-card").forEach(card => {
  card.addEventListener("click", (e) => {
    e.preventDefault();

    if (card.dataset.city) {
      openCityDrawer(card.dataset.city);
      return;
    }

    const href = card.getAttribute("href");
    if (!href) return;

    const params = new URLSearchParams(href.split("?")[1]);
    const cityKey = params.get("city");

    if (cityKey) openCityDrawer(cityKey);
  });
});

window.openCityDrawer = openCityDrawer;
