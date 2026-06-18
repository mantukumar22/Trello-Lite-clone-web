import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/Shared/ProtectedRoute';
import AdminRoute     from './components/Shared/AdminRoute';

import Login        from './components/Auth/Login';
import Register     from './components/Auth/Register';
import Dashboard    from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';
import AdminPanel   from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>

        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/"             element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/projects/:id" element={<ProjectBoard />} />

          {/* Admin only routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;