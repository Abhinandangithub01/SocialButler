
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-base-100 text-text-primary">
      {children}
    </div>
  );
};

export default Layout;
