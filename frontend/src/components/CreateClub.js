import React, { useState } from "react";
import axios from 'axios';
import './CreateClub.css';  // Optional: Add a CSS file for better styling

function CreateClub() {
  const [clubData, setClubData] = useState({
    club_name: "",
    description: "",
    creation_date: "",
    image: null,
    video: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClubData({ ...clubData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setClubData({ ...clubData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('club_name', clubData.club_name);
    formData.append('description', clubData.description);
    formData.append('creation_date', clubData.creation_date);
    if (clubData.image) formData.append('image', clubData.image);
    if (clubData.video) formData.append('video', clubData.video);

    try {
      const response = await axios.post("http://localhost:8000/create-club", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data',  // Set content type for file uploads
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
        
        <div className="form-group">
          <label>Upload Club Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="form-group">
          <label>Upload Club Video</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="submit-btn">Create Club</button>
      </form>
    </div>
  );
}

export default CreateClub;
