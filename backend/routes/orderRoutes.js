const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuth } = require('../middlewares/authMiddleware');
const { validateOrder } = require('../utils/validators');

// All order routes require authentication
router.use(isAuth);

// Create new order
router.post('/', validateOrder, orderController.createOrder);

// Get user's orders
router.get('/', orderController.getOrders);

// Get specific order
router.get('/:id', orderController.getOrderById);

// Cancel order (if still possible)
router.post('/:id/cancel', orderController.cancelOrder);

// Track order status
router.get('/:id/track', orderController.getOrderById);

module.exports = router;
