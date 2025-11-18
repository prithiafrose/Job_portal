// ==================== Backend Base URL ====================
const API_BASE = "http://localhost:5001/api";

// ==================== Utility ====================
function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}

// ==================== Profile Photo Preview ====================
const uploadPhoto = document.getElementById("uploadPhoto");
const profileImage = document.getElementById("profileImage");

if (uploadPhoto && profileImage) {
  uploadPhoto.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      profileImage.src = URL.createObjectURL(file);
    }
  });
}

// ==================== Job List ====================
const jobListDiv = document.getElementById("job-list");
const applyFilters = document.getElementById("applyFilters");
const clearFilters = document.getElementById("clearFilters");

async function fetchJobs(filters = {}) {
  if (!jobListDiv) return;
  jobListDiv.innerHTML = "<p>Loading jobs...</p>";

  try {
    const res = await fetch(`${API_BASE}/jobs`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch jobs");

    let jobs = data;

    // Apply filters if provided
    if (filters.jobTitle) {
      jobs = jobs.filter(job => job.title.toLowerCase().includes(filters.jobTitle.toLowerCase()));
    }
    if (filters.location) {
      jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.skills) {
      jobs = jobs.filter(job => job.skills.toLowerCase().includes(filters.skills.toLowerCase()));
    }
    if (filters.minSalary) {
      jobs = jobs.filter(job => job.salary >= filters.minSalary);
    }
    if (filters.maxSalary) {
      jobs = jobs.filter(job => job.salary <= filters.maxSalary);
    }

    if (jobs.length === 0) {
      jobListDiv.innerHTML = "<p>No jobs found.</p>";
      return;
    }

    jobListDiv.innerHTML = jobs.map(job => `
      <div class="job-card">
        <h4>${escapeHTML(job.title)}</h4>
        <p><strong>Company:</strong> ${escapeHTML(job.company)}</p>
        <p><strong>Location:</strong> ${escapeHTML(job.location)}</p>
        <p><strong>Salary:</strong> $${job.salary}</p>
        <p><strong>Skills:</strong> ${escapeHTML(job.skills)}</p>
        <a href="job-details.html?id=${job.id}">View Details</a>
      </div>
    `).join("");

  } catch (err) {
    jobListDiv.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}

// Apply filters
if (applyFilters) {
  applyFilters.addEventListener("click", () => {
    const filters = {
      jobTitle: document.getElementById("jobTitle").value.trim(),
      location: document.getElementById("location").value.trim(),
      skills: document.getElementById("skills").value.trim(),
      minSalary: document.getElementById("minSalary").value.trim(),
      maxSalary: document.getElementById("maxSalary").value.trim()
    };
    fetchJobs(filters);
  });
}

// Clear filters
if (clearFilters) {
  clearFilters.addEventListener("click", () => {
    document.getElementById("jobTitle").value = "";
    document.getElementById("location").value = "";
    document.getElementById("skills").value = "";
    document.getElementById("minSalary").value = "";
    document.getElementById("maxSalary").value = "";
    fetchJobs();
  });
}

// Load jobs on page load
fetchJobs();

// ==================== Job Details ====================
const jobDetailsDiv = document.getElementById("job-details");
if (jobDetailsDiv) {
  const jobId = new URLSearchParams(window.location.search).get("id");

  async function fetchJobDetails() {
    try {
      const res = await fetch(`${API_BASE}/jobs/${jobId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Job not found");

      jobDetailsDiv.innerHTML = `
        <h3>${escapeHTML(data.title)}</h3>
        <p><strong>Company:</strong> ${escapeHTML(data.company)}</p>
        <p><strong>Location:</strong> ${escapeHTML(data.location)}</p>
        <p><strong>Salary:</strong> $${data.salary}</p>
        <p><strong>Type:</strong> ${escapeHTML(data.type)}</p>
        <p><strong>Description:</strong> ${escapeHTML(data.description)}</p>
        <p><strong>Skills Required:</strong> ${escapeHTML(data.skills)}</p>
        <button class="btn" onclick="applyJob()">Apply Now</button>
      `;
    } catch (err) {
      jobDetailsDiv.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
  }

  function applyJob() {
    alert("Applied successfully!");
  }

  fetchJobDetails();
}
