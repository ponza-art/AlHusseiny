const axios = require('axios');

class PaymobService {
    constructor() {
        if (!process.env.PAYMOB_API_KEY) {
            throw new Error('PAYMOB_API_KEY is not defined in environment variables');
        }
        
        this.API_KEY = process.env.PAYMOB_API_KEY;
        this.INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
        this.IFRAME_ID = process.env.PAYMOB_IFRAME_ID;
        this.HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET;
        this.baseURL = 'https://accept.paymob.com/api';
        
        // Configure axios defaults
        this.axiosInstance = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    }

    async getAuthToken() {
        try {
            console.log('Attempting to get auth token...');
            const response = await this.axiosInstance.post('/auth/tokens', {
                api_key: this.API_KEY
            });
            
            if (!response.data || !response.data.token) {
                console.error('Invalid response from Paymob:', response.data);
                throw new Error('Invalid response from Paymob auth endpoint');
            }
            
            console.log('Successfully obtained auth token');
            return response.data.token;
        } catch (error) {
            console.error('Paymob Auth Error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
                apiKey: this.API_KEY.substring(0, 10) + '...' // Log partial API key for debugging
            });
            throw new Error(`Failed to get auth token: ${error.response?.data?.message || error.message}`);
        }
    }

    async createOrder(authToken, amount, items) {
        try {
            console.log('Creating order with amount:', amount);
            const response = await this.axiosInstance.post('/ecommerce/orders', {
                auth_token: authToken,
                delivery_needed: false,
                amount_cents: Math.round(amount * 100),
                currency: "EGP",
                items: items.map(item => ({
                    ...item,
                    amount_cents: Math.round(item.amount_cents)
                }))
            });
            
            console.log('Order created successfully:', response.data.id);
            return response.data;
        } catch (error) {
            console.error('Create Order Error:', error.response?.data || error.message);
            throw new Error('Failed to create order');
        }
    }

    async createPaymentKey(authToken, orderId, amount, billingData, returnUrl) {
        try {
            console.log('Creating payment key for order:', orderId);
            const response = await this.axiosInstance.post('/acceptance/payment_keys', {
                auth_token: authToken,
                amount_cents: Math.round(amount * 100),
                expiration: 3600,
                order_id: orderId,
                billing_data: {
                    ...billingData,
                    apartment: "NA",
                    floor: "NA",
                    building: "NA",
                    shipping_method: "NA",
                },
                currency: "EGP",
                integration_id: this.INTEGRATION_ID,
                lock_order_when_paid: true,
                return_url: returnUrl
            });
            
            console.log('Payment key created successfully');
            return response.data.token;
        } catch (error) {
            console.error('Payment Key Error:', error.response?.data || error.message);
            throw new Error('Failed to create payment key');
        }
    }

    async processWebhook(payload) {
        try {
            console.log('Processing webhook payload');
            const { success, amount_cents, order, txn_response_code } = payload;
            
            return {
                success,
                amount: amount_cents / 100,
                orderId: order.id,
                transactionId: payload.transaction_id,
                paymentStatus: success ? 'PAID' : 'FAILED',
                responseCode: txn_response_code
            };
        } catch (error) {
            console.error('Webhook Processing Error:', error);
            throw error;
        }
    }
}

// Export a singleton instance
module.exports = new PaymobService(); 