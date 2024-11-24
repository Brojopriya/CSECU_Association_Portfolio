import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DeleteAccountPage = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .delete('http://localhost:8000/delete-account', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          setMessage('Account deleted successfully. Redirecting to signup...');
          localStorage.removeItem('token');
          setTimeout(() => {
            navigate('/signup');
          }, 5000);
        })
        .catch(() => {
          setMessage('Error deleting account.');
        });
    }
  };

  return (
    <div>
      <h1>Delete Account</h1>
      {message && <p>{message}</p>}
      <button onClick={handleDeleteAccount}>Confirm Deletion</button>
    </div>
  );
};

export default DeleteAccountPage;
