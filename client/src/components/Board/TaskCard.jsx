import { Draggable } from "@hello-pangea/dnd";

const priorityStyles = {
  high: "bg-red-100 text-red-600",
  medium: "bg-yellow-100 text-yellow-600",
  low: "bg-green-100 text-green-600",
};

const TaskCard = ({ task, index, onTaskClick, onDeleteTask }) => {
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onTaskClick(task)}
          className={`
            bg-white rounded-xl p-3
            shadow-sm border border-gray-100
            cursor-pointer group
            transition-all duration-150
            ${
              snapshot.isDragging
                ? "shadow-lg rotate-1 scale-105 border-indigo-300"
                : "hover:shadow-md hover:border-indigo-200"
            }
          `}
        >
          {/* Top row — priority + delete */}
          <div className="flex items-start justify-between gap-2 mb-2">
            {/* Priority badge */}
            <span
              className={`
              text-xs font-semibold px-2 py-0.5
              rounded-full capitalize
              ${priorityStyles[task.priority] || priorityStyles.medium}
            `}
            >
              {task.priority}
            </span>

            {/* Delete button — visible on hover */}
            {user?.role !== "viewer" && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening detail modal
                  onDeleteTask(task._id);
                }}
                className="
                opacity-0 group-hover:opacity-100
                text-gray-300 hover:text-red-500
                transition text-sm leading-none
              "
              >
                ✕
              </button>
            )}
          </div>

          {/* Task title */}
          <p className="text-sm font-semibold text-gray-800 leading-snug mb-2">
            {task.title}
          </p>

          {/* Labels */}
          {task.labels?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.labels.map((label, i) => (
                <span
                  key={i}
                  className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full"
                >
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* Bottom row — assignee + due date */}
          <div className="flex items-center justify-between mt-2">
            {/* Assignee avatar */}
            {task.assignee ? (
              <div className="flex items-center gap-1.5">
                <div
                  className="
                  w-6 h-6 rounded-full
                  bg-indigo-100 text-indigo-600
                  flex items-center justify-center
                  text-xs font-bold shrink-0
                "
                >
                  {task.assignee.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-gray-400 truncate max-w-20">
                  {task.assignee.name}
                </span>
              </div>
            ) : (
              <span className="text-xs text-gray-300">Unassigned</span>
            )}

            {/* Due date */}
            {dueDate && (
              <span
                className={`
                text-xs font-medium
                ${isOverdue ? "text-red-500" : "text-gray-400"}
              `}
              >
                📅 {dueDate}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
