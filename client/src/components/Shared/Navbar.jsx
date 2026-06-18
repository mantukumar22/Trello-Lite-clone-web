import { useNavigate, Link } from 'react-router-dom';
import toast                 from 'react-hot-toast';
import useAuthStore          from '../../store/authStore';
import authService           from '../../services/authService';

const roleBadgeStyles = {
  admin:  'bg-blue-900 text-blue-100',
  member: 'bg-blue-200 text-blue-800',
  viewer: 'bg-blue-100 text-blue-500',
};

const Navbar = () => {
  const navigate            = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try { await authService.logout(); } catch {}
    finally {
      clearAuth();
      toast.success('Logged out');
      navigate('/login');
    }
  };

  return (
    <nav className="bg-linear-to-r from-blue-900 to-blue-700 px-6 py-3 flex items-center justify-between shadow-lg">

      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-400 bg-opacity-30 rounded-lg flex items-center justify-center">
          <span className="text-lg">📋</span>
        </div>
        <span className="text-xl font-bold text-white">Trello Lite</span>
      </Link>

      {/* Center links */}
      <div className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className="text-sm text-blue-200 hover:text-white font-medium transition"
        >
          Dashboard
        </Link>
        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className="
              text-sm font-semibold
              bg-blue-400 bg-opacity-20
              hover:bg-opacity-30
              text-white px-3 py-1
              rounded-lg transition
            "
          >
            ⚙ Admin Panel
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Role badge */}
        <span className={`
          hidden sm:inline-block
          text-xs font-bold px-2.5 py-1
          rounded-full capitalize
          ${roleBadgeStyles[user?.role] || ''}
        `}>
          {user?.role}
        </span>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="
            w-8 h-8 rounded-full
            bg-blue-400 text-blue-900
            flex items-center justify-center
            font-bold text-sm
          ">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block text-sm font-medium text-blue-100">
            {user?.name}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            text-sm px-4 py-1.5
            border border-blue-400
            text-blue-100
            rounded-lg
            hover:bg-blue-600
            transition
          "
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;