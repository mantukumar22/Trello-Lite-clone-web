const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const {
  sendTaskAssignedEmail,
  sendTaskCompletedEmail,
} = require("../services/emailService");

// Reusable function to check if a user is a member of a project
const isMember = (project, userId) => {
  return project.members.some((m) => m.user.toString() === userId.toString());
};

//  CREATE TASK
const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, assigneeEmail, dueDate, labels } =
      req.body;

    // Validate title
    if (!title) {
      return res.status(400).json({ message: "Task title is required" });
    }

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check membership
    if (!isMember(project, req.user.id)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this project" });
    }

    // Find order — how many tasks are already in 'todo' column
    const taskCount = await Task.countDocuments({
      project: projectId,
      status: "todo",
    });

    // Find assignee if email is provided
    let assigneeId = null;
    let assigneeUser = null;

    if (assigneeEmail) {
      assigneeUser = await User.findOne({ email: assigneeEmail });
      if (assigneeUser) {
        assigneeId = assigneeUser._id;
      }
    }

    // Create the task
    const task = await Task.create({
      title,
      description,
      priority: priority || "medium",
      status: "todo",
      order: taskCount,
      project: projectId,
      assignee: assigneeId,
      createdBy: req.user.id,
      dueDate: dueDate || null,
      labels: labels || [],
    });

    // Send email if assignee was found
    if (assigneeUser) {
      await sendTaskAssignedEmail({
        toEmail: assigneeUser.email,
        assigneeName: assigneeUser.name,
        taskTitle: task.title,
        projectName: project.title,
      });
    }

    // Return task with populated fields
    const populatedTask = await task.populate([
      { path: "assignee", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 2. GET ALL TASKS FOR A PROJECT
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find project and check membership
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!isMember(project, req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get all tasks sorted by order
    const tasks = await Task.find({ project: projectId })
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .sort({ order: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  3. GET SINGLE TASK
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignee", "name email")
      .populate("createdBy", "name email")
      .populate("project", "title members");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check membership using the populated project
    if (!isMember(task.project, req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 4. UPDATE TASK 
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check project membership
    const project = await Project.findById(task.project);
    if (!isMember(project, req.user.id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, priority, dueDate, labels, assigneeEmail } =
      req.body;

    // Update only provided fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (labels) task.labels = labels;

    // Handle assignee change
    if (assigneeEmail) {
      const newAssignee = await User.findOne({ email: assigneeEmail });
      if (newAssignee) {
        // Only send email if assignee actually changed
        const assigneeChanged =
          task.assignee?.toString() !== newAssignee._id.toString();

        task.assignee = newAssignee._id;

        if (assigneeChanged) {
          await sendTaskAssignedEmail({
            toEmail: newAssignee.email,
            assigneeName: newAssignee.name,
            taskTitle: task.title,
            projectName: project.title,
          });
        }
      }
    }

    await task.save();

    const updatedTask = await task.populate([
      { path: "assignee", select: "name email" },
      { path: "createdBy", select: "name email" },
    ]);

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 5. MOVE TASK (DRAG & DROP) 
const moveTask = async (req, res) => {
  try {
    const { newStatus, newOrder } = req.body;

    if (!newStatus && newOrder === undefined) {
      return res.status(400).json({ message: 'newStatus and newOrder are required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check membership
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is member
    const memberCheck = project.members.some(
      (m) => m.user.toString() === req.user.id.toString()
    );
    if (!memberCheck) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const oldStatus = task.status;

    task.status = newStatus;
    task.order  = newOrder;

    await task.save();

    // Send email if moved to done
    if (newStatus === 'done' && oldStatus !== 'done' && task.assignee) {
      try {
        const assigneeUser = await User.findById(task.assignee);
        if (assigneeUser) {
          await sendTaskCompletedEmail({
            toEmail:      assigneeUser.email,
            assigneeName: assigneeUser.name,
            taskTitle:    task.title,
            projectName:  project.title
          });
        }
      } catch (emailError) {
        console.error('Email error:', emailError.message);
      }
    }

    // Safe populate
    const updatedTask = await Task.findById(task._id)
      .populate('assignee',  'name email')
      .populate('createdBy', 'name email');

    res.status(200).json(updatedTask);

  } catch (error) {
    console.error('moveTask error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 6. DELETE TASK 
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);

    // Only project owner OR task creator can delete
    const isOwner = project.owner.toString() === req.user.id;
    const isCreator = task.createdBy.toString() === req.user.id;

    if (!isOwner && !isCreator) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  moveTask,
  deleteTask,
};
