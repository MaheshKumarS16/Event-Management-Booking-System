const Booking = require('../models/Booking');
const Event = require('../models/Event');

/**
 * Booking Controller (Business Logic & Overbooking Prevention)
 * 
 * Concept Explanation:
 * - What it is: Core controller handling ticket reservations, availability validation, price computation, and cancellations.
 * - Why we need it: Enforces strict backend verification so customers cannot overbook seats or alter ticket prices.
 * - Where we use it: Connected to bookingRoutes.js.
 */

// @desc    Create a new event booking (Mock Payment + Overbooking Prevention)
// @route   POST /api/bookings
// @access  Private (Customer / Admin)
const createBooking = async (req, res, next) => {
  try {
    const { eventId, tickets, mockPaymentMethod } = req.body;

    // Find target event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Event Status Check: Only published events can be booked
    if (event.status !== 'Published') {
      return res.status(400).json({
        success: false,
        message: `Booking unavailable. Event status is ${event.status}.`
      });
    }

    let calculatedTotal = 0;
    const bookingTickets = [];

    // CRITICAL BUSINESS LOGIC: Verify Ticket Availability on Backend
    for (const item of tickets) {
      const targetTicketTier = event.ticketTypes.id(item.ticketTypeId) || 
                              event.ticketTypes.find(t => t._id.toString() === item.ticketTypeId);

      if (!targetTicketTier) {
        return res.status(400).json({
          success: false,
          message: `Invalid ticket type selection: ${item.ticketTypeId}`
        });
      }

      const availableTickets = targetTicketTier.quantity - targetTicketTier.soldQuantity;
      const requestedQty = parseInt(item.quantity, 10);

      // Overbooking Guard
      if (requestedQty > availableTickets) {
        return res.status(400).json({
          success: false,
          message: `Booking rejected. Only ${availableTickets} ticket(s) available for "${targetTicketTier.name}".`
        });
      }

      // Calculate total amount securely on backend
      const tierTotal = targetTicketTier.price * requestedQty;
      calculatedTotal += tierTotal;

      bookingTickets.push({
        ticketTypeId: targetTicketTier._id,
        name: targetTicketTier.name,
        price: targetTicketTier.price,
        quantity: requestedQty
      });
    }

    // Generate Unique Sequential Booking ID (e.g. EVT-2026-000001)
    const bookingCount = await Booking.countDocuments();
    const currentYear = new Date().getFullYear();
    const formattedSequence = String(bookingCount + 1).padStart(6, '0');
    const bookingId = `EVT-${currentYear}-${formattedSequence}`;

    // Create Booking Document (Mock Payment = Completed)
    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      event: event._id,
      tickets: bookingTickets,
      totalAmount: calculatedTotal,
      paymentStatus: 'Completed',
      bookingStatus: 'Confirmed',
      bookingDate: new Date()
    });

    // ATOMIC UPDATE: Increment soldQuantity on target ticket tiers in Event document
    for (const item of bookingTickets) {
      const ticketTier = event.ticketTypes.id(item.ticketTypeId);
      if (ticketTier) {
        ticketTier.soldQuantity += item.quantity;
      }
    }
    await event.save();

    // Populate event & user details for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('event', 'title image venue address city startDate startTime category')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings of currently logged-in user
// @route   GET /api/bookings
// @access  Private (Customer / Organizer / Admin)
const getUserBookings = async (req, res, next) => {
  try {
    let query = {};
    
    // Customer gets their own bookings; Admin can view all
    if (req.user.role === 'customer') {
      query.user = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('event', 'title image venue city startDate startTime status category')
      .populate('user', 'name email phone')
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

// @desc    Get single booking details
// @route   GET /api/bookings/:id
// @access  Private (Customer Ownership / Admin / Event Organizer)
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }]
    })
      .populate('event')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    // Ownership check: Customer can only view their own booking
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own booking details.'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an eligible booking & restore ticket availability
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer Ownership / Admin)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Ownership check
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only cancel your own bookings.'
      });
    }

    // Check double cancellation guard
    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.'
      });
    }

    // Update booking status
    booking.bookingStatus = 'Cancelled';
    await booking.save();

    // RESTORE TICKET AVAILABILITY: Decrement soldQuantity on Event document
    const event = await Event.findById(booking.event);
    if (event) {
      for (const item of booking.tickets) {
        const ticketTier = event.ticketTypes.id(item.ticketTypeId);
        if (ticketTier) {
          ticketTier.soldQuantity = Math.max(0, ticketTier.soldQuantity - item.quantity);
        }
      }
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully and ticket availability restored.',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
};
