const express = require('express');
const router = express.Router();

const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember
} = require('../controllers/projectController')

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getAllProjects);
router.post('/', protect, authorize('admin'), createProject);
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/members', protect, addMember);

module.exports = router;