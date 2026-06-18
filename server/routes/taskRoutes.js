const express = require('express')
const router = express.Router();

const {
    createTask,
    getTasksByProject,
    getTaskById,
    updateTask,
    moveTask,
    deleteTask
} = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware');

// project scoped task routes /api/projects/:projectId/tasks

router.get('/:projectId/tasks', protect, getTasksByProject);
router.post('/:projectId/tasks', protect, createTask);

// Individual task routes These work under /api/tasks/:id

router.get   ('/:id',      protect, getTaskById);
router.put   ('/:id',      protect, updateTask);
router.put   ('/:id/move', protect, moveTask);
router.delete('/:id',      protect, deleteTask);

module.exports = router;