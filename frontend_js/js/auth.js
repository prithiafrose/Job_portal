document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const msg = document.getElementById('auth-msg');

  if (loginForm) loginForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm).entries());
    try {
      const res = await fetch(API_BASE + '/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const body = await res.json();
      if (body.error) {
        msg.innerText = body.error;
      } else {
        localStorage.setItem('token', body.token);
        localStorage.setItem('user', JSON.stringify(body.user));
        msg.innerText = 'Login successful';
        setTimeout(()=>location.href = '/index.html', 600);
      }
    } catch (err) {
      msg.innerText = 'Login failed';
    }
  });

  if (registerForm) registerForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(registerForm).entries());
    try {
      const res = await fetch(API_BASE + '/auth/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      const body = await res.json();
      if (body.error) {
        msg.innerText = body.error;
      } else {
        localStorage.setItem('token', body.token);
        localStorage.setItem('user', JSON.stringify(body.user));
        msg.innerText = 'Account created';
        setTimeout(()=>location.href = '/index.html', 600);
      }
    } catch (err) {
      msg.innerText = 'Registration failed';
    }
  });
});
