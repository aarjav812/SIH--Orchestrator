const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user (Admin or HR only in real-world)
// @route   POST /api/auth/register
// @access  Public (For setup, later make it Private/Admin)
const registerUser = asyncHandler(async (req, res) => {
  console.log('Registration request body:', req.body); // Debug log
  
  const { firstName, lastName, email, password, role } = req.body;

  // Basic validation for login form fields
  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error('Please fill in all fields');
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Generate a unique employee ID
  const employeeCount = await User.countDocuments();
  const employeeID = `EMP${String(employeeCount + 1).padStart(3, '0')}`;

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user with minimal required data, placeholders for required fields
  const user = await User.create({
    email,
    password: hashedPassword,
    role: role || 'employee',
    personalInfo: {
      firstName,
      lastName,
      location: 'Not specified' // Placeholder for required field
    },
    workInfo: {
      employeeID,
      department: 'Not assigned', // Placeholder for required field
      skills: ['To be updated'], // Placeholder for required field
      experienceLevel: 'junior' // Default value
    }
  });

  if (user) {
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.personalInfo.firstName,
        lastName: user.personalInfo.lastName,
        employeeID: user.workInfo.employeeID,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body; // Login form sends 'name' field

  if (!name || !password) {
    res.status(400);
    throw new Error('Please provide name and password');
  }

  // Find user by email or first name (since login form uses 'name')
  const user = await User.findOne({
    $or: [
      { email: name },
      { 'personalInfo.firstName': name }
    ]
  }).select('+password');

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.personalInfo.firstName,
        lastName: user.personalInfo.lastName,
        employeeID: user.workInfo.employeeID,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get current logged in user data
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.personalInfo.firstName,
      lastName: user.personalInfo.lastName,
      employeeID: user.workInfo.employeeID,
      role: user.role,
      department: user.workInfo.department,
      location: user.personalInfo.location,
      skills: user.workInfo.skills,
      experienceLevel: user.workInfo.experienceLevel
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
};