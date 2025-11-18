import express from "express";
import { createJob, listJobs, getJob, updateJob, deleteJob } from "../controllers/jobsController.js";
import { getForJob } from "../controllers/applicationsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all recruiter routes
router.use(authMiddleware);

// POST /api/recruiter/jobs - Create a new job
router.post("/jobs", createJob);

// GET /api/recruiter/jobs - Get jobs posted by current recruiter
router.get("/jobs", async (req, res) => {
  try {
    const Job = (await import("../models/Job.js")).default;
    const jobs = await Job.findAll({
      where: { posted_by: req.user.id },
      order: [["id", "DESC"]]
    });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/recruiter/jobs/count - Get count of jobs posted by recruiter
router.get("/jobs/count", async (req, res) => {
  try {
    const Job = (await import("../models/Job.js")).default;
    const count = await Job.count({
      where: { posted_by: req.user.id }
    });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/recruiter/jobs/:id - Get specific job by recruiter
router.get("/jobs/:id", getJob);

// PUT /api/recruiter/jobs/:id - Update job (only if posted by recruiter)
router.put("/jobs/:id", async (req, res) => {
  try {
    const Job = (await import("../models/Job.js")).default;
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    if (job.posted_by !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this job" });
    }
    
    await job.update(req.body);
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/recruiter/jobs/:id - Delete job (only if posted by recruiter)
router.delete("/jobs/:id", async (req, res) => {
  try {
    const Job = (await import("../models/Job.js")).default;
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    if (job.posted_by !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this job" });
    }
    
    await job.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

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

export default router;