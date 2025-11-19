import express from 'express';
const router = express.Router();
import { applyForJob, getMyApplications, getForJob } from '../controllers/studentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/', authMiddleware, applyForJob);
router.get('/my-applications', authMiddleware, getMyApplications);
router.get('/job/:jobId', authMiddleware, getForJob);

export default router;
