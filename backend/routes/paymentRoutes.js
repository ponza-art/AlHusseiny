const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/paymentController');
const { isAuth } = require('../../middlewares/authMiddleware');

// Initialize payment
router.post('/initiate', isAuth, paymentController.initiatePayment);

// Payment webhook
router.post('/webhook', paymentController.handlePaymentWebhook);

// Get payment status
router.get('/status/:orderId', isAuth, paymentController.getPaymentStatus);

module.exports = router; 