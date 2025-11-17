// auth.js
document.addEventListener("DOMContentLoaded", () => {
  // ==================== Show/Hide Password ====================
  const togglePassword = (checkboxId, inputId) => {
    const checkbox = document.getElementById(checkboxId);
    if (checkbox) {
      checkbox.addEventListener("change", () => {
        const input = document.getElementById(inputId);
        input.type = checkbox.checked ? "text" : "password";
      });
    }
  };
  togglePassword("showLoginPassword", "loginPassword");
  togglePassword("showRegisterPassword", "registerPassword");

  // ==================== LOGIN FORM ====================
  const loginForm = document.getElementById("loginSubmit");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const error = document.getElementById("loginError");
      const loading = document.getElementById("loginLoading");

      error.textContent = "";
      loading.textContent = "Loading...";

      const formData = {
        email: loginForm.email.value,
        password: loginForm.password.value
      };

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        // Safely parse JSON
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }

        loading.textContent = "";

        if (!res.ok) throw new Error(data.error || `Login failed (status ${res.status})`);

        // Save token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        error.style.color = "green";
        error.textContent = "Login successful! Redirecting...";
        setTimeout(() => {
          window.location.href = "../../Auth/login.html";
        }, 800);
      } catch (err) {
        loading.textContent = "";
        error.style.color = "red";
        error.textContent = err.message;
      }
    });
  }

  // ==================== REGISTER FORM ====================
  const registerForm = document.getElementById("registerSubmit");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const error = document.getElementById("registerError");
      const loading = document.getElementById("registerLoading");

      error.textContent = "";
      loading.textContent = "Loading...";
      error.style.color = "red";

      const formData = {
        username: registerForm.username.value,
        email: registerForm.email.value,
        mobile: registerForm.mobile.value,
        password: registerForm.password.value,
        role: registerForm.role ? registerForm.role.value : "candidate"
      };

      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        // Safely parse JSON
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }

        loading.textContent = "";

        if (!res.ok) throw new Error(data.error || `Registration failed (status ${res.status})`);

        error.style.color = "green";
        error.textContent = "Registration successful! Redirecting to login...";
        setTimeout(() => {
           window.location.href = "../../Auth/Register.html";
        }, 900);
      } catch (err) {
        loading.textContent = "";
        error.style.color = "red";
        error.textContent = err.message;
      }
    });
  }
});
