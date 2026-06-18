import { useState } from "react";
import toast from "react-hot-toast";
import taskService from "../../services/taskService";

const priorityStyles = {
  high: "bg-red-100 text-red-600",
  medium: "bg-yellow-100 text-yellow-600",
  low: "bg-green-100 text-green-600",
};

const TaskDetailModal = ({ task, onClose, onTaskUpdated, onDeleteTask }) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);
      const updated = await taskService.updateTask(task._id, {
        title,
        description,
        priority,
      });
      onTaskUpdated(updated);
      setEditMode(false);
    } catch (error) {
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No due date";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            {editMode ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xl font-bold text-gray-800 border-b-2 border-indigo-400 focus:outline-none pb-1"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4">
          {/* Priority */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 w-24">
              Priority
            </span>
            {editMode ? (
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            ) : (
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${priorityStyles[task.priority]}`}
              >
                {task.priority}
              </span>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 w-24">
              Status
            </span>
            <span className="text-sm text-gray-700 capitalize">
              {task.status === "inprogress" ? "In Progress" : task.status}
            </span>
          </div>

          {/* Assignee */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 w-24">
              Assignee
            </span>
            {task.assignee ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                  {task.assignee.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-700">
                  {task.assignee.name}
                </span>
                <span className="text-xs text-gray-400">
                  ({task.assignee.email})
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Unassigned</span>
            )}
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 w-24">
              Due Date
            </span>
            <span
              className={`text-sm ${task.dueDate && new Date(task.dueDate) < new Date() ? "text-red-500 font-medium" : "text-gray-700"}`}
            >
              {formatDate(task.dueDate)}
            </span>
          </div>

          {/* Created By */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 w-24">
              Created by
            </span>
            <span className="text-sm text-gray-700">
              {task.createdBy?.name || "Unknown"}
            </span>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-sm font-medium text-gray-500">
              Description
            </span>
            {editMode ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Add a description..."
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 min-h-16">
                {task.description || "No description provided."}
              </p>
            )}
          </div>

          {/* Labels */}
          {task.labels?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-500 w-24">
                Labels
              </span>
              {task.labels.map((label, i) => (
                <span
                  key={i}
                  className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full"
                >
                  {label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 mt-6">
          {/* Delete */}
          <button
            onClick={() => onDeleteTask(task._id)}
            className="px-4 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition"
          >
            Delete
          </button>
          {user?.role !== "viewer" && (
            <div className="flex gap-2 ml-auto">
              {editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition"
                >
                  Edit Task
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
