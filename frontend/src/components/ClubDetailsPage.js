import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ClubDetailsPage.css';

const ClubDetailsPage = () => {
  const { clubId } = useParams(); // Retrieve clubId from URL parameters
  const [club, setClub] = useState(null); // Store club details
  const [joining, setJoining] = useState(false); // Manage joining state
  const [joinError, setJoinError] = useState(null); // Track errors during joining
  const [hasJoined, setHasJoined] = useState(false); // Track if user has joined the club
  const [welcomeMessage, setWelcomeMessage] = useState(null); // Welcome message upon joining

  // Fetch club details when the component mounts
  useEffect(() => {
    axios
      .get(`http://localhost:8000/clubs/${clubId}`)
      .then((response) => {
        const clubData = response.data.club;
        setClub({
          name: clubData.club_name,
          description: clubData.description || 'No description provided',
          startDate: new Date(clubData.creation_date).toLocaleDateString(),
          totalMembers: clubData.total_members,
          about: clubData.about || 'No additional information available',
          profilePhoto: clubData.profile_photo,
          additionalPhoto: clubData.additional_photo,
          video: clubData.video,
        });
      })
      .catch((error) => {
        console.error('Error fetching club details:', error);
      });
  }, [clubId]);

  // Handle the join club button click
  const handleJoinClub = () => {
    setJoining(true);
    setJoinError(null);

    axios
      .post(
        'http://localhost:8000/club/join',
        { club_id: clubId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
        setJoining(false);
        setClub((prevClub) => ({
          ...prevClub,
          totalMembers: prevClub.totalMembers + 1,
        }));
        setHasJoined(true);
        setWelcomeMessage(response.data.message || 'Welcome to the club!');
      })
      .catch((error) => {
        setJoining(false);
        setJoinError(
          error.response?.data?.message ||
            'Error joining the club. Please try again later.'
        );
        console.error('Error joining club:', error);
      });
  };

  return (
    <div className="club-details-page">
      {club ? (
        <div className="club-details-container">
          {/* Club Name */}
          <h2 className="club-name">{club.name}</h2>

          {/* Club Details */}
        
          <p className="club-start-date">
            <strong>Started on:</strong> {club.startDate}
          </p>
          <p className="club-members">
            <strong>Total Members:</strong> {club.totalMembers}
          </p>
          <p className="club-about">
            <strong>About the Club:</strong> {club.description}
          </p>

          {/* Club Media Section */}
          {club && (
  <div className="media-gallery">
    {/* Profile Photo */}
    {club.profilePhoto && (
      <div className="media-item">
        <img
          src={`http://localhost:8000/${club.profilePhoto}`}
          alt="Profile"
        />
      </div>
    )}

    {/* Additional Photo */}
    {club.additionalPhoto && (
      <div className="media-item">
        <img
          src={`http://localhost:8000/${club.additionalPhoto}`}
          alt="Additional"
        />
      </div>
    )}

    {/* Club Video */}
    {club.video && (
      <div className="media-item">
        <video controls>
          <source
            src={`http://localhost:8000/${club.video}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    )}
  </div>
)}

          {/* Join Club Section */}
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

          {/* Welcome Message */}
          {hasJoined && welcomeMessage && (
            <div className="welcome-message">
              <h3>Welcome to the club!</h3>
              <p>{welcomeMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {joinError && <p className="error-message">{joinError}</p>}
        </div>
      ) : (
        <p>Loading club details...</p>
      )}
    </div>
  );
};

export default ClubDetailsPage;
