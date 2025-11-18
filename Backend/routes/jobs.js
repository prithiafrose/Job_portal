const express = require("express");
const { listJobs, getJob } = require("../controllers/jobsController");

const router = express.Router();

// GET /jobs - Get all jobs (for homepage)
router.get("/", listJobs);

// GET /jobs/:id - Get specific job details
router.get("/:id", getJob);

module.exports = router;