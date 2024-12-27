const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuth } = require('../middlewares/authMiddleware');
const { validateProduct } = require('../utils/validators');

// Get all products with filtering, searching and pagination
router.get('/', productController.getProducts);

// Get single product
router.get('/:id', productController.getProductById);

// Protected routes
router.post('/',
    isAuth,
    validateProduct,
    productController.createProduct
);

router.patch('/:id',
    isAuth,
    validateProduct,
    productController.updateProduct
);

router.delete('/:id',
    isAuth,
    productController.deleteProduct
);

// Product ratings
router.post('/:id/ratings',
    isAuth,
    productController.addRating
);

module.exports = router;
