// dashboard.js - Dashboard page logic (No authentication required)

document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData();
});

/* ================= LOAD DASHBOARD ================= */
async function loadDashboardData() {
  await Promise.all([
    loadStats(),
    loadRecentContacts(),
    loadRecentEmergencies()
  ]);
}

/* ================= LOAD STATS ================= */
async function loadStats() {
  try {
    const contactsRes = await apiRequest(getApiUrl(API_CONFIG.endpoints.getAllContacts));
    const enquiriesRes = await apiRequest(getApiUrl(API_CONFIG.endpoints.getAllEnquiries));
    const emergenciesRes = await apiRequest(getApiUrl(API_CONFIG.endpoints.getAllEmergencies));
    const feedbacksRes = await apiRequest(getApiUrl(API_CONFIG.endpoints.getAllFeedbacks));

    const contacts = contactsRes.data || [];
    const enquiries = enquiriesRes.data || [];
    const emergencies = emergenciesRes.data || [];
    const feedbacks = feedbacksRes.data || [];

    document.getElementById("totalContacts").textContent = contacts.length;
    document.getElementById("totalEnquiries").textContent = enquiries.length;
    document.getElementById("totalEmergencies").textContent = emergencies.length;
    document.getElementById("totalFeedbacks").textContent = feedbacks.length;

  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

/* ================= LOAD RECENT CONTACTS ================= */
async function loadRecentContacts() {
  const containerId = "recentContactsTable";
  showLoading(containerId);

  try {
    const response = await apiRequest(getApiUrl(API_CONFIG.endpoints.getAllContacts));
    const contacts = response.data || [];

    if (contacts.length === 0) {
      showEmptyState(containerId, "No contact requests yet");
      return;
    }

    const recent = contacts.slice(0, 5);

    let html = `
      <div style="overflow-x:auto;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    recent.forEach((c) => {
      html += `
        <tr>
          <td><strong>${c.name || "N/A"}</strong></td>
          <td style="max-width: 200px; word-break: break-word;">
            ${c.email ? `<div><i class="fas fa-envelope" style="margin-right:5px;"></i><a href="mailto:${c.email}">${c.email}</a></div>` : ''}
            ${c.phone ? `<div><i class="fas fa-phone" style="margin-right:5px;"></i><a href="tel:${c.phone}">${c.phone}</a></div>` : ''}
            ${(!c.email && !c.phone) ? 'N/A' : ''}
          </td>
          <td>${truncateText(c.message || "", 50)}</td>
          <td>${formatDate(c.createdAt || c.date)}</td>
          <td>
            <button class="action-btn btn-view" onclick="viewContact('${c._id}')">👁</button>
          </td>
        </tr>
      `;
    });

    html += "</tbody></table></div>";
    document.getElementById(containerId).innerHTML = html;

  } catch (error) {
    console.error("Error loading contacts:", error);
    showError(containerId, "Failed to load contact requests");
  }
}

/* ================= LOAD RECENT EMERGENCIES ================= */
async function loadRecentEmergencies() {
  const containerId = "recentEmergenciesTable";
  showLoading(containerId);

  try {
    const response = await apiRequest(getApiUrl(API_CONFIG.endpoints.getAllEmergencies));
    const emergencies = response.data || [];

    if (emergencies.length === 0) {
      showEmptyState(containerId, "No emergency requests yet");
      return;
    }

    const recent = emergencies.slice(0, 5);

    let html = `
      <div style="overflow-x:auto;">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Location</th>
            <th>Issue</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    recent.forEach((e) => {
      html += `
        <tr>
          <td><strong>${e.fullName || "N/A"}</strong></td>
          <td style="max-width: 200px; word-break: break-word;">
            ${e.emailAddress ? `<div><i class="fas fa-envelope" style="margin-right:5px;"></i><a href="mailto:${e.emailAddress}">${e.emailAddress}</a></div>` : ''}
            ${e.phoneNumber ? `<div><i class="fas fa-phone" style="margin-right:5px;"></i><a href="tel:${e.phoneNumber}">${e.phoneNumber}</a></div>` : ''}
            ${(!e.emailAddress && !e.phoneNumber) ? 'N/A' : ''}
          </td>
          <td style="max-width: 220px; word-break: break-word;">
            ${e.currentLocation || 'N/A'}
          </td>
          <td style="max-width: 200px; word-break: break-word;">
            ${truncateText(e.issueDescription || '', 50)}
          </td>
          <td>${getStatusBadge(e.status || "pending")}</td>
          <td>${formatDate(e.createdAt || e.date)}</td>
          <td>
            <button class="action-btn btn-view" onclick="viewEmergency('${e._id}')">👁</button>
          </td>
        </tr>
      `;
    });

    html += "</tbody></table></div>";
    document.getElementById(containerId).innerHTML = html;

  } catch (error) {
    console.error("Error loading emergencies:", error);
    showError(containerId, "Failed to load emergency requests");
  }
}

/* ================= NAVIGATION ================= */
function viewContact(id) {
  window.location.href = `contacts.html?id=${id}`;
}

function viewEmergency(id) {
  // Use the reference endpoint if needed
  window.location.href = `emergencies.html?id=${id}`;
}
