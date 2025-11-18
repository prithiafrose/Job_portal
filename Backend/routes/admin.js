import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import {
  getUserStats,
  getJobStats,
  getPendingApprovals,
  getRecentRegistrations
} from "../controllers/adminController.js";

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard stats
router.get("/users/stats", getUserStats);
router.get("/jobs/stats", getJobStats);
router.get("/jobs/pending", getPendingApprovals);
router.get("/users/recent", getRecentRegistrations);

export default router;