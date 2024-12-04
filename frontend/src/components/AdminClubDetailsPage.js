import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AdminClubDetailsPage.css';

const ClubDetailsPage = () => {
  const { clubId } = useParams(); // Retrieve clubId from the URL
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch club details and members
    const fetchClubData = async () => {
      try {
        const clubResponse = await axios.get(`http://localhost:8000/clubs/${clubId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClub(clubResponse.data.club);

        const membersResponse = await axios.get(`http://localhost:8000/clubs/${clubId}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setMembers(membersResponse.data.users);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching club details or members:", error);
        setError("Failed to load club data");
        setLoading(false);
      }
    };

    fetchClubData();
  }, [clubId]);

  if (loading) return <p>Loading club details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="club-details-page">
      {club && (
        <div className="club-details-container">
          <h2 className="club-name">{club.club_name}</h2>
          <p className="club-description">{club.description}</p>
          <p className="club-start-date">
            <strong>Started on:</strong> {new Date(club.creation_date).toLocaleDateString()}
          </p>
          <p className="club-members">
            <strong>Total Members:</strong> {club.total_members}
          </p>

          <h3 className="members-header">Club Members</h3>
          {members.length > 0 ? (
            <ul className="members-list">
              {members.map(member => (
                <li key={member.id} className="member-item">
                  <strong>{member.name}</strong> - {member.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No members have joined this club yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminClubDetailsPage;
