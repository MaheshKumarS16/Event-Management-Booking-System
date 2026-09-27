const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

const connectDB = require('./config/db');

const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const customerRoutes = require('./routes/customerRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const errorHandler = require('./middleware/errorHandler');

// ==================================================
// Load Environment Variables
// ==================================================

dotenv.config();

// ==================================================
// Connect to MongoDB
// ==================================================

connectDB();

// ==================================================
// Ensure Demo Data Exists
// ==================================================

const ensureDemoData = async () => {
  try {
    const demoUsers = [
      {
        name: 'Mahesh Candidate',
        email: 'mahesh.candidate@gmail.com',
        password: 'SmartHire@123',
        phone: '9876543210',
        role: 'customer'
      },
      {
        name: 'TechEvents Global',
        email: 'organizer@eventify.com',
        password: 'Organizer@123',
        phone: '9876543211',
        role: 'organizer'
      },
      {
        name: 'System Administrator',
        email: 'admin@eventify.com',
        password: 'Admin@123',
        phone: '9876543212',
        role: 'admin'
      },
      {
        name: 'Demo Admin',
        email: 'admin@example.com',
        password: 'admin123',
        phone: '9000000001',
        role: 'admin'
      },
      {
        name: 'Demo Organizer',
        email: 'organizer@example.com',
        password: 'organizer123',
        phone: '9000000002',
        role: 'organizer'
      },
      {
        name: 'Demo Customer',
        email: 'customer@example.com',
        password: 'customer123',
        phone: '9000000003',
        role: 'customer'
      }
    ];

    // --------------------------------------------------
    // Create Demo Users
    // --------------------------------------------------

    for (const u of demoUsers) {
      const exists = await User.findOne({
        email: u.email
      });

      if (!exists) {
        await User.create(u);
      }
    }

    // --------------------------------------------------
    // Create Categories
    // --------------------------------------------------

    const catCount = await Category.countDocuments();

    if (catCount === 0) {
      await Category.insertMany([
        {
          name: 'Technology',
          icon: '💻',
          description:
            'Tech summits, AI workshops, and developer conferences'
        },
        {
          name: 'Music',
          icon: '🎵',
          description:
            'Live concerts, EDM festivals, and acoustic nights'
        },
        {
          name: 'Sports',
          icon: '⚽',
          description:
            'Marathons, tournaments, and fitness expos'
        },
        {
          name: 'Business',
          icon: '💼',
          description:
            'Startup pitch sessions, networking, and leadership summits'
        },
        {
          name: 'Education',
          icon: '🎓',
          description:
            'Academic seminars, study fairs, and career guidance'
        },
        {
          name: 'Workshop',
          icon: '🛠️',
          description:
            'Hands-on design, coding bootcamps, and creative arts'
        },
        {
          name: 'Entertainment',
          icon: '🎭',
          description:
            'Stand-up comedy, theater plays, and magic shows'
        }
      ]);
    }

    // --------------------------------------------------
    // Create Starter Events
    // --------------------------------------------------

    const eventCount = await Event.countDocuments();

    if (eventCount === 0) {
      const organizer = await User.findOne({
        role: 'organizer'
      });

      const techCat = await Category.findOne({
        name: 'Technology'
      });

      const musicCat = await Category.findOne({
        name: 'Music'
      });

      const workshopCat = await Category.findOne({
        name: 'Workshop'
      });

      if (organizer && techCat) {
        await Event.create([
          {
            title: 'Global Tech Innovation Summit 2026',

            description:
              'Join over 2,000 developers, founders, and AI engineers for South Asia’s premier technology summit. Featuring keynote speakers from Google, OpenAI, and leading tech pioneers.',

            category: techCat._id,

            image:
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',

            organizer: organizer._id,

            venue: 'Chennai Trade Centre',

            address: 'CTC Complex, Nandambakkam',

            city: 'Chennai',

            startDate: '2026-10-15',

            endDate: '2026-10-16',

            startTime: '09:00 AM',

            endTime: '06:00 PM',

            status: 'Published',

            featured: true,

            ticketTypes: [
              {
                name: 'Regular Pass',
                price: 499,
                quantity: 500,
                soldQuantity: 40
              },
              {
                name: 'VIP Pass',
                price: 999,
                quantity: 100,
                soldQuantity: 15
              },
              {
                name: 'Premium Pass',
                price: 1499,
                quantity: 50,
                soldQuantity: 5
              }
            ]
          },

          {
            title: 'Sunburn Music Festival - Live Bangalore',

            description:
              'Experience an electrifying night of electronic dance music featuring top international DJs, massive laser displays, food stalls, and non-stop energy.',

            category: musicCat
              ? musicCat._id
              : techCat._id,

            image:
              'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',

            organizer: organizer._id,

            venue: 'Manpho Convention Center',

            address: 'Nagavara Ring Road',

            city: 'Bangalore',

            startDate: '2026-11-20',

            endDate: '2026-11-20',

            startTime: '05:00 PM',

            endTime: '11:30 PM',

            status: 'Published',

            featured: true,

            ticketTypes: [
              {
                name: 'Early Bird Regular',
                price: 799,
                quantity: 800,
                soldQuantity: 120
              },
              {
                name: 'VIP Arena',
                price: 1799,
                quantity: 300,
                soldQuantity: 30
              }
            ]
          },

          {
            title: 'Full Stack Web Development Bootcamp',

            description:
              'Intensive 2-day hands-on workshop covering React, Node.js, Express, MongoDB, and deployment. Build a complete project live with mentorship.',

            category: workshopCat
              ? workshopCat._id
              : techCat._id,

            image:
              'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',

            organizer: organizer._id,

            venue: 'T-Hub 2.0 Campus',

            address: 'Raidurgam, Hitec City',

            city: 'Hyderabad',

            startDate: '2026-10-05',

            endDate: '2026-10-06',

            startTime: '10:00 AM',

            endTime: '05:00 PM',

            status: 'Published',

            featured: true,

            ticketTypes: [
              {
                name: 'Student Pass',
                price: 299,
                quantity: 150,
                soldQuantity: 25
              },
              {
                name: 'Professional Pass',
                price: 599,
                quantity: 100,
                soldQuantity: 10
              }
            ]
          }
        ]);
      }
    }
  } catch (err) {
    console.error(
      'Demo data initialization error:',
      err.message
    );
  }
};

ensureDemoData();

// ==================================================
// Initialize Express Application
// ==================================================

const app = express();

// ==================================================
// Security HTTP Headers
// ==================================================

app.use(helmet());

// ==================================================
// CORS Configuration
// ==================================================

const configuredFrontend =
  process.env.FRONTEND_URL ||
  process.env.CLIENT_URL ||
  'http://localhost:5174';

const allowedOrigins = [
  configuredFrontend,
  'http://localhost:5174',
  'http://localhost:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an Origin header
      // such as Postman or server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error('Not allowed by CORS')
      );
    },

    credentials: true
  })
);

// ==================================================
// Body Parser Middleware
// ==================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

// ==================================================
// API Routes
// ==================================================

app.use('/api', healthRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/events', eventRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/api/customer', customerRoutes);

app.use('/api/organizer', organizerRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/users', userRoutes);

// ==================================================
// 404 Handler
// ==================================================

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.originalUrl}`
  });
});

// ==================================================
// Centralized Error Handler
// ==================================================

app.use(errorHandler);

// ==================================================
// Server Port
// ==================================================

const PORT = process.env.PORT || 5000;

// ==================================================
// Start Server
// ==================================================

const server = app.listen(PORT, () => {
  console.log(
    '=================================================='
  );

  console.log(
    `  🎉 Eventify Server running on port ${PORT}`
  );

  console.log(
    `  📡 Health Check: http://localhost:${PORT}/api/health`
  );

  console.log(
    `  🔐 Auth Endpoint: http://localhost:${PORT}/api/auth`
  );

  console.log(
    `  🎪 Events Endpoint: http://localhost:${PORT}/api/events`
  );

  console.log(
    `  🎟️ Bookings Endpoint: http://localhost:${PORT}/api/bookings`
  );

  console.log(
    `  👑 Admin Endpoint: http://localhost:${PORT}/api/admin`
  );

  console.log(
    `  💼 Organizer Endpoint: http://localhost:${PORT}/api/organizer`
  );

  console.log(
    `  🌐 Environment: ${
      process.env.NODE_ENV || 'development'
    }`
  );

  console.log(
    '=================================================='
  );
});

// ==================================================
// Handle Unhandled Promise Rejections
// ==================================================

process.on('unhandledRejection', (err) => {
  console.error(
    `[Unhandled Rejection] ${err.message}`
  );

  server.close(() => {
    process.exit(1);
  });
});