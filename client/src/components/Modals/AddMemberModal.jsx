import { useState } from 'react';
import toast        from 'react-hot-toast';
import projectService from '../../services/projectService';

const AddMemberModal = ({ projectId, onClose, onMemberAdded }) => {
  const [email,   setEmail]   = useState('');
  const [role,    setRole]    = useState('member');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    try {
      setLoading(true);
      const updated = await projectService.addMember(projectId, { email, role });
      toast.success(`Member added successfully!`);
      onMemberAdded(updated);
      onClose();

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add member';
      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-blue-900">Add Member</h2>
            <p className="text-sm text-blue-400 mt-0.5">
              Invite someone to this project
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-blue-800">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="member@example.com"
              className="
                px-4 py-2.5
                border-2 border-blue-100
                rounded-xl text-sm
                text-blue-900
                placeholder-blue-300
                bg-blue-50
                focus:outline-none
                focus:border-blue-400
                focus:bg-white
                transition-all duration-200
              "
            />
            <p className="text-xs text-blue-400">
              The user must already have a registered account.
            </p>
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-blue-800">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="
                px-4 py-2.5
                border-2 border-blue-100
                rounded-xl text-sm
                text-blue-900
                bg-blue-50
                focus:outline-none
                focus:border-blue-400
                focus:bg-white
                transition-all duration-200
              "
            >
              <option value="member">👤 Member — Can create and edit tasks</option>
              <option value="viewer">👁 Viewer — Can only view tasks</option>
              <option value="admin">⚙️ Admin — Full access</option>
            </select>
          </div>

          {/* Role descriptions */}
          <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-600 flex flex-col gap-1">
            <p>👤 <strong>Member</strong> — Create, edit, move tasks</p>
            <p>👁 <strong>Viewer</strong> — View only, no changes</p>
            <p>⚙️ <strong>Admin</strong> — Full project control</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 py-2.5
                border-2 border-blue-100
                text-blue-600 font-medium
                rounded-xl hover:bg-blue-50 transition
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 py-2.5
                bg-linear-to-r from-blue-700 to-blue-500
                hover:from-blue-800 hover:to-blue-600
                text-white font-semibold
                rounded-xl transition
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-md
              "
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;