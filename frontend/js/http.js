// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api';

// Get authentication headers
export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export function redirectTo500() {
  window.location.href = "../500.html";
}

export async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options);

    // If server returned 5xx, show 500 page
    if (res.status >= 500) {
      redirectTo500();
      return null;
    }

    return res;
  } catch (err) {
    // Network error / server down / CORS etc.
    redirectTo500();
    return null;
  }
}

