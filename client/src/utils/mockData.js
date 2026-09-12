/**
 * Mock Data for Eventify Phase 2 Frontend Showcase
 * Contains realistic categories, events, ticket tiers, and demo credentials.
 */

export const DEMO_CREDENTIALS = {
  customer: {
    role: 'Customer',
    email: 'mahesh.candidate@gmail.com',
    password: 'SmartHire@123',
    name: 'Mahesh Candidate'
  },
  organizer: {
    role: 'Organizer',
    email: 'organizer@eventify.com',
    password: 'Organizer@123',
    name: 'TechEvents Global'
  },
  admin: {
    role: 'Admin',
    email: 'admin@eventify.com',
    password: 'Admin@123',
    name: 'System Administrator'
  }
};

export const MOCK_CATEGORIES = [
  { id: '1', name: 'Technology', icon: '💻', count: 12, description: 'Tech summits, AI workshops, and developer conferences' },
  { id: '2', name: 'Music', icon: '🎵', count: 24, description: 'Live concerts, EDM festivals, and acoustic nights' },
  { id: '3', name: 'Sports', icon: '⚽', count: 8, description: 'Marathons, tournaments, and fitness expos' },
  { id: '4', name: 'Business', icon: '💼', count: 15, description: 'Startup pitch sessions, networking, and leadership summits' },
  { id: '5', name: 'Education', icon: '🎓', count: 10, description: 'Academic seminars, study fairs, and career guidance' },
  { id: '6', name: 'Workshop', icon: '🛠️', count: 18, description: 'Hands-on design, coding bootcamps, and creative arts' },
  { id: '7', name: 'Entertainment', icon: '🎭', count: 20, description: 'Stand-up comedy, theater plays, and magic shows' },
];

export const MOCK_EVENTS = [
  {
    id: 'evt-001',
    title: 'Global Tech Innovation Summit 2026',
    description: 'Join over 2,000 developers, founders, and AI engineers for South Asia’s premier technology summit. Featuring keynote speakers from Google, OpenAI, and leading tech pioneers.',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    organizer: 'TechEvents Global',
    venue: 'Chennai Trade Centre',
    address: 'CTC Complex, Nandambakkam',
    city: 'Chennai',
    startDate: '2026-10-15',
    endDate: '2026-10-16',
    startTime: '09:00 AM',
    endTime: '06:00 PM',
    status: 'Published',
    featured: true,
    startingPrice: 499,
    totalCapacity: 650,
    soldTickets: 420,
    ticketTypes: [
      { id: 't1', name: 'Regular Pass', price: 499, quantity: 500, soldQuantity: 380 },
      { id: 't2', name: 'VIP Pass', price: 999, quantity: 100, soldQuantity: 30 },
      { id: 't3', name: 'Premium Pass', price: 1499, quantity: 50, soldQuantity: 10 }
    ]
  },
  {
    id: 'evt-002',
    title: 'Sunburn Music Festival - Live Bangalore',
    description: 'Experience an electrifying night of electronic dance music featuring top international DJs, massive laser displays, food stalls, and non-stop energy.',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    organizer: 'BeatPulse Entertainment',
    venue: 'Manpho Convention Center',
    address: 'Nagavara Ring Road',
    city: 'Bangalore',
    startDate: '2026-11-20',
    endDate: '2026-11-20',
    startTime: '05:00 PM',
    endTime: '11:30 PM',
    status: 'Published',
    featured: true,
    startingPrice: 799,
    totalCapacity: 1200,
    soldTickets: 950,
    ticketTypes: [
      { id: 't1', name: 'Early Bird Regular', price: 799, quantity: 800, soldQuantity: 750 },
      { id: 't2', name: 'VIP Arena', price: 1799, quantity: 300, soldQuantity: 180 },
      { id: 't3', name: 'Backstage Fan Pass', price: 2999, quantity: 100, soldQuantity: 20 }
    ]
  },
  {
    id: 'evt-003',
    title: 'Full Stack Web Development Bootcamp',
    description: 'Intensive 2-day hands-on workshop covering React, Node.js, Express, MongoDB, and AWS deployment. Build a complete project live with mentorship.',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    organizer: 'DevCraft Academy',
    venue: 'T-Hub 2.0 Campus',
    address: 'Raidurgam, Hitec City',
    city: 'Hyderabad',
    startDate: '2026-10-05',
    endDate: '2026-10-06',
    startTime: '10:00 AM',
    endTime: '05:00 PM',
    status: 'Published',
    featured: true,
    startingPrice: 299,
    totalCapacity: 250,
    soldTickets: 190,
    ticketTypes: [
      { id: 't1', name: 'Student Pass', price: 299, quantity: 150, soldQuantity: 120 },
      { id: 't2', name: 'Professional Pass', price: 599, quantity: 100, soldQuantity: 70 }
    ]
  },
  {
    id: 'evt-004',
    title: 'Stand-up Comedy Night featuring Zakir Khan',
    description: 'Get ready for an evening of non-stop laughter and heartwarming comedy stories by India’s favourite comedian, Zakir Khan.',
    category: 'Entertainment',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=1200&q=80',
    organizer: 'LaughOutLoud Studio',
    venue: 'NCPA Mumbai Auditorium',
    address: 'Nariman Point',
    city: 'Mumbai',
    startDate: '2026-10-28',
    endDate: '2026-10-28',
    startTime: '07:30 PM',
    endTime: '09:30 PM',
    status: 'Published',
    featured: false,
    startingPrice: 699,
    totalCapacity: 800,
    soldTickets: 780,
    ticketTypes: [
      { id: 't1', name: 'Balcony Seat', price: 699, quantity: 400, soldQuantity: 390 },
      { id: 't2', name: 'Executive Seat', price: 1199, quantity: 300, soldQuantity: 295 },
      { id: 't3', name: 'VIP Front Row', price: 1999, quantity: 100, soldQuantity: 95 }
    ]
  },
  {
    id: 'evt-005',
    title: 'Indian Startup & Venture Capital Conclave',
    description: 'Connect with angel investors, VC firms, and top founders. Pitch your startup ideas, listen to keynote panels, and explore funding opportunities.',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    organizer: 'VentureConnect India',
    venue: 'Taj Palace Hotel',
    address: 'Chanakyapuri',
    city: 'New Delhi',
    startDate: '2026-11-10',
    endDate: '2026-11-11',
    startTime: '09:30 AM',
    endTime: '05:30 PM',
    status: 'Published',
    featured: false,
    startingPrice: 1299,
    totalCapacity: 400,
    soldTickets: 210,
    ticketTypes: [
      { id: 't1', name: 'Delegate Pass', price: 1299, quantity: 300, soldQuantity: 180 },
      { id: 't2', name: 'Investor & Founder Pass', price: 2999, quantity: 100, soldQuantity: 30 }
    ]
  },
  {
    id: 'evt-006',
    title: 'Chennai International City Marathon 2026',
    description: 'Run for health and eco-awareness! Choose between 5K Fun Run, 10K Challenge, or Full 42K Marathon along Marina Beach road.',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    organizer: 'Chennai Runners Club',
    venue: 'Elliot’s Beach Promenade',
    address: 'Besant Nagar',
    city: 'Chennai',
    startDate: '2026-12-06',
    endDate: '2026-12-06',
    startTime: '05:30 AM',
    endTime: '11:00 AM',
    status: 'Published',
    featured: false,
    startingPrice: 350,
    totalCapacity: 3000,
    soldTickets: 1800,
    ticketTypes: [
      { id: 't1', name: '5K Fun Run', price: 350, quantity: 1000, soldQuantity: 700 },
      { id: 't2', name: '10K Challenge', price: 650, quantity: 1200, soldQuantity: 800 },
      { id: 't3', name: '42K Full Marathon', price: 999, quantity: 800, soldQuantity: 300 }
    ]
  }
];
