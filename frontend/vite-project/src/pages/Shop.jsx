import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        minPrice: '',
        maxPrice: '',
        sort: 'newest'
    });

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, [searchParams]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const url = new URL('http://localhost:5000/api/products');
            
            // Add search params
            for (const [key, value] of searchParams.entries()) {
                url.searchParams.append(key, value);
            }

            const response = await fetch(url);
            const data = await response.json();
            setProducts(data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        const newSearchParams = new URLSearchParams(searchParams);
        
        if (value) {
            newSearchParams.set(key, value);
        } else {
            newSearchParams.delete(key);
        }
        
        setSearchParams(newSearchParams);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchTerm = formData.get('search');
        
        if (searchTerm) {
            searchParams.set('search', searchTerm);
        } else {
            searchParams.delete('search');
        }
        
        setSearchParams(searchParams);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="lg:w-1/4">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Filters</h2>
                            
                            {/* Search */}
                            <form onSubmit={handleSearch} className="form-control">
                                <div className="join w-full">
                                    <input 
                                        type="text"
                                        name="search"
                                        placeholder="Search products..."
                                        className="input input-bordered join-item w-full"
                                        defaultValue={searchParams.get('search') || ''}
                                    />
                                    <button type="submit" className="btn join-item">
                                        Search
                                    </button>
                                </div>
                            </form>

                            {/* Categories */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>
                                <select 
                                    className="select select-bordered"
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-2">
                                <label className="label">
                                    <span className="label-text">Price Range</span>
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input 
                                        type="number"
                                        placeholder="Min"
                                        className="input input-bordered w-full"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    />
                                    <input 
                                        type="number"
                                        placeholder="Max"
                                        className="input input-bordered w-full"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Sort By</span>
                                </label>
                                <select 
                                    className="select select-bordered"
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="name_asc">Name: A to Z</option>
                                    <option value="name_desc">Name: Z to A</option>
                                </select>
                            </div>

                            {/* Clear Filters */}
                            <button 
                                className="btn btn-outline btn-block mt-4"
                                onClick={() => setSearchParams({})}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="lg:w-3/4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8">
                            <h2 className="text-2xl font-bold mb-4">No products found</h2>
                            <p>Try adjusting your filters or search terms</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}