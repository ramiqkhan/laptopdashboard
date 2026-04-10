import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Check if the user is logged in
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  // If not authenticated, send them back to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;