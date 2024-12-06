import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // To store user info (username, role)

  // Simulate getting logged-in user info
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser || { username: "Admin", role: "Administrator" });
  }, []);

  const handleViewClubs = () => navigate("/clubs");
  const handleViewEvents = () => navigate("/events");
  const handleViewResources = () => navigate("/resources");
  const handleShareThoughts = () => navigate("/share-thought");
  const handleViewUsers = () => navigate("/all-users");
  const handleCreateClub = () => navigate("/create-club");
  const handleCreateEvent = () => navigate("/create-event");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="topbar">
      <div className="logo">CSECU ASSOCIATION</div>
        <div className="profile">
          <p>{user.username}</p>
          <p className="role">{user.role}</p>
        </div>
        <div className="actions">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="content">
        <h1>Welcome</h1>
        <p>Explore the admin functionalities below:</p>

        {/* Cards Section */}
        <div className="dashboard-cards">
          {/* Clubs */}
          <div
            className="card"
            onClick={handleViewClubs}
            style={{
              backgroundImage: `url('/club.jpg')`,  // Path to image in the public folder
            }}
          >
            <div className="card-title">Clubs</div>
          </div>

          {/* Events */}
          <div
            className="card"
            onClick={handleViewEvents}
            style={{
              backgroundImage: `url('/event.jpg')`,  // Path to image in the public folder
            }}
          >
            <div className="card-title">Events</div>
          </div>

          {/* Resources */}
          <div
            className="card"
            onClick={handleViewResources}
            style={{
              backgroundImage: `url('/re.jpg')`,  // Path to image in the public folder
            }}
          >
            <div className="card-title">Resources</div>
          </div>

          {/* Share Thoughts */}
          <div
            className="card"
            onClick={handleShareThoughts}
            style={{
              backgroundImage: `url('/share-thoughts.jpg')`,  // Path to image in the public folder
            }}
          >
            <div className="card-title">Share Thoughts</div>
          </div>

          {/* View All Users */}
          <div
            className="card"
            onClick={handleViewUsers}
            style={{
              backgroundImage: `url('/user.jpg')`,  // Path to image in the public folder
            }}
          >
            <div className="card-title">View All Users</div>
          </div>

          {/* Create Club */}
          <div
            className="card"
            onClick={handleCreateClub}
            style={{
              backgroundImage: `url('/cb.jpg')`,  // Path to image in the public folder
            }}
          >
            <div className="card-title">Create Club</div>
          </div>

          {/* Create Event */}
          <div
            className="card"
            onClick={handleCreateEvent}
            style={{
              backgroundImage: `url('/ev.jpg')`,  // Path to image in the public folder
            }}
          >
            <div className="card-title">Create Event</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
