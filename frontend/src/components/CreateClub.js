import React, { useState } from "react";
import axios from 'axios';

function CreateClub() {
  const [clubData, setClubData] = useState({
    club_name: "",
    description: "",
    creation_date: "",
  });

  const handleChange = (e) => {
    setClubData({ ...clubData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Club Data Submitted:", clubData); // Log the form data
  console.log("Authorization Token:", localStorage.getItem("token")); // Log token

  try {
    const response = await axios.post("http://localhost:8000/create-club", clubData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("Server Response:", response.data); // Log success response
    alert(response.data.message);
  } catch (error) {
    console.error("Error Response:", error.response || error); // Log error details
    alert(error.response?.data?.error || "Failed to create club");
  }
};

  return (
    <div>
      <h2>Create Club</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="club_name"
          type="text"
          placeholder="Club Name"
          value={clubData.club_name}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={clubData.description}
          onChange={handleChange}
        />
        <input
          name="creation_date"
          type="date"
          value={clubData.creation_date}
          onChange={handleChange}
        />
        <button type="submit">Create Club</button>
      </form>
    </div>
  );
}

export default CreateClub;
