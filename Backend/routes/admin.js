import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  getUserStats,
  getJobStats,
  getPendingApprovals,
  getRecentRegistrations
} from "../controllers/adminController.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// ======================= DASHBOARD STATS =======================
router.get("/users/stats", getUserStats);
router.get("/jobs/stats", getJobStats);
router.get("/jobs/pending", getPendingApprovals);
router.get("/users/recent", getRecentRegistrations);

// ======================= GET ALL USERS (ADMIN PANEL) =======================
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "mobile", "role"]
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ======================= DELETE USER =======================
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ======================= JOB APPLICANTS =======================
router.get("/job-applicants/:jobId", async (req, res) => {
  try {
    const apps = await Application.getApplicationsForJob(req.params.jobId);
    
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

// ======================= UPDATE APPLICATION STATUS =======================
router.put("/application-status/:applicationId", async (req, res) => {
  try {
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

export default router;
