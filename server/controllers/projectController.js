const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const defaultColumns = [
      { id: "todo", title: "To Do" },
      { id: "inprogress", title: "In Progress" },
      { id: "done", title: "Done" },
    ];

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
      columns: defaultColumns,
      members: [{ user: req.user.id, role: "admin" }],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// GET ALL PROJECTS (where logged-in user is a member)
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user.id,
    }).populate("owner", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET SINGLE PROJECT
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if logged-in user is a member
    const isMember = project.members.some(
      (m) => m.user._id.toString() === req.user.id,
    );

    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can update
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the owner can update this project" });
    }

    const { title, description } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can delete
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the owner can delete this project" });
    }

    // Delete all tasks belonging to this project
    await Task.deleteMany({ project: project._id });

    await project.deleteOne();

    res
      .status(200)
      .json({ message: "Project and all its tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADD MEMBER TO PROJECT
const addMember = async (req, res) => {
  try {
    const { email, role } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only owner can add members
    if (project.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the owner can add members" });
    }

    // Find user by email
    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already a member
    const alreadyMember = project.members.some(
      (m) => m.user.toString() === userToAdd._id.toString(),
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push({
      user: userToAdd._id,
      role: role || "member",
    });

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
};
