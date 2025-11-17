// main.js
document.addEventListener("DOMContentLoaded", () => {
  const jobList = document.getElementById("job-list");
  const applyBtn = document.getElementById("applyFilters");
  const clearBtn = document.getElementById("clearFilters");

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
      const res = await fetch(API_BASE + "/jobs?" + params.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");

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

  applyBtn?.addEventListener("click", fetchJobs);
  clearBtn?.addEventListener("click", () => {
    document.getElementById("jobTitle").value = "";
    document.getElementById("location").value = "";
    document.getElementById("skills").value = "";
    document.getElementById("minSalary").value = "";
    document.getElementById("maxSalary").value = "";
    fetchJobs();
  });

  fetchJobs();
});
