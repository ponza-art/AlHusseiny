const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuth } = require('../middlewares/authMiddleware');

router.use(isAuth);

// Create order
router.post('/', orderController.createOrder);

// Get all orders for user
router.get('/', orderController.getOrders);

// Get single order
router.get('/:id', orderController.getOrderById);

// Cancel order
router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router;
