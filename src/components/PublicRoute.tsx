import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Centered>
        <Spinner aria-label="Loading" />
      </Centered>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

const Centered = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #edf2f4;
`;

const Spinner = styled(Loader2)`
  width: 2.5rem;
  height: 2.5rem;
  color: #ef233c;
  animation: spin 1s linear infinite;
`;
