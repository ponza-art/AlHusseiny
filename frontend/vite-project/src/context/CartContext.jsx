/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    // Fetch cart on mount
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setCart(data.items || []);
            setTotal(data.totalAmount || 0);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (product, quantity = 1) => {
        try {
            const response = await fetch('http://localhost:5000/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId: product._id,
                    quantity
                })
            });
            const data = await response.json();
            setCart(data.items || []);
            setTotal(data.totalAmount || 0);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cart/items/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity })
            });
            const data = await response.json();
            setCart(data.items || []);
            setTotal(data.totalAmount || 0);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cart/items/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setCart(data.items || []);
            setTotal(data.totalAmount || 0);
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const clearCart = async () => {
        try {
            await fetch('http://localhost:5000/api/cart', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCart([]);
            setTotal(0);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            total,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useCart = () => useContext(CartContext);