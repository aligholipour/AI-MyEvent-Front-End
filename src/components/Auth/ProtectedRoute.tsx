import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  console.log('ProtectedRoute rendering...');

  const { isAuthenticated, isLoading } = useAuth();

  console.log('isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to home');

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;

}

export default ProtectedRoute;