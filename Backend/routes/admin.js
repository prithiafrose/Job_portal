const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const {
  getUserStats,
  getJobStats,
  getPendingApprovals,
  getRecentRegistrations
} = require("../controllers/adminController");

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard stats
router.get("/users/stats", getUserStats);
router.get("/jobs/stats", getJobStats);
router.get("/jobs/pending", getPendingApprovals);
router.get("/users/recent", getRecentRegistrations);

// Get applicants for a specific job
router.get("/job-applicants/:jobId", async (req, res) => {
  try {
    const Application = require("../models/Application");
    const apps = await Application.getApplicationsForJob(req.params.jobId);
    
    // Format for frontend
    const formattedApps = apps.map(app => ({
      id: app.id,
      name: app.full_name || app.User?.username || 'N/A',
      email: app.email || app.User?.email || 'N/A',
      phone: app.phone || app.User?.mobile || 'N/A',
      education: app.education,
      experience: app.experience,
      skills: app.skills,
      resume: app.resume_path,
      status: app.status
    }));

    res.json({ applicants: formattedApps });
  } catch (err) {
    console.error("Error fetching job applicants:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update application status
router.put("/application-status/:applicationId", async (req, res) => {
  try {
    const Application = require("../models/Application");
    const { status } = req.body;
    
    const application = await Application.findByPk(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    await application.update({ status });
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;