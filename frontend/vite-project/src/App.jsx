import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundry';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
    return (
        <ErrorBoundary>
            <Router>
                <AuthProvider>
                    <CartProvider>
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/product/:id" element={<ProductDetails />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                
                                {/* Protected Routes */}
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/profile" element={<Profile />} />
                                </Route>

                                {/* 404 Page */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Layout>
                    </CartProvider>
                </AuthProvider>
            </Router>
        </ErrorBoundary>
    );
}