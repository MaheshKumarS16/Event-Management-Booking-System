const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Mongoose Schema & Model
 * 
 * Concept Explanation:
 * - What it is: A blueprint defining user document structure in MongoDB.
 * - Why we need it: Enforces schema validation, role assignment (customer, organizer, admin), and password hashing.
 * - Where we use it: Used in authentication controllers, authorization middlewares, and seed script.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\s*[\w\.-]+@[\w\.-]+\.\w+\s*$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false // Exclude password from query results by default for security
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'organizer', 'admin'],
        message: 'Role must be customer, organizer, or admin'
      },
      default: 'customer'
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active'
    }
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt fields
  }
);

/**
 * Mongoose Pre-Save Hook: Hash password before saving user to database
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

/**
 * Instance Method: Compare entered password with stored hashed password
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
