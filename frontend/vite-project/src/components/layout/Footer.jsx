import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-base-200">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Our Store</h3>
                        <p className="text-base-content/70">
                            Your one-stop shop for quality products at great prices.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="btn btn-circle btn-ghost">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="btn btn-circle btn-ghost">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="btn btn-circle btn-ghost">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/shop" className="hover:text-primary">Shop</Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-primary">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary">Contact</Link>
                            </li>
                            <li>
                                <Link to="/faq" className="hover:text-primary">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/shipping" className="hover:text-primary">Shipping Info</Link>
                            </li>
                            <li>
                                <Link to="/returns" className="hover:text-primary">Returns</Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-primary">Terms & Conditions</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Newsletter</h3>
                        <p className="mb-4 text-base-content/70">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="join">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="input input-bordered join-item"
                            />
                            <button type="submit" className="btn btn-primary join-item">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="divider my-8"></div>
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-base-content/70">
                        © {new Date().getFullYear()} Our Store. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <img src="/payment-visa.svg" alt="Visa" className="h-8" />
                        <img src="/payment-mastercard.svg" alt="Mastercard" className="h-8" />
                        <img src="/payment-paypal.svg" alt="PayPal" className="h-8" />
                    </div>
                </div>
            </div>
        </footer>
    );
}