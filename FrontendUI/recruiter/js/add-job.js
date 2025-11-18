const API_BASE = "http://localhost:5001/api";

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

document.getElementById("jobForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const skillsText = document.getElementById("skills_required").value;
  const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);

  const job = {
    job_position: document.getElementById("job_position").value,
    company_name: document.getElementById("company_name").value,
    location: document.getElementById("location").value,
    monthly_salary: parseInt(document.getElementById("monthly_salary").value),
    skills_required: skillsArray,
    description: document.getElementById("description").value,
    logo_url: document.getElementById("logo_url").value || null
  };

  try {
    const res = await fetch(API_BASE + "/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`
      },
      body: JSON.stringify(job)
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById("msg").textContent = "Job posted successfully!";
      document.getElementById("msg").style.color = "lightgreen";
      document.getElementById("jobForm").reset();
      
      // Redirect to my jobs after 2 seconds
      setTimeout(() => {
        window.location.href = "my-jobs.html";
      }, 2000);
    } else {
      document.getElementById("msg").textContent = data.error || "Error posting job";
      document.getElementById("msg").style.color = "red";
    }
  } catch (error) {
    console.error('Error posting job:', error);
    document.getElementById("msg").textContent = "Network error. Please try again.";
    document.getElementById("msg").style.color = "red";
  }
});

// Check if user is authenticated
window.addEventListener('load', () => {
  const token = getToken();
  if (!token) {
    window.location.href = '../Auth/login.html';
    return;
  }

  // Verify token and role
  fetch(API_BASE + '/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(r => {
    if (!r.ok) {
      if (r.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '../Auth/login.html';
      }
      throw new Error('Authentication failed');
    }
    return r.json();
  })
  .then(data => {
    if (!data.user || data.user.role !== 'recruiter') {
      alert('Access denied. Recruiter role required.');
      localStorage.removeItem('token');
      window.location.href = '../Auth/login.html';
    }
  })
  .catch(err => {
    console.error('Error checking authentication:', err);
    localStorage.removeItem('token');
    window.location.href = '../Auth/login.html';
  });
});
