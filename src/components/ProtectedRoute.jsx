import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function ProtectedRoute() {
  const { accessToken } = useAuth();

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}