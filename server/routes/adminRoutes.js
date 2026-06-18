const express    = require('express');
const router     = express.Router();
const { getAllUsers, updateUserRole, getStats } = require('../controllers/adminController');
const { protect }   = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes require login + admin role
router.use(protect, authorize('admin'));

router.get  ('/users',           getAllUsers);
router.put  ('/users/:id/role',  updateUserRole);
router.get  ('/stats',           getStats);

module.exports = router;