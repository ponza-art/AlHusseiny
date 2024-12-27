/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OrderSuccess() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkPaymentStatus = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/payments/status/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setPaymentStatus(data.paymentStatus);
        } catch (error) {
            console.error('Error checking payment status:', error);
        }
    };

    useEffect(() => {
        if (order?.paymentMethod === 'CARD') {
            checkPaymentStatus();
            // Poll payment status every 5 seconds
            const interval = setInterval(checkPaymentStatus, 5000);
            return () => clearInterval(interval);
        }
    }, [order]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                    <svg className="w-20 h-20 text-success mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <h1 className="text-3xl font-bold mb-2">Order Successful!</h1>
                    <p className="text-gray-600">Thank you for your purchase.</p>
                </div>

                <div className="card bg-base-100 shadow-xl mb-8">
                    <div className="card-body">
                        <h2 className="card-title">Order Details</h2>
                        <p>Order ID: {orderId}</p>
                        <p>Status: {order?.orderStatus}</p>
                        <p>Total Amount: ${order?.totalAmount?.toFixed(2)}</p>
                        {order?.paymentMethod === 'CARD' && (
                            <p>Payment Status: {paymentStatus || 'Processing...'}</p>
                        )}
                    </div>
                </div>

                <div className="space-x-4">
                    <Link to="/shop" className="btn btn-primary">
                        Continue Shopping
                    </Link>
                    <Link to="/orders" className="btn btn-outline">
                        View Orders
                    </Link>
                </div>
            </div>
        </div>
    );
} 