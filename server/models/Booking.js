const mongoose = require('mongoose');

/**
 * Booking Ticket Item Subdocument Schema
 */
const bookingTicketSchema = new mongoose.Schema({
  ticketTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true // e.g. Regular, VIP
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  }
});

/**
 * Booking Mongoose Schema & Model
 * 
 * Concept Explanation:
 * - What it is: Model storing customer ticket reservation records.
 * - Why we need it: Connects User to Event, calculates transaction amount, tracks ticket quantities, and enables cancellation.
 * - Where we use it: Created during checkout, displayed on customer dashboard, organizer attendee lists, and admin panel.
 */
const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required']
    },
    tickets: {
      type: [bookingTicketSchema],
      required: true
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative']
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Completed' // Mock Payment System
    },
    bookingStatus: {
      type: String,
      enum: ['Confirmed', 'Cancelled'],
      default: 'Confirmed'
    },
    bookingDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
