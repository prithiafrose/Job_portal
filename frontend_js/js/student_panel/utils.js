// ====================== API BASE URL ======================
const API_BASE = "http://localhost:5000/api"; // Change if backend URL changes

// Escape HTML to prevent XSS
function escapeHTML(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Auth UI (Login/Logout link)
function setAuthUI() {
  const link = document.getElementById('auth-link');
  if (!link) return;

  const token = localStorage.getItem('token');
  if (token) {
    const userJson = localStorage.getItem('user');
    const name = userJson ? JSON.parse(userJson).username : 'Account';
    link.textContent = `Hi, ${name}`;
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        location.reload();
      }
    });
  } else {
    link.textContent = 'Login';
    link.href = '../auth/login.html';
  }
}

document.addEventListener('DOMContentLoaded', setAuthUI);
