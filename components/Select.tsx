import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly string[];
}

const Select: React.FC<SelectProps> = ({ options, className = '', ...props }) => {
  return (
    <div className="relative">
      <select
        className={`w-full bg-base-300/50 border border-base-300 rounded-lg px-4 py-2.5 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-colors duration-300 appearance-none ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option} value={option} className="bg-base-200">{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
  );
};

export default Select;