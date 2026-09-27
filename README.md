# Eventify - Event Management & Booking System

Eventify is a full-stack event management and ticket booking web application built using React.js, Node.js, Express.js, and MongoDB.

The application provides separate experiences for customers, organizers, and administrators. Customers can discover and book events, organizers can create and manage events, and administrators can manage users, events, and bookings.

## Live Demo

Frontend:
https://eventify-event-booking.vercel.app

Backend API:
https://eventify-backendservice.onrender.com

Backend Health Check:
https://eventify-backendservice.onrender.com/api/health

GitHub Repository:
https://github.com/MaheshKumarS16/Event-Management-Booking-System


## Features

### Customer

- User registration and login
- JWT-based authentication
- Browse available events
- View event details
- Search and filter events
- Select ticket quantity
- Book event tickets
- View booking information
- Manage customer profile
- Responsive interface for desktop, tablet, and mobile
- Logout functionality


### Organizer

- Organizer authentication
- Create events
- Update event information
- Manage created events
- View event bookings
- Manage event availability
- Organizer dashboard


### Admin

- Admin authentication
- Admin dashboard
- Manage users
- Manage events
- Manage bookings
- View platform information
- Role-based access control


## Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router
- Responsive UI

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt
- CORS
- dotenv

### Database

- MongoDB
- MongoDB Atlas
- Mongoose

### Deployment

- Vercel - Frontend
- Render - Backend
- MongoDB Atlas - Database

### Development Tools

- Visual Studio Code
- Git
- GitHub
- npm


## Application Architecture

```text
                         EVENTIFY
                            |
             +--------------+--------------+
             |                             |
        React Frontend                Express Backend
             |                             |
          Vercel                      Render
             |                             |
             +------------ REST API --------+
                                           |
                                      MongoDB Atlas

The frontend communicates with the backend through REST APIs.

Authentication is handled using JSON Web Tokens (JWT), while MongoDB Atlas stores application data.

Project Structure
Event-Management-Booking-System/
│
├── .github/
│
├── client/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
Getting Started

Follow the steps below to run Eventify locally.

Prerequisites

Make sure the following are installed:

Node.js
npm
Git
MongoDB or MongoDB Atlas
Visual Studio Code
Clone the Repository
git clone https://github.com/MaheshKumarS16/Event-Management-Booking-System.git

Navigate into the project:

cd Event-Management-Booking-System
Backend Setup

Navigate to the server folder:

cd server

Install dependencies:

npm install

Create a .env file inside the server folder.

Example:

PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173

Do not commit the .env file to GitHub.

Start the backend:

npm run dev

The backend will run locally at:

http://localhost:5000
Frontend Setup

Open another terminal and navigate to the client folder:

cd client

Install dependencies:

npm install

Create a .env file inside the client folder:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev

The frontend will normally be available at:

http://localhost:5173

If Vite automatically selects another available port, use the URL displayed in the terminal.

Environment Variables
Frontend
VITE_API_URL=

For production:

VITE_API_URL=https://eventify-backendservice.onrender.com/api
Backend
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
FRONTEND_URL=
CLIENT_URL=

Never expose database credentials or JWT secrets publicly.

Authentication

Eventify uses JWT-based authentication.

The authentication flow is:

User
  |
  | Login
  v
Backend API
  |
  | Validate credentials
  v
JWT Token
  |
  v
Frontend
  |
  | Store authentication token
  v
Authenticated API Requests

Protected API requests use the JWT token in the Authorization header.

API

The backend provides REST API endpoints for different parts of the application.

Authentication
/api/auth

Used for:

User registration
User login
Authentication-related operations
Events
/api/events

Used for:

Fetching events
Viewing event information
Creating events
Updating events
Managing events
Bookings
/api/bookings

Used for:

Creating bookings
Viewing bookings
Managing booking information
Customer
/api/customer

Used for customer-specific operations.

Organizer
/api/organizer

Used for organizer-specific operations.

Admin
/api/admin

Used for administrative operations.

Users
/api/users

Used for user-related operations.

Health Check
/api/health

Production health endpoint:

https://eventify-backendservice.onrender.com/api/health

Responsive Design

Eventify is designed to work across different screen sizes.

The interface has been tested and optimized for:

Mobile devices
Tablets
Laptops
Desktop screens
Large desktop displays

Target viewport sizes include:

320px
375px
390px
414px
768px
1024px
1280px
1440px
1920px

The application uses responsive layouts, flexible components, and mobile-friendly navigation.

Deployment

Eventify is deployed using a three-part production architecture.

Frontend - Vercel

The React/Vite frontend is deployed on Vercel.

Production URL:

https://eventify-event-booking.vercel.app

Backend - Render

The Node.js/Express backend is deployed on Render.

Production API:

https://eventify-backendservice.onrender.com

Database - MongoDB Atlas

The production database is hosted using MongoDB Atlas.

Production Architecture
                    Vercel
                      |
                      v
              React/Vite Frontend
                      |
                      | HTTPS REST API
                      v
                    Render
                      |
                      v
              Node.js + Express
                      |
                      | Mongoose
                      v
                MongoDB Atlas
Vercel Configuration

The frontend uses a Vercel rewrite configuration to support client-side routing.

File:

client/vercel.json

Configuration:

{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}

This allows application routes to work correctly when users directly refresh or open a route.

Security

Security considerations implemented in the project include:

JWT-based authentication
Password hashing
Protected API routes
Role-based authorization
Environment variables for sensitive configuration
CORS configuration
MongoDB Atlas connection
Secrets excluded from Git
Production-specific environment configuration

Sensitive values such as:

MongoDB passwords
JWT secrets
API keys
Environment variables

must never be committed to the repository.

Git and GitHub

Check the current Git status:

git status

Add changes:

git add .

Commit changes:

git commit -m "Update Eventify project"

Push to GitHub:

git push origin master
Production URLs
Resource	URL
Frontend	https://eventify-event-booking.vercel.app
Backend	https://eventify-backendservice.onrender.com
API Health	https://eventify-backendservice.onrender.com/api/health
GitHub	https://github.com/MaheshKumarS16/Event-Management-Booking-System
Testing Checklist

Before making production changes, verify:

 Frontend loads correctly
 Backend API is running
 MongoDB connection works
 User registration works
 User login works
 JWT authentication works
 Events load correctly
 Event details work
 Event booking works
 Customer dashboard works
 Organizer features work
 Admin features work
 Logout works
 Protected routes work
 Page refresh works on application routes
 Mobile layout works
 Desktop layout works
 Production API works
 No secrets are exposed in GitHub
Build

To create a production frontend build:

cd client
npm run build

The production files will be generated in:

client/dist/

The dist folder should not be committed to GitHub.

Backend Production Start

The backend can be started using:

npm start

The backend uses the hosting provider's production PORT environment variable when deployed.

Key Learning Outcomes

This project demonstrates practical experience with:

Full-stack web application development
React.js development
REST API development
Node.js and Express.js
MongoDB and Mongoose
JWT authentication
Role-based authorization
CRUD operations
API integration
Responsive web design
Environment variable management
Git and GitHub
Vercel deployment
Render deployment
MongoDB Atlas
Production configuration
Debugging and deployment troubleshooting
Future Improvements

Possible future enhancements include:

Online payment integration
Email notifications
Event reminders
QR-code based ticket validation
Advanced event search
Event categories and recommendations
Analytics dashboard
Booking reports
Cloud image storage
Automated testing
CI/CD improvements
Author

Mahesh Kumar S

B.Tech Information Technology

GitHub:
https://github.com/MaheshKumarS16

License

This project is intended for educational, portfolio, and demonstration purposes.