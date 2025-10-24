import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePageRedirect = () => {
  const { isAuthenticated } = useAuth();

  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If user is not authenticated, redirect to login
  return <Navigate to="/login" replace />;
};

export default HomePageRedirect;
