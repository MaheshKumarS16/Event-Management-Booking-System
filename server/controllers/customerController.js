const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

/**
 * @desc Get Customer Dashboard data
 * @route GET /api/customer/dashboard
 * @access Private (Customer Only)
 */
const getCustomerDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // recent bookings (last 5)
    const recentBookings = await Booking.find({ user: userId, bookingStatus: 'Confirmed' })
      .populate('event', 'title startDate venue')
      .sort({ createdAt: -1 })
      .limit(5);
    // fetch persisted favorite events from user.favorites
    const user = await User.findById(userId).select('favorites');
    const favoriteEvents = await Event.find({ _id: { $in: user.favorites } })
      .select('title image startDate venue')
      .lean();
    res.status(200).json({
      success: true,
      data: {
        recentBookings,
        favoriteEvents
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Customer Profile info
 * @route GET /api/customer/profile
 * @access Private (Customer Only)
 */
const getCustomerProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCustomerDashboard, getCustomerProfile };
