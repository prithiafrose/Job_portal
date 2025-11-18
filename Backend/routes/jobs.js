// backend/routes/jobs.js
import express from "express";
import Job from "../models/Job.js"; // your Job model

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

export default router;

