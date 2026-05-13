import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type RoleRouteProps = {
  role: string;
  children: ReactNode;
  redirectTo?: string;
};

/**
 * Route guard that only renders children when the current user's role matches.
 */
export function RoleRoute({ role, children, redirectTo = '/dashboard' }: RoleRouteProps) {
  const { user } = useAuth();
  if (!user?.role || user.role.name !== role) {
    return <Navigate to={redirectTo} replace />;
  }
  return <>{children}</>;
}
