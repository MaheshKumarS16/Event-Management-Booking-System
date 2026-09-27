import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

/**
 * Global Navigation Header
 * Fully responsive: desktop links, mobile hamburger drawer, role-based links.
 */
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    API.get("/health")
      .then(() => setApiConnected(true))
      .catch(() => setApiConnected(false));
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "organizer") return "/organizer/dashboard";
    return "/customer/dashboard";
  };

  const getDashboardLabel = () => {
    if (!user) return "Dashboard";
    if (user.role === "admin") return "Admin Dashboard";
    if (user.role === "organizer") return "Organizer Dashboard";
    return "My Dashboard";
  };

  return (
    <header
      className="navbar-wrapper"
      style={{
        backgroundColor: "var(--navbar-bg)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0.75rem 0",
        transition: "background-color 0.25s, border-color 0.25s",
      }}
    >
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>

        {/* Brand Logo */}
        <Link to="/" aria-label="Eventify home" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "1.25rem", color: "#ffffff", boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)", flexShrink: 0, transition: "transform 0.2s, box-shadow 0.2s" }}>
            E
          </div>
          <div>
            <div style={{ fontSize: "1.35rem", fontWeight: "800", letterSpacing: "-0.03em", color: "var(--text-main)", lineHeight: "1.1" }}>
              EVENT<span style={{ color: "var(--primary)" }}>IFY</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.7rem", color: "var(--text-muted)" }}>
              <span>Event System</span>
              <span
                role="status"
                title={apiConnected ? "API Connected" : "API Connecting / Offline"}
                aria-label={apiConnected ? "API Connected" : "API Offline"}
                style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: apiConnected ? "var(--success)" : "var(--warning)", display: "inline-block" }}
              />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main navigation" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {[{ to: "/", label: "Home" }, { to: "/events", label: "Explore Events" }].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="nav-link"
              style={{ fontWeight: isActive(to) ? "700" : "500", color: isActive(to) ? "var(--primary)" : "var(--text-main)", fontSize: "0.92rem" }}
              aria-current={isActive(to) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}

          {user && (
            <>
              <Link to="/my-bookings" className="nav-link" style={{ fontWeight: isActive("/my-bookings") ? "700" : "500", color: isActive("/my-bookings") ? "var(--primary)" : "var(--text-main)", fontSize: "0.92rem" }} aria-current={isActive("/my-bookings") ? "page" : undefined}>
                My Bookings
              </Link>
              <Link to={getDashboardPath()} className="nav-link" style={{ fontWeight: isActive(getDashboardPath()) ? "700" : "500", color: isActive(getDashboardPath()) ? "var(--primary)" : "var(--text-main)", fontSize: "0.92rem" }} aria-current={isActive(getDashboardPath()) ? "page" : undefined}>
                {getDashboardLabel()}
              </Link>
            </>
          )}

          <div style={{ height: "20px", width: "1px", backgroundColor: "var(--border)" }} />
          <ThemeToggle />

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <Link to={getDashboardPath()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }} title={`Go to ${getDashboardLabel()}`} aria-label={`Go to ${getDashboardLabel()}`}>
                <div aria-hidden="true" style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "0.9rem", flexShrink: 0 }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
                  <span className={`badge ${user.role === "admin" ? "badge-error" : user.role === "organizer" ? "badge-warning" : "badge-success"}`} style={{ fontSize: "0.62rem", padding: "0.1rem 0.35rem" }}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </Link>
              <button onClick={handleLogout} aria-label="Sign out" style={{ padding: "0.45rem 0.85rem", borderRadius: "var(--radius-md)", backgroundColor: "var(--error-bg)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--error)", fontSize: "0.82rem", fontWeight: "600", transition: "transform 0.15s, box-shadow 0.15s" }}>
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Link to="/login" style={{ padding: "0.48rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", fontWeight: "600", fontSize: "0.88rem", color: isActive("/login") ? "var(--primary)" : "var(--text-main)", backgroundColor: isActive("/login") ? "var(--primary-light)" : "transparent", transition: "background-color 0.2s, color 0.2s" }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: "0.48rem 1.15rem", fontSize: "0.88rem" }}>
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile: ThemeToggle + Hamburger */}
        <div className="mobile-actions" style={{ display: "none", alignItems: "center", gap: "0.5rem" }}>
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-drawer"
            style={{ background: "var(--bg-card)", color: "var(--text-main)", fontSize: "1.25rem", width: "40px", height: "40px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background-color 0.2s" }}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          <div onClick={() => setMobileMenuOpen(false)} aria-hidden="true" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 90 }} />
          <nav
            id="mobile-drawer"
            aria-label="Mobile navigation"
            style={{ position: "absolute", top: "100%", left: 0, right: 0, backgroundColor: "var(--bg-card)", borderBottom: "1px solid var(--border)", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", zIndex: 95, animation: "slideDown 0.22s ease-out" }}
          >
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)" }}>
                <div aria-hidden="true" style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", flexShrink: 0 }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: "700", color: "var(--text-main)", fontSize: "0.95rem" }}>{user.name}</div>
                  <span className={`badge ${user.role === "admin" ? "badge-error" : user.role === "organizer" ? "badge-warning" : "badge-success"}`} style={{ fontSize: "0.65rem" }}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {[{ to: "/", label: "🏠 Home" }, { to: "/events", label: "🎪 Explore Events" }].map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", fontWeight: "600", color: isActive(to) ? "var(--primary)" : "var(--text-main)" }} aria-current={isActive(to) ? "page" : undefined}>
                {label}
              </Link>
            ))}

            {user && (
              <>
                <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", fontWeight: "600", color: isActive("/my-bookings") ? "var(--primary)" : "var(--text-main)" }}>
                  🎟️ My Bookings
                </Link>
                <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.5rem 0", fontWeight: "600", color: isActive(getDashboardPath()) ? "var(--primary)" : "var(--text-main)" }}>
                  📊 {getDashboardLabel()}
                </Link>
              </>
            )}

            <div style={{ height: "1px", backgroundColor: "var(--border)", margin: "0.25rem 0" }} />

            {user ? (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} aria-label="Sign out" style={{ padding: "0.65rem", borderRadius: "var(--radius-md)", backgroundColor: "var(--error-bg)", border: "1px solid rgba(239,68,68,0.3)", color: "var(--error)", fontWeight: "700", textAlign: "center", cursor: "pointer" }}>
                Sign Out
              </button>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ padding: "0.65rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", textAlign: "center", fontWeight: "600", color: "var(--text-main)" }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary" style={{ padding: "0.65rem", textAlign: "center" }}>
                  Register
                </Link>
              </div>
            )}
          </nav>
        </>
      )}
    </header>
  );
}

export default Navbar;
