const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

// Get current user profile
router.get('/', verifyToken, getProfile);

// Update profile (username, email, phone, skills, photo)
router.put('/update', verifyToken, updateProfile);

module.exports = router;
