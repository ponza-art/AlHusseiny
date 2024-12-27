/* eslint-disable react/prop-types */
import { useCart } from '../../context/CartContext';

export default function CartItem({ item }) {
    const { updateQuantity, removeFromCart } = useCart();

    return (
        <div className="card card-side bg-base-100 shadow-xl mb-4">
            <figure className="w-48">
                <img 
                    src={item.product.images[0]} 
                    alt={item.product.name} 
                    className="h-full w-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{item.product.name}</h2>
                <p className="text-gray-600">${item.price}</p>
                
                <div className="flex items-center gap-4">
                    <div className="join">
                        <button 
                            className="join-item btn btn-sm"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        >
                            -
                        </button>
                        <input 
                            type="number" 
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 0)}
                            className="join-item btn btn-sm w-16 text-center"
                        />
                        <button 
                            className="join-item btn btn-sm"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                    
                    <button 
                        className="btn btn-error btn-sm"
                        onClick={() => removeFromCart(item._id)}
                    >
                        Remove
                    </button>
                </div>
                
                <div className="text-right font-semibold">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        </div>
    );
}