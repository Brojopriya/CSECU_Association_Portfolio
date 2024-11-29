import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleViewClubs}>View All Clubs</button>
      <button onClick={handleViewEvents}>View All Events</button>
      <button onClick={handleViewResources}>View All Resources</button>

      {/* Actions */}
      <button onClick={handleDeleteAccount}>Delete Account</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;