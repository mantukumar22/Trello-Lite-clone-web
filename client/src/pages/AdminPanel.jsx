import { useState, useEffect } from 'react';
import { Link }                from 'react-router-dom';
import toast                   from 'react-hot-toast';
import Navbar                  from '../components/Shared/Navbar';
import Spinner                 from '../components/Shared/Spinner';
import adminService            from '../services/adminService';
import useAuthStore            from '../store/authStore';

const roleBadgeStyles = {
  admin:  'bg-red-100 text-red-600',
  member: 'bg-blue-100 text-blue-600',
  viewer: 'bg-gray-100 text-gray-600',
};

const AdminPanel = () => {
  const { user: currentUser }       = useAuthStore();
  const [users,   setUsers]         = useState([]);
  const [stats,   setStats]         = useState(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, statsData] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getStats()
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch (error) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, role: newRole } : u
        )
      );
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update role';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to="/dashboard"
              className="text-sm text-indigo-600 hover:underline mb-1 block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage users and roles
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* Stats cards */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Users', value: stats.total,   color: 'bg-indigo-50 text-indigo-600' },
                  { label: 'Admins',      value: stats.admins,  color: 'bg-red-50 text-red-600'       },
                  { label: 'Members',     value: stats.members, color: 'bg-blue-50 text-blue-600'     },
                  { label: 'Viewers',     value: stats.viewers, color: 'bg-gray-50 text-gray-600'     },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`${stat.color} rounded-2xl p-4 text-center`}
                  >
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm font-medium mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Users table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">
                  All Users ({users.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                    <tr>
                      <th className="px-6 py-3 text-left">User</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Current Role</th>
                      <th className="px-6 py-3 text-left">Change Role</th>
                      <th className="px-6 py-3 text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition"
                      >
                        {/* Avatar + Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="
                              w-8 h-8 rounded-full
                              bg-indigo-100 text-indigo-600
                              flex items-center justify-center
                              font-bold text-sm shrink-0
                            ">
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {user.name}
                              </p>
                              {user._id === currentUser?.id && (
                                <span className="text-xs text-indigo-500">
                                  (You)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-gray-500">
                          {user.email}
                        </td>

                        {/* Current Role Badge */}
                        <td className="px-6 py-4">
                          <span className={`
                            text-xs font-semibold
                            px-3 py-1 rounded-full capitalize
                            ${roleBadgeStyles[user.role]}
                          `}>
                            {user.role}
                          </span>
                        </td>

                        {/* Role Dropdown */}
                        <td className="px-6 py-4">
                          {user._id === currentUser?.id ? (
                            <span className="text-xs text-gray-400 italic">
                              Cannot change own role
                            </span>
                          ) : (
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(user._id, e.target.value)
                              }
                              className="
                                text-sm border border-gray-200
                                rounded-lg px-3 py-1.5
                                focus:outline-none
                                focus:ring-2 focus:ring-indigo-500
                                bg-white cursor-pointer
                              "
                            >
                              <option value="admin">Admin</option>
                              <option value="member">Member</option>
                              <option value="viewer">Viewer</option>
                            </select>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day:   'numeric',
                            year:  'numeric'
                          })}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;