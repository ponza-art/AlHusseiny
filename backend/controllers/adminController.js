const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const stats = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: new Date(new Date().setDate(new Date().getDate() - 30))
                        },
                        paymentStatus: 'PAID'
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$totalAmount' }
                    }
                }
            ])
        ]);

        res.json({
            totalUsers: stats[0],
            totalProducts: stats[1],
            totalOrders: stats[2],
            monthlyRevenue: stats[3][0]?.totalRevenue || 0
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort('-createdAt');

        const total = await User.countDocuments(query);

        res.json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.getOrderStats = async (req, res, next) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        res.json(stats);
    } catch (error) {
        next(error);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        ).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};

exports.getInventoryAlerts = async (req, res, next) => {
    try {
        const lowStockProducts = await Product.find({
            stock: { $lt: 10 }
        }).select('name stock');

        res.json(lowStockProducts);
    } catch (error) {
        next(error);
    }
};

exports.getSalesReport = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        const sales = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    paymentStatus: 'PAID'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    totalSales: { $sum: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(sales);
    } catch (error) {
        next(error);
    }
}; 