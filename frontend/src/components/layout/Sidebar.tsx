import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  UserPlus,
  Calendar,
  BarChartHorizontal,
  ShieldQuestion,
  FileCheck2,
  AlertCircle,
  Archive,
  Megaphone,
  Trash2
} from 'lucide-react';

const NavItem = ({ to, icon, children, isCollapsed }: { to: string, icon: React.ReactNode, children: React.ReactNode, isCollapsed: boolean }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group ${isCollapsed ? 'justify-center' : ''
      } ${isActive
        ? 'bg-[#083D77] text-[#FAF8F1]'
        : 'text-[#083D77] hover:bg-[#083D77]/10 hover:text-[#083D77]'
      }`
    }
  >
    <div className="transition-transform group-hover:scale-110">{icon}</div>
    {!isCollapsed && <span className="whitespace-nowrap">{children}</span>}
  </NavLink>
);

const Sidebar = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { userInfo } = useAuthStore();

  return (
    <aside
      className={`flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out border-r border-[#083D77]/30 
      ${isCollapsed ? 'w-20' : 'w-64'} bg-[#FAF8F1] text-[#083D77]`}
    >
      <div className="h-16 flex items-center justify-center px-4 border-b border-[#083D77]/30">
        <Link to="/app" className="text-2xl font-bold whitespace-nowrap text-[#083D77]">
          {isCollapsed ? (
            <ShieldQuestion className="text-[#083D77]" />
          ) : (
            <span>IFQE Portal</span>
          )}
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {userInfo?.role === 'department' && (
          <>
            <NavItem to="/app/department/dashboard" icon={<LayoutDashboard size={20} />} isCollapsed={isCollapsed}>
              Dashboard
            </NavItem>
            <NavItem to="/app/department/appeals" icon={<AlertCircle size={20} />} isCollapsed={isCollapsed}>
              Appeals
            </NavItem>
            <NavItem to="/app/department/archives" icon={<Archive size={20} />} isCollapsed={isCollapsed}>
              Archives
            </NavItem>
          </>
        )}

        {userInfo?.role === 'qaa' && (
          <NavItem to="/app/qaa/dashboard" icon={<FileText size={20} />} isCollapsed={isCollapsed}>
            Review Queue
          </NavItem>
        )}

        {userInfo?.role === 'superuser' && (
          <>
            <NavItem to="/app/superuser/approval-queue" icon={<FileCheck2 size={20} />} isCollapsed={isCollapsed}>
              Approval Queue
            </NavItem>
            <NavItem to="/app/superuser/appeal-queue" icon={<AlertCircle size={20} />} isCollapsed={isCollapsed}>
              Appeal Queue
            </NavItem>
          </>
        )}

        {userInfo?.role === 'admin' && (
          <>
            <NavItem to="/app/admin/dashboard" icon={<BarChart2 size={20} />} isCollapsed={isCollapsed}>
              Analytics Overview
            </NavItem>
            <NavItem to="/app/admin/comparison" icon={<BarChartHorizontal size={20} />} isCollapsed={isCollapsed}>
              Indicator Comparison
            </NavItem>
            <NavItem to="/app/admin/users" icon={<UserPlus size={20} />} isCollapsed={isCollapsed}>
              User Management
            </NavItem>
            <NavItem to="/app/admin/windows" icon={<Calendar size={20} />} isCollapsed={isCollapsed}>
              Manage Windows
            </NavItem>
            <NavItem to="/app/admin/content" icon={<Megaphone size={20} />} isCollapsed={isCollapsed}>
              Manage Content
            </NavItem>
            <NavItem to="/app/admin/deletion" icon={<Trash2 size={20} />} isCollapsed={isCollapsed}>
              Deletion
            </NavItem>

            <NavItem to="/app/admin/activity-logs" icon={<FileText size={20} />} isCollapsed={isCollapsed}>
              Activity Logs
            </NavItem>

          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
