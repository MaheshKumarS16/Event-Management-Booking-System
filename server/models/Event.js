const mongoose = require('mongoose');

/**
 * Subdocument Schema for Ticket Tiers
 */
const ticketTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ticket type name is required'], // e.g., Regular, VIP, Premium
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Ticket price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Total ticket quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  soldQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Sold quantity cannot be negative']
  }
});

/**
 * Event Mongoose Schema & Model
 * 
 * Concept Explanation:
 * - What it is: Primary entity model holding event information, venue, schedule, ticket tiers, and approval status.
 * - Why we need it: Stores organizer event creations and tracks ticket availability for customer bookings.
 * - Where we use it: Event creation, browsing, editing, admin approval, and booking availability checks.
 */
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required']
    },
    image: {
      type: String,
      required: [true, 'Event image URL is required']
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer reference is required']
    },
    venue: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Venue address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: String,
      required: [true, 'End date is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    ticketTypes: {
      type: [ticketTypeSchema],
      validate: [
        function (val) {
          return val.length > 0;
        },
        'At least one ticket type must be specified'
      ]
    },
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Approved', 'Published', 'Rejected', 'Cancelled', 'Completed'],
      default: 'Draft'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Virtual Field: Total capacity across all ticket tiers
 */
eventSchema.virtual('totalCapacity').get(function () {
  if (!this.ticketTypes) return 0;
  return this.ticketTypes.reduce((acc, ticket) => acc + ticket.quantity, 0);
});

/**
 * Virtual Field: Total sold tickets across all ticket tiers
 */
eventSchema.virtual('soldTickets').get(function () {
  if (!this.ticketTypes) return 0;
  return this.ticketTypes.reduce((acc, ticket) => acc + ticket.soldQuantity, 0);
});

/**
 * Virtual Field: Available tickets remaining
 */
eventSchema.virtual('availableTickets').get(function () {
  return this.totalCapacity - this.soldTickets;
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
