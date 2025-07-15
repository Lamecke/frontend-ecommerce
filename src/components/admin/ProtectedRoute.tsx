import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !userInfo.isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Alert variant="destructive">
          <AlertDescription>
            Acesso negado. Você precisa ser um administrador para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

