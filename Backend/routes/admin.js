const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const {
  getUserStats,
  getJobStats,
  getPendingApprovals,
  getRecentRegistrations
} = require("../controllers/adminController");

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard stats
router.get("/users/stats", getUserStats);
router.get("/jobs/stats", getJobStats);
router.get("/jobs/pending", getPendingApprovals);
router.get("/users/recent", getRecentRegistrations);

module.exports = router;