import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css"; // For custom styling

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // To store user info (username, role)

  // UseEffect to simulate getting user data
  useEffect(() => {
    // In a real app, you'd fetch this from an API or use the token to get the logged-in user's info
    const loggedInUser = JSON.parse(localStorage.getItem("user")); // Assume user info is stored in localStorage
    setUser(loggedInUser || { username: "Welcome!", role: "Admin" });
  }, []);

  const handleViewClubs = () => {
    navigate('/clubs');
  };

  const handleViewEvents = () => {
    navigate('/events');
  };

  const handleViewResources = () => {
    navigate('/resources');
  };

  // Navigate to Create Club Page
  const handleCreateClub = () => {
    navigate("/create-club");
  };

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  // Function to handle logout and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Assuming user data is also in localStorage
    navigate("/login");
  };

  // Function to handle user deletion (simplified version)
  const handleDeleteAccount = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        {/* Display Profile Info */}
        <div className="profile">
          <p>{user.username}</p>
          <p>{user.role}</p>
        </div>

        {/* Logout and Delete Account buttons */}
        <div className="actions">
          <button onClick={handleDeleteAccount} className="delete-btn">
            Delete Account
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <h1>Discover new Horizons—explore now!</h1>

      {/* Dashboard Sections */}
      <div className="dashboard-actions">
        <button onClick={handleViewClubs} className="action-btn">
         Clubs
        </button>
        <button onClick={handleViewEvents} className="action-btn">
         Events
        </button>
        <button onClick={handleViewResources} className="action-btn">
          Resources
        </button>
      </div>

      {/* Admin Functionalities */}
      <div className="admin-actions">
        <button onClick={handleCreateClub} className="action-btn">
          Create Club
        </button>
        <button onClick={handleCreateEvent} className="action-btn">
          Create Event
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
