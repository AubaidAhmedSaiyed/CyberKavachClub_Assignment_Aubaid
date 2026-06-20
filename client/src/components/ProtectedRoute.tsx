import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/rbac';

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-primary">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Base path resolution for dynamic params (e.g. /dashboard/events/123 -> /dashboard/events)
  const basePath = location.pathname.split('/').slice(0, 3).join('/');
  
  if (!hasPermission(user.role, basePath)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
