import React, { useState } from "react";
import axios from 'axios';
import './CreateClub.css';  // Optional: Add a CSS file for better styling

function CreateClub() {
  const [clubData, setClubData] = useState({
    club_name: "",
    description: "",
    creation_date: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubData({ ...clubData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/create-club", clubData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json', // Set content type for JSON data
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error Response:", error.response || error);
      alert(error.response?.data?.error || "Failed to create club");
    }
  };

  return (
    <div className="create-club-container">
      <h2>Create Your Club</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Club Name</label>
          <input
            name="club_name"
            type="text"
            placeholder="Enter Club Name"
            value={clubData.club_name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter a brief description of the club"
            value={clubData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Creation Date</label>
          <input
            name="creation_date"
            type="date"
            value={clubData.creation_date}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Create Club</button>
      </form>
    </div>
  );
}

export default CreateClub;
