const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const { validateRegistration, validateLogin } = require('../utils/validators');

exports.register = async (req, res, next) => {
    try {
        const { error } = validateRegistration(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create new user
        user = new User({
            name,
            email,
            password,
            verificationToken
        });

        await user.save();

        // Send verification email
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
        await sendEmail({
            to: email,
            subject: 'Verify your email',
            text: `Please click on this link to verify your email: ${verificationUrl}`
        });

        res.status(201).json({ 
            message: 'Registration successful. Please check your email to verify your account.' 
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(400).json({ 
                message: 'Please verify your email before logging in' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.googleAuthCallback = async (req, res) => {
    try {
        // Generate JWT token
        const token = jwt.sign(
            { id: req.user.id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}`);
    } catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/auth/google/failure`);
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
}; 