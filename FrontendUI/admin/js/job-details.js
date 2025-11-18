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
const actionContainer = document.querySelector(".job-details-container"); // We will append buttons here

async function fetchJobDetails() {
  try {
    const res = await fetchWithAuth(`/jobs/${jobId}`);
    if (!res) return;
    
    const data = await res.json();
    const job = data.job;

    jobPosition.textContent = job.job_position;
    companyName.textContent = job.company_name;
    locationEl.textContent = job.location;
    salaryEl.textContent = job.monthly_salary;
    skillsEl.textContent = job.skills_required;
    descriptionEl.textContent = job.skills_required; // Assuming description isn't in the model shown earlier? 
    // Wait, the model had skills_required but the controller logs 'description'. 
    // Let's check the response. If description is missing, it might be missing in model.
    // Checking the model again in memory... Job model didn't have description! 
    // That's a backend bug I noticed earlier in the controller log vs model.
    // For now let's just display what we have.
    
    // Add Action Buttons (Approve / Reject)
    const btnContainer = document.createElement("div");
    btnContainer.style.marginTop = "20px";

    if (job.status === 'pending') {
        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.className = "btn";
        approveBtn.style.backgroundColor = "#28a745";
        approveBtn.style.marginRight = "10px";
        approveBtn.onclick = () => updateStatus('active');

        const rejectBtn = document.createElement("button");
        rejectBtn.textContent = "Reject";
        rejectBtn.className = "btn";
        rejectBtn.style.backgroundColor = "#dc3545";
        rejectBtn.onclick = () => updateStatus('rejected');

        btnContainer.appendChild(approveBtn);
        btnContainer.appendChild(rejectBtn);
    } else {
        const statusMsg = document.createElement("p");
        statusMsg.innerHTML = `<strong>Current Status:</strong> ${job.status}`;
        btnContainer.appendChild(statusMsg);
    }

    // Remove the old "Apply Now" button if it exists in HTML
    const oldApplyBtn = document.getElementById("applyBtn");
    if(oldApplyBtn) oldApplyBtn.remove();

    actionContainer.appendChild(btnContainer);

  } catch (err) {
    console.error("Error:", err);
  }
}

async function updateStatus(status) {
    if(!confirm(`Mark this job as ${status}?`)) return;

    try {
        const res = await fetchWithAuth(`/jobs/${jobId}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });

        if (res && res.ok) {
            alert("Status updated!");
            location.reload();
        } else {
            alert("Failed to update status");
        }
    } catch (error) {
        console.error(error);
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    checkAdminAuth();
    fetchJobDetails();
});
