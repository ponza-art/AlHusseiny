const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { isAuth } = require('../middlewares/authMiddleware');

// All cart routes require authentication
router.use(isAuth);

// Get user's cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update cart item quantity
router.patch('/items/:itemId', cartController.updateCartItem);

// Remove item from cart
router.delete('/items/:itemId', cartController.removeFromCart);

// Clear entire cart
router.delete('/', cartController.clearCart);

module.exports = router;
