import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
const AppRoutes = React.lazy(() => import('./routes/AppRoutes'));

/**
 * Eventify Main Root Component
 *
 * Concept Explanation:
 * - What it is: Primary layout wrapper for the entire frontend application.
 * - Why we need it: Wraps application in Router and AuthProvider context store.
 * - Where we use it: Rendered inside main.jsx into the DOM element.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Global Navigation Header */}
          <Navbar />

          {/* Main Routed Page Content */}
          <main style={{ flex: 1 }}>
            <Suspense fallback={<div className="loader">Loading…</div>}>
              <AppRoutes />
            </Suspense>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
