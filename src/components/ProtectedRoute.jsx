import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if we have ANY supabase auth token in localStorage
  const hasAuthToken = () => {
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
          const value = localStorage.getItem(key);
          if (value && value.includes('access_token')) {
            return true;
          }
        }
      }
    } catch (e) {
      console.error('Error checking auth:', e);
    }
    return false;
  };

  // Must have valid auth token
  if (!hasAuthToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
