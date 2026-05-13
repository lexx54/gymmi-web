import type { ReactNode } from 'react';
import { useHasPermission } from '../hooks/usePermissions';

type CanProps = {
  resource: string;
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
};

/**
 * Conditionally renders children when the current user has the given permission.
 */
export function Can({ resource, action, children, fallback = null }: CanProps) {
  const allowed = useHasPermission(resource, action);
  return <>{allowed ? children : fallback}</>;
}
