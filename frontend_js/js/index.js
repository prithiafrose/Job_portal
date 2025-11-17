// main.js
document.addEventListener("DOMContentLoaded", () => {
  const jobList = document.getElementById("job-list");
  const applyBtn = document.getElementById("applyFilters");
  const clearBtn = document.getElementById("clearFilters");

  // Fetch jobs from backend with optional filters
  const fetchJobs = async () => {
    if (!jobList) return;

    const title = document.getElementById("jobTitle")?.value;
    const location = document.getElementById("location")?.value;
    const skills = document.getElementById("skills")?.value;
    const minSalary = document.getElementById("minSalary")?.value;
    const maxSalary = document.getElementById("maxSalary")?.value;

    const params = new URLSearchParams();
    if (title) params.append("q", title);
    if (location) params.append("location", location);
    if (skills) params.append("skills", skills);
    if (minSalary) params.append("minSalary", minSalary);
    if (maxSalary) params.append("maxSalary", maxSalary);

    try {
      const res = await fetch(`${API_BASE}/jobs?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");

      // Render job cards
      jobList.innerHTML = data.jobs.map(job => `
        <div class="job-card">
          <h3>${escapeHTML(job.title)}</h3>
          <p>${escapeHTML(job.company)} - ${escapeHTML(job.location)}</p>
          <p>${escapeHTML(job.type)} | $${job.salary}</p>
          <a href="pages/job-details.html?id=${job._id}">View Details</a>
        </div>
      `).join("");

    } catch (err) {
      jobList.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
  };

  // Apply filters button
  applyBtn?.addEventListener("click", fetchJobs);

  // Clear filters button
  clearBtn?.addEventListener("click", () => {
    ["jobTitle","location","skills","minSalary","maxSalary"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    fetchJobs();
  });

  // Initial fetch
  fetchJobs();
});
