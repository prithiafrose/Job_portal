document.addEventListener("DOMContentLoaded", () => {

  // ===== LocalStorage User =====
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // ===== Profile Photo =====
  const profileImage = document.getElementById("profileImage");
  const uploadPhoto = document.getElementById("uploadPhoto");

  if (user.photo) profileImage.src = user.photo;

  uploadPhoto.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      profileImage.src = event.target.result;
      user.photo = event.target.result;
      localStorage.setItem("user", JSON.stringify(user));
    };
    reader.readAsDataURL(file);
  });

  // ===== Personal Info =====
  const fullNameInput = document.querySelector('input[placeholder="Full Name"]');
  const emailInput = document.querySelector('input[placeholder="Email"]');
  const phoneInput = document.querySelector('input[placeholder="Phone"]');

  // Prefill inputs
  if (user.fullName) fullNameInput.value = user.fullName;
  if (user.email) emailInput.value = user.email;
  if (user.phone) phoneInput.value = user.phone;

  // ===== Skills =====
  const skillsInput = document.querySelector('input[placeholder="Skills"]');
  if (user.skills) skillsInput.value = user.skills;

  // ===== Buttons =====
  const updateProfileBtn = document.getElementById("updateProfileBtn");
  const updateSkillsBtn = document.getElementById("updateSkillsBtn");

  updateProfileBtn.addEventListener("click", () => {
    user.fullName = fullNameInput.value.trim();
    user.email = emailInput.value.trim();
    user.phone = phoneInput.value.trim();
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profile saved locally!");
  });

  updateSkillsBtn.addEventListener("click", () => {
    user.skills = skillsInput.value.trim();
    localStorage.setItem("user", JSON.stringify(user));
    alert("Skills saved locally!");
  });

});
