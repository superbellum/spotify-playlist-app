import { Outlet, Navigate } from 'react-router-dom';

export default function ProtectedRoute() {
  const isAuthenticated = sessionStorage.getItem('access_token');
  console.log("isAuthenticated: ", isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}