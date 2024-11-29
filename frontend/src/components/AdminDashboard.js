import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

const handleViewClubs = () => {
    navigate('/clubs');
  };

  const handleViewEvents = () => {
    navigate('/events');
  };

  const handleViewResources = () => {
    navigate('/resources');
  };


  // Function to navigate to the Create Club page
 const handleCreateClub = () => {
    navigate("/create-club");
  };

  const handleCreateEvent = () => {
    navigate("/create-event");
  };


  
  // Function to handle logout and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <button onClick={handleViewClubs}>View All Clubs</button>
      <button onClick={handleViewEvents}>View All Events</button>
      <button onClick={handleViewResources}>View All Resources</button>

     

      {/* Admin Functionalities */}
      <div className="admin-actions">
        <button onClick={handleCreateClub} className="action-btn">
          Create Club
        </button>
        <button onClick={handleCreateEvent} className="action-btn">
          Create Event
        </button>

         {/* Logout Button */}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
