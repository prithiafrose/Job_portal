// Frontend: homepage JS
const jobListEl = document.getElementById('job-list');
const paginationEl = document.getElementById('pagination');
const jobTitleInput = document.getElementById('jobTitle');
const locationInput = document.getElementById('location');
const minSalaryInput = document.getElementById('minSalary');
const maxSalaryInput = document.getElementById('maxSalary');

let currentPage = 1;
let jobsData = [];

// Fetch jobs from backend
async function fetchJobs(page = 1) {
  try {
    const res = await fetch(`http://localhost:5001/api/jobs/public?page=${page}`);
    
    if (!res.ok) throw new Error('Failed to fetch jobs');
    
    const data = await res.json();

    // Backend returns array directly
    jobsData = Array.isArray(data) ? data : [];

    renderJobs();
    renderPagination();
  } catch (err) {
    console.error("Error fetching jobs:", err);
    jobListEl.innerHTML = "<p>Error loading jobs</p>";
  }
}

// Render job cards
function renderJobs() {
  const filteredJobs = jobsData.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(jobTitleInput.value.toLowerCase());
    const locationMatch = job.location.toLowerCase().includes(locationInput.value.toLowerCase());

    const minSalaryMatch = minSalaryInput.value === '' || parseInt(job.salary) >= parseInt(minSalaryInput.value);
    const maxSalaryMatch = maxSalaryInput.value === '' || parseInt(job.salary) <= parseInt(maxSalaryInput.value);

    return titleMatch && locationMatch && minSalaryMatch && maxSalaryMatch;
  });

  jobListEl.innerHTML = filteredJobs.length === 0
    ? "<p>No jobs found</p>"
    : filteredJobs.map(job => `
      <div class="job-card">
        <div>
          <h3>${job.title}</h3>
          <p>Company: ${job.company}</p>
          <p>Salary: ${job.salary || 'N/A'}</p>
          <p>Location: ${job.location || 'N/A'}</p>
          <p>Type: ${job.type || 'N/A'}</p>
        </div>
        <button onclick="viewJob(${job.id})">View Details</button>
      </div>
    `).join('');
}

// Pagination (simple version)
function renderPagination() {
  paginationEl.innerHTML = ''; // Clear previous buttons
  // If backend does not return total pages, we can skip or implement later
}

// Navigate to job details
function viewJob(id) {
  window.location.href = `/FrontendUI/admin/job-details.html?id=${id}`;
}

// Filter and clear buttons
document.getElementById('applyFilters').addEventListener('click', () => {
  renderJobs();
});

document.getElementById('clearFilters').addEventListener('click', () => {
  jobTitleInput.value = '';
  locationInput.value = '';
  minSalaryInput.value = '';
  maxSalaryInput.value = '';
  renderJobs();
});

// Initial fetch
fetchJobs();
