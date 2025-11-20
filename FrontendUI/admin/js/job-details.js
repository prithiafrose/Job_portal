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

// Helper: get user role
function getUserRole() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role || "guest";
}

// Fetch job details
async function fetchJobDetails() {
  try {
    const token = localStorage.getItem("token") || "";
    const res = await fetch(`${API}/jobs/${jobId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined
      }
    });
    if (!res.ok) throw new Error("Failed to fetch job details");

    const job = await res.json();

    // Fill in job info
    jobPosition.textContent = job.title;
    companyName.textContent = job.company;
    locationEl.textContent = job.location || "N/A";
    salaryEl.textContent = job.salary || "N/A";
    skillsEl.textContent = job.skills || "N/A";
    descriptionEl.textContent = job.description || "No description";

    // Role-based buttons
    const role = getUserRole();

    if (role === "admin" || role === "recruiter") {
      // Admin/Recruiter cannot apply
      if (applyBtn) applyBtn.style.display = "none";

      if (job.status === "pending") {
        // Show Approve/Reject buttons
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.onclick = () => updateStatus("active");
        approveBtn.style.marginRight = "10px";

        const rejectBtn = document.createElement("button");
        rejectBtn.textContent = "Reject";
        rejectBtn.onclick = () => updateStatus("rejected");

        actionContainer.appendChild(approveBtn);
        actionContainer.appendChild(rejectBtn);
      } else {
        const statusMsg = document.createElement("p");
        statusMsg.innerHTML = `<strong>Status:</strong> ${job.status || "N/A"}`;
        actionContainer.appendChild(statusMsg);
      }
    } else {
      // Normal users can apply if active
      if (applyBtn) {
        if (!job.status || job.status === "active") {
          applyBtn.style.display = "inline-block";
          applyBtn.onclick = () => applyForJob(job.id);
        } else {
          applyBtn.style.display = "none";
        }
      }
    }

  } catch (err) {
    console.error("Error loading job:", err);
    if (actionContainer) actionContainer.innerHTML = "<p>Error loading job details.</p>";
    if (applyBtn) applyBtn.style.display = "none";
  }
}

// Apply function
function applyForJob(jobId) {
  const role = getUserRole();
  if (role === "admin" || role === "recruiter") {
    alert("Admins and recruiters cannot apply for jobs.");
    return;
  }

  const token = localStorage.getItem("token");
  const applyUrl = `/FrontendUI/apply.html?jobId=${jobId}`;

  if (!token) {
    const returnUrl = encodeURIComponent(window.location.origin + applyUrl);
    window.location.href = `/FrontendUI/Auth/login.html?redirect=${returnUrl}`;
    return;
  }

  window.location.href = applyUrl;
}

// Update job status
async function updateStatus(status) {
  if (!confirm(`Mark this job as ${status}?`)) return;
  const token = localStorage.getItem("token") || "";

  try {
    const res = await fetch(`${API}/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
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
document.addEventListener("DOMContentLoaded", () => {
  // Redirect recruiters/admins if they are on apply page
  const role = getUserRole();
  if (window.location.pathname.includes("apply.html") && (role === "admin" || role === "recruiter")) {
    alert("You cannot access this page");
    window.location.href = "/FrontendUI/index.html";
    return;
  }

  if (window.location.pathname.includes("job-details.html")) {
    fetchJobDetails();
  }
});



