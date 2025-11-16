document.addEventListener("DOMContentLoaded", () => {

  // ===================== SHOW / HIDE LOGIN PASSWORD =====================
  const showLoginPass = document.getElementById("showLoginPassword");
  if (showLoginPass) {
    showLoginPass.addEventListener("change", () => {
      const pass = document.getElementById("loginPassword");
      pass.type = showLoginPass.checked ? "text" : "password";
    });
  }

  // ============================= LOGIN FORM =============================
  const loginForm = document.getElementById("loginSubmit"); // matches HTML
  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();

      const error = document.getElementById("loginError");
      error.style.color = "red";
      error.textContent = "Loading...";

      const formData = {
        email: loginForm.email.value,
        password: loginForm.password.value
      };

      try {
        const res = await fetch("https://job-portal-server-witx.onrender.com/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        error.style.color = "green";
        error.textContent = "Login successful!";

        localStorage.setItem("token", data.token);

        setTimeout(() => {
          window.location.href = "../index.html";
        }, 800);

      } catch (err) {
        error.style.color = "red";
        error.textContent = err.message;
      }
    };
  }

});
