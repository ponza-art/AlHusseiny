const User = require('../models/User');

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                message: 'Access denied. Admin only.' 
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.validateAdminAction = async (req, res, next) => {
    try {
        // Add specific validation for admin actions
        const { action, targetUserId } = req.body;

        // Prevent admin from modifying super admin
        if (action === 'modify_role') {
            const targetUser = await User.findById(targetUserId);
            if (targetUser && targetUser.role === 'super_admin') {
                return res.status(403).json({ 
                    message: 'Cannot modify super admin privileges' 
                });
            }
        }

        next();
    } catch (error) {
        next(error);
    }
}; 