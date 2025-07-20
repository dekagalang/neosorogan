
import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Navigate } from 'react-router-dom';

const Index = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect based on user role
  switch (userRole) {
    case 'student':
      return <Navigate to="/dashboard/student" replace />;
    case 'teacher':
      return <Navigate to="/dashboard/teacher" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

export default Index;
