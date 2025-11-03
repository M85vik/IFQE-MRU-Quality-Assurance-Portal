// src/components/layout/WebsiteLayout.tsx

import React from 'react';
import Navbar from '../landing/Navbar';
import Footer from '../landing/Footer';

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({ children }) => {
  React.useEffect(() => {
    // Ensure consistent theme and scroll to top on page load
    document.body.classList.add('light-theme');
    window.scrollTo(0, 0);
    return () => {
      document.body.classList.remove('light-theme');
    };
  }, []);

  return (
    <div className="bg-white">
      <Navbar />
      <main className="pt-20"> {/* pt-20 to offset the fixed navbar height */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteLayout;