import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ClubDetailsPage.css';

const ClubDetailsPage = () => {
  const { clubId } = useParams();  // Retrieve clubId from URL
  const [club, setClub] = useState(null);
  const [joining, setJoining] = useState(false);  // To manage the joining process
  const [joinError, setJoinError] = useState(null);  // To manage any error while joining
  const [hasJoined, setHasJoined] = useState(false);  // To track if the user has joined
  const [welcomeMessage, setWelcomeMessage] = useState(null);  // Store welcome message
  
  useEffect(() => {
    // Fetch the details for the specific club using the clubId
    axios
      .get(`http://localhost:8000/clubs/${clubId}`)
      .then(response => {
        const clubData = response.data.club;
        setClub({
          name: clubData.club_name,  // club_name in the database
          description: clubData.description,
          startDate: new Date(clubData.creation_date).toLocaleDateString(),  // Format the date
          totalMembers: clubData.total_members,
          about: clubData.about || 'No additional information available'  // Check if 'about' exists
        });
      })
      .catch(error => {
        console.error("Error fetching club details:", error);
      });
  }, [clubId]);

  // Handle Join Club Button Click
  const handleJoinClub = () => {
    setJoining(true);
    setJoinError(null);  // Clear any previous error

    // Make a POST request to join the club
    axios
  .post(
    'http://localhost:8000/club/join', 
    { club_id: clubId }, // Request body with club ID
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Add JWT token from local storage
      }
    }
  )
  .then(response => {
    setJoining(false);

    // Update total members after successful join
    setClub(prevState => ({
      ...prevState,
      totalMembers: prevState.totalMembers + 1,
    }));

    // Set user as joined and show welcome message
    setHasJoined(true);
    setWelcomeMessage(response.data.message); // Use server response message
  })
  .catch(error => {
    setJoining(false);
    if (error.response && error.response.data.message) {
      setJoinError(error.response.data.message);
    } else {
      setJoinError('Error joining club. Please try again later.');
    }
    console.error('Error joining club:', error);
  });

  };

  return (
    <div className="club-details-page">
      {club ? (
        <div className="club-details-container">
          <h2 className="club-name">{club.name}</h2>
          <p className="club-description">{club.description}</p>
          <p className="club-start-date"><strong>Started on:</strong> {club.startDate}</p>
          <p className="club-members"><strong>Total Members:</strong> {club.totalMembers}</p>
          <p className="club-about"><strong>About the Club:</strong> {club.about}</p>

          {/* Show Welcome Message if user successfully joins */}
          {hasJoined && (
            <div className="welcome-message">
              <h3>Welcome to the club!</h3>
              <p>{welcomeMessage}</p>
            </div>
          )}

          {/* Show Join Button or Thank You Message */}
          {!hasJoined ? (
            <button 
              className="join-btn" 
              onClick={handleJoinClub} 
              disabled={joining}
            >
              {joining ? 'Joining...' : 'Join Club'}
            </button>
          ) : (
            <button className="thank-you-btn" disabled>
              Thank you for joining!
            </button>
          )}

          {/* Show error message if join fails */}
          {joinError && <p className="error-message">{joinError}</p>}
        </div>
      ) : (
        <p>Loading club details...</p>
      )}
    </div>
  );
};

export default ClubDetailsPage;
