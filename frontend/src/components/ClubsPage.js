import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ClubsPage.css';  // Ensure you have the updated styles

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

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
                <h3 className="club-name">{club.club_name}</h3>
              </div>
              <p className="club-description">{club.description}</p>
              {/* Optionally, you can add icons, links, or more details */}
              <button className="join-btn">Join Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubsPage;
