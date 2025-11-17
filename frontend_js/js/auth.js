// auth.js
document.addEventListener("DOMContentLoaded", () => {
  // ==================== Backend Base URL ====================
  const API_BASE = "http://localhost:5000/api"; // Change to your backend URL if needed

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
        const res = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        loading.textContent = "";

        if (!res.ok) throw new Error(data.error || "Login failed");

        // Save token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        error.style.color = "green";
        error.textContent = "Login successful! Redirecting...";
        setTimeout(() => {
          window.location.href = "../index.html";
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
          role: registerForm.role ? registerForm.role.value : "candidate" // include role

      };

      try {
        const res = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        loading.textContent = "";

        if (!res.ok) throw new Error(data.error || "Registration failed");

        error.style.color = "green";
        error.textContent = "Registration successful! Redirecting to login...";
        setTimeout(() => {
          window.location.href = "login.html";
        }, 900);
      } catch (err) {
        loading.textContent = "";
        error.style.color = "red";
        error.textContent = err.message;
      }
    });
  }
});
