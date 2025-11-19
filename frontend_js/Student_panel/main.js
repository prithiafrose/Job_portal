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

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  if (!token) return {};
  return { 'Authorization': `Bearer ${token}` };
}

// ==================== Auth Check ====================
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem('token');
  // Redirect to login if not authenticated (unless on a public page, but these seem to be protected panel pages)
  const isLoginPage = window.location.href.includes('login.html');
  if (!token && !isLoginPage) {
      // Adjust path relative to where these files are served.
      // Assuming ../../FrontendUI/Auth/login.html is the path from Student_panel
      window.location.href = "../../FrontendUI/Auth/login.html"; 
      return;
  }

  // Sidebar Active State
  const links = document.querySelectorAll('.sidebar a');
  const currentPath = window.location.pathname.split("/").pop();
  links.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
      link.style.backgroundColor = '#34495e'; // simple highlight
    }
  });
});

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

    let jobs = data.jobs || data;

    // Check URL params
    const urlParams = new URLSearchParams(window.location.search);
    const pTitle = urlParams.get('jobTitle');
    const pLocation = urlParams.get('location');

    if (pTitle && document.getElementById("jobTitle")) {
       document.getElementById("jobTitle").value = pTitle;
       filters.jobTitle = pTitle;
    }
    if (pLocation && document.getElementById("location")) {
       document.getElementById("location").value = pLocation;
       filters.location = pLocation;
    }

    // Apply filters
    if (filters.jobTitle) {
      jobs = jobs.filter(job => (job.title || job.job_position).toLowerCase().includes(filters.jobTitle.toLowerCase()));
    }
    if (filters.location) {
      jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.skills) {
      jobs = jobs.filter(job => (job.skills || job.skills_required || "").toLowerCase().includes(filters.skills.toLowerCase()));
    }
    if (filters.minSalary) {
      jobs = jobs.filter(job => (job.salary || job.monthly_salary) >= filters.minSalary);
    }
    if (filters.maxSalary) {
      jobs = jobs.filter(job => (job.salary || job.monthly_salary) <= filters.maxSalary);
    }

    if (jobs.length === 0) {
      jobListDiv.innerHTML = "<p>No jobs found.</p>";
      return;
    }

    jobListDiv.innerHTML = jobs.map(job => `
      <div class="job-card">
        <h4>${escapeHTML(job.title || job.job_position)}</h4>
        <p><strong>Company:</strong> ${escapeHTML(job.company || job.company_name)}</p>
        <p><strong>Location:</strong> ${escapeHTML(job.location)}</p>
        <p><strong>Salary:</strong> $${job.salary || job.monthly_salary}</p>
        <p><strong>Skills:</strong> ${escapeHTML(job.skills || job.skills_required || "N/A")}</p>
        <a href="job-details.html?id=${job.id}">View Details</a>
      </div>
    `).join("");

  } catch (err) {
    jobListDiv.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}

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

// Load jobs if on job list page
if (jobListDiv) fetchJobs();


// ==================== Job Details & Apply ====================
const jobDetailsDiv = document.getElementById("job-details");
if (jobDetailsDiv) {
  const jobId = new URLSearchParams(window.location.search).get("id");

  async function fetchJobDetails() {
    try {
      const res = await fetch(`${API_BASE}/jobs/${jobId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Job not found");

      const job = data.job || data;

      jobDetailsDiv.innerHTML = `
        <h3>${escapeHTML(job.title || job.job_position)}</h3>
        <p><strong>Company:</strong> ${escapeHTML(job.company || job.company_name)}</p>
        <p><strong>Location:</strong> ${escapeHTML(job.location)}</p>
        <p><strong>Salary:</strong> $${job.salary || job.monthly_salary}</p>
        <p><strong>Type:</strong> ${escapeHTML(job.type || 'Full Time')}</p>
        <p><strong>Description:</strong> ${escapeHTML(job.description)}</p>
        <p><strong>Skills Required:</strong> ${escapeHTML(job.skills || job.skills_required)}</p>
        
        <hr style="margin: 20px 0;">
        <h4>Apply for this Job</h4>
        <form id="applyForm" style="display: flex; flex-direction: column; gap: 15px; max-width: 500px;">
            <label>
                Cover Letter:
                <textarea name="cover_letter" rows="4" style="width: 100%; padding: 8px;" required></textarea>
            </label>
            <label>
                Upload Resume (PDF/Doc):
                <input type="file" name="resume" accept=".pdf,.doc,.docx" required>
            </label>
            <button type="submit" class="btn">Submit Application</button>
        </form>
        <div id="applyMsg"></div>
      `;

      document.getElementById("applyForm").addEventListener("submit", handleApply);

    } catch (err) {
      jobDetailsDiv.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
  }

  async function handleApply(e) {
    e.preventDefault();
    const msgDiv = document.getElementById("applyMsg");
    msgDiv.textContent = "Submitting...";
    
    const formData = new FormData(e.target);
    formData.append("job_id", jobId);

    try {
        const res = await fetch(`${API_BASE}/applications`, {
            method: "POST",
            headers: {
                // 'Content-Type': 'multipart/form-data', // Do NOT set this manually when using FormData
                ...getAuthHeaders()
            },
            body: formData
        });
        
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Application failed");
        
        msgDiv.innerHTML = `<p style="color: green;">Application submitted successfully!</p>`;
        e.target.reset();
        setTimeout(() => window.location.href = "applied-jobs.html", 2000);

    } catch (err) {
        msgDiv.innerHTML = `<p style="color: red;">${err.message}</p>`;
    }
  }

  fetchJobDetails();
}

// ==================== Applied Jobs List ====================
const appliedJobsTableBody = document.getElementById("applied-jobs-body");
if (appliedJobsTableBody) {
    async function fetchAppliedJobs() {
        try {
            const res = await fetch(`${API_BASE}/applications/my-applications`, {
                headers: getAuthHeaders()
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || "Failed to fetch applications");
            
            const apps = data.applications || [];
            
            if (apps.length === 0) {
                appliedJobsTableBody.innerHTML = `<tr><td colspan="4">You haven't applied to any jobs yet.</td></tr>`;
                return;
            }

            appliedJobsTableBody.innerHTML = apps.map(app => `
                <tr>
                    <td>${escapeHTML(app.Job ? (app.Job.title || app.Job.job_position) : 'Job Deleted')}</td>
                    <td>${escapeHTML(app.Job ? (app.Job.company || app.Job.company_name) : 'N/A')}</td>
                    <td>${escapeHTML(app.Job ? app.Job.location : 'N/A')}</td>
                    <td><span class="status ${app.status}">${escapeHTML(app.status)}</span></td>
                </tr>
            `).join("");

        } catch (err) {
            appliedJobsTableBody.innerHTML = `<tr><td colspan="4" style="color:red">${err.message}</td></tr>`;
        }
    }
    fetchAppliedJobs();
}
