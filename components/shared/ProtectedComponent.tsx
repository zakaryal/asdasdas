
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedComponentProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedComponent;
