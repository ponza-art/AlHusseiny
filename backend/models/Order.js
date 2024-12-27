const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    selectedVariants: [{
        name: String,
        value: String
    }],
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
        phone: String
    },
    paymentMethod: {
        type: String,
        enum: ['CARD', 'CASH', 'WALLET'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING'
    },
    orderStatus: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    },
    paymentDetails: {
        transactionId: String,
        paymentMethod: String,
        paidAt: Date
    },
    trackingNumber: String,
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema); 