import React from "react";
import { Link } from "react-router-dom";

/**
 * Reusable Event Card Component
 * Responsive image, pricing, availability. Works with live API and mock data.
 */
function EventCard({ event }) {
  const eventId = event._id || event.id;

  const totalCap =
    event.totalCapacity ||
    (event.ticketTypes?.length
      ? event.ticketTypes.reduce((acc, t) => acc + (t.quantity || 0), 0)
      : 100);
  const sold =
    event.soldTickets !== undefined
      ? event.soldTickets
      : event.ticketTypes?.length
      ? event.ticketTypes.reduce((acc, t) => acc + (t.soldQuantity || 0), 0)
      : 0;
  const availableTickets = Math.max(0, totalCap - sold);
  const isSoldOut = availableTickets <= 0;

  const startingPrice =
    event.startingPrice !== undefined
      ? event.startingPrice
      : event.ticketTypes?.length
      ? Math.min(...event.ticketTypes.map((t) => t.price))
      : 0;

  const categoryName =
    typeof event.category === "object"
      ? event.category?.name
      : event.category || "General";

  return (
    <article
      className="glass-card event-card-wrapper"
      style={{ padding: "0", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}
    >
      {/* Event Image */}
      <div style={{ position: "relative", height: "190px", width: "100%", overflow: "hidden", flexShrink: 0 }}>
        <img
          src={event.image}
          alt={`${event.title} event banner`}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.35s ease" }}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80";
          }}
        />
        {/* Category Badge */}
        <span
          aria-label={`Category: ${categoryName}`}
          style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "rgba(15,23,42,0.85)", backdropFilter: "blur(6px)", color: "#ffffff", fontSize: "0.75rem", fontWeight: "700", padding: "0.3rem 0.75rem", borderRadius: "var(--radius-full)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          {categoryName}
        </span>
        {/* Featured Badge */}
        {event.featured && (
          <span
            style={{ position: "absolute", top: "12px", right: "12px", background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)", color: "#ffffff", fontSize: "0.72rem", fontWeight: "800", padding: "0.25rem 0.65rem", borderRadius: "var(--radius-full)", boxShadow: "0 2px 8px rgba(236,72,153,0.4)" }}
          >
            FEATURED
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--text-main)", lineHeight: "1.35", marginBottom: "0.65rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word" }}>
          {event.title}
        </h3>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.4rem", flexWrap: "wrap" }}>
          <span aria-hidden="true">📅</span>
          <span>{event.startDate} {event.startTime ? `• ${event.startTime}` : ""}</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem", minWidth: 0 }}>
          <span aria-hidden="true" style={{ flexShrink: 0 }}>📍</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>
            {event.venue}{event.city ? `, ${event.city}` : ""}
          </span>
        </div>

        {/* Footer: Price + Availability */}
        <div style={{ marginTop: "auto", paddingTop: "0.85rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)", display: "block" }}>Starts from</span>
            <span style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--primary)" }}>₹{startingPrice}</span>
          </div>
          <span className={`badge ${isSoldOut ? "badge-error" : "badge-success"}`} style={{ fontSize: "0.72rem" }}>
            {isSoldOut ? "Sold Out" : `${availableTickets} left`}
          </span>
        </div>

        <Link
          to={`/events/${eventId}`}
          className="btn-primary"
          aria-label={`View details for ${event.title}`}
          style={{ width: "100%", marginTop: "1rem", padding: "0.6rem", fontSize: "0.88rem", textAlign: "center" }}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}

export default EventCard;
