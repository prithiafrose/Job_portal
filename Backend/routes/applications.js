import express from 'express';
import { apply, getForJob, upload, getMyApplications } from '../controllers/recruiterapplicationcontroller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

<<<<<<< HEAD
router.post('/', authMiddleware, appCtrl.apply);
router.get('/job/:jobId', authMiddleware, appCtrl.getForJob);
router.get('/my-applications', authMiddleware, appCtrl.getApplicationsByUser);
=======
router.post('/', authMiddleware, upload.single('resume'), apply);
router.get('/my-applications', authMiddleware, getMyApplications);
router.get('/job/:jobId', authMiddleware, getForJob);
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d

export default router;
