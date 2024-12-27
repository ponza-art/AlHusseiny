import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.log(err);
            
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title justify-center text-2xl">Login</h2>
                    
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            className="input input-bordered"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            className="input input-bordered"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                        <label className="label">
                            <Link to="/forgot-password" className="label-text-alt link link-hover">
                                Forgot password?
                            </Link>
                        </label>
                    </div>

                    <div className="form-control mt-6">
                        <button 
                            type="submit" 
                            className={`btn btn-primary ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            Login
                        </button>
                    </div>

                    <div className="divider">OR</div>

                    <button 
                        type="button"
                        onClick={() => window.location.href = 'http://localhost:5000/api/auth/google'}
                        className="btn btn-outline"
                    >
                        <img 
                            src="/google-icon.png" 
                            alt="Google" 
                            className="w-6 h-6 mr-2"
                        />
                        Continue with Google
                    </button>

                    <p className="text-center mt-4">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="link link-primary">
                            Register
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}