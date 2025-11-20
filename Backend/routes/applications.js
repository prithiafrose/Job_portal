const express = require('express');
const router = express.Router();
const appCtrl = require('../controllers/applicationsController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, appCtrl.apply);
router.get('/job/:jobId', authMiddleware, appCtrl.getForJob);
router.get('/my-applications', authMiddleware, appCtrl.getApplicationsByUser);

module.exports = router;
