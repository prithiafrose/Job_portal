const express = require('express');
const { processPayment, getPaymentStatus } = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Process payment for job application
router.post('/process-payment', authMiddleware, processPayment);

// Get payment status for an application
router.get('/payment-status/:applicationId', authMiddleware, getPaymentStatus);

module.exports = router;