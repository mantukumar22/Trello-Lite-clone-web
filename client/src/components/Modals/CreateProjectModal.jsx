import { useState } from 'react';
import toast        from 'react-hot-toast';
import projectService from '../../services/projectService';

const CreateProjectModal = ({ onClose, onProjectCreated }) => {
  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [loading,     setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Project title is required');
      return;
    }

    try {
      setLoading(true);
      const newProject = await projectService.createProject({ title, description });
      toast.success('Project created!');
      onProjectCreated(newProject);
      onClose();

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      {/* Modal box — stop click from closing when clicking inside */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Create New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Title */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="
                w-full px-4 py-2.5
                border border-gray-300
                rounded-lg text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project about?"
              rows={3}
              className="
                w-full px-4 py-2.5
                border border-gray-300
                rounded-lg text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                resize-none
              "
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 py-2.5
                border border-gray-300
                text-gray-600
                rounded-lg
                font-medium
                hover:bg-gray-50
                transition
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 py-2.5
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                font-semibold
                rounded-lg
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;