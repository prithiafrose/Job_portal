import express from "express";
import { createJob, listJobs, getJob, updateJob, deleteJob } from "../controllers/jobsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

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

export default router;
