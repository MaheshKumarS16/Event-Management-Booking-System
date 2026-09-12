import React, { useState } from 'react';

/**
 * Reusable Ticket Selector Component
 * 
 * Concept Explanation:
 * - What it is: Interactive UI component with quantity decrement/increment [-] [+] controls per ticket tier.
 * - Why we need it: Prevents invalid quantities (< 0 or > available) and calculates totals dynamically.
 * - Where we use it: Rendered on EventDetails sidebar and Checkout page.
 */
function TicketSelector({ ticketTypes = [], onSelectionChange }) {
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    ticketTypes.forEach(ticket => {
      init[ticket._id || ticket.id] = 0;
    });
    return init;
  });

  const handleIncrement = (ticket) => {
    const id = ticket._id || ticket.id;
    const available = ticket.quantity - ticket.soldQuantity;
    const current = quantities[id] || 0;

    if (current < available) {
      const updated = { ...quantities, [id]: current + 1 };
      setQuantities(updated);
      notifyParent(updated);
    }
  };

  const handleDecrement = (ticket) => {
    const id = ticket._id || ticket.id;
    const current = quantities[id] || 0;

    if (current > 0) {
      const updated = { ...quantities, [id]: current - 1 };
      setQuantities(updated);
      notifyParent(updated);
    }
  };

  const notifyParent = (currentQuantities) => {
    let grandTotal = 0;
    let totalQty = 0;
    const selectedTickets = [];

    ticketTypes.forEach(ticket => {
      const id = ticket._id || ticket.id;
      const qty = currentQuantities[id] || 0;
      if (qty > 0) {
        grandTotal += ticket.price * qty;
        totalQty += qty;
        selectedTickets.push({
          ticketTypeId: id,
          name: ticket.name,
          price: ticket.price,
          quantity: qty
        });
      }
    });

    if (onSelectionChange) {
      onSelectionChange({ selectedTickets, grandTotal, totalQty });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {ticketTypes.map(ticket => {
        const id = ticket._id || ticket.id;
        const available = ticket.quantity - ticket.soldQuantity;
        const qty = quantities[id] || 0;
        const isSoldOut = available <= 0;

        return (
          <div 
            key={id}
            style={{
              padding: '1.1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-dark)',
              border: qty > 0 ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'border-color 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f8fafc' }}>{ticket.name}</h4>
                <span style={{ fontSize: '0.8rem', color: isSoldOut ? 'var(--error)' : 'var(--text-dim)' }}>
                  {isSoldOut ? 'Sold Out' : `${available} ticket(s) remaining`}
                </span>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                ₹{ticket.price}
              </span>
            </div>

            {/* Quantity [-] [+] Control */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Select Quantity:</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--bg-card)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                <button
                  type="button"
                  disabled={qty <= 0 || isSoldOut}
                  onClick={() => handleDecrement(ticket)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-dark)',
                    color: qty <= 0 ? 'var(--text-dim)' : '#f8fafc',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    cursor: qty <= 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  -
                </button>

                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '800', color: '#f8fafc' }}>
                  {qty}
                </span>

                <button
                  type="button"
                  disabled={qty >= available || isSoldOut}
                  onClick={() => handleIncrement(ticket)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    cursor: qty >= available ? 'not-allowed' : 'pointer'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TicketSelector;
