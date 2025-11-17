document.addEventListener("DOMContentLoaded", () => {

  // ===================== SHOW / HIDE REGISTER PASSWORD =====================
  const showRegisterPass = document.getElementById("showRegisterPassword");
  if (showRegisterPass) {
    showRegisterPass.addEventListener("change", () => {
      const pass = document.getElementById("registerPassword");
      pass.type = showRegisterPass.checked ? "text" : "password";
    });
  }

  // ============================= REGISTER FORM =============================
  const registerForm = document.getElementById("registerSubmit"); // matches HTML
  if (registerForm) {
    registerForm.onsubmit = async (e) => {
      e.preventDefault();

      const error = document.getElementById("registerError");
      const loading = document.getElementById("registerLoading");

      error.textContent = "";
      loading.textContent = "Loading...";

      const formData = {
        username: registerForm.username.value,
        email: registerForm.email.value,
        mobile: registerForm.mobile.value,
        password: registerForm.password.value
      };

      try {
        const res = await fetch(API_BASE + "/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        loading.textContent = "";
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
    };
  }

});
