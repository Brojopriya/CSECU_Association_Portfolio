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

  const handleRegister = () => {
    // Simulate registration (you can enhance this with an API call)
    alert(`Successfully registered for ${event?.event_name}!`);
  };

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
          <p className="event-description">{event.description}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Location:</strong> {event.location}</p>

          {/* Media Section */}
          <div className="media-section">
            <h3>Photos</h3>
            <div className="media-container">
              {event.photos?.length > 0 ? (
                event.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8000/${photo}`}
                    alt={`Event Photo ${index + 1}`}
                    className="event-photo"
                  />
                ))
              ) : (
                <p>No photos available for this event.</p>
              )}
            </div>

            <h3>Videos</h3>
            <div className="media-container">
              {event.videos?.length > 0 ? (
                event.videos.map((video, index) => (
                  <video key={index} controls className="event-video">
                    <source src={`http://localhost:8000/${video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ))
              ) : (
                <p>No videos available for this event.</p>
              )}
            </div>
          </div>

          {/* Registration Button */}
          <button onClick={handleRegister} className="register-btn">
            Register for Event
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
