<<<<<<< HEAD
const express = require("express");
const { createJob, listJobs, getJob, updateJob, deleteJob } = require("../controllers/jobsController");
const { getForJob } = require("../controllers/applicationsController");
const { authMiddleware } = require("../middleware/authMiddleware");
=======
import express from "express";
import { createJob, listJobs, getJob, updateJob, deleteJob } from "../controllers/jobsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d

const router = express.Router();

// All recruiter routes require authentication
router.use(authMiddleware);

// Create job
router.post("/jobs", createJob);

// List all jobs
router.get("/jobs", listJobs);

// Get single job
router.get("/jobs/:id", getJob);

// Update job
router.put("/jobs/:id", updateJob);

// Delete job
router.delete("/jobs/:id", deleteJob);

<<<<<<< HEAD
// GET /api/recruiter/applicants - Get all applicants for recruiter's jobs
router.get("/applicants", async (req, res) => {
  try {
    const Application = (await import("../models/Application.js")).default;
    const Job = (await import("../models/Job.js")).default;
    const User = (await import("../models/User.js")).default;
    
    const applications = await Application.findAll({
      include: [
        {
          model: Job,
          where: { posted_by: req.user.id },
          attributes: ['id', 'title', 'company']
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [["id", "DESC"]]
    });
    
    const formattedApps = applications.map(app => ({
      id: app.id,
      name: app.User?.name || 'Unknown',
      email: app.User?.email || 'Unknown',
      job: app.Job?.title || 'Unknown',
      job_id: app.job_id,
      cover_letter: app.cover_letter,
      resume_path: app.resume_path,
      status: app.status || 'pending',
      applied_at: app.createdAt
    }));
    
    res.json(formattedApps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/recruiter/jobs/:jobId/applicants - Get applicants for specific job
router.get("/jobs/:jobId/applicants", getForJob);

// PUT /api/recruiter/applications/:id/status - Update application status
router.put("/applications/:id/status", async (req, res) => {
  try {
    const Application = (await import("../models/Application.js")).default;
    const Job = (await import("../models/Job.js")).default;
    
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job }]
    });
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    // Verify that the job belongs to the current recruiter
    if (application.Job.posted_by !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this application" });
    }
    
    const { status } = req.body;
    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }
    
    await application.update({ status });
    res.json({ success: true, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
=======
export default router;
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
