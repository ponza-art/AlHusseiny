const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuth } = require('../middlewares/authMiddleware');
const { validatePayment } = require('../utils/validators');

// Initialize payment
router.post('/initiate', 
    isAuth, 
    validatePayment,
    paymentController.initiatePayment
);

// Payment webhook
router.post('/webhook', 
    paymentController.handlePaymentWebhook
);

// Get payment status
router.get('/status/:orderId', 
    isAuth, 
    paymentController.getPaymentStatus
);

module.exports = router; 