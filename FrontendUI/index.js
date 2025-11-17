const jobListEl = document.getElementById('job-list');
const paginationEl = document.getElementById('pagination');
const jobTitleInput = document.getElementById('jobTitle');
const locationInput = document.getElementById('location');
const skillsInput = document.getElementById('skills');
const minSalaryInput = document.getElementById('minSalary');
const maxSalaryInput = document.getElementById('maxSalary');

let currentPage = 1;
let totalPages = 1;
let jobsData = [];

// Fetch jobs from backend
async function fetchJobs(page = 1) {
  try {
    const res = await fetch(`http://localhost:3000/jobs?page=${page}`);
    const data = await res.json();
    jobsData = data.jobs;
    totalPages = data.totalPages;
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
    const titleMatch = job.job_position.toLowerCase().includes(jobTitleInput.value.toLowerCase());
    const locationMatch = job.location.toLowerCase().includes(locationInput.value.toLowerCase());
    const skillsMatch = skillsInput.value === '' || skillsInput.value.split(',').every(s => job.skills_required.includes(s.trim()));
    const minSalaryMatch = minSalaryInput.value === '' || job.monthly_salary >= parseInt(minSalaryInput.value);
    const maxSalaryMatch = maxSalaryInput.value === '' || job.monthly_salary <= parseInt(maxSalaryInput.value);
    return titleMatch && locationMatch && skillsMatch && minSalaryMatch && maxSalaryMatch;
  });

  jobListEl.innerHTML = filteredJobs.length === 0
    ? "<p>No jobs found</p>"
    : filteredJobs.map(job => `
      <div class="job-card">
        <img src="${job.logo_url}" alt="logo">
        <div>
          <h3>${job.job_position}</h3>
          <p>Company: ${job.company_name}</p>
          <p>Salary: ₹${job.monthly_salary}</p>
          <p>Location: ${job.location}</p>
          <p>Skills: ${job.skills_required}</p>
        </div>
        <button onclick="viewJob(${job.id})">View Details</button>
      </div>
    `).join('');
}

// Pagination
function renderPagination() {
  let html = '';
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'disabled' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  paginationEl.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  fetchJobs(page);
}

// Apply filters
document.getElementById('applyFilters').addEventListener('click', renderJobs);
document.getElementById('clearFilters').addEventListener('click', () => {
  jobTitleInput.value = '';
  locationInput.value = '';
  skillsInput.value = '';
  minSalaryInput.value = '';
  maxSalaryInput.value = '';
  renderJobs();
});

// View job details (just alert for now)
function viewJob(id) {
  const job = jobsData.find(j => j.id === id);
  alert(`Job: ${job.job_position}\nCompany: ${job.company_name}\nLocation: ${job.location}`);
}

// Initial fetch
fetchJobs();
