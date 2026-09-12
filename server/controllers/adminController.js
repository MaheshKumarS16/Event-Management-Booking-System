const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

/**
 * Admin Controller (Platform Analytics & System Management)
 * 
 * Concept Explanation:
 * - What it is: Controller powering the Admin Dashboard with real database statistics and user management.
 * - Why we need it: Gives administrators full control to monitor revenue, approve events, and suspend abusive users.
 * - Where we use it: Connected to adminRoutes.js.
 */

// @desc    Get real platform statistics for Admin Dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin Only)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalEvents = await Event.countDocuments();
    const pendingEvents = await Event.countDocuments({ status: 'Pending Approval' });
    const publishedEvents = await Event.countDocuments({ status: 'Published' });
    const totalBookings = await Booking.countDocuments({ bookingStatus: 'Confirmed' });

    // Calculate total revenue from all confirmed bookings
    const revenueResult = await Booking.aggregate([
      { $match: { bookingStatus: 'Confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrganizers,
        totalEvents,
        pendingEvents,
        publishedEvents,
        totalBookings,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get users list with filtering
// @route   GET /api/admin/users
// @access  Private (Admin Only)
const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block or Unblock user account
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin Only)
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be active or blocked'
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent blocking an Admin
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be blocked'
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${status === 'blocked' ? 'blocked' : 'unblocked'}`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getUsers,
  updateUserStatus
};
