/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="card w-96 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <figure className="px-10 pt-10">
                <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="rounded-xl h-48 w-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{product.name}</h2>
                <p className="text-gray-600 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold">${product.price}</span>
                    <div className="card-actions">
                        <Link 
                            to={`/product/${product._id}`} 
                            className="btn btn-outline btn-primary btn-sm"
                        >
                            Details
                        </Link>
                        <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => addToCart(product)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}