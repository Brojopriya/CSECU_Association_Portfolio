import React, { useState } from "react";
import axios from 'axios';
import './CreateEvent.css';  // Import custom CSS for styling

function CreateEvent() {
  const [eventData, setEventData] = useState({
    event_name: "",
    club_id: "",
    event_date: "",
    event_description: "",
    location: "",
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the token is available
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/create-event", eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(response.data.message); // Display success message
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        // Handle error response from backend
        alert(error.response.data.error || "Failed to create event");
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="create-event-page">
      <div className="form-box">
        <h2>Create Event</h2>
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="event_name">Event Name</label>
            <input
              id="event_name"
              name="event_name"
              type="text"
              placeholder="Event Name"
              value={eventData.event_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="club_id">Club ID</label>
            <input
              id="club_id"
              name="club_id"
              type="text"
              placeholder="Club ID"
              value={eventData.club_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="event_date">Event Date</label>
            <input
              id="event_date"
              name="event_date"
              type="date"
              value={eventData.event_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="event_description">Event Description</label>
            <textarea
              id="event_description"
              name="event_description"
              placeholder="Event Description"
              value={eventData.event_description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="Event Location"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
