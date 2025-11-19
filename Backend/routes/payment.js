import express from 'express';
import { processPayment, getPaymentStatus } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Process payment for job application
router.post('/process-payment', authMiddleware, processPayment);

// Get payment status for an application
router.get('/payment-status/:applicationId', authMiddleware, getPaymentStatus);

export default router;