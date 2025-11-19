document.addEventListener("DOMContentLoaded", () => {
  // ==================== Backend Base URL ====================
  const API_BASE = "http://localhost:5001/api/auth";

  // ==================== Handle Redirect URL ====================
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get("redirect");
  
  if (redirectUrl) {
    // Store redirect URL for after login/register
    localStorage.setItem("redirectAfterLogin", decodeURIComponent(redirectUrl));
  }

  // ==================== Show/Hide Password ====================
  const togglePassword = (checkboxId, inputId) => {
    const checkbox = document.getElementById(checkboxId);
    const input = document.getElementById(inputId);

    if (checkbox && input) {
      checkbox.addEventListener("change", () => {
        input.type = checkbox.checked ? "text" : "password";
      });
    }
  };

  togglePassword("showLoginPassword", "loginPassword");
  togglePassword("showRegisterPassword", "registerPassword");

  // ==================== LOGIN FORM ===========================
  const loginForm = document.getElementById("loginSubmit");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const error = document.getElementById("loginError");
      const loading = document.getElementById("loginLoading");

      error.textContent = "";
      loading.textContent = "Loading...";
        const selectedRole = loginForm.querySelector('input[name="role"]:checked');
    const role = selectedRole ? selectedRole.value : "student";

      const formData = {
        email: loginForm.email.value.trim(),
        password: loginForm.password.value.trim(),
        role: role,
      };

      try {
        const res = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        loading.textContent = "";

        if (!res.ok) throw new Error(data.error || "Login failed");

        // Save token & user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        error.style.color = "green";
        error.textContent = "Login successful! Redirecting...";

        const userRole = data.user.role;

        setTimeout(() => {
          // Check if there's a redirect URL stored
          const redirectUrl = localStorage.getItem("redirectAfterLogin");
          if (redirectUrl) {
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = redirectUrl;
            return;
          }

          // Default role-based redirects
          if (userRole === 'admin') {
            window.location.href = "/FrontendUI/admin/dashboard.html";
          } else if (userRole === 'student') {
            window.location.href = "/frontend_js/Student_panel/dashboard.html";
          } else if (userRole === 'recruiter') {
            window.location.href = "/FrontendUI/recruiter/dashboard.html";
          } else {
            alert("Invalid role returned from server!");
          }
        }, 800);
      } catch (err) {
        loading.textContent = "";
        error.style.color = "red";
        error.textContent = err.message;
      }
    });
  }

  // ==================== REGISTER FORM ========================
  const registerForm = document.getElementById("registerSubmit");

  if (registerForm) {
    // Real-time Email Validation
    const emailInput = registerForm.querySelector('input[name="email"]');
    if (emailInput) {
      const statusSpan = document.createElement("span");
      statusSpan.style.marginLeft = "10px";
      statusSpan.style.fontWeight = "bold";
      statusSpan.style.fontSize = "0.9em";
      emailInput.parentNode.appendChild(statusSpan);

      emailInput.addEventListener("blur", async () => {
        const email = emailInput.value.trim();
        statusSpan.textContent = "";
        if (!email) return;

        statusSpan.textContent = "Checking...";
        statusSpan.style.color = "blue";

        try {
          const res = await fetch(`${API_BASE}/check-email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = await res.json();

          if (data.valid) {
            statusSpan.textContent = "✔ Valid email";
            statusSpan.style.color = "green";
          } else {
            statusSpan.textContent = "✘ Invalid email";
            statusSpan.style.color = "red";
          }
        } catch (err) {
          console.error(err);
          statusSpan.textContent = "Error checking email";
          statusSpan.style.color = "orange";
        }
      });
    }

    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const error = document.getElementById("registerError");
      const loading = document.getElementById("registerLoading");

      error.textContent = "";
      loading.textContent = "Loading...";
      error.style.color = "red";
       const selectedRole = registerForm.querySelector('input[name="role"]:checked');
const role = selectedRole ? selectedRole.value : "student"; // fallback

const formData = {
  username: registerForm.username.value.trim(),
  email: registerForm.email.value.trim(),
  mobile: registerForm.mobile.value.trim(),
  password: registerForm.password.value.trim(),
  role: role,
};


      try {
        const res = await fetch(`${API_BASE}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        loading.textContent = "";

        if (!res.ok) throw new Error(data.error || "Registration failed");
        localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));

        error.style.color = "green";
        error.textContent = "Registration successful! Redirecting...";

const userRole = data.user.role;

        setTimeout(() => {
          // Check if there's a redirect URL stored
          const redirectUrl = localStorage.getItem("redirectAfterLogin");
          if (redirectUrl) {
            localStorage.removeItem("redirectAfterLogin");
            window.location.href = redirectUrl;
            return;
          }

          // Default role-based redirects
          if (userRole === 'admin') {
            window.location.href = "/FrontendUI/admin/dashboard.html";
          } else if (userRole === 'student') {
            window.location.href = "/frontend_js/Student_panel/dashboard.html";
          } else if (userRole === 'recruiter') {
            window.location.href = "/FrontendUI/recruiter/dashboard.html";
          } else {
            alert("Invalid role returned from server!");
          }
        }, 900);
      } catch (err) {
        loading.textContent = "";
        error.style.color = "red";
        error.textContent = err.message;
      }
    });
  }
});
