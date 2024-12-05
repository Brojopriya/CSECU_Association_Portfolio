import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // State to store user details
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details from localStorage
  useEffect(() => {
    const storedUserDetails = JSON.parse(localStorage.getItem('userDetails'));
    if (storedUserDetails) {
      setUserDetails(storedUserDetails);
    }
  }, []);

  // Button navigation handlers
  const handleViewClubs = () => navigate('/clubs');
  const handleViewEvents = () => navigate('/events');
  const handleViewResources = () => navigate('/resources');
  const handleDeleteAccount = () => navigate('/delete-account');
  const handleLogout = () => {
    localStorage.removeItem('userDetails');
    navigate('/logout');
  };

  return (
    <div className="dashboard-container">
      {/* Logo on the top-left corner */}
      <img src="/logo1.png" alt="Logo" className="logo-img" />
<p className="logo-caption">University of Chittagong</p> {/* Caption below the logo */}
      
      {/* Top-right: Profile section with user details, logout, and delete account */}
      <div className="profile-section">
        {userDetails ? (
          <div className="profile-info">
            <div className="user-details">
              <h2 className="username">{userDetails.name}</h2>
              <p className="user-role">{userDetails.role}</p>
              <button className="btn btn-info">View Profile</button>
            </div>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}

        {/* Logout and Delete Account buttons */}
        <div className="top-right-buttons">
          <button className="btn btn-danger" onClick={handleDeleteAccount}>
            Delete Account
          </button>
          <button className="btn btn-warning" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Highlighted Welcome Message */}
      <h1 className="dashboard-title">
       <span className="highlight">CSECU ASSOCIATION</span> 
      </h1>
            <h2 className="dashboard-title1">
        Welcome to the <span className="highlight">Digital Frontier</span> – it’s time to explore
      </h2>

      {/* Dynamic Button Group with Images */}
      <div className="button-group">
        <div className="card" onClick={handleViewClubs}>
          <img src="/club.jpg" alt="Clubs" className="card-img" />
          <div className="card-overlay">
            <button className="btn btn-primary">View All Clubs</button>
          </div>
        </div>
        <div className="card" onClick={handleViewEvents}>
          <img src="/event.jpg" alt="Events" className="card-img" />
          <div className="card-overlay">
            <button className="btn btn-secondary">View All Events</button>
          </div>
        </div>
        <div className="card" onClick={handleViewResources}>
          <img src="/re.jpg" alt="Resources" className="card-img" />
          <div className="card-overlay">
            <button className="btn btn-success">View All Resources</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
