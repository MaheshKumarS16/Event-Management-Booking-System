const Event = require('../models/Event');
const Category = require('../models/Category');
const Booking = require('../models/Booking');

/**
 * Event Controller
 * 
 * Concept Explanation:
 * - What it is: Primary business logic controller managing event creation, filtering, editing, approval, and deletion.
 * - Why we need it: Powers the public discovery catalog, organizer dashboard, and admin approval workflow.
 * - Where we use it: Connected to eventRoutes.js.
 */

// @desc    Get all events with search, filtering, sorting, and pagination
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const { search, category, city, maxPrice, sortBy, page = 1, limit = 10, status, dateFrom, dateTo, ticketType } = req.query;

    let query = {};

    // Filter rule: Public visitors only view 'Published' events
    // Admins and Organizers can request specific statuses
    if (status) {
      query.status = status;
    } else {
      query.status = 'Published';
    }

    // Keyword Search (Matches Title or Description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // City Filter
    if (city && city !== 'All') {
      query.city = { $regex: city, $options: 'i' };
    }

    // Category Filter (Handles ObjectId or Category Name string)
    if (category && category !== 'All') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ name: { $regex: category, $options: 'i' } });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    // Starting Price Filter
    if (maxPrice) {
      query['ticketTypes.price'] = { $lte: Number(maxPrice) };
    }

    // Date range filter (ISO date strings)
    if (dateFrom || dateTo) {
      query.startDate = {};
      if (dateFrom) query.startDate.$gte = dateFrom;
      if (dateTo) query.startDate.$lte = dateTo;
    }

    // Ticket type filter (ticketType name)
    if (ticketType && ticketType !== 'All') {
      query['ticketTypes.name'] = { $regex: ticketType, $options: 'i' };
    }

    // Sorting Options
    let sortOptions = { startDate: 1 }; // Default: earliest date first
    if (sortBy === 'price-low') sortOptions = { 'ticketTypes.price': 1 };
    if (sortBy === 'price-high') sortOptions = { 'ticketTypes.price': -1 };
    if (sortBy === 'recent') sortOptions = { createdAt: -1 };

    // Pagination Math
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalEvents = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('category', 'name icon')
      .populate('organizer', 'name email phone')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: events.length,
      total: totalEvents,
      totalPages: Math.ceil(totalEvents / limitNum) || 1,
      currentPage: pageNum,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('category', 'name icon description')
      .populate('organizer', 'name email phone');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get events created by logged-in organizer
// @route   GET /api/events/my-events
// @access  Private (Organizer / Admin)
const getOrganizerEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Organizer / Admin)
const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      image,
      venue,
      address,
      city,
      startDate,
      endDate,
      startTime,
      endTime,
      ticketTypes,
      featured
    } = req.body;

    // Verify category existence
    const validCategory = await Category.findById(category);
    if (!validCategory) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category reference ID'
      });
    }

    // Default status for new events created by Organizers is 'Draft' or 'Pending Approval'
    const event = await Event.create({
      title,
      description,
      category,
      image,
      organizer: req.user._id,
      venue,
      address,
      city,
      startDate,
      endDate,
      startTime,
      endTime,
      ticketTypes,
      featured: featured || false,
      status: 'Draft'
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('category', 'name icon')
      .populate('organizer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully as Draft',
      data: populatedEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing event
// @route   PUT /api/events/:id
// @access  Private (Organizer Ownership / Admin)
const updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Ownership Check: Organizer can only edit their own events (Admin can edit any)
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only modify your own events.'
      });
    }

    const {
      title,
      description,
      category,
      image,
      venue,
      address,
      city,
      startDate,
      endDate,
      startTime,
      endTime,
      ticketTypes,
      status,
      featured
    } = req.body;

    // Ticket Quantity Guard: Do not allow reducing total tickets below already booked (sold) tickets
    if (ticketTypes && Array.isArray(ticketTypes)) {
      for (const newTier of ticketTypes) {
        const existingTier = event.ticketTypes.find(t => t.name.toLowerCase() === newTier.name.toLowerCase());
        if (existingTier && newTier.quantity < existingTier.soldQuantity) {
          return res.status(400).json({
            success: false,
            message: `Cannot reduce quantity of "${newTier.name}" below already sold tickets (${existingTier.soldQuantity}).`
          });
        }
      }
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.category = category || event.category;
    event.image = image || event.image;
    event.venue = venue || event.venue;
    event.address = address || event.address;
    event.city = city || event.city;
    event.startDate = startDate || event.startDate;
    event.endDate = endDate || event.endDate;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    if (ticketTypes) event.ticketTypes = ticketTypes;
    if (featured !== undefined) event.featured = featured;

    // Organizers can submit status changes (Draft -> Pending Approval)
    if (status && ['Draft', 'Pending Approval'].includes(status) && req.user.role === 'organizer') {
      event.status = status;
    } else if (status && req.user.role === 'admin') {
      event.status = status;
    }

    await event.save();

    const updatedEvent = await Event.findById(event._id)
      .populate('category', 'name icon')
      .populate('organizer', 'name email');

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin Update Event Status (Approve/Reject/Publish/Cancel)
// @route   PUT /api/events/:id/status
// @access  Private (Admin Only)
const updateEventStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Draft', 'Pending Approval', 'Approved', 'Published', 'Rejected', 'Cancelled', 'Completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Allowed: ${allowedStatuses.join(', ')}`
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.status = status;
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event status updated to ${status}`,
      data: event
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Organizer Ownership / Admin)
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Ownership Check
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own events.'
      });
    }

    // Safety Guard: Check if event has active confirmed bookings
    const activeBookings = await Booking.countDocuments({ event: event._id, bookingStatus: 'Confirmed' });
    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete event with ${activeBookings} active customer bookings. Cancel the event instead.`
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvents,
  getEventById,
  getOrganizerEvents,
  createEvent,
  updateEvent,
  updateEventStatus,
  deleteEvent
};
