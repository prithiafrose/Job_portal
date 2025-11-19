import express from 'express';
import { createJob, listJobs, getJob, updateJob, deleteJob } from '../controllers/jobsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', listJobs);
router.get('/:id', getJob);

// Protected routes (require login)
router.post('/', authMiddleware, createJob);
router.put('/:id', authMiddleware, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

export default router;
