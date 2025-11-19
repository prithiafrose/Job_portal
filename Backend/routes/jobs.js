import express from "express";
import { listJobs, getJob } from "../controllers/jobsController.js";

const router = express.Router();

// GET /jobs - Get all jobs (for homepage)
router.get("/public", listJobs);

// GET /jobs/:id - Get specific job details
router.get("/:id", getJob);

export default router;