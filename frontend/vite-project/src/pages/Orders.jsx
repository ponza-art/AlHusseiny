import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'badge-warning';
            case 'PROCESSING':
                return 'badge-info';
            case 'SHIPPED':
                return 'badge-primary';
            case 'DELIVERED':
                return 'badge-success';
            case 'CANCELLED':
                return 'badge-error';
            default:
                return 'badge-ghost';
        }
    };

    const cancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to cancel order');
            }

            // Refresh orders list
            fetchOrders();
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
                    <p className="mb-4">Start shopping to create your first order!</p>
                    <Link to="/shop" className="btn btn-primary">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="card-title mb-2">
                                        Order #{order._id.slice(-8)}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`badge ${getStatusColor(order.orderStatus)}`}>
                                        {order.orderStatus}
                                    </span>
                                    <span className="font-semibold mt-2">
                                        Total: ${order.totalAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="divider"></div>

                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item._id} className="flex items-center gap-4">
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{item.product.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity} × ${item.price}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                ${(item.quantity * item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="divider"></div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">Shipping Address:</p>
                                    <p className="text-sm text-gray-600">
                                        {order.shippingAddress.street}, {order.shippingAddress.city}
                                        <br />
                                        {order.shippingAddress.state}, {order.shippingAddress.country} {order.shippingAddress.zipCode}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">Payment Method:</p>
                                    <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                                </div>
                            </div>

                            {order.orderStatus === 'PENDING' && (
                                <div className="card-actions justify-end mt-4">
                                    <button 
                                        className="btn btn-error"
                                        onClick={() => cancelOrder(order._id)}
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 