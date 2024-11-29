import React, { useState } from "react";
import axios from 'axios';

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
    try {
      const response = await axios.post("http://localhost:8000/create-event", eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert(response.data.message); // Show success message
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create event");
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="event_name"
          type="text"
          placeholder="Event Name"
          value={eventData.event_name}
          onChange={handleChange}
        />
        <input
          name="club_id"
          type="text"
          placeholder="Club ID"
          value={eventData.club_id}
          onChange={handleChange}
        />
        <input
          name="event_date"
          type="date"
          value={eventData.event_date}
          onChange={handleChange}
        />
        <textarea
          name="event_description"
          placeholder="Event Description"
          value={eventData.event_description}
          onChange={handleChange}
        />
        <input
          name="location"
          type="text"
          placeholder="Location"
          value={eventData.location}
          onChange={handleChange}
        />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
