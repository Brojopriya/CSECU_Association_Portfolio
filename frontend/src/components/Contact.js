import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-text">For inquiries, reach out to us via:</p>
      <p className="contact-info">📧 Email:brojopriyanag@gmail.com</p>
      <p className="contact-info">📞 Phone: +880 1978 896352</p>
      <button className="contact-btn" onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
}

export default Contact;
