import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChartPieIcon, BuildingOfficeIcon, DocumentTextIcon, SparklesIcon, UsersIcon } from './icons';
import ProtectedComponent from './shared/ProtectedComponent';
import { UserRole } from '../types';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: ChartPieIcon, roles: [UserRole.Admin, UserRole.ProjectManager, UserRole.Contractor] },
  { name: 'Projects', href: '/projects', icon: BuildingOfficeIcon, roles: [UserRole.Admin, UserRole.ProjectManager, UserRole.Contractor] },
  { name: 'Team', href: '/team', icon: UsersIcon, roles: [UserRole.Admin, UserRole.ProjectManager] },
  { name: 'Reports', href: '/reports', icon: DocumentTextIcon, roles: [UserRole.Admin, UserRole.ProjectManager] },
  { name: 'Cost Intelligence', href: '/intelligence', icon: SparklesIcon, roles: [UserRole.Admin, UserRole.ProjectManager] },
];

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 bg-slate-900 text-slate-100">
      <div className="flex items-center justify-center h-20 border-b border-slate-800">
        <BuildingOfficeIcon className="h-8 w-8 text-primary-400" />
        <h1 className="text-2xl font-bold ml-2">CiviCost</h1>
      </div>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <ProtectedComponent key={item.name} allowedRoles={item.roles}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-6 w-6" aria-hidden="true" />
                {item.name}
              </NavLink>
            </ProtectedComponent>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;