import { useState }          from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast                 from 'react-hot-toast';
import authService           from '../../services/authService';
import useAuthStore          from '../../store/authStore';
import InputField            from '../Shared/InputField';

const Login = () => {
  const navigate = useNavigate();
  const setAuth  = useAuthStore((state) => state.setAuth);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }
    try {
      setLoading(true);
      const data = await authService.login(email, password);
      setAuth(data.user, data.accessToken);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-r from-blue-900 via-blue-800 to-blue-600 flex-col items-center justify-center p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-400 bg-opacity-30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📋</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Trello Lite</h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm">
            Manage your projects and tasks beautifully with drag and drop simplicity.
          </p>

          {/* Feature list */}
          <div className="mt-10 flex flex-col gap-4 text-left">
            {[
              '📁  Organize projects your way',
              '🖱️  Drag & drop task management',
              '👥  Collaborate with your team',
              '📧  Email notifications built-in',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-100 text-sm">
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 bg-blue-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900">Trello Lite</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900">Welcome back</h2>
              <p className="text-blue-400 mt-1 text-sm">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <InputField
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-3 mt-2
                  bg-linear-to-r from-blue-700 to-blue-500
                  hover:from-blue-800 hover:to-blue-600
                  text-white font-semibold rounded-xl
                  transition-all duration-200
                  shadow-md hover:shadow-lg
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <p className="text-center text-sm text-blue-400 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-700 font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;