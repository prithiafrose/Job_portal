// Get job ID from URL
const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get("id");

// DOM elements
const loadingMessage = document.getElementById("loadingMessage");
const jobContent = document.getElementById("jobContent");
const jobPosition = document.getElementById("jobPosition");
const companyName = document.getElementById("companyName");
const locationEl = document.getElementById("location");
const salaryEl = document.getElementById("salary");
const skillsEl = document.getElementById("skills");
const descriptionEl = document.getElementById("description");
const postedDateEl = document.getElementById("postedDate");
const applyBtn = document.getElementById("applyBtn");
const backBtn = document.getElementById("backBtn");

// Fetch job details
async function fetchJobDetails() {
  if (!jobId) {
    showError("No job ID provided");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5001/jobs/${jobId}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch job details');
    }

    const job = data.job;

    // Populate job details
    jobPosition.textContent = job.job_position;
    companyName.textContent = job.company_name;
    locationEl.textContent = job.location;
    salaryEl.textContent = job.monthly_salary || 'Not specified';

    // Handle skills_required - it could be JSON string or array
    let skillsDisplay = '';
    try {
      const skills = Array.isArray(job.skills_required)
        ? job.skills_required
        : JSON.parse(job.skills_required || '[]');
      skillsDisplay = Array.isArray(skills) ? skills.join(', ') : skills;
    } catch (e) {
      skillsDisplay = job.skills_required || 'Not specified';
    }
    skillsEl.textContent = skillsDisplay;

    descriptionEl.textContent = job.description || 'No description available';
    postedDateEl.textContent = new Date(job.createdAt).toLocaleDateString();

    // Show content, hide loading
    loadingMessage.style.display = 'none';
    jobContent.style.display = 'block';

  } catch (err) {
    console.error("Error:", err);
    showError(`Error loading job details: ${err.message}`);
  }
}

function showError(message) {
  loadingMessage.innerHTML = `<p style="color: red;">${message}</p>`;
}

// Apply for job
applyBtn.addEventListener("click", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    // Store the intended destination for redirect after login
    localStorage.setItem("redirectAfterLogin", `../apply-job.html?id=${jobId}`);
    window.location.href = "Auth/login.html";
    return;
  }

  // Check if user is a student
  if (user.role !== "student") {
    alert("Only students can apply for jobs.");
    return;
  }

  // Redirect to application page with CV upload and payment
  window.location.href = `/FrontendUI/apply-job.html?id=${jobId}`;
});

// Back button
backBtn.addEventListener("click", () => {
  window.location.href = "admin/index.html";
});

// Initialize
fetchJobDetails();