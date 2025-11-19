// Get job ID from URL
const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get("id");

// DOM elements
const applicationForm = document.getElementById("applicationForm");
const jobSummary = document.getElementById("jobSummary");
const resumeInput = document.getElementById("resume");
const fileName = document.getElementById("fileName");
const paymentMethods = document.querySelectorAll(".payment-method");
const paymentDetails = document.getElementById("paymentDetails");
const submitBtn = document.getElementById("submitBtn");

let selectedPaymentMethod = null;

// Check authentication and redirect if needed
function checkAuthentication() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  if (!token) {
    // Not logged in, redirect to login with return URL
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `Auth/login.html?redirect=${returnUrl}`;
    return false;
  }
  
  // Check if user is registered as student
  if (user.role !== "student") {
    alert("Only students can apply for jobs. Please register as a student.");
    window.location.href = `/FrontendUI/Auth/Register.html?redirect=${encodeURIComponent(window.location.href)}`;
    return false;
  }
  
  return true;
}

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
    jobSummary.innerHTML = `
      <p><strong>Position:</strong> ${job.job_position}</p>
      <p><strong>Company:</strong> ${job.company_name}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Salary:</strong> ₹${job.monthly_salary}</p>
      <p><strong>Skills Required:</strong> ${job.skills_required}</p>
    `;
    
    // Pre-fill user information if available
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.name) document.getElementById("fullName").value = user.name;
    if (user.email) document.getElementById("email").value = user.email;
    
  } catch (err) {
    console.error("Error fetching job details:", err);
    jobSummary.innerHTML = `<p style="color: red;">Error loading job details: ${err.message}</p>`;
  }
}

// Handle file selection
resumeInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      fileName.innerHTML = '<span class="error">File size must be less than 5MB</span>';
      resumeInput.value = '';
      return;
    }
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      fileName.innerHTML = '<span class="error">Only PDF, DOC, and DOCX files are allowed</span>';
      resumeInput.value = '';
      return;
    }
    
    fileName.innerHTML = `<span class="success">Selected: ${file.name}</span>`;
  }
});

// Handle payment method selection
paymentMethods.forEach(method => {
  method.addEventListener("click", () => {
    // Remove previous selection
    paymentMethods.forEach(m => m.classList.remove("selected"));
    
    // Add selection to clicked method
    method.classList.add("selected");
    selectedPaymentMethod = method.dataset.method;
    
    // Show payment details based on method
    showPaymentDetails(selectedPaymentMethod);
  });
});

// Show payment details based on selected method
function showPaymentDetails(method) {
  let detailsHTML = "";
  
  switch (method) {
    case "credit_card":
      detailsHTML = `
        <div class="form-group">
          <label for="cardNumber">Card Number *</label>
          <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
        </div>
        <div class="form-group">
          <label for="cardName">Cardholder Name *</label>
          <input type="text" id="cardName" placeholder="John Doe" required>
        </div>
        <div style="display: flex; gap: 15px;">
          <div class="form-group" style="flex: 1;">
            <label for="expiry">Expiry Date *</label>
            <input type="text" id="expiry" placeholder="MM/YY" maxlength="5" required>
          </div>
          <div class="form-group" style="flex: 1;">
            <label for="cvv">CVV *</label>
            <input type="text" id="cvv" placeholder="123" maxlength="3" required>
          </div>
        </div>
      `;
      break;
      
    case "upi":
      detailsHTML = `
        <div class="form-group">
          <label for="upiId">UPI ID *</label>
          <input type="text" id="upiId" placeholder="yourname@upi" required>
        </div>
        <p style="text-align: center; margin-top: 15px;">
          <strong>Scan QR Code:</strong><br>
          <img src="/assets/upi-qr-code.png" alt="UPI QR Code" style="max-width: 200px; margin: 10px 0;">
        </p>
      `;
      break;
      
    case "net_banking":
      detailsHTML = `
        <div class="form-group">
          <label for="bank">Select Bank *</label>
          <select id="bank" required>
            <option value="">Choose your bank</option>
            <option value="sbi">State Bank of India</option>
            <option value="hdfc">HDFC Bank</option>
            <option value="icici">ICICI Bank</option>
            <option value="pnb">Punjab National Bank</option>
            <option value="axis">Axis Bank</option>
            <option value="other">Other</option>
          </select>
        </div>
        <p style="font-size: 14px; color: #666;">
          You will be redirected to your bank's secure payment gateway.
        </p>
      `;
      break;
  }
  
  paymentDetails.innerHTML = detailsHTML;
  paymentDetails.style.display = "block";
}

// Format card number input
document.addEventListener("input", (e) => {
  if (e.target.id === "cardNumber") {
    let value = e.target.value.replace(/\s/g, "");
    let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
    e.target.value = formattedValue;
  }
  
  if (e.target.id === "expiry") {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    e.target.value = value;
  }
  
  if (e.target.id === "cvv") {
    e.target.value = e.target.value.replace(/\D/g, "");
  }
});

// Handle form submission
applicationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  if (!selectedPaymentMethod) {
    alert("Please select a payment method");
    return;
  }
  
  const formData = new FormData(applicationForm);
  const resumeFile = resumeInput.files[0];
  
  if (!resumeFile) {
    alert("Please upload your resume/CV");
    return;
  }
  
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";
  
  try {
    // First upload resume to Cloudinary
    const resumeFormData = new FormData();
    resumeFormData.append("resume", resumeFile);
    
    const token = localStorage.getItem("token");
    const uploadRes = await fetch("http://localhost:5001/upload/resume", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: resumeFormData
    });
    
    const uploadData = await uploadRes.json();
    
    if (!uploadRes.ok) {
      throw new Error(uploadData.error || "Failed to upload resume");
    }
    
    // Prepare application data
    const applicationData = {
      jobId: jobId,
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      education: formData.get("education"),
      experience: formData.get("experience"),
      skills: formData.get("skills"),
      resume: uploadData.resumeUrl,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "pending"
    };
    
    // Add payment details based on method
    if (selectedPaymentMethod === "credit_card") {
      applicationData.cardDetails = {
        last4: formData.get("cardNumber").slice(-4),
        name: formData.get("cardName"),
        expiry: formData.get("expiry")
      };
    } else if (selectedPaymentMethod === "upi") {
      applicationData.upiId = formData.get("upiId");
    } else if (selectedPaymentMethod === "net_banking") {
      applicationData.bank = formData.get("bank");
    }
    
    // Submit application
    const appRes = await fetch("http://localhost:5001/apply-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(applicationData)
    });
    
    const appData = await appRes.json();
    
    if (appRes.ok) {
      // Process payment
      const paymentRes = await fetch("http://localhost:5001/api/payment/process-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          applicationId: appData.applicationId,
          amount: 100,
          method: selectedPaymentMethod,
          ...applicationData
        })
      });
      
      const paymentData = await paymentRes.json();
      
    if (paymentRes.ok) {
        alert("Application submitted successfully! Payment processed.");
        window.location.href = `/FrontendUI/job-details.html?id=${jobId}`;
      } else {
        alert("Application submitted but payment failed. Please contact support.");
        window.location.href = `/FrontendUI/job-details.html?id=${jobId}`;
      }
    } else {
      throw new Error(appData.error || "Failed to submit application");
    }
    
  } catch (err) {
    console.error("Error:", err);
    alert(`Error: ${err.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Application & Pay ₹100";
  }
});

// Initialize page
if (checkAuthentication()) {
  fetchJobDetails();
}