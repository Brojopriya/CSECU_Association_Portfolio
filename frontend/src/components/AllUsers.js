import React, { useEffect, useState } from "react";
import "./AllUsers.css"; // For custom styling

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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
      .then((data) => {
        setUsers(data.users);
        setFilteredUsers(data.users); // Initially, show all users
      })
      .catch((err) => setError(err.message));
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter users based on the search query
    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.phone_number.includes(query)
      );
    });

    setFilteredUsers(filtered);
  };

  return (
    <div className="all-users">
      <h1>All Users</h1>
      {error && <p className="error">{error}</p>}

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Name, Email, or Phone"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {filteredUsers.length > 0 ? (
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
            {filteredUsers.map((user) => (
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
