import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartSummary() {
    const { cart, total } = useCart();

    const shipping = 10; // Example shipping cost
    const tax = total * 0.15; // Example 15% tax

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Order Summary</h2>
                
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span>Subtotal ({cart.length} items)</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="divider"></div>
                    
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${(total + shipping + tax).toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="card-actions justify-end mt-4">
                    <Link 
                        to="/checkout" 
                        className="btn btn-primary btn-block"
                        disabled={cart.length === 0}
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}