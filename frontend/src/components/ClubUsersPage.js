import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ClubUsersPage.css';

const ClubUsersPage = () => {
  const { clubId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/clubs/${clubId}/users`)
      .then(response => {
        setUsers(response.data.users); // Assume the API returns a list of users
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to load user data');
        setLoading(false);
        console.error('Error fetching users:', error);
      });
  }, [clubId]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="club-users-page">
      <h2>Members of the Club</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClubUsersPage;
