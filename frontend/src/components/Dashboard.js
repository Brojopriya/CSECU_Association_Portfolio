import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Assuming your CSS will be in this file

const Dashboard = () => {
  const navigate = useNavigate();

  // Handle button clicks to navigate to the appropriate page
  const handleViewClubs = () => {
    navigate('/clubs');
  };

  const handleViewEvents = () => {
    navigate('/events');
  };

  const handleViewResources = () => {
    navigate('/resources');
  };

  // Navigate to delete account page
  const handleDeleteAccount = () => {
    navigate('/delete-account');
  };

  // Navigate to logout page
  const handleLogout = () => {
    navigate('/logout');
  };

  return (
    <div className="dashboard-container">
      {/* Top-right Buttons (Logout & Delete Account) */}
      <div className="top-right-buttons">
        <button className="btn btn-danger" onClick={handleDeleteAccount}>
          Delete Account
        </button>
        <button className="btn btn-warning" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-info">
          <div className="user-details">
            <h2 className="username">CSECU</h2>
            <p className="user-role">ASSOCIATION</p>
            <button className="btn btn-info">member</button>
          </div>
        </div>
      </div>

      <h1 className="dashboard-title">Welcome to the digital frontier – it’s time to explore</h1>

      <div className="button-group">
        <div className="card">
          <button className="btn btn-primary" onClick={handleViewClubs}>View All Clubs</button>
        </div>
        <div className="card">
          <button className="btn btn-secondary" onClick={handleViewEvents}>View All Events</button>
        </div>
        <div className="card">
          <button className="btn btn-success" onClick={handleViewResources}>View All Resources</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
