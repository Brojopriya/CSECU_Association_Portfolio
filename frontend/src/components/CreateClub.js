import React, { useState } from "react";
import axios from 'axios';
import './CreateClub.css';  // Optional: Add a CSS file for better styling

function CreateClub() {
  const [clubData, setClubData] = useState({
    club_name: "",
    description: "",
    creation_date: "",
    profile_photo: null,      // Profile photo
    additional_photo: null,   // Additional photo
    video: null                // Video file
  });

  // Handle input changes for text and file inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_photo" || name === "additional_photo" || name === "video") {
      // If it's a file input, store the file in the state
      setClubData({ ...clubData, [name]: files[0] });
    } else {
      setClubData({ ...clubData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("club_name", clubData.club_name);
    formData.append("description", clubData.description);
    formData.append("creation_date", clubData.creation_date);
    
    // Append the files to the FormData object if they exist
    if (clubData.profile_photo) formData.append("profile_photo", clubData.profile_photo);
    if (clubData.additional_photo) formData.append("additional_photo", clubData.additional_photo);
    if (clubData.video) formData.append("video", clubData.video);

    try {
      const response = await axios.post("http://localhost:8000/create-club", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'multipart/form-data', // Specify content type for file uploads
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

        {/* Profile photo input */}
        <div className="form-group">
          <label>Profile Photo</label>
          <input
            name="profile_photo"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {/* Additional photo input */}
        <div className="form-group">
          <label>Additional Photo</label>
          <input
            name="additional_photo"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        {/* Video file input */}
        <div className="form-group">
          <label>Club Introduction Video</label>
          <input
            name="video"
            type="file"
            accept="video/*"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-btn">Create Club</button>
      </form>
    </div>
  );
}

export default CreateClub;
