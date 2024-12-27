const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { isAuth } = require('../middlewares/authMiddleware');
const { validateRegistration, validateLogin } = require('../utils/validators');

// Regular auth routes
router.post('/register', 
    validateRegistration,
    authController.register
);

router.post('/login',
    validateLogin, 
    authController.login
);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    authController.googleAuthCallback
);

// Protected route example
router.get('/me', isAuth, authController.getCurrentUser);

module.exports = router; 