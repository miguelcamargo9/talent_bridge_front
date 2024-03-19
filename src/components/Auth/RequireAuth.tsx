import React from 'react';
import { Navigate } from 'react-router-dom';

type RequireAuthProps = {
  children: JSX.Element;
};

const RequireAuth = ({ children }: RequireAuthProps) => {
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default RequireAuth;