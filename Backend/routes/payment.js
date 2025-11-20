<<<<<<< HEAD
const express = require('express');
const { processPayment, getPaymentStatus } = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');
=======
import express from 'express';
import { processPayment, getPaymentStatus } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d

const router = express.Router();

// Process payment for job application
router.post('/process-payment', authMiddleware, processPayment);

// Get payment status for an application
router.get('/payment-status/:applicationId', authMiddleware, getPaymentStatus);

<<<<<<< HEAD
module.exports = router;
=======
export default router;
>>>>>>> c9bb79de7d25ffeef274cc70238fb8e77b97a16d
