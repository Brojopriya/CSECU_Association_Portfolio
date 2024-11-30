import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './EventsPage.css';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:8000/events/all')
      .then((response) => {
        if (response.data.events && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
        } else {
          setMessage('No events found.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        setMessage('Error loading events. Please try again later.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="event-page">
      <h1 className="page-title">Upcoming Events</h1>
      {loading ? (
        <div className="loading-container">
          <p>Loading events...</p>
        </div>
      ) : message ? (
        <p className="error-message">{message}</p>
      ) : events.length === 0 ? (
        <p>No events available at the moment.</p>
      ) : (
        <div className="events-container">
          {events.map((event) => (
            <div className="event-card" key={event.event_id}>
              <div className="event-header">
                <h3 className="event-name">{event.event_name}</h3>
              </div>
              <p className="event-description">{event.description}</p>
              {/* Button for Interested */}
              <button
                className="interest-button"
                onClick={() => window.location.href = `/events/${event.event_id}`} // Redirect to the event details page
              >
                Interested
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventPage;
