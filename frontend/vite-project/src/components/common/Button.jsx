/* eslint-disable react/prop-types */
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    to,
    href,
    loading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    leftIcon,
    rightIcon,
    ...props
}, ref) => {
    // Base classes
    const baseClasses = 'btn';
    
    // Variant classes
    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        accent: 'btn-accent',
        ghost: 'btn-ghost',
        link: 'btn-link',
        outline: 'btn-outline',
        error: 'btn-error',
        success: 'btn-success',
        warning: 'btn-warning',
        info: 'btn-info'
    };

    // Size classes
    const sizeClasses = {
        xs: 'btn-xs',
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg'
    };

    // Combine classes
    const classes = [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        loading ? 'loading' : '',
        className
    ].filter(Boolean).join(' ');

    // Render content
    const content = (
        <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
    );

    // If it's a Link
    if (to) {
        return (
            <Link
                to={to}
                className={classes}
                ref={ref}
                {...props}
            >
                {content}
            </Link>
        );
    }

    // If it's an external link
    if (href) {
        return (
            <a
                href={href}
                className={classes}
                ref={ref}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {content}
            </a>
        );
    }

    // Regular button
    return (
        <button
            className={classes}
            disabled={disabled || loading}
            ref={ref}
            {...props}
        >
            {content}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;