// config.js - Configuration and utility functions for frontend

// API Configuration
const API_CONFIG = {
  baseUrl: "http://localhost:3000/api",

  endpoints: {
    /* ========== AUTH (Admin) ========== */
    getAllUsers: "/auth/users",

    /* ========== CONTACTS ========== */
    getAllContacts: "/contact",

    /* ========== EMERGENCIES ========== */
    getAllEmergencies: "/emergencies/emergencies",
    getEmergencyByReference: "/emergencies/:reference",

    /* ========== ENQUIRIES ========== */
    getAllEnquiries: "/enquiries/enquiries",
    getEnquiryByReference: "/enquiries/:reference",

    /* ========== FEEDBACKS ========== */
    getAllFeedbacks: "/feedbacks",
  },
};

  
 /* ================= URL BUILDER ================= */
function getApiUrl(endpoint, params = {}) {
  let url = `${API_CONFIG.baseUrl}${endpoint}`;

  Object.keys(params).forEach((key) => {
    url = url.replace(`:${key}`, encodeURIComponent(params[key]));
  });

  return url;
}

/* ================= API WRAPPER ================= */
async function apiRequest(url, options = {}) {
  const headers = {
    ...options.headers,
  };

  // Only set JSON header if body exists
  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Safely handle JSON responses
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response;
}

/* ================= EXPORTS ================= */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    API_CONFIG,
    getApiUrl,
    apiRequest,
  };
} else {
  window.API_CONFIG = API_CONFIG;
  window.getApiUrl = getApiUrl;
  window.apiRequest = apiRequest;
}
