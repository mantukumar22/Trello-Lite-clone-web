import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';

const BoardView = ({
  project,
  organizedTasks,
  onDragEnd,
  onTaskClick,
  onDeleteTask,
  onCreateTask,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-5 items-start min-w-max">
        {project?.columns?.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={organizedTasks[column.id] || []}
            onTaskClick={onTaskClick}
            onDeleteTask={onDeleteTask}
            onCreateTask={onCreateTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default BoardView;