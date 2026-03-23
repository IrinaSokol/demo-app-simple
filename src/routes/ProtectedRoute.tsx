import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getStoredToken } from '@/api/client';

export function ProtectedRoute() {
  const location = useLocation();
  if (!getStoredToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
