const User = require('../models/User');

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -refreshToken') // exclude sensitive fields
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE USER ROLE
const updateUserRole = async (req, res) => {
  try {
    const { id }   = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['admin', 'member', 'viewer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    // Prevent admin from changing their own role
    if (id === req.user.id) {
      return res.status(400).json({
        message: 'You cannot change your own role'
      });
    }

    const user = await User.findById(id).select('-password -refreshToken');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: `Role updated to ${role}`,
      user
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET STATS
const getStats = async (req, res) => {
  try {
    const total   = await User.countDocuments();
    const admins  = await User.countDocuments({ role: 'admin' });
    const members = await User.countDocuments({ role: 'member' });
    const viewers = await User.countDocuments({ role: 'viewer' });

    res.status(200).json({ total, admins, members, viewers });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllUsers, updateUserRole, getStats };