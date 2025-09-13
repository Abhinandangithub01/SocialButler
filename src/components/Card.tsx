import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-base-200/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-base-300/50 shadow-2xl shadow-black/20 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-text-primary tracking-tight">{title}</h2>
      {children}
    </div>
  );
};

export default Card;
