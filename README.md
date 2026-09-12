# Eventify — Event Management & Booking System

[![Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://react.dev/)
[![Status](https://img.shields.io/badge/Phase-1_Setup_Complete-success.svg)](#)

Eventify is a full-stack Event Management & Booking System web application designed for discovering events, managing ticket availability, processing mock bookings, and managing role-based dashboards for Customers, Organizers, and Admins.

---

## 🏗️ Architecture Flow

```text
React (Client) ──> Axios ──> Express.js / Node.js (Server) ──> Mongoose ──> MongoDB
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Vanilla CSS3 (Custom Design System with Glassmorphism)
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Charts:** Recharts

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Security:** Helmet, CORS, bcryptjs, jsonwebtoken, express-validator

---

## 📁 Project Structure

```text
Event/
├── client/                 # React Frontend App
│   ├── src/
│   │   ├── assets/         # Images and icons
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context API state management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── layouts/        # Page layouts (Navbar, Footer, Sidebar)
│   │   ├── pages/          # Page views (Home, Events, Booking, Dashboards)
│   │   ├── routes/         # Protected and public routes
│   │   ├── services/       # Axios API client setup
│   │   ├── utils/          # Helper functions and formatters
│   │   ├── App.jsx         # Root React component
│   │   ├── index.css       # Global design tokens and styles
│   │   └── main.jsx        # React entry point
│   ├── index.html
│   └── package.json
│
├── server/                 # Express Backend Server
│   ├── config/             # Database connection setup (db.js)
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & error handling middlewares
│   ├── models/             # Mongoose schemas (User, Event, Booking, Category)
│   ├── routes/             # REST API endpoint routes
│   ├── services/           # Business logic & database operations
│   ├── utils/              # Helper utilities
│   ├── validators/         # Input validation rules
│   ├── .env                # Environment variables configuration
│   ├── .env.example        # Environment variables template
│   ├── server.js           # Express application entry point
│   └── package.json
│
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

---

## 🚀 Environment Configuration

Create `server/.env` with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventify_db
JWT_SECRET=eventify_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

## 💻 How to Run the Application

### 1. Start Backend Server
```bash
cd server
npm run dev
```
Backend will start at: `http://localhost:5000`
Health Check API: `http://localhost:5000/api/health`

### 2. Start Frontend React App
Open a new terminal:
```bash
cd client
npm run dev
```
Frontend client will start at: `http://localhost:5173`

---

## 🔍 How to Verify MongoDB Connection

1. Ensure local MongoDB service is active or MongoDB Compass is connected to `mongodb://localhost:27017`.
2. When starting the backend server (`cd server && npm run dev`), look for the following console output:
   `[Database] MongoDB Connected Successfully: 127.0.0.1`
3. Open `http://localhost:5173` in your browser. The "Backend Health Status" card will display `"Database State: Connected"`.
