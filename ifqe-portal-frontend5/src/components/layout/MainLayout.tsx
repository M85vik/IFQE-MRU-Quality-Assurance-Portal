import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  useEffect(() => {
    document.body.classList.add('portal-theme');
    return () => {
      document.body.classList.remove('portal-theme');
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAF8F1] text-[#334443]">
      {/* Sidebar - visible on desktop */}
      <div className="hidden md:flex bg-[#34656D] text-[#FAF8F1] shadow-lg">
        <Sidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* Sidebar for Mobile - animated overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 h-full z-40 md:hidden bg-[#34656D] text-[#FAF8F1] shadow-lg"
            >
              <Sidebar isCollapsed={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content section */}
      <div className="flex-1 flex flex-col bg-[#FAEAB1]">
        {/* Header */}
        <Header 
          toggleSidebar={toggleSidebar} 
          toggleMobileMenu={toggleMobileMenu} 
        />

        {/* Main content area */}
        <div className="relative flex-1 overflow-y-auto bg-[#FAF8F1] rounded-t-2xl shadow-inner">
          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
