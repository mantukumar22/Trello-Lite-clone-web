import { Droppable } from '@hello-pangea/dnd';
import TaskCard      from './TaskCard';

// Column header colors
const columnStyles = {
  todo:       { header: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700'   },
  inprogress: { header: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700' },
  done:       { header: 'bg-green-500',  badge: 'bg-green-100 text-green-700'  },
};

const Column = ({ column, tasks, onTaskClick, onDeleteTask, onCreateTask }) => {
  const style = columnStyles[column.id] || {
    header: 'bg-gray-500',
    badge:  'bg-gray-100 text-gray-700'
  };

  return (
    <div className="flex flex-col w-72 bg-gray-100 rounded-2xl overflow-hidden shadow-sm">

      {/* Column header */}
      <div className={`${style.header} px-4 py-3 flex items-center justify-between`}>
        <h3 className="text-white font-semibold text-sm tracking-wide">
          {column.title}
        </h3>
        <span className={`
          ${style.badge}
          text-xs font-bold
          px-2 py-0.5 rounded-full
        `}>
          {tasks.length}
        </span>
      </div>

      {/* Droppable task list */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex flex-col gap-2 p-3 min-h-32
              transition-colors duration-150
              ${snapshot.isDraggingOver ? 'bg-indigo-50' : 'bg-gray-100'}
            `}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onTaskClick={onTaskClick}
                onDeleteTask={onDeleteTask}
              />
            ))}

            {/* Required by dnd — keeps space when dragging */}
            {provided.placeholder}

            {/* Empty column hint */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-center text-gray-400 text-xs py-4">
                No tasks yet
              </p>
            )}
          </div>
        )}
      </Droppable>

      {/* Add task button */}
      <button
        onClick={onCreateTask}
        className="
          mx-3 mb-3 py-2
          border-2 border-dashed border-gray-300
          text-gray-400 text-sm
          rounded-xl
          hover:border-indigo-400 hover:text-indigo-500
          transition
        "
      >
        + Add Task
      </button>

    </div>
  );
};

export default Column;