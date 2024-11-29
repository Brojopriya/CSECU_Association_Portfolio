import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios
        .get('http://localhost:8000/resources/all', { // Corrected endpoint
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setResources(response.data.resources);
          setLoading(false); // Set loading to false when data is loaded
        })
        .catch((err) => {
          console.error(err);
          setMessage('Error loading resources.');
          setLoading(false); // Set loading to false even in case of error
        });
    } else {
      setMessage('Access denied. Please log in.');
      setLoading(false); // Set loading to false when no token is available
    }
  }, []);

  return (
    <div>
      <h1>All Resources</h1>
      {loading && <p>Loading resources...</p>} {/* Show loading text */}
      {message && <p>{message}</p>}
      <ul>
        {resources.length > 0 ? (
          resources.map((resource) => (
            <li key={resource.resource_id}>
              <strong>{resource.title}</strong>
              <p>Type: {resource.type}</p>
              <p>Uploaded on: {new Date(resource.upload_date).toLocaleString()}</p>
            </li>
          ))
        ) : (
          <p>No resources available.</p>
        )}
      </ul>
    </div>
  );
};

export default ResourcesPage;