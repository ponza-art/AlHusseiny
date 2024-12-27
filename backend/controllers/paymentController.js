const PaymobService = require('../config/paymob');
const Order = require('../models/Order');
const logger = require('../utils/logger');

exports.initiatePayment = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId)
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get Paymob auth token
        const authToken = await PaymobService.getAuthToken();

        // Create Paymob order
        const paymobOrder = await PaymobService.createOrder(
            authToken,
            order.totalAmount,
            order.items.map(item => ({
                name: item.product.name,
                amount_cents: item.price * 100,
                quantity: item.quantity
            }))
        );

        // Create payment key
        const billingData = {
            first_name: order.user.name.split(' ')[0],
            last_name: order.user.name.split(' ').slice(1).join(' '),
            email: order.user.email,
            phone_number: order.user.phone,
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            country: order.shippingAddress.country,
            apartment: "NA",
            floor: "NA",
            postal_code: order.shippingAddress.zipCode,
            state: order.shippingAddress.state
        };

        const paymentKey = await PaymobService.createPaymentKey(
            authToken,
            paymobOrder.id,
            order.totalAmount,
            billingData
        );

        // Update order with Paymob order ID
        order.paymentDetails = {
            ...order.paymentDetails,
            paymobOrderId: paymobOrder.id
        };
        await order.save();

        // Return payment data
        res.json({
            paymentKey,
            iframeId: PaymobService.iframeId
        });
    } catch (error) {
        logger.error('Payment initiation error:', error);
        next(error);
    }
};

exports.handlePaymentWebhook = async (req, res, next) => {
    try {
        const paymentData = await PaymobService.processWebhook(req.body);

        // Find and update order
        const order = await Order.findOne({
            'paymentDetails.paymobOrderId': paymentData.orderId
        });

        if (!order) {
            logger.error('Order not found for payment webhook:', paymentData);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order payment status
        order.paymentStatus = paymentData.paymentStatus;
        order.paymentDetails = {
            ...order.paymentDetails,
            transactionId: paymentData.transactionId,
            paidAt: new Date()
        };

        if (paymentData.success) {
            order.orderStatus = 'PROCESSING';
        }

        await order.save();

        res.json({ success: true });
    } catch (error) {
        logger.error('Payment webhook error:', error);
        next(error);
    }
};

exports.getPaymentStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .select('paymentStatus paymentDetails');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({
            paymentStatus: order.paymentStatus,
            transactionId: order.paymentDetails?.transactionId
        });
    } catch (error) {
        next(error);
    }
}; 