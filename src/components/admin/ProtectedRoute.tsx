import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { RootState } from '@/store/store';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

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

  return <>{children}</>;
};

export default ProtectedRoute;
