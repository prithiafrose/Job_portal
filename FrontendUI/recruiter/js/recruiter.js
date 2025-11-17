const API = "http://localhost:5000/api";

/* Load Dashboard Stats */
if (document.getElementById("totalJobs")) {
  fetch(API + "/recruiter/jobs/count")
    .then(r => r.json())
    .then(d => {
      document.getElementById("totalJobs").textContent = d.count;
    });
}

/* Load Applicants */
if (document.getElementById("applicantsTable")) {
  fetch(API + "/recruiter/applicants")
    .then(r => r.json())
    .then(data => {
      document.getElementById("applicantsTable").innerHTML = data.map(app => `
        <tr>
          <td>${app.name}</td>
          <td>${app.job}</td>
          <td>${app.email}</td>
          <td>${app.status}</td>
        </tr>
      `).join("");
    });
}

/* Load My Jobs */
if (document.getElementById("jobList")) {
  fetch(API + "/recruiter/jobs")
    .then(r => r.json())
    .then(data => {
      document.getElementById("jobList").innerHTML = data.map(job => `
        <div class="card">
          <h3>${job.title}</h3>
          <p>${job.location}</p>
          <p>$${job.salary}</p>
        </div>
      `).join("");
    });
}
