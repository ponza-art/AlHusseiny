const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuth } = require('../middlewares/authMiddleware');
const { validatePayment } = require('../utils/validators');
const rateLimit = require('express-rate-limit');

// Initialize payment
router.post('/initiate', 
    isAuth, 
    validatePayment,
    paymentController.initiatePayment
);

// Add rate limiting for webhook
const webhookLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

router.post('/webhook', 
    webhookLimiter,
    paymentController.handlePaymentWebhook
);

// Get payment status
router.get('/status/:orderId', isAuth, paymentController.getPaymentStatus);

module.exports = router; 