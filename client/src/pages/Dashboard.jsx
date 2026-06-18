import { useState, useEffect } from 'react';
import toast                   from 'react-hot-toast';

import Navbar              from '../components/Shared/Navbar';
import Spinner             from '../components/Shared/Spinner';
import EmptyState          from '../components/Shared/EmptyState';
import ProjectCard         from '../components/Board/ProjectCard';
import CreateProjectModal  from '../components/Modals/CreateProjectModal';

import projectService from '../services/projectService';
import useAuthStore   from '../store/authStore';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);

  const [projects,   setProjects]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);

  // Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAllProjects();
        setProjects(data);

      } catch (error) {
        toast.error('Failed to load projects');

      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Add new project to list instantly
  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  // Delete project from list
  const handleDelete = async (projectId) => {
    const confirm = window.confirm('Are you sure you want to delete this project and all its tasks?');
    if (!confirm) return;

    try {
      await projectService.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      toast.success('Project deleted');

    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              My Projects
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Welcome back, {user?.name} 👋
            </p>
          </div>

          {/* Only admin can create projects */}
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="
                px-5 py-2.5
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                font-semibold
                text-sm
                rounded-lg
                transition
              "
            >
              + New Project
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-20">
            <Spinner size="lg" />
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <EmptyState
            message="No projects yet. Create your first project!"
            actionLabel={user?.role === 'admin' ? '+ New Project' : null}
            onAction={() => setShowModal(true)}
          />
        )}

        {/* Projects grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={handleDelete}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}

      </div>

      {/* Create Project Modal */}
      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}

    </div>
  );
};

export default Dashboard;