import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EventDetails.css';

const EventDetails = () => {
  const { eventId } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [hasRegistered, setHasRegistered] = useState(false); // Track if user has already registered for the event

  useEffect(() => {
    // Fetch event details from the backend
    axios
      .get(`http://localhost:8000/events/${eventId}`)
      .then((response) => {
        if (response.data.event) {
          setEvent(response.data.event);
        } else {
          setMessage('Event not found.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching event details:', error);
        setMessage('Failed to load event details. Please try again later.');
        setLoading(false);
      });
  }, [eventId]);

  const handleRegister = async () => {
    setLoading(true);
    setMessage(''); // Clear any previous messages

    try {
      const response = await axios.post(
        `http://localhost:8000/register/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Get token from localStorage
          },
        }
      );

      if (response.data.success) {
        setHasRegistered(true); // Mark as registered
        setMessage(`Successfully registered for ${event?.event_name}!`);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error registering for the event:', error);
      setMessage('You are already registered for this event');
    } finally {
      setLoading(false);
    }
  };

  // Date formatting function (place this inside your component)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options); // Formats like "Dec 1, 2024"
  };

  // Format the event date
  const formattedDate = event ? formatDate(event.event_date) : '';

  if (loading) return <p>Loading event details...</p>;
  if (message) return <p className="error-message">{message}</p>;

  return (
    <div className="event-details-page">
      <button onClick={() => navigate('/events')} className="back-btn">
        Back to Events
      </button>

      {event && (
        <div className="event-details-container">
          <h1 className="event-title">{event.event_name}</h1>
          <p className="event-description">{event.event_description}</p>
          <p><strong>Date:</strong> {formattedDate}</p> {/* Use the formatted date */}
          <p><strong>Location:</strong> {event.location}</p>

          {/* Registration Button */}
          {!hasRegistered ? (
            <button onClick={handleRegister} className="register-btn">
              Register for Event
            </button>
          ) : (
            <p>You are already registered for this event!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDetails;
