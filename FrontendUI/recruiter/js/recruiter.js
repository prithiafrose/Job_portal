const API = "http://localhost:5001/api";

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Common fetch headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

/* Load Dashboard Stats */
if (document.getElementById("totalJobs")) {
  fetch(`${API}/jobs/recruiter/stats`, {
    headers: getHeaders()
  })
    .then(r => r.json())
    .then(d => {
      document.getElementById("totalJobs").textContent = d.totalJobs || 0;
      document.getElementById("totalApplicants").textContent = d.totalApplicants || 0;
    })
    .catch(err => {
      console.error('Error loading stats:', err);
      document.getElementById("totalJobs").textContent = "0";
      document.getElementById("totalApplicants").textContent = "0";
    });
}

/* Load Applicants */
if (document.getElementById("applicantsTable")) {
  fetch(`${API}/applications/recruiter`, {
    headers: getHeaders()
  })
    .then(r => r.json())
    .then(data => {
      if (data.applications && data.applications.length > 0) {
        document.getElementById("applicantsTable").innerHTML = data.applications.map(app => `
          <tr>
            <td>${app.student_name || 'N/A'}</td>
            <td>${app.job_title || 'N/A'}</td>
            <td>${app.student_email || 'N/A'}</td>
            <td><span class="status ${app.status}">${app.status || 'pending'}</span></td>
            <td>
              <button class="btn btn-sm" onclick="viewApplication(${app.id})">View</button>
            </td>
          </tr>
        `).join("");
      } else {
        document.getElementById("applicantsTable").innerHTML = '<tr><td colspan="5">No applications found</td></tr>';
      }
    })
    .catch(err => {
      console.error('Error loading applicants:', err);
      document.getElementById("applicantsTable").innerHTML = '<tr><td colspan="5">Error loading applications</td></tr>';
    });
}

/* Load My Jobs */
if (document.getElementById("jobList")) {
  fetch(`${API}/jobs/recruiter`, {
    headers: getHeaders()
  })
    .then(r => r.json())
    .then(data => {
      if (data.jobs && data.jobs.length > 0) {
        document.getElementById("jobList").innerHTML = data.jobs.map(job => `
          <div class="card">
            <h3>${job.job_position || job.title}</h3>
            <p><strong>Company:</strong> ${job.company_name || 'N/A'}</p>
            <p><strong>Location:</strong> ${job.location || 'N/A'}</p>
            <p><strong>Salary:</strong> $${job.monthly_salary || job.salary || 'N/A'}</p>
            <p><strong>Skills:</strong> ${job.skills_required ? (Array.isArray(job.skills_required) ? job.skills_required.join(', ') : job.skills_required) : 'N/A'}</p>
            <div class="job-actions">
              <button class="btn btn-sm" onclick="editJob(${job.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteJob(${job.id})">Delete</button>
            </div>
          </div>
        `).join("");
      } else {
        document.getElementById("jobList").innerHTML = '<p>No jobs posted yet. <a href="add-job.html">Post your first job</a></p>';
      }
    })
    .catch(err => {
      console.error('Error loading jobs:', err);
      document.getElementById("jobList").innerHTML = '<p>Error loading jobs</p>';
    });
}

/* Helper functions */
function viewApplication(id) {
  // Implementation for viewing application details
  console.log('View application:', id);
}

function editJob(id) {
  // Implementation for editing job
  console.log('Edit job:', id);
  window.location.href = `edit-job.html?id=${id}`;
}

function deleteJob(id) {
  if (confirm('Are you sure you want to delete this job?')) {
    fetch(`${API}/jobs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        alert('Job deleted successfully');
        location.reload();
      } else {
        alert('Error deleting job');
      }
    })
    .catch(err => {
      console.error('Error deleting job:', err);
      alert('Error deleting job');
    });
  }
}
