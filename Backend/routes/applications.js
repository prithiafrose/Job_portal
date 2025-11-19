import express from 'express';
import { apply, getForJob, upload, getMyApplications } from '../controllers/recruiterapplicationcontroller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, upload.single('resume'), apply);
router.get('/my-applications', authMiddleware, getMyApplications);
router.get('/job/:jobId', authMiddleware, getForJob);

export default router;
