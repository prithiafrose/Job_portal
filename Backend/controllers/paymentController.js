const Application = require('../models/Application');

// Process payment for job application
const processPayment = async (req, res) => {
  try {
    const { applicationId, amount, method, ...paymentDetails } = req.body;
    const userId = req.user.id;

    if (!applicationId || !amount || !method) {
      return res.status(400).json({ error: 'Application ID, amount, and payment method are required' });
    }

    // Verify application belongs to user
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized: Application does not belong to user' });
    }

    // Simulate payment processing (in real implementation, integrate with payment gateway)
    const paymentResult = await simulatePayment(method, amount, paymentDetails);

    if (paymentResult.success) {
      // Update application payment status
      await Application.updatePaymentStatus(applicationId, {
        payment_status: 'completed',
        payment_transaction_id: paymentResult.transactionId,
        payment_date: new Date()
      });

      res.json({
        success: true,
        message: 'Payment processed successfully',
        transactionId: paymentResult.transactionId
      });
    } else {
      // Update application payment status to failed
      await Application.updatePaymentStatus(applicationId, {
        payment_status: 'failed',
        payment_error: paymentResult.error
      });

      res.status(400).json({
        success: false,
        error: paymentResult.error || 'Payment failed'
      });
    }
  } catch (err) {
    console.error('Payment processing error:', err);
    res.status(500).json({ error: 'Server error during payment processing' });
  }
};

// Simulate payment processing (replace with actual payment gateway integration)
const simulatePayment = async (method, amount, details) => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Generate mock transaction ID
  const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  // Simulate different payment methods
  switch (method) {
    case 'credit_card':
      if (details.cardDetails) {
        return {
          success: true,
          transactionId,
          method: 'credit_card',
          last4: details.cardDetails.last4
        };
      }
      break;

    case 'upi':
      if (details.upiId) {
        return {
          success: true,
          transactionId,
          method: 'upi',
          upiId: details.upiId
        };
      }
      break;

    case 'net_banking':
      if (details.bank) {
        return {
          success: true,
          transactionId,
          method: 'net_banking',
          bank: details.bank
        };
      }
      break;

    default:
      return {
        success: false,
        error: 'Invalid payment method'
      };
  }

  return {
    success: false,
    error: 'Payment details incomplete'
  };
};

// Get payment status for an application
const getPaymentStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({
      applicationId: application.id,
      paymentStatus: application.payment_status,
      paymentAmount: application.payment_amount,
      paymentMethod: application.payment_method,
      transactionId: application.payment_transaction_id,
      paymentDate: application.payment_date,
      paymentError: application.payment_error
    });
  } catch (err) {
    console.error('Error getting payment status:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { processPayment, getPaymentStatus };