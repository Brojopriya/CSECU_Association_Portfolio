import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FrontPage.css';

function FrontPage() {
  const navigate = useNavigate();

  return (
    <div className="front-page">
      {/* Logo in Top-Left Corner */}
      <img
        src="/cse.png"
        alt="CSECU Logo"
        className="logo"
        onClick={() => navigate('/')} // Optional: Navigate to home or other route on click
      />

      {/* University Logo with Caption */}
<div className="university-logo-container">
  <img
    src="/logo1.png" // Replace with actual university logo path
    alt="University Logo"
    className="university-logo"
    onClick={() => navigate('/')}
  />
  <p className="university-caption">University of Chittagong</p> {/* Caption below logo */}
</div>


      {/* About & Contact Links in Top-Right Corner */}
      <div className="nav-links">
        <a href="/about">About</a>
        <a href="/contact">Contact us</a>
      </div>


      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Welcome to CSECU</h1>
        <p className="hero-subtitle">Join us in revolutionizing Computer Science and Engineering</p>
      </section>

      {/* Buttons in Top-Right Corner */}
      <div className="button-group">
        <button className="btn primary" onClick={() => navigate('/signup')}>
          Get Started
        </button>
        <button className="btn secondary" onClick={() => navigate('/login')}>
          Get Quotes
        </button>
      </div>
    </div>
  );
}

export default FrontPage;
