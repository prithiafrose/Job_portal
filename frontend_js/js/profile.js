const API = "http://localhost:5000/api/profile";

// LOAD admin profile
async function loadProfile() {
    const res = await fetch(API);
    const user = await res.json();

    document.getElementById("full_name").value = user.username;
    document.getElementById("email").value = user.email;
    document.getElementById("mobile").value = user.mobile;

    document.getElementById("profile-name").innerText = user.username_name;
    document.getElementById("profile-avatar-text").innerText = user.username_name[0].toUpperCase();
}

// SAVE general info
document.getElementById("general-info-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        username_name: document.getElementById("username_name").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value
    };

    await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert("Profile updated");
    loadProfile();
});

// CHANGE PASSWORD
document.getElementById("password-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        current_password: document.getElementById("current_password").value,
        new_password: document.getElementById("new_password").value
    };

    const res = await fetch(API + "/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const msg = await res.json();

    if (!res.ok) return alert(msg.error);

    alert("Password changed successfully");
});
loadProfile();
