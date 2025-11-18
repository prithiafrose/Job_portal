// backend/routes/jobs.js
import express from "express";
import Job from "../models/Job.js"; // your Job model
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /jobs?page=1
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // jobs per page
    const offset = (page - 1) * limit;

    const { count, rows } = await Job.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
    });

    res.json({
      jobs: rows,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /jobs - Create a new job
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      job_position,
      company_name,
      location,
      monthly_salary,
      skills_required,
      description,
      logo_url
    } = req.body;

    const job = await Job.create({
      job_position,
      company_name,
      location,
      monthly_salary,
      skills_required: Array.isArray(skills_required) ? skills_required.join(', ') : skills_required,
      description,
      logo_url,
      posted_by: req.user.id
    });

    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /jobs/recruiter - Get jobs posted by current recruiter
router.get("/recruiter", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const jobs = await Job.findAll({
      where: { posted_by: user_id },
      order: [["id", "DESC"]]
    });
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /jobs/recruiter/stats - Get recruiter stats
router.get("/recruiter/stats", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const totalJobs = await Job.count({
      where: { posted_by: user_id }
    });
    
    // Get total applicants count
    const Application = await import("../models/Application.js");
    const totalApplicants = await Application.default.count({
      include: [{
        model: Job,
        where: { posted_by: user_id }
      }]
    });
    
    res.json({ totalJobs, totalApplicants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /jobs/:id - Delete a job
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const jobId = req.params.id;
    const user_id = req.user.id;
    
    const job = await Job.findOne({
      where: { id: jobId, posted_by: user_id }
    });
    
    if (!job) {
      return res.status(404).json({ error: "Job not found or you don't have permission" });
    }
    
    await job.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

