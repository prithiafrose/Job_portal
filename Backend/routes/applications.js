import express from 'express';
const router = express.Router();
import { apply, getForJob, getMyApplications } from '../controllers/applicationsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

router.post('/', authMiddleware, apply);
router.get('/my-applications', authMiddleware, getMyApplications);
router.get('/job/:jobId', authMiddleware, getForJob);

export default router;
