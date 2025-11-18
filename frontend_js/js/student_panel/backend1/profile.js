const API_BASE = "http://localhost:5000/api";

document.addEventListener("DOMContentLoaded", () => {
  const profileImage = document.getElementById("profileImage");
  const uploadPhoto = document.getElementById("uploadPhoto");
  const fullNameInput = document.querySelector('input[placeholder="Full Name"]');
  const emailInput = document.querySelector('input[placeholder="Email"]');
  const phoneInput = document.querySelector('input[placeholder="Phone"]');
  const skillsInput = document.querySelector('input[placeholder="Skills"]');
  const token = localStorage.getItem("token"); // JWT token from login

  // ===== Load profile from backend =====
  async function loadProfile() {
    try {
      const res = await fetch(`${API_BASE}/users/`, {
        headers: { "Authorization": "Bearer " + token }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load profile");

      profileImage.src = data.photo || "default-avatar.png";
      fullNameInput.value = data.username || "";
      emailInput.value = data.email || "";
      phoneInput.value = data.phone || "";
      skillsInput.value = data.skills || "";

    } catch (err) {
      console.error(err.message);
    }
  }

  loadProfile();

  // ===== Upload photo preview =====
  uploadPhoto.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      profileImage.src = event.target.result; // preview immediately
    };
    reader.readAsDataURL(file);
  });

  // ===== Update profile button =====
  document.getElementById("updateProfileBtn").addEventListener("click", async () => {
    const body = {
      username: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      skills: skillsInput.value.trim(),
      photo: profileImage.src
    };

    try {
      const res = await fetch(`${API_BASE}/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      alert(data.message);

    } catch (err) {
      alert(err.message);
    }
  });
});
