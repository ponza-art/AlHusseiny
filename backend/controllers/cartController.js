const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product', 'name images price stock');

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: []
            });
        }

        res.json(cart);
    } catch (error) {
        next(error);
    }
};

exports.addToCart = async (req, res, next) => {
    try {
        const { productId, quantity = 1, selectedVariants = [] } = req.body;

        // Validate product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = new Cart({
                user: req.user.id,
                items: []
            });
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find(item => 
            item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.price = product.price;
            existingItem.selectedVariants = selectedVariants;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price,
                selectedVariants
            });
        }

        await cart.save();
        await cart.populate('items.product', 'name images price stock');

        res.json(cart);
    } catch (error) {
        next(error);
    }
};

exports.updateCartItem = async (req, res, next) => {
    try {
        const { quantity } = req.body;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = cart.items.id(itemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Validate stock
        const product = await Product.findById(cartItem.product);
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        cartItem.quantity = quantity;
        await cart.save();
        await cart.populate('items.product', 'name images price stock');

        res.json(cart);
    } catch (error) {
        next(error);
    }
};

exports.removeFromCart = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        await cart.save();
        await cart.populate('items.product', 'name images price stock');

        res.json(cart);
    } catch (error) {
        next(error);
    }
};

exports.clearCart = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        next(error);
    }
}; 