import API from './api';
import { MOCK_EVENTS, MOCK_CATEGORIES } from '../utils/mockData';

/**
 * Event Service Layer
 * 
 * Concept Explanation:
 * - What it is: Service helper wrapping Axios calls for event management.
 * - Why we need it: Decouples API fetching logic from React UI components and provides seamless fallback if backend is offline.
 * - Where we use it: Consumed in Home, Events, EventDetails, and Dashboard views.
 */

export const getPublishedEvents = async (params = {}) => {
  try {
    const response = await API.get('/events', { params });
    if (response.data?.data && response.data.data.length > 0) {
      return {
        events: response.data.data,
        total: response.data.total || response.data.data.length,
        totalPages: response.data.totalPages || 1
      };
    }
  } catch (error) {
    console.warn('[EventService] Backend API unreachable or empty. Using client dataset.');
  }

  // Client-side fallback dataset when DB is initializing
  let events = [...MOCK_EVENTS];
  if (params.search) {
    events = events.filter(e => e.title.toLowerCase().includes(params.search.toLowerCase()));
  }
  if (params.category && params.category !== 'All') {
    events = events.filter(e => e.category === params.category);
  }
  if (params.city && params.city !== 'All') {
    events = events.filter(e => e.city.toLowerCase() === params.city.toLowerCase());
  }

  return {
    events,
    total: events.length,
    totalPages: 1
  };
};

export const getEventDetailsById = async (eventId) => {
  try {
    const response = await API.get(`/events/${eventId}`);
    if (response.data?.data) {
      return response.data.data;
    }
  } catch (error) {
    console.warn(`[EventService] Event ID ${eventId} fetch error. Checking mock fallback.`);
  }

  return MOCK_EVENTS.find(e => e.id === eventId) || MOCK_EVENTS[0];
};

export const getActiveCategories = async () => {
  try {
    const response = await API.get('/categories');
    if (response.data?.data && response.data.data.length > 0) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('[EventService] Category fetch error. Using mock categories.');
  }

  return MOCK_CATEGORIES;
};

export const createEvent = async (eventData) => {
  const response = await API.post('/events', eventData);
  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const response = await API.put(`/events/${eventId}`, eventData);
  return response.data;
};

export const deleteEvent = async (eventId) => {
  const response = await API.delete(`/events/${eventId}`);
  return response.data;
};
