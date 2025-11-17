const API_BASE = "http://localhost:5000"; // change if deployed

async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE}/admin/users`);
    const users = await res.json();
    const tbody = document.getElementById("usersTableBody");
    tbody.innerHTML = "";

    users.forEach((user, index) => {
      tbody.innerHTML += `
        <tr data-id="${user._id}">
          <td>${index + 1}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.mobile}</td>
          <td>${user.role}</td>
          <td>${user.status}</td>
          <td>
            <button class="block-user">${user.status === 'Active' ? 'Block' : 'Unblock'}</button>
            <button class="delete-user">Delete</button>
          </td>
        </tr>
      `;
    });

    // Add event listeners for buttons
    document.querySelectorAll(".block-user").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const tr = e.target.closest("tr");
        const id = tr.dataset.id;
        await fetch(`${API_BASE}/admin/users/${id}/block`, { method: "PATCH" });
        loadUsers();
      });
    });

    document.querySelectorAll(".delete-user").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const tr = e.target.closest("tr");
        const id = tr.dataset.id;
        if (confirm("Are you sure you want to delete this user?")) {
          await fetch(`${API_BASE}/admin/users/${id}`, { method: "DELETE" });
          loadUsers();
        }
      });
    });

  } catch (err) {
    console.error("Error loading users:", err);
  }
}

loadUsers();

// Optional: Search filter
const searchInput = document.getElementById("searchUser");
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.toLowerCase();
  document.querySelectorAll("#usersTableBody tr").forEach(tr => {
    const name = tr.children[1].textContent.toLowerCase();
    const email = tr.children[2].textContent.toLowerCase();
    tr.style.display = name.includes(filter) || email.includes(filter) ? "" : "none";
  });
});
