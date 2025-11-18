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

      jobsList.innerHTML = data.jobs.map(job => {
        // Handle skills display
        let skillsDisplay = '';
        try {
          const skills = Array.isArray(job.skills_required) 
            ? job.skills_required 
            : JSON.parse(job.skills_required || '[]');
          skillsDisplay = Array.isArray(skills) ? skills.slice(0, 3).join(', ') : skills;
        } catch (e) {
          skillsDisplay = job.skills_required || 'Not specified';
        }
        
        return `
        <div class="job-card">
          <h3>${escapeHTML(job.job_position)}</h3>
          <p>${escapeHTML(job.company_name)} - ${escapeHTML(job.location)}</p>
          <p><strong>Skills:</strong> ${escapeHTML(skillsDisplay)}</p>
          <p><strong>Salary:</strong> ₹${job.monthly_salary || 'Not specified'}</p>
          <a href="../pages/job-details.html?id=${job.id}">View Details</a>
        </div>
      `;
      }).join("");

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
