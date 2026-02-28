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

    // Handle session expiry
    if (res.status === 401) {
      alert('Your session has expired. Please log in again.');
      if (typeof window.handleLogout === 'function') {
        window.handleLogout();
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        sessionStorage.removeItem('currentUser');
        window.location.href = '../pages/login.html';
      }
      return null;
    }

    // If server returned 5xx, show 500 page
    if (res.status >= 500) {
      redirectTo500();
      return null;
    }

    return res;
  } catch (err) {
    // Network error / server down / CORS etc.
    alert('Connection lost or server unreachable. Please check your internet and try again.');
    return null;
  }
}

