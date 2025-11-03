// src/components/landing/Navbar.tsx

import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, LogIn, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DropdownNavItem = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center space-x-1 px-1 py-2 text-sm font-semibold text-foreground hover:text-primary-DEFAULT transition-colors duration-300">
        <span>{title}</span>
        <ChevronDown size={16} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-lg shadow-lg border border-muted-DEFAULT z-50 overflow-hidden"
          >
            <div className="py-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ to, children }: { to: string, children: React.ReactNode }) => (
    <NavLink
      to={to}
      className="relative px-1 py-2 text-sm font-semibold text-foreground hover:text-primary-DEFAULT transition-colors duration-300"
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && (
            <motion.div
              className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"
              layoutId="underline"
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          )}
        </>
      )}
    </NavLink>
  );

  const DropdownLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
    <NavLink
      to={to}
      className={({ isActive }) => `block px-4 py-2 text-sm font-semibold transition-colors border-l-4 ${isActive ? 'border-red-500 bg-red-500/10 text-red-600' : 'border-transparent text-foreground hover:bg-muted-DEFAULT'}`}
    >
      {children}
    </NavLink>
  );

  return (
    <nav className="bg-slate-100/80 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          <Link to="/" className="flex items-center space-x-2">
            <img src="/mru-logo.png" alt="Manav Rachna University Logo" className="h-11" />
          </Link>

          <div className="hidden lg:flex items-center space-x-8">

            <DropdownNavItem title="About">
              <DropdownLink to="/about-mru">About MRU</DropdownLink>
              <DropdownLink to="/qaa">Office of QAA</DropdownLink>
            </DropdownNavItem>

            <NavItem to="/criteria">IFQE</NavItem>
            
            <NavItem to="/leadership-messages">Our Leadership & Governance</NavItem>

            <DropdownNavItem title="Our Team">
              <DropdownLink to="/faculty-team">Steering Group</DropdownLink>
              <DropdownLink to="/developing-team">DEVs</DropdownLink>
            </DropdownNavItem>
          </div>

          <div className="hidden lg:flex">
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-sky-500 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <LogIn size={18} /> Login
            </Link>
          </div>

          <button className="lg:hidden text-foreground p-2" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content (omitted for brevity, remains the same) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="absolute right-0 top-0 h-full w-11/12 max-w-xs bg-white shadow-lg p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Menu Content Here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;