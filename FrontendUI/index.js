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
<<<<<<< HEAD
    // Create URLSearchParams with current input values
    const params = new URLSearchParams({
        page: page,
        limit: 10
    });

    if (jobTitleInput.value.trim()) params.append('q', jobTitleInput.value.trim());
    if (locationInput.value.trim()) params.append('location', locationInput.value.trim());
    if (skillsInput.value.trim()) params.append('skills', skillsInput.value.trim());
    if (minSalaryInput.value.trim()) params.append('minSalary', minSalaryInput.value.trim());
    if (maxSalaryInput.value.trim()) params.append('maxSalary', maxSalaryInput.value.trim());

    const res = await fetch(`http://localhost:5001/jobs?${params.toString()}`);
    const data = await res.json();
    
    jobsData = data.jobs || [];
    totalPages = Math.ceil(data.total / 10) || 1;
    
    // Update current page state
    currentPage = page;
    
=======
    const res = await fetch(`http://localhost:5001/api/jobs/public?page=${page}`);
    
    if (!res.ok) throw new Error('Failed to fetch jobs');
    
    const data = await res.json();

    // Backend returns array directly
    jobsData = Array.isArray(data) ? data : [];

>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
    renderJobs();
    renderPagination();
  } catch (err) {
    console.error("Error fetching jobs:", err);
    jobListEl.innerHTML = "<p>Error loading jobs</p>";
  }
}

// Render job cards
function renderJobs() {
<<<<<<< HEAD
  // No client-side filtering needed as backend handles it
  jobListEl.innerHTML = jobsData.length === 0
=======
  const filteredJobs = jobsData.filter(job => {
    const titleMatch = job.title.toLowerCase().includes(jobTitleInput.value.toLowerCase());
    const locationMatch = job.location.toLowerCase().includes(locationInput.value.toLowerCase());

    const minSalaryMatch = minSalaryInput.value === '' || parseInt(job.salary) >= parseInt(minSalaryInput.value);
    const maxSalaryMatch = maxSalaryInput.value === '' || parseInt(job.salary) <= parseInt(maxSalaryInput.value);

    return titleMatch && locationMatch && minSalaryMatch && maxSalaryMatch;
  });

  jobListEl.innerHTML = filteredJobs.length === 0
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
    ? "<p>No jobs found</p>"
    : jobsData.map(job => {
      // Handle skills display
      let skillsDisplay = '';
      try {
        const skills = Array.isArray(job.skills_required) 
          ? job.skills_required 
          : JSON.parse(job.skills_required || '[]');
        skillsDisplay = Array.isArray(skills) ? skills.join(', ') : skills;
      } catch (e) {
        skillsDisplay = job.skills_required || 'Not specified';
      }

      return `
      <div class="job-card">
<<<<<<< HEAD
        ${job.logo_url ? `<img src="${job.logo_url}" alt="${job.company_name} logo" onerror="this.style.display='none'">` : ''}
        <div>
          <h3>${job.job_position}</h3>
          <p><strong>Company:</strong> ${job.company_name}</p>
          <p><strong>Salary:</strong> ₹${job.monthly_salary || 'Not specified'}</p>
          <p><strong>Location:</strong> ${job.location}</p>
          <p><strong>Skills:</strong> ${skillsDisplay}</p>
          <p><strong>Posted:</strong> ${new Date(job.createdAt).toLocaleDateString()}</p>
=======
        <div>
          <h3>${job.title}</h3>
          <p>Company: ${job.company}</p>
          <p>Salary: ${job.salary || 'N/A'}</p>
          <p>Location: ${job.location || 'N/A'}</p>
          <p>Type: ${job.type || 'N/A'}</p>
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
        </div>
        <button onclick="viewJob(${job.id})">View Details</button>
      </div>
    `;
    }).join('');
}

// Pagination (simple version)
function renderPagination() {
<<<<<<< HEAD
  let html = '';
  // Add previous button
  if (currentPage > 1) {
      html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">Prev</button>`;
  }

  // Show limited page numbers for better UX
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
      html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
      if (startPage > 2) html += `<span>...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'disabled' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }

  if (endPage < totalPages) {
      if (endPage < totalPages - 1) html += `<span>...</span>`;
      html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }

  // Add next button
  if (currentPage < totalPages) {
      html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">Next</button>`;
  }

  paginationEl.innerHTML = html;
}

function goToPage(page) {
  fetchJobs(page);
}

// Filter and clear button listeners
document.getElementById('applyFilters').addEventListener('click', () => {
  fetchJobs(1); // Always reset to page 1 when filtering
});

// Debounce function to limit API calls
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Add live filtering with debounce
const debouncedFetch = debounce(() => fetchJobs(1), 500);

[jobTitleInput, locationInput, skillsInput, minSalaryInput, maxSalaryInput].forEach(input => {
  if (input) {
    input.addEventListener('input', debouncedFetch);
  }
=======
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
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
});

document.getElementById('clearFilters').addEventListener('click', () => {
  jobTitleInput.value = '';
  locationInput.value = '';
  minSalaryInput.value = '';
  maxSalaryInput.value = '';
<<<<<<< HEAD
  fetchJobs(1);
});

// View job details
function viewJob(id) {
  window.location.href = `job-details.html?id=${id}`;
}

=======
  renderJobs();
});

>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
// Initial fetch
fetchJobs();
