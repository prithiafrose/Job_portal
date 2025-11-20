const API_URL = "http://localhost:5001";

function getToken() {
  return localStorage.getItem("token");
}

function checkAdminAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = "../../Auth/login.html";
    return null;
  }
  // Ideally you would decode the token to check role, but for now we rely on the backend 403
  return token;
}

async function fetchWithAuth(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    alert("Session expired or unauthorized. Please login again.");
    localStorage.removeItem("token");
    window.location.href = "../../Auth/login.html";
    return null;
  }

  return response;
}

// Export functions globally if using simple script tags
window.API_URL = API_URL;
window.getToken = getToken;
window.checkAdminAuth = checkAdminAuth;
window.fetchWithAuth = fetchWithAuth;
