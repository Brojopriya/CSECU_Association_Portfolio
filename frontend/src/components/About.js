import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>
      <p className="about-text">
        The Department of Computer Science & Engineering (CSE) at the University of Chittagong launched its undergraduate major programme in 2001 and its postgraduate programme in 2010. CSE department currently hosts 22 faculty members, including eight Professors and around 400 students. There are 300 undergraduate students, 100 MSc students, and a few postgraduate research students in CSE department, carrying out learning and research activities in a very co-operative and friendly environment.
      </p>
      <button className="about-btn" onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
}

export default About;
