import React from 'react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, UserCircle, Menu } from 'lucide-react';
import Button from '../shared/Button';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, toggleMobileMenu }) => {
  const { userInfo, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="p-4 h-16 flex justify-between items-center sticky top-0 z-20 shadow-md"
      style={{ backgroundColor: '#083D77', color: '#FAF8F1' }}
    >
      {/* Left Menu Buttons */}
      <div className="flex items-center">
        <Button
          onClick={toggleMobileMenu}
       
          size="sm"
          className="md:hidden  transition "
          aria-label="Toggle Menu"
        >
          <Menu size={20} color="#FAF8F1" />
        </Button>

        <Button
          onClick={toggleSidebar}
          
          size="sm"
          className="hidden md:inline-flex  transition"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} color="#FAF8F1" />
        </Button>
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="flex items-center space-x-2 text-right">
          <div>
            <p className="text-sm font-semibold">{userInfo?.name}</p>
            <p className="text-xs opacity-80 capitalize">{userInfo?.role}</p>
          </div>
          <UserCircle size={32} color="#FAF8F1" />
        </div>

        <Button
          onClick={handleLogout}
         
          size="sm"
          className="hover:bg-[#FAF8F1]/10 transition"
          aria-label="Logout"
        >
          <LogOut size={18} color="#FAF8F1" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
