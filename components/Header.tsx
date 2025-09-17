
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, ChevronDownIcon } from './icons';
import NotificationBell from './NotificationBell';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path || path === 'dashboard') return 'Dashboard';
    if (path === 'projects') return 'Projects';
    if (path === 'reports') return 'Reports';
    return 'CiviCost';
  };

  return (
    <header className="bg-white shadow-sm h-20 flex items-center justify-between px-8 z-10">
      <h1 className="text-2xl font-semibold text-slate-800">{getPageTitle()}</h1>
      <div className="flex items-center space-x-2">
        <NotificationBell />
        <div className="relative">
          <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100">
            <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="text-left">
                <div className="font-semibold text-slate-700 text-sm">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-slate-400" />
          </button>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          title="Logout"
        >
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
