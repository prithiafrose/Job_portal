const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authMiddleware');
const { getJobs, getJobById, applyJob } = require('../controllers/jobController');

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/apply', verifyToken, applyJob);

module.exports = router;
