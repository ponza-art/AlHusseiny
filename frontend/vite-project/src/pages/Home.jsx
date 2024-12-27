import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:5000/api/products?featured=true').then(res => res.json()),
            fetch('http://localhost:5000/api/categories').then(res => res.json())
        ])
        .then(([productsData, categoriesData]) => {
            setFeaturedProducts(productsData.products);
            setCategories(categoriesData);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8">
            <span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    return (
        <div>
            {/* Hero Section */}
            <div className="hero min-h-[70vh] bg-base-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Welcome to Our Store</h1>
                        <p className="py-6">
                            Discover amazing products at great prices. Shop now and enjoy our wide selection of items!
                        </p>
                        <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {featuredProducts.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="bg-base-200 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map(category => (
                            <Link 
                                key={category._id}
                                to={`/shop?category=${category._id}`}
                                className="card bg-base-100 hover:shadow-xl transition-shadow"
                            >
                                <figure className="px-10 pt-10">
                                    <img 
                                        src={category.image} 
                                        alt={category.name}
                                        className="rounded-xl h-32 w-32 object-cover"
                                    />
                                </figure>
                                <div className="card-body items-center text-center">
                                    <h3 className="card-title">{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Newsletter Signup */}
            <div className="container mx-auto px-4 py-16">
                <div className="card bg-primary text-primary-content">
                    <div className="card-body text-center">
                        <h2 className="card-title justify-center text-2xl mb-4">
                            Subscribe to Our Newsletter
                        </h2>
                        <p>Stay updated with our latest products and offers!</p>
                        <div className="flex justify-center mt-4">
                            <div className="join">
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="input join-item"
                                />
                                <button className="btn join-item btn-secondary">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}