import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// 1️⃣ GET /jobs?page=1 - list jobs with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
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

// 2️⃣ GET /jobs/:id - get single job details
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

