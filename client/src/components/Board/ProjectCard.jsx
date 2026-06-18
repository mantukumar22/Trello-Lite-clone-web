import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, onDelete, currentUserId }) => {
  const navigate  = useNavigate();
  const isOwner   = project.owner?._id === currentUserId ||
                    project.owner === currentUserId;

  // Format date
  const createdAt = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });

  return (
    <div className="
      bg-white
      rounded-2xl
      shadow-sm
      border border-gray-100
      p-5
      flex flex-col
      gap-3
      hover:shadow-md
      hover:-translate-y-0.5
      transition-all
      duration-200
    ">

      {/* Top row — title + delete */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-gray-800 leading-tight">
          {project.title}
        </h3>

        {isOwner && (
          <button
            onClick={() => onDelete(project._id)}
            className="
              text-gray-300
              hover:text-red-500
              transition
              shrink-0
              text-lg
              leading-none
            "
            title="Delete project"
          >
            🗑
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
        {project.description || 'No description provided.'}
      </p>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>👥 {project.members?.length || 1} member{project.members?.length !== 1 ? 's' : ''}</span>
        <span>📅 {createdAt}</span>
      </div>

      {/* Owner badge */}
      {isOwner && (
        <span className="
          self-start
          text-xs
          bg-indigo-50
          text-indigo-600
          font-medium
          px-2 py-0.5
          rounded-full
        ">
          Owner
        </span>
      )}

      {/* Open Board button */}
      <button
        onClick={() => navigate(`/projects/${project._id}`)}
        className="
          mt-auto
          w-full py-2
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          text-sm
          font-semibold
          rounded-lg
          transition
        "
      >
        Open Board →
      </button>

    </div>
  );
};

export default ProjectCard;