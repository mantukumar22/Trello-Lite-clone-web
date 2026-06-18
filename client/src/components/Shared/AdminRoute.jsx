import { Navigate, Outlet } from 'react-router-dom';
import toast                from 'react-hot-toast';
import useAuthStore         from '../../store/authStore';
import { useEffect }        from 'react';

const AdminRoute = () => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Access denied. Admins only.');
    }
  }, [user]);

  return user?.role === 'admin'
    ? <Outlet />
    : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;