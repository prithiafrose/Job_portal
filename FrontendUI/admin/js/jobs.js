document.addEventListener("DOMContentLoaded", async () => {
  checkAdminAuth();

  const tableBody = document.querySelector("tbody");

  async function loadJobs() {
    try {
      // Reusing the public jobs list API, but we might want a specific admin one to see ALL statuses
      // Ideally, the backend /jobs endpoint should return all jobs for admins.
      // Let's assume the updated GET /jobs does that or we use /admin/jobs if we made one.
      // We didn't create a specific /admin/jobs list endpoint, but we can use the general one.
      // However, the general one might filter by active. 
      // Let's use the general one for now.
      
      const res = await fetchWithAuth("/jobs?limit=100"); // Fetch enough jobs
      if (!res) return;
      
      const data = await res.json();
      const jobs = data.jobs || [];
      
      tableBody.innerHTML = "";
      
      jobs.forEach(job => {
        const row = document.createElement("tr");
        // Status color
        let statusColor = "black";
        if(job.status === 'active') statusColor = "green";
        if(job.status === 'pending') statusColor = "orange";
        if(job.status === 'rejected') statusColor = "red";

        row.innerHTML = `
          <td>${job.id}</td>
          <td>${job.job_position}</td>
          <td>${job.company_name}</td>
          <td style="color:${statusColor}; font-weight:bold">${job.status || 'Active'}</td>
          <td>
            <a href="job-details.html?id=${job.id}" class="btn">View/Edit</a>
            <button class="btn delete-btn" data-id="${job.id}" style="background-color:#ff4d4d; margin-left: 5px;">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.getAttribute("data-id");
          if (confirm("Are you sure you want to delete this job?")) {
            await deleteJob(id);
          }
        });
      });

    } catch (error) {
      console.error("Error loading jobs:", error);
    }
  }

  async function deleteJob(id) {
    try {
      const res = await fetchWithAuth(`/jobs/${id}`, {
        method: "DELETE"
      });

      if (res && res.ok) {
        alert("Job deleted successfully");
        loadJobs();
      } else {
        alert("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  }

  loadJobs();
});
