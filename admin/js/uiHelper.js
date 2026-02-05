/* ================= COMMON UTILITIES ================= */

/* Debounce */
function debounce(fn, delay = 400) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* Unified API call wrapper */
async function apiCall(endpoint, options = {}) {
  try {
    const url = getApiUrl(endpoint);
    const response = await apiRequest(url, options);

    if (!response.success) {
      throw new Error(response.message || "API Error");
    }

    return response.data || [];
  } catch (err) {
    console.error("API Call Failed:", err);
    throw err;
  }
}

/* Modal close handler */
function setupModalClose(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      modal.style.display = "none";
    }
  });
}



function showLoading(containerId) {
    document.getElementById(containerId).innerHTML = `
      <div style="padding:10px; text-align:center;">Loading...</div>
    `;
  }
  
  function showEmptyState(containerId, message) {
    document.getElementById(containerId).innerHTML = `
      <div style="padding:10px; text-align:center; color:#666;">
        ${message}
      </div>
    `;
  }
  
  function showError(containerId, message) {
    document.getElementById(containerId).innerHTML = `
      <div style="padding:10px; text-align:center; color:red;">
        ${message}
      </div>
    `;
  }
  
  function truncateText(text, length) {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  }
  
  function formatDate(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  }
  
  function getStatusBadge(status) {
    const colors = {
      pending: "orange",
      resolved: "green",
      rejected: "red"
    };
    return `<span style="color:${colors[status] || "gray"}">${status}</span>`;
  }
  
  /* expose globally */
  
  window.showLoading = showLoading;
  window.showEmptyState = showEmptyState;
  window.showError = showError;
  window.truncateText = truncateText;
  window.formatDate = formatDate;
  window.getStatusBadge = getStatusBadge;

  /* Export to global */
window.debounce = debounce;
window.apiCall = apiCall;
window.setupModalClose = setupModalClose;
  