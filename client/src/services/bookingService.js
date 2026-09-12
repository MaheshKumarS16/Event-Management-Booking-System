import API from './api';

/**
 * Booking Service Layer
 * 
 * Concept Explanation:
 * - What it is: Service helper wrapping Axios calls for booking operations.
 * - Why we need it: Connects React checkout components to backend REST API endpoints.
 * - Where we use it: Consumed in Checkout, BookingConfirmation, MyBookings, and BookingDetails pages.
 */

export const createBookingApi = async (eventId, tickets, mockPaymentMethod = 'Mock Card') => {
  const response = await API.post('/bookings', {
    eventId,
    tickets,
    mockPaymentMethod
  });
  return response.data;
};

export const getUserBookingsApi = async () => {
  const response = await API.get('/bookings');
  return response.data;
};

export const getBookingByIdApi = async (id) => {
  const response = await API.get(`/bookings/${id}`);
  return response.data;
};

export const cancelBookingApi = async (id) => {
  const response = await API.put(`/bookings/${id}/cancel`);
  return response.data;
};
