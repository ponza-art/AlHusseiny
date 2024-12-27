const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuth } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');
const { validateAdminAction, validateDateRange } = require('../utils/adminValidators');

// Dashboard
router.get('/dashboard', isAuth, isAdmin, adminController.getDashboardStats);

// User Management
router.get('/users', isAuth, isAdmin, adminController.getAllUsers);
router.patch('/users/:id/role', 
    isAuth, 
    isAdmin, 
    validateAdminAction, 
    adminController.updateUserRole
);

// Order Management
router.get('/orders/stats', isAuth, isAdmin, adminController.getOrderStats);
router.patch('/orders/:id/status', 
    isAuth, 
    isAdmin, 
    adminController.updateOrderStatus
);

// Inventory Management
router.get('/inventory/alerts', isAuth, isAdmin, adminController.getInventoryAlerts);

// Reports
router.get('/reports/sales', 
    isAuth, 
    isAdmin,
    validateDateRange,
    adminController.getSalesReport
);

module.exports = router; 