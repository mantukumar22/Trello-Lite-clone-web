import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Shared/Navbar";
import Spinner from "../components/Shared/Spinner";
import BoardView from "../components/Board/BoardView";
import CreateTaskModal from "../components/Modals/CreateTaskModal";
import TaskDetailModal from "../components/Modals/TaskDetailModal";
import projectService from "../services/projectService";
import taskService from "../services/taskService";
import useAuthStore from "../store/authStore";

// Group flat tasks array into object by status
const organizeTasks = (tasks, columns) => {
  const organized = {};
  columns.forEach((col) => {
    organized[col.id] = tasks
      .filter((t) => t.status === col.id)
      .sort((a, b) => a.order - b.order);
  });
  return organized;
};

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [organizedTasks, setOrganizedTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch project + tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectData, tasksData] = await Promise.all([
          projectService.getProjectById(id),
          taskService.getTasksByProject(id),
        ]);
        setProject(projectData);
        setTasks(tasksData);
        setOrganizedTasks(organizeTasks(tasksData, projectData.columns));
      } catch (error) {
        toast.error("Failed to load board");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Called when drag ends
  const onDragEnd = useCallback(
    async (result) => {
      const { destination, source, draggableId } = result;

      // Dropped outside any column
      if (!destination) return;

      // Dropped in same position
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return;

      const taskId = draggableId;
      const newStatus = destination.droppableId;
      const newOrder = destination.index;
      const oldStatus = source.droppableId;
      const oldIndex = source.index;

      // --- OPTIMISTIC UPDATE ---
      // Remove task from old column
      const oldColumnTasks = [...organizedTasks[oldStatus]];
      const [movedTask] = oldColumnTasks.splice(oldIndex, 1);

      // Insert into new column
      const newColumnTasks =
        oldStatus === newStatus
          ? oldColumnTasks
          : [...(organizedTasks[newStatus] || [])];

      newColumnTasks.splice(newOrder, 0, {
        ...movedTask,
        status: newStatus,
        order: newOrder,
      });

      // Update organized tasks state immediately
      setOrganizedTasks((prev) => ({
        ...prev,
        [oldStatus]: oldStatus === newStatus ? newColumnTasks : oldColumnTasks,
        [newStatus]: newColumnTasks,
      }));

      // --- PERSIST TO BACKEND ---
      try {
        await taskService.moveTask(taskId, { newStatus, newOrder });
      } catch (error) {
        // Revert on failure
        toast.error("Failed to move task");
        setOrganizedTasks(organizeTasks(tasks, project.columns));
      }
    },
    [organizedTasks, tasks, project],
  );

  // Add new task to board
  const handleTaskCreated = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    setOrganizedTasks(organizeTasks(updatedTasks, project.columns));
    toast.success("Task created!");
  };

  // Update task in board
  const handleTaskUpdated = (updatedTask) => {
    const updatedTasks = tasks.map((t) =>
      t._id === updatedTask._id ? updatedTask : t,
    );
    setTasks(updatedTasks);
    setOrganizedTasks(organizeTasks(updatedTasks, project.columns));
    setSelectedTask(updatedTask);
    toast.success("Task updated!");
  };

  // Delete task from board
  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;

    try {
      await taskService.deleteTask(taskId);
      const updatedTasks = tasks.filter((t) => t._id !== taskId);
      setTasks(updatedTasks);
      setOrganizedTasks(organizeTasks(updatedTasks, project.columns));
      setSelectedTask(null);
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Board header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm text-indigo-600 hover:underline mb-1 block"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-800">{project?.title}</h1>
          {project?.description && (
            <p className="text-sm text-gray-500 mt-0.5">
              {project.description}
            </p>
          )}
        </div>

        {/* Hide Add Task button for viewers */}
        {user?.role !== "viewer" && (
          <button
            onClick={() => setShowCreateTask(true)}
            className="
                  px-4 py-2
                  bg-indigo-600 hover:bg-indigo-700
                  text-white text-sm font-semibold
                  rounded-lg transition
                  "
          >
            + Add Task
          </button>
        )}
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <BoardView
          project={project}
          organizedTasks={organizedTasks}
          onDragEnd={onDragEnd}
          onTaskClick={(task) => setSelectedTask(task)}
          onDeleteTask={handleDeleteTask}
          onCreateTask={() => setShowCreateTask(true)}
        />
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          projectId={id}
          onClose={() => setShowCreateTask(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default ProjectBoard;
