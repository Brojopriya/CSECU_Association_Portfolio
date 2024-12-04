import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminClubsPage.css'; // Optional: Add styling

const AdminClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/clubs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(response => {
        setClubs(response.data.clubs);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching clubs:", error);
        setError("Failed to load clubs");
        setLoading(false);
      });
  }, []);

  const handleCreateClub = () => {
    navigate("/create-club");
  };

  const handleViewDetails = (clubId) => {
    navigate(`/clubs/${clubId}`);
  };

  if (loading) return <p>Loading clubs...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-clubs-page">
      <div className="header">
        <h2>All Clubs</h2>
        <button onClick={handleCreateClub} className="create-club-btn">Create Club</button>
      </div>
      <ul className="club-list">
        {clubs.map(club => (
          <li key={club.id} className="club-item">
            <div className="club-info">
              <h3>{club.club_name}</h3>
              <p>{club.description}</p>
              <button
                onClick={() => handleViewDetails(club.id)}
                className="view-details-btn"
              >
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminClubsPage;
