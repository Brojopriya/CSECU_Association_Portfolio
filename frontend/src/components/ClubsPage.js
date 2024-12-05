import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook
import axios from 'axios';
import './ClubsPage.css';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialize the navigate function

  useEffect(() => {
    // Fetch the clubs
    axios
      .get('http://localhost:8000/clubs/all')
      .then((response) => {
        if (response.data.clubs && Array.isArray(response.data.clubs)) {
          setClubs(response.data.clubs);
        } else {
          setMessage('No clubs found.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching clubs:', err);
        setMessage('Error loading clubs. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Handle the exploration of a club
  const handleExplore = (clubId) => {
    navigate(`/clubs/${clubId}`);  // Navigate to the ClubDetailsPage for the selected club
  };

  return (
    <div className="clubs-page">
      <h1 className="page-title">Our Clubs</h1>
      {loading ? (
        <div className="loading-container">
          <p>Loading clubs...</p>
        </div>
      ) : message ? (
        <p className="error-message">{message}</p>
      ) : clubs.length === 0 ? (
        <p>No clubs available at the moment.</p>
      ) : (
        <div className="clubs-container">
          {clubs.map((club) => (
            <div className="club-card" key={club.club_id}>
              <div className="club-header">
                {club.profile_photo ? (
                  <img 
                    src={`http://localhost:8000/${club.profile_photo}`} 
                    alt={club.club_name} 
                    className="club-image" 
                  />
                ) : (
                  <div className="club-image-placeholder">No Image</div>
                )}
                <h3 className="club-name">{club.club_name}</h3>
              </div>
              <p className="club-description">{club.description}</p>
              <button className="explore-btn" onClick={() => handleExplore(club.club_id)}>
                EXPLORE
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubsPage;
