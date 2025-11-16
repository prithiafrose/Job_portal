document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("jobForm");
  const errorMsg = document.getElementById("errorMsg");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.style.color = "red";
    errorMsg.textContent = "Submitting...";

    const token = localStorage.getItem("token");
    if (!token) {
      errorMsg.textContent = "You must be logged in to add a job.";
      return;
    }

    const formData = {
      companyName: form.companyName.value,
      logoUrl: form.logoUrl.value,
      title: form.jobPosition.value,
      salary: form.salary.value,
      type: form.jobType.value,
      remote: form.remote.value,
      location: form.location.value,
      description: form.jobDescription.value,
      aboutCompany: form.aboutCompany.value,
      skills: form.skills.value,
      information: form.information.value
    };

    try {
      // Ensure API_BASE exists
      if (typeof API_BASE === "undefined") {
        throw new Error("API_BASE is not defined. Check utils.js");
      }

      const res = await fetch(API_BASE + "/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add job");

      errorMsg.style.color = "green";
      errorMsg.textContent = "Job added successfully!";
      form.reset();
    } catch (err) {
      console.error(err);
      errorMsg.textContent = err.message;
    }
  });
});
