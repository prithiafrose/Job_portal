document.addEventListener("DOMContentLoaded", () => {
  const jobList = document.getElementById("job-list");
  const applyBtn = document.getElementById("applyFilters");
  const clearBtn = document.getElementById("clearFilters");

  async function fetchJobs() {
    if (!jobList) return;

    const title = document.getElementById("jobTitle")?.value;
    const location = document.getElementById("location")?.value;
    const skills = document.getElementById("skills")?.value;
    const minSalary = document.getElementById("minSalary")?.value;
    const maxSalary = document.getElementById("maxSalary")?.value;

    const params = new URLSearchParams();
    if (title) params.append("q", title);
    if (location) params.append("location", location);
    if (skills) params.append("skills", skills);
    if (minSalary) params.append("minSalary", minSalary);
    if (maxSalary) params.append("maxSalary", maxSalary);

    try {
      const res = await fetch(API_BASE + "/jobs?" + params.toString());
      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();

      jobList.innerHTML = data.jobs.map(job => `
        <div class="card">
          <h3>${escapeHTML(job.title)}</h3>
          <p>${escapeHTML(job.company)} - ${escapeHTML(job.location)}</p>
          <p>${escapeHTML(job.type)} | $${job.salary}</p>
          <a href="job-details.html?id=${job._id}" class="btn">View Details</a>
        </div>
      `).join("");

    } catch (err) {
      jobList.innerHTML = `<p style="color:red">${err.message}</p>`;
    }
  }

  applyBtn?.addEventListener("click", fetchJobs);
  clearBtn?.addEventListener("click", () => {
    document.getElementById("jobTitle").value = "";
    document.getElementById("location").value = "";
    document.getElementById("skills").value = "";
    document.getElementById("minSalary").value = "";
    document.getElementById("maxSalary").value = "";
    fetchJobs();
  });

  fetchJobs();
});
document.addEventListener("DOMContentLoaded", () => {
  const profileImage = document.getElementById("profileImage");
  const uploadPhoto = document.getElementById("uploadPhoto");

  // Load user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    if (user.photo) profileImage.src = user.photo; // existing photo
  }

  // Upload photo preview and save
  uploadPhoto.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        profileImage.src = event.target.result;
        // Save photo in localStorage for demo (replace with backend save later)
        user.photo = event.target.result;
        localStorage.setItem("user", JSON.stringify(user));
      };
      reader.readAsDataURL(file);
    }
  });
});
document.querySelectorAll("#job-list .job-card").forEach(card => {
  const applyBtn = document.createElement("button");
  applyBtn.textContent = "Apply";
  applyBtn.classList.add("btn");
  card.appendChild(applyBtn);

  applyBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Login required to apply!");
    const jobId = card.querySelector("a").href.split("id=")[1];

    try {
      const res = await fetch(`${API_BASE}/jobs/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ jobId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to apply");
      alert("Job applied successfully!");
      applyBtn.disabled = true;
      applyBtn.textContent = "Applied";
    } catch (err) {
      alert(err.message);
    }
  });
});


