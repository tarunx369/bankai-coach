import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SkeletonBlock } from './Skeleton';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-50 dark:bg-ink-950">
        <SkeletonBlock className="w-32 h-32 rounded-full" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
