import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  // State to store user details
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details from the backend on component mount
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (token) {
      // Fetch user details from backend
      fetch("http://localhost:8000/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Parse JSON response
          } else {
            throw new Error("Failed to fetch user details");
          }
        })
        .then((data) => {
          if (data.success) {
            setUserDetails(data.userDetails); // Save user details to state
          } else {
            console.error(data.message);
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
          navigate("/login"); // Redirect to login if token is invalid or request fails
        });
    } else {
      navigate("/login"); // Redirect to login if no token is found
    }
  }, [navigate]);

  // Button navigation handlers
  const handleViewClubs = () => navigate("/clubs");
  const handleViewEvents = () => navigate("/events");
  const handleViewResources = () => navigate("/resources");
  const handleDeleteAccount = () => navigate("/delete-account");
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from localStorage
    localStorage.removeItem("userDetails"); // Clear user details
    navigate("/login"); // Redirect to login
  };
  const handleShareThoughts = () => navigate("/share-thought");

  return (
    <div className="dashboard-container">
      {/* Logo on the top-left corner */}
      <img src="/logo1.png" alt="Logo" className="logo-img" />
      <p className="logo-caption">University of Chittagong</p>

      {/* Profile Section */}
      <div className="profile-section">
        {userDetails ? (
          <div className="profile-info">
            <h className="userName">{userDetails.userName}</h>
            <p className="user-id">ID: {userDetails.userId}</p>
            <p className="user-role"> {userDetails.userRole}</p>
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

      {/* Welcome Message */}
      <h1 className="dashboard-title">
        <span className="highlight">CSECU ASSOCIATION</span>
      </h1>
      <h2 className="dashboard-title1">
        Welcome to the <span className="highlight">Digital Frontier</span> – it’s time to explore
      </h2>

      {/* Dynamic Button Group */}
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
        {/* Share Your Thoughts Button */}
        <div className="card" onClick={handleShareThoughts}>
          <img src="/share-thoughts.jpg" alt="Share Thoughts" className="card-img" />
          <div className="card-overlay">
            <button className="btn btn-info">Share Your Thoughts</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
