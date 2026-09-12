const Event = require('../models/Event');
const Booking = require('../models/Booking');

/**
 * Organizer Controller (Organizer Dashboard & Attendee Analytics)
 * 
 * Concept Explanation:
 * - What it is: Controller computing performance metrics specifically for the logged-in event organizer.
 * - Why we need it: Gives organizers real-time insights into published events, total bookings, attendees, and total revenue earned.
 * - Where we use it: Connected to organizerRoutes.js.
 */

// @desc    Get Organizer Dashboard Analytics
// @route   GET /api/organizer/dashboard
// @access  Private (Organizer Only)
const getOrganizerDashboardStats = async (req, res, next) => {
  try {
    const organizerId = req.user._id;

    // Find all events created by this organizer
    const organizerEvents = await Event.find({ organizer: organizerId });
    const eventIds = organizerEvents.map(e => e._id);

    const totalEvents = organizerEvents.length;
    const publishedEvents = organizerEvents.filter(e => e.status === 'Published').length;
    const pendingEvents = organizerEvents.filter(e => e.status === 'Pending Approval').length;

    // Total attendees (tickets sold across organizer events)
    let totalAttendees = 0;
    organizerEvents.forEach(e => {
      e.ticketTypes.forEach(t => {
        totalAttendees += t.soldQuantity;
      });
    });

    // Find confirmed bookings for organizer events
    const bookings = await Booking.find({
      event: { $in: eventIds },
      bookingStatus: 'Confirmed'
    });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, b) => acc + b.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        publishedEvents,
        pendingEvents,
        totalBookings,
        totalAttendees,
        totalRevenue
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Attendee List for Organizer Events
// @route   GET /api/organizer/attendees
// @access  Private (Organizer Only)
const getOrganizerAttendees = async (req, res, next) => {
  try {
    const organizerEvents = await Event.find({ organizer: req.user._id }).select('_id');
    const eventIds = organizerEvents.map(e => e._id);

    const bookings = await Booking.find({ event: { $in: eventIds } })
      .populate('user', 'name email phone')
      .populate('event', 'title startDate venue city')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrganizerDashboardStats,
  getOrganizerAttendees
};
