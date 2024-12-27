const Product = require('../models/Product');
const { validateProduct } = require('../utils/validators');

exports.createProduct = async (req, res, next) => {
    try {
        const { error } = validateProduct(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const product = new Product(req.body);
        await product.save();

        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, category, search, sort } = req.query;
        const query = {};

        // Filter by category
        if (category) query.category = category;

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting options
        let sortOption = {};
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    sortOption = { price: 1 };
                    break;
                case 'price_desc':
                    sortOption = { price: -1 };
                    break;
                case 'newest':
                    sortOption = { createdAt: -1 };
                    break;
                case 'rating':
                    sortOption = { averageRating: -1 };
                    break;
            }
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Product.countDocuments(query);

        res.json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category')
            .populate('ratings.user', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};

exports.addRating = async (req, res, next) => {
    try {
        const { rating, review } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user has already rated
        const existingRating = product.ratings.find(
            r => r.user.toString() === req.user.id
        );

        if (existingRating) {
            existingRating.rating = rating;
            existingRating.review = review;
        } else {
            product.ratings.push({
                user: req.user.id,
                rating,
                review
            });
        }

        await product.save();
        res.json(product);
    } catch (error) {
        next(error);
    }
}; 