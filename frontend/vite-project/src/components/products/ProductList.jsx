/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ category = null }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts();
    }, [category, currentPage]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const url = new URL('http://localhost:5000/api/products');
            url.searchParams.append('page', currentPage);
            if (category) url.searchParams.append('category', category);

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            setProducts(data.products);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner loading-lg"></span></div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center my-8">
                <div className="join">
                    <button 
                        className="join-item btn"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>
                    <button className="join-item btn">Page {currentPage}</button>
                    <button 
                        className="join-item btn"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        »
                    </button>
                </div>
            </div>
        </div>
    );
}