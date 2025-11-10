import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Uso no Router:
// <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
