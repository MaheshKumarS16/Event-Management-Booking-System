const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

// Load environment configuration
dotenv.config();

/**
 * Seed Database Script
 * 
 * Concept Explanation:
 * - What it is: A standalone setup script that populates the MongoDB database with demo users, categories, events, and bookings.
 * - Why we need it: Ensures the application has working demo accounts and initial dataset for testing without manual database entry.
 * - Where we use it: Executed via `npm run seed` or `node seed.js`.
 */
const seedDatabase = async () => {
  try {
    const primaryUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventify_db';
    console.log(`[Seed Script] Attempting connection to MongoDB: ${primaryUri}`);

    try {
      await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 2500 });
      console.log('[Seed Script] Connected to primary MongoDB server.');
    } catch (err) {
      console.warn(`[Seed Warning] Could not connect to ${primaryUri}. Using In-Memory MongoDB...`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Seed Script] Connected to In-Memory MongoDB server.`);
    }

    // Clear existing collections
    console.log('[Seed Script] Clearing existing collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Event.deleteMany({});
    await Booking.deleteMany({});

    // 1. Create Default Users
    console.log('[Seed Script] Creating Demo Users...');
    
    // Customer User (Prompt explicit credentials)
    const customerUser = await User.create({
      name: 'Mahesh Candidate',
      email: 'mahesh.candidate@gmail.com',
      password: 'SmartHire@123',
      phone: '9876543210',
      role: 'customer',
      status: 'active'
    });

    // Organizer User
    const organizerUser = await User.create({
      name: 'TechEvents Global',
      email: 'organizer@eventify.com',
      password: 'Organizer@123',
      phone: '9876543211',
      role: 'organizer',
      status: 'active'
    });

    // Admin User
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@eventify.com',
      password: 'Admin@123',
      phone: '9876543212',
      role: 'admin',
      status: 'active'
    });

    console.log('[Seed Script] Created 3 Users (Customer, Organizer, Admin).');

    // 2. Create Categories
    console.log('[Seed Script] Creating Categories...');
    const categoryDocs = await Category.insertMany([
      { name: 'Technology', icon: '💻', description: 'Tech summits, AI workshops, and developer conferences' },
      { name: 'Music', icon: '🎵', description: 'Live concerts, EDM festivals, and acoustic nights' },
      { name: 'Sports', icon: '⚽', description: 'Marathons, tournaments, and fitness expos' },
      { name: 'Business', icon: '💼', description: 'Startup pitch sessions, networking, and leadership summits' },
      { name: 'Education', icon: '🎓', description: 'Academic seminars, study fairs, and career guidance' },
      { name: 'Workshop', icon: '🛠️', description: 'Hands-on design, coding bootcamps, and creative arts' },
      { name: 'Entertainment', icon: '🎭', description: 'Stand-up comedy, theater plays, and magic shows' }
    ]);

    const categoryMap = {};
    categoryDocs.forEach(c => { categoryMap[c.name] = c._id; });

    console.log(`[Seed Script] Created ${categoryDocs.length} Categories.`);

    // 3. Create Events
    console.log('[Seed Script] Creating Seed Events...');
    const eventDocs = await Event.create([
      {
        title: 'Global Tech Innovation Summit 2026',
        description: 'Join over 2,000 developers, founders, and AI engineers for South Asia’s premier technology summit.',
        category: categoryMap['Technology'],
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        organizer: organizerUser._id,
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
          { name: 'Regular Pass', price: 499, quantity: 500, soldQuantity: 380 },
          { name: 'VIP Pass', price: 999, quantity: 100, soldQuantity: 30 },
          { name: 'Premium Pass', price: 1499, quantity: 50, soldQuantity: 10 }
        ]
      },
      {
        title: 'Sunburn Music Festival - Live Bangalore',
        description: 'Experience an electrifying night of electronic dance music featuring top international DJs.',
        category: categoryMap['Music'],
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        organizer: organizerUser._id,
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
          { name: 'Early Bird Regular', price: 799, quantity: 800, soldQuantity: 750 },
          { name: 'VIP Arena', price: 1799, quantity: 300, soldQuantity: 180 }
        ]
      },
      {
        title: 'Full Stack Web Development Bootcamp',
        description: 'Intensive 2-day hands-on workshop covering React, Node.js, Express, MongoDB, and AWS deployment.',
        category: categoryMap['Workshop'],
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
        organizer: organizerUser._id,
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
          { name: 'Student Pass', price: 299, quantity: 150, soldQuantity: 120 },
          { name: 'Professional Pass', price: 599, quantity: 100, soldQuantity: 70 }
        ]
      }
    ]);

    console.log(`[Seed Script] Created ${eventDocs.length} Events.`);

    // 4. Create Sample Booking
    console.log('[Seed Script] Creating Sample Booking...');
    const techEvent = eventDocs[0];
    const regularTicket = techEvent.ticketTypes[0];

    const sampleBooking = await Booking.create({
      bookingId: 'EVT-2026-000001',
      user: customerUser._id,
      event: techEvent._id,
      tickets: [
        {
          ticketTypeId: regularTicket._id,
          name: regularTicket.name,
          price: regularTicket.price,
          quantity: 2
        }
      ],
      totalAmount: regularTicket.price * 2,
      paymentStatus: 'Completed',
      bookingStatus: 'Confirmed',
      bookingDate: new Date()
    });

    console.log(`[Seed Script] Sample Booking Created: ${sampleBooking.bookingId}`);

    console.log('\n==================================================');
    console.log('  🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==================================================');
    console.log('\nDEMO LOGIN CREDENTIALS:');
    console.log('--------------------------------------------------');
    console.log('👤 CUSTOMER LOGIN');
    console.log('Role: Customer');
    console.log('Login URL: http://localhost:5173/login');
    console.log(`Email: ${customerUser.email}`);
    console.log('Password: SmartHire@123');
    console.log('--------------------------------------------------');
    console.log('🎪 ORGANIZER LOGIN');
    console.log('Role: Organizer');
    console.log('Login URL: http://localhost:5173/login');
    console.log(`Email: ${organizerUser.email}`);
    console.log('Password: Organizer@123');
    console.log('--------------------------------------------------');
    console.log('👑 ADMIN LOGIN');
    console.log('Role: Admin');
    console.log('Login URL: http://localhost:5173/login');
    console.log(`Email: ${adminUser.email}`);
    console.log('Password: Admin@123');
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Database seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
