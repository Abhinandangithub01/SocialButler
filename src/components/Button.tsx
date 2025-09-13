import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseClasses = 'px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform hover:-translate-y-0.5';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-brand-primary to-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-500/40 focus:ring-brand-primary',
    secondary: 'bg-base-300/70 text-text-primary hover:bg-base-300 focus:ring-gray-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
