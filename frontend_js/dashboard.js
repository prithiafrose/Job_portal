const nameEl = document.getElementById("name");
const token = localStorage.getItem("token");

if (!token) window.location.href = "login.html";

async function getUser() {
  const res = await fetch("http://localhost:5000/api/recruiter/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.ok) {
    const data = await res.json();
    nameEl.textContent = data.name;
  } else {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  }
}
getUser();

document.getElementById("logout-link").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});
