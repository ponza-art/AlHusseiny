const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { isAuth } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

// Regular auth routes
router.post('/register', authController.register);

router.post('/login', authController.login);

// Protected route example
router.get('/me', isAuth, authController.getCurrentUser);

// Google OAuth routes
router.get('/google',
    passport.authenticate('google', { 
        scope: ['profile', 'email']
    })
);

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: false
    }),
    (req, res) => {
        // Generate JWT token
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );
        
        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    }
);

module.exports = router; 