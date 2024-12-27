const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuth } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected admin routes
router.post('/',
    isAuth,
    isAdmin,
    categoryController.createCategory
);

router.patch('/:id',
    isAuth,
    isAdmin,
    categoryController.updateCategory
);

router.delete('/:id',
    isAuth,
    isAdmin,
    categoryController.deleteCategory
);

module.exports = router;
