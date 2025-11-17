const API_BASE = "http://localhost:5000/api";

document.getElementById("jobForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const job = {
    title: document.getElementById("title").value,
    location: document.getElementById("location").value,
    salary: document.getElementById("salary").value,
    type: document.getElementById("type").value,
    description: document.getElementById("description").value
  };

  const res = await fetch(API_BASE + "/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job)
  });

  const data = await res.json();

  document.getElementById("msg").textContent = data.message || "Job Posted!";
  document.getElementById("msg").style.color = "lightgreen";
});
