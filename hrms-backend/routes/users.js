// Users API routes

const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getUser,
  updateUser,
  getMyTeam,
  getUsers
} = require('../controllers/userController');

const router = express.Router();

router.use(protect);

// Get user profile
router.get('/:id', getUser);
// Update user profile
router.put('/:id', updateUser);
// Get logged-in user's team
router.get('/team/my-team', getMyTeam);
// Get all users (admin only)
router.get('/', getUsers);

module.exports = router;
