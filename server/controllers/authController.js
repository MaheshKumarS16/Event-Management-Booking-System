const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * Authentication Controller
 * 
 * Concept Explanation:
 * - What it is: A module containing business logic handlers for authentication endpoints.
 * - Why we need it: Handles user registration, credentials verification, JWT generation, and profile lookup.
 * - Where we use it: Connected to authRoutes endpoints.
 */

// @desc    Register a new Customer or Organizer user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Explicit Rule: Admin registration is forbidden via API
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is restricted. Admin accounts can only be created via system seed configuration.'
      });
    }

    const assignedRole = role === 'organizer' ? 'organizer' : 'customer';

    // Check if user email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email address already exists.'
      });
    }

    // Create new user in database (password is automatically hashed via User schema pre-save hook)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: assignedRole,
      status: 'active'
    });

    // Generate JWT authentication token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & generate JWT session token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User email not found.'
      });
    }

    // Check if account status is blocked by Admin
    if (user.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended by an Administrator.'
      });
    }

    // Compare entered password with stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (Authenticated User)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (stateless JWT client cleanup response)
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  getMe,
  logout
};
