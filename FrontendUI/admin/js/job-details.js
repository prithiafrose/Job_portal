// Full backend URL
const API = "http://localhost:5001/api";

// Get job ID from URL
const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get("id");

// DOM elements
const jobPosition = document.getElementById("jobPosition");
const companyName = document.getElementById("companyName");
const locationEl = document.getElementById("location");
const salaryEl = document.getElementById("salary");
const skillsEl = document.getElementById("skills");
const descriptionEl = document.getElementById("description");
const actionContainer = document.querySelector(".job-details-container");
const applyBtn = document.getElementById("applyBtn");

// Fetch helper with auth
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API + endpoint, { ...options, headers });
  return res;
}

// Check user role
function getUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role || "guest";
  } catch {
    return "guest";
  }
}

// Fetch job details
async function fetchJobDetails() {
  try {
    const res = await fetchWithAuth(`/jobs/${jobId}`);
    if (!res.ok) throw new Error("Failed to fetch job details");

    const job = await res.json();

    // Fill in job details
    jobPosition.textContent = job.title;
    companyName.textContent = job.company;
    locationEl.textContent = job.location || "N/A";
    salaryEl.textContent = job.salary || "N/A";
    skillsEl.textContent = job.skills || "N/A";
    descriptionEl.textContent = job.description || "No description";

    // Show buttons
    const role = getUserRole();
    if (role === "admin" || role === "recruiter") {
      // Admin/Recruiter: show Approve/Reject if pending
      if (job.status === "pending") {
        applyBtn.style.display = "none"; // hide apply button

        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.style.backgroundColor = "#28a745";
        approveBtn.style.marginRight = "10px";
        approveBtn.onclick = () => updateStatus("active");

        const rejectBtn = document.createElement("button");
        rejectBtn.textContent = "Reject";
        rejectBtn.style.backgroundColor = "#dc3545";
        rejectBtn.onclick = () => updateStatus("rejected");

        actionContainer.appendChild(approveBtn);
        actionContainer.appendChild(rejectBtn);
      } else {
        const statusMsg = document.createElement("p");
        statusMsg.innerHTML = `<strong>Status:</strong> ${job.status || "N/A"}`;
        actionContainer.appendChild(statusMsg);
        applyBtn.style.display = "none";
      }
    } else {
      // Normal user: show Apply button if job is active or status is undefined (default active)
      if (!job.status || job.status === "active") {
        applyBtn.style.display = "inline-block";
        applyBtn.onclick = () => applyForJob(job.id);
      } else {
        applyBtn.style.display = "none";
      }
    }

  } catch (err) {
    console.error("Error:", err);
    actionContainer.innerHTML = "<p>Error loading job details.</p>";
  }
}

// Apply for job
function applyForJob(jobId) {
  const token = localStorage.getItem("token");
  const applyUrl = `/FrontendUI/apply.html?jobId=${jobId}`;
  
  if (!token) {
    // Redirect to login with return URL
    const returnUrl = encodeURIComponent(window.location.origin + applyUrl);
    window.location.href = `/FrontendUI/Auth/login.html?redirect=${returnUrl}`;
    return;
  }

  // Redirect to apply page
  window.location.href = applyUrl;
}

// Update job status (admin/recruiter)
async function updateStatus(status) {
  if (!confirm(`Mark this job as ${status}?`)) return;

  try {
    const res = await fetchWithAuth(`/jobs/${jobId}`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });

    if (res.ok) {
      alert("Status updated!");
      location.reload();
    } else {
      alert("Failed to update status");
    }
  } catch (err) {
    console.error(err);
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", fetchJobDetails);

