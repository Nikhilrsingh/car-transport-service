// contacts.js - Manage Contact Requests

document.addEventListener("DOMContentLoaded", () => {
  loadContacts();
  setupSearchDebounce();
  setupModalClose("contactModal");
});

/* ================= LOAD CONTACTS ================= */
async function loadContacts() {
  const containerId = "contactsTable";
  showLoading(containerId);

  try {
    // Correct endpoint key from config.js
    const contacts = await apiCall(API_CONFIG.endpoints.getAllContacts);

    if (!contacts || contacts.length === 0) {
      showEmptyState(containerId, "No contact requests found");
      return;
    }

    let html = `
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    contacts.forEach((c) => {
      html += `
        <tr>
          <td><strong>${c.name || "N/A"}</strong></td>
          <td>${c.email || "N/A"}</td>
          <td>${c.phone || "N/A"}</td>
          <td>${truncateText(c.message || "", 50)}</td>
          <td>${formatDate(c.createdAt || c.date)}</td>
          <td>
            <button class="action-btn btn-view" onclick="viewContact('${c._id}')">👁</button>
          </td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    document.getElementById(containerId).innerHTML = html;

  } catch (error) {
    console.error("Error loading contacts:", error);
    showError(containerId, "Failed to load contacts");
  }
}

/* ================= SEARCH CONTACTS ================= */
function setupSearchDebounce() {
  const searchInput = document.getElementById("contactSearch");
  if (!searchInput) return;

  searchInput.addEventListener(
    "input",
    debounce(async (e) => {
      const query = e.target.value.trim().toLowerCase();
      const containerId = "contactsTable";
      showLoading(containerId);

      try {
        const contacts = await apiCall(API_CONFIG.endpoints.getAllContacts);
        const filtered = contacts.filter((c) =>
          (c.name || "").toLowerCase().includes(query) ||
          (c.email || "").toLowerCase().includes(query) ||
          (c.phone || "").toLowerCase().includes(query)
        );

        if (!filtered || filtered.length === 0) {
          showEmptyState(containerId, "No contacts match your search");
          return;
        }

        let html = `
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
        `;

        filtered.forEach((c) => {
          html += `
            <tr>
              <td><strong>${c.name || "N/A"}</strong></td>
              <td>${c.email || "N/A"}</td>
              <td>${c.phone || "N/A"}</td>
              <td>${truncateText(c.message || "", 50)}</td>
              <td>${formatDate(c.createdAt || c.date)}</td>
              <td>
                <button class="action-btn btn-view" onclick="viewContact('${c._id}')">👁</button>
              </td>
            </tr>
          `;
        });

        html += "</tbody></table>";
        document.getElementById(containerId).innerHTML = html;

      } catch (error) {
        console.error("Error searching contacts:", error);
        showError(containerId, "Failed to search contacts");
      }
    }, 400)
  );
}

/* ================= NAVIGATION ================= */
function viewContact(id) {
  window.location.href = `contact-details.html?id=${id}`;
}
