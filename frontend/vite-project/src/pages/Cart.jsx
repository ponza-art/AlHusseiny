import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                    <p className="mb-4">Add some items to your cart to get started!</p>
                    <a href="/shop" className="btn btn-primary">
                        Continue Shopping
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {cart.map(item => (
                        <CartItem key={item._id} item={item} />
                    ))}
                </div>
                
                <div className="lg:col-span-1">
                    <CartSummary />
                </div>
            </div>
        </div>
    );
}