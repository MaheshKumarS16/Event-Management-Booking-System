const mongoose = require('mongoose');

/**
 * Category Mongoose Schema & Model
 * 
 * Concept Explanation:
 * - What it is: Data model defining event categories (e.g., Technology, Music, Sports).
 * - Why we need it: Organizes events into distinct filterable classification groups.
 * - Where we use it: Referenced in Event model and managed by Admin.
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    icon: {
      type: String,
      default: '📅'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
