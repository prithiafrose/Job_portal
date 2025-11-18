import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { apply, getForJob, getRecruiterApplications, getRecentApplications, updateApplicationStatus } from "../controllers/applicationsController.js";

const router = express.Router();

router.post('/', authMiddleware, apply);
router.get('/job/:jobId', authMiddleware, getForJob);
router.get('/recruiter', authMiddleware, getRecruiterApplications);
router.get('/recruiter/recent', authMiddleware, getRecentApplications);
router.put('/:id/status', authMiddleware, updateApplicationStatus);

export default router;
