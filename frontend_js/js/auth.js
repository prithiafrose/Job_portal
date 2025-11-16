// auth.js
document.addEventListener("DOMContentLoaded", () => {

  // ===== Show/Hide Login Password =====
  const showLoginPass = document.getElementById("showLoginPassword");
  if (showLoginPass) {
    showLoginPass.addEventListener("change", () => {
      const pass = document.getElementById("loginPassword");
      pass.type = showLoginPass.checked ? "text" : "password";
    });
  }

  // ===== Login Form =====
  const loginForm = document.getElementById("loginSubmit");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const error = document.getElementById("loginError");
      error.style.color = "red";
      error.textContent = "Loading...";

      const formData = {
        email: loginForm.email.value,
        password: loginForm.password.value
      };

      try {
        const res = await fetch(API_BASE + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Login failed");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        error.style.color = "green";
        error.textContent = "Login successful!";
        setTimeout(() => window.location.href = "../index.html", 800);
      } catch (err) {
        error.textContent = err.message;
      }
    });
  }

  // ===== Show/Hide Register Password =====
  const showRegisterPass = document.getElementById("showRegisterPassword");
  if (showRegisterPass) {
    showRegisterPass.addEventListener("change", () => {
      const pass = document.getElementById("registerPassword");
      pass.type = showRegisterPass.checked ? "text" : "password";
    });
  }

  // ===== Register Form =====
  const registerForm = document.getElementById("registerSubmit");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const error = document.getElementById("registerError");
      error.textContent = "Loading...";
      error.style.color = "red";

      const formData = {
        username: registerForm.username.value,
        email: registerForm.email.value,
        mobile: registerForm.mobile.value,
        password: registerForm.password.value
      };

      try {
        const res = await fetch(API_BASE + "/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");

        error.style.color = "green";
        error.textContent = "Registration successful!";
        setTimeout(() => window.location.href = "login.html", 900);
      } catch (err) {
        error.textContent = err.message;
      }
    });
  }
});
