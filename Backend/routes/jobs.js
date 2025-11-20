<<<<<<< HEAD
const express = require("express");
const { listJobs, getJob } = require("../controllers/jobsController");
=======
import express from "express";
import { listJobs, getJob } from "../controllers/jobsController.js";
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d

const router = express.Router();

// GET /jobs - Get all jobs (for homepage)
<<<<<<< HEAD
router.get("/", listJobs);
=======
router.get("/public", listJobs);
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d

// GET /jobs/:id - Get specific job details
router.get("/:id", getJob);

<<<<<<< HEAD
module.exports = router;
=======
export default router;
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
