const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const {
  getUserStats,
  getJobStats,
  getPendingApprovals,
<<<<<<< HEAD
  getRecentRegistrations,
  getUsers,
  deleteUser,
  getAllJobs,
  updateJobStatus,
  deleteJob
} = require("../controllers/adminController");
=======
  getRecentRegistrations
} from "../controllers/adminController.js";
import Application from "../models/Application.js";
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard stats
router.get("/users/stats", getUserStats);
router.get("/jobs/stats", getJobStats);
router.get("/jobs/pending", getPendingApprovals);
router.get("/users/recent", getRecentRegistrations);

<<<<<<< HEAD
// User Management
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

// Job Management
router.get("/jobs", getAllJobs);
router.put("/jobs/:id/status", updateJobStatus);
router.delete("/jobs/:id", deleteJob);

// Get applicants for a specific job
router.get("/job-applicants/:jobId", async (req, res) => {
  try {
    const Application = require("../models/Application");
=======
// Get applicants for a specific job
router.get("/job-applicants/:jobId", async (req, res) => {
  try {
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
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
<<<<<<< HEAD
    const Application = require("../models/Application");
=======
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
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

<<<<<<< HEAD
module.exports = router;
=======
export default router;
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
