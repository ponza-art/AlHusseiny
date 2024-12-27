/* eslint-disable react/prop-types */
import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-base-200">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body text-center">
                            <h2 className="card-title justify-center text-error">Oops! Something went wrong</h2>
                            <p className="text-gray-600">We&apos;re sorry for the inconvenience</p>
                            <div className="card-actions justify-center mt-4">
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => window.location.reload()}
                                >
                                    Refresh Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;