import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FrontPage.css';

function FrontPage() {
  const navigate = useNavigate();

  return (
    <div className="front-page">
      {/* Logo Section */}
      <header className="header">
        <img src="/logo.png" alt="CSECU Logo" className="logo" />
      </header>

      {/* Hero Section with Welcome Message below logo */}
      <section className="hero">
        <h1 className="hero-title">Welcome to CSECU!</h1>
        <p className="hero-subtitle">Join us in revolutionizing Computer Science and Engineering</p>
      </section>

      {/* About CSE Section */}
      <section className="about-cse">
  
          The Department of Computer Science & Engineering (CSE) at the University of Chittagong launched its undergraduate major programme in 2001 and its postgraduate programme in 2010.
          CSE department currently hosts 22 faculty members, including eight Professors, and around 400 students.
      
      </section>

      {/* Buttons Section */}
      <div className="button-group">
        <button className="btn primary" onClick={() => navigate('/signup')}>Get Started</button>
        <button className="btn secondary" onClick={() => navigate('/login')}>Get Quotes</button>
      </div>
    </div>
  );
}

export default FrontPage;
