import React, { useEffect, useState } from "react";
import "./AllUsers.css"; // For custom styling

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Fetch all users on component mount
  useEffect(() => {
    fetch("http://localhost:8000/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass token for authentication
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => setUsers(data.users))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="all-users">
      <h1>All Users</h1>
      {error && <p className="error">{error}</p>}
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone_number}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default AllUsers;
