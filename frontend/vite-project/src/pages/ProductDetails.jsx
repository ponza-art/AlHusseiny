import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { formatPrice } from '../utils/helpers';
import ProductCard from './../components/products/ProductCard';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
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

    if (loading) return <Loading />;
    if (error) return <div className="alert alert-error">{error}</div>;
    if (!product) return <div className="alert alert-info">Product not found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden">
                        <img 
                            src={product.images[selectedImage]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`aspect-square rounded-lg overflow-hidden border-2 
                                    ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
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
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <p className="text-2xl font-bold text-primary mt-2">
                            {formatPrice(product.price)}
                        </p>
                    </div>

                    <div className="prose max-w-none">
                        <p>{product.description}</p>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center space-x-2">
                        <div className={`badge ${product.stock ? 'badge-success' : 'badge-error'}`}>
                            {product.stock ? 'In Stock' : 'Out of Stock'}
                        </div>
                        {product.stock && (
                            <span className="text-sm text-gray-500">
                                ({product.stock} units available)
                            </span>
                        )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4">
                        <span>Quantity:</span>
                        <div className="join">
                            <Button 
                                variant="outline"
                                className="join-item"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </Button>
                            <input 
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="join-item w-20 text-center input input-bordered"
                            />
                            <Button 
                                variant="outline"
                                className="join-item"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                +
                            </Button>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div className="flex space-x-4">
                        <Button 
                            variant="primary"
                            fullWidth
                            disabled={!product.stock}
                            onClick={() => {
                                addToCart(product, quantity);
                                navigate('/cart');
                            }}
                        >
                            Add to Cart
                        </Button>
                        <Button 
                            variant="secondary"
                            onClick={() => addToCart(product, quantity)}
                        >
                            Buy Now
                        </Button>
                    </div>

                    {/* Product Details */}
                    <div className="divider"></div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Product Details</h3>
                        <table className="table">
                            <tbody>
                                {product.specifications?.map((spec, index) => (
                                    <tr key={index}>
                                        <td className="font-medium">{spec.key}</td>
                                        <td>{spec.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {product.relatedProducts && product.relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {product.relatedProducts.map(relatedProduct => (
                            <ProductCard 
                                key={relatedProduct._id} 
                                product={relatedProduct} 
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}