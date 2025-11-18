document.addEventListener("DOMContentLoaded", async () => {
  checkAdminAuth();

  const tableBody = document.querySelector("tbody");

  async function loadUsers() {
    try {
      const res = await fetchWithAuth("/admin/users");
      if (!res) return;
      
      const users = await res.json();
      
      tableBody.innerHTML = ""; // Clear existing rows
      
      users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.mobile || 'N/A'}</td>
          <td>${user.role}</td>
          <td>
            <button class="btn delete-btn" data-id="${user.id}" style="background-color:#ff4d4d">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      // Attach event listeners to delete buttons
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          if (confirm("Are you sure you want to delete this user?")) {
            await deleteUser(id);
          }
        });
      });

    } catch (error) {
      console.error("Error loading users:", error);
    }
  }

  async function deleteUser(id) {
    try {
      const res = await fetchWithAuth(`/admin/users/${id}`, {
        method: "DELETE"
      });

      if (res && res.ok) {
        alert("User deleted successfully");
        loadUsers(); // Refresh table
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  loadUsers();
});
