import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { cart, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create order
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    items: cart,
                    shippingAddress,
                    totalAmount: total
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Initialize payment
            const paymentResponse = await fetch('http://localhost:5000/api/payments/initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    orderId: data._id
                })
            });

            const paymentData = await paymentResponse.json();

            // Clear cart and redirect to payment
            clearCart();
            navigate(paymentData.paymentUrl);

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Shipping Information */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Street Address</span>
                            </label>
                            <input
                                type="text"
                                className="input input-bordered"
                                value={shippingAddress.street}
                                onChange={(e) => setShippingAddress({
                                    ...shippingAddress,
                                    street: e.target.value
                                })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">City</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        city: e.target.value
                                    })}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">State</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={shippingAddress.state}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        state: e.target.value
                                    })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">ZIP Code</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={shippingAddress.zipCode}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        zipCode: e.target.value
                                    })}
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Phone</span>
                                </label>
                                <input
                                    type="tel"
                                    className="input input-bordered"
                                    value={shippingAddress.phone}
                                    onChange={(e) => setShippingAddress({
                                        ...shippingAddress,
                                        phone: e.target.value
                                    })}
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className={`btn btn-primary btn-block ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            Proceed to Payment
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            {cart.map(item => (
                                <div key={item._id} className="flex justify-between mb-2">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="divider"></div>
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}