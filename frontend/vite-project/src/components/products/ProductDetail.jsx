import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/products/${id}`);
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="alert alert-error">{error}</div>;
    if (!product) return <div className="alert alert-info">Product not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="w-full aspect-square">
                        <img 
                            src={product.images[selectedImage]} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {product.images.map((image, index) => (
                            <button 
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`w-20 h-20 rounded-lg overflow-hidden ${
                                    selectedImage === index ? 'ring-2 ring-primary' : ''
                                }`}
                            >
                                <img 
                                    src={image} 
                                    alt={`${product.name} ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-xl font-semibold">${product.price}</p>
                    <div className="prose max-w-none">
                        <p>{product.description}</p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm">Quantity:</span>
                        <div className="join">
                            <button 
                                className="join-item btn"
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            >
                                -
                            </button>
                            <input 
                                type="number" 
                                value={quantity}
                                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="join-item btn w-20 text-center"
                            />
                            <button 
                                className="join-item btn"
                                onClick={() => setQuantity(q => q + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                        className="btn btn-primary btn-block"
                        onClick={() => addToCart(product, quantity)}
                    >
                        Add to Cart
                    </button>

                    {/* Product Specifications */}
                    {product.specifications?.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <tbody>
                                        {product.specifications.map((spec, index) => (
                                            <tr key={index}>
                                                <td className="font-medium">{spec.key}</td>
                                                <td>{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}