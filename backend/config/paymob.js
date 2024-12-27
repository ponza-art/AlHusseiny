const axios = require('axios');

class PaymobService {
    constructor() {
        this.apiKey = process.env.PAYMOB_API_KEY;
        this.baseUrl = 'https://accept.paymob.com/api';
        this.integrationId = process.env.PAYMOB_INTEGRATION_ID;
        this.iframeId = process.env.PAYMOB_IFRAME_ID;
    }

    async getAuthToken() {
        try {
            const response = await axios.post(`${this.baseUrl}/auth/tokens`, {
                api_key: this.apiKey
            });
            return response.data.token;
        } catch (error) {
            throw new Error('Failed to get Paymob auth token');
        }
    }

    async createOrder(authToken, amount, items) {
        try {
            const response = await axios.post(`${this.baseUrl}/ecommerce/orders`, {
                auth_token: authToken,
                delivery_needed: false,
                amount_cents: amount * 100, // Convert to cents
                items: items
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to create Paymob order');
        }
    }

    async createPaymentKey(authToken, orderId, amount, billingData) {
        try {
            const response = await axios.post(`${this.baseUrl}/acceptance/payment_keys`, {
                auth_token: authToken,
                amount_cents: amount * 100,
                expiration: 3600,
                order_id: orderId,
                billing_data: billingData,
                currency: "EGP",
                integration_id: this.integrationId,
                lock_order_when_paid: true
            });
            return response.data.token;
        } catch (error) {
            throw new Error('Failed to create payment key');
        }
    }

    async processWebhook(payload) {
        // Verify hmac
        const calculatedHmac = this.calculateHmac(payload);
        if (calculatedHmac !== payload.hmac) {
            throw new Error('Invalid HMAC');
        }

        return {
            success: payload.success,
            orderId: payload.order.id,
            transactionId: payload.id,
            amount: payload.amount_cents / 100,
            currency: payload.currency,
            paymentStatus: this.mapPaymentStatus(payload.success)
        };
    }

    calculateHmac(payload) {
        // Implement HMAC calculation according to Paymob documentation
        // This is a placeholder - implement actual HMAC calculation
        return '';
    }

    mapPaymentStatus(success) {
        return success ? 'PAID' : 'FAILED';
    }
}

module.exports = new PaymobService(); 