import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove token from localStorage to log out the user
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login page
  }, [navigate]);

  return (
    <div>
      <h1>Logging out...</h1>
      <p>You are being logged out. Please wait.</p>
    </div>
  );
};

export default LogoutPage;
