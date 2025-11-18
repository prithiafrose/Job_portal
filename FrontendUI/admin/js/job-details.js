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
const applicantsList = document.getElementById("applicantsList");
const applyBtn = document.getElementById("applyBtn");

// Fetch job details
async function fetchJobDetails() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5001/jobs/${jobId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch job details');
    }

    const job = data.job;
    jobPosition.textContent = job.job_position;
    companyName.textContent = job.company_name;
    locationEl.textContent = job.location;
    salaryEl.textContent = job.monthly_salary;
    
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
  } catch (err) {
    console.error("Error:", err);
    document.querySelector('.job-details-container').innerHTML = 
      `<p style="color: red;">Error loading job details: ${err.message}</p>`;
  }
}

// Fetch applicants for this job
async function fetchApplicants() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5001/admin/job-applicants/${jobId}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch applicants');
    }
    
    displayApplicants(data.applicants);
  } catch (err) {
    console.error("Error fetching applicants:", err);
    applicantsList.innerHTML = `<p style="color: red;">Error loading applicants: ${err.message}</p>`;
  }
}

// Display applicants
function displayApplicants(applicants) {
  if (!applicants || applicants.length === 0) {
    applicantsList.innerHTML = '<div class="no-applicants">No applicants yet for this job.</div>';
    return;
  }
  
  applicantsList.innerHTML = applicants.map(applicant => `
    <div class="applicant-card">
      <div class="applicant-header">
        <div>
          <div class="applicant-name">${applicant.name || 'N/A'}</div>
          <div class="applicant-email">${applicant.email || 'N/A'}</div>
        </div>
        <span class="status-badge status-${applicant.status || 'pending'}">
          ${(applicant.status || 'pending').charAt(0).toUpperCase() + (applicant.status || 'pending').slice(1)}
        </span>
      </div>
      
      ${applicant.education ? `<p><strong>Education:</strong> ${applicant.education}</p>` : ''}
      ${applicant.experience ? `<p><strong>Experience:</strong> ${applicant.experience} years</p>` : ''}
      
      ${applicant.skills ? `
        <div class="applicant-skills">
          <strong>Skills:</strong>
          ${applicant.skills.split(',').map(skill => 
            `<span class="skill-tag">${skill.trim()}</span>`
          ).join('')}
        </div>
      ` : ''}
      
      ${applicant.resume ? `
        <p><strong>Resume:</strong> 
          <a href="${applicant.resume}" target="_blank" style="color: #007bff;">View Resume</a>
        </p>
      ` : ''}
      
      <div class="action-buttons">
        ${applicant.status === 'pending' ? `
          <button class="action-btn shortlist-btn" onclick="updateApplicationStatus(${applicant.id}, 'reviewed')">
            Shortlist
          </button>
          <button class="action-btn accept-btn" onclick="updateApplicationStatus(${applicant.id}, 'accepted')">
            Accept
          </button>
          <button class="action-btn reject-btn" onclick="updateApplicationStatus(${applicant.id}, 'rejected')">
            Reject
          </button>
        ` : ''}
        
        ${applicant.status === 'reviewed' ? `
          <button class="action-btn accept-btn" onclick="updateApplicationStatus(${applicant.id}, 'accepted')">
            Accept
          </button>
          <button class="action-btn reject-btn" onclick="updateApplicationStatus(${applicant.id}, 'rejected')">
            Reject
          </button>
        ` : ''}
      </div>
    </div>
  `).join('');
}

// Update application status
window.updateApplicationStatus = async function(applicationId, newStatus) {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5001/admin/application-status/${applicationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      alert(`Application ${newStatus} successfully!`);
      fetchApplicants(); // Refresh the list
    } else {
      alert(data.error || `Failed to ${newStatus} application`);
    }
  } catch (err) {
    console.error("Error updating status:", err);
    alert(`Failed to ${newStatus} application`);
  }
}

// Handle apply button click
applyBtn.addEventListener("click", () => {
  // Redirect to application page with job ID
  window.location.href = `/FrontendUI/apply-job.html?id=${jobId}`;
});

// Initialize
fetchJobDetails();
fetchApplicants();
