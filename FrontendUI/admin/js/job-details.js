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
const applyBtn = document.getElementById("applyBtn");

// Fetch job details
async function fetchJobDetails() {
  try {
    const res = await fetch(`http://localhost:5001/jobs/${jobId}`);
    const job = await res.json();

    jobPosition.textContent = job.job_position;
    companyName.textContent = job.company_name;
    locationEl.textContent = job.location;
    salaryEl.textContent = job.monthly_salary;
    skillsEl.textContent = job.skills_required;
    descriptionEl.textContent = job.description;
  } catch (err) {
    console.error("Error:", err);
  }
}

fetchJobDetails();

// Apply for job
applyBtn.addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    window.location.href = "../../Auth/login.html";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5001/jobs/apply/${jobId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    alert(data.message || "Applied successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to apply");
  }
});
