// global utilities
const API_BASE = (function(){
  // By default assume backend at same host + /api
  return window.API_BASE || (location.origin.includes('file:') ? 'http://localhost:5000/api' : location.origin + '/api');
})();

function setAuthUI() {
  const link = document.getElementById('auth-link');
  const token = localStorage.getItem('token');
  if (!link) return;
  if (token) {
    const userJson = localStorage.getItem('user');
    const name = userJson ? JSON.parse(userJson).name : 'Account';
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
    link.href = '/pages/login.html';
  }
}

function escapeHTML(s='') {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', setAuthUI);
