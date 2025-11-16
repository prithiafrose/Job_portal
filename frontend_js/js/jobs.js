// jobs.js
document.addEventListener("DOMContentLoaded", async () => {
  const jobsList = document.getElementById("jobs-list");
  if (!jobsList) return;

  const fetchJobs = async () => {
    const params = new URLSearchParams();
    const q = document.getElementById("q")?.value;
    const type = document.getElementById("type")?.value;
    const location = document.getElementById("location")?.value;

    if (q) params.append("q", q);
    if (type) params.append("type", type);
    if (location) params.append("location", location);

    try {
      const res = await fetch(API_BASE + "/jobs?" + params.toString());
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");

      jobsList.innerHTML = data.jobs.map(job => `
        <div class="job-card">
          <h3>${escapeHTML(job.title)}</h3>
          <p>${escapeHTML(job.company)} - ${escapeHTML(job.location)}</p>
          <p>${escapeHTML(job.type)} | $${job.salary}</p>
          <a href="job-details.html?id=${job._id}">View Details</a>
        </div>
      `).join("");

    } catch (err) {
      jobsList.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
  };

  fetchJobs();

  const filterForm = document.getElementById("list-filter");
  if (filterForm) filterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchJobs();
  });
});
