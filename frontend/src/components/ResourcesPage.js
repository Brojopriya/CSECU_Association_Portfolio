import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch resources when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      axios
        .get('http://localhost:8000/resources/all', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setResources(response.data.resources);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching resources:', err);
          setMessage('Error loading resources.');
          setLoading(false);
        });
    } else {
      setMessage('Access denied. Please log in.');
      setLoading(false);
    }
  }, []);

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!file || !title) {
      alert('Please provide a file and a title.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Access denied. Please log in.');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    // Debugging FormData
    console.log('FormData Entries:', [...formData.entries()]);

    try {
      const response = await axios.post(
        'http://localhost:8000/resources/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Upload Response:', response.data);

      if (response.data.success) {
        alert('Resource uploaded successfully!');
        setResources([...resources, response.data.resource]); // Update resource list
      } else {
        alert('Failed to upload resource.');
      }
    } catch (error) {
      console.error('Upload error:', error.response || error.message);

      if (error.response?.status === 400) {
        alert('Bad Request: Please check the uploaded file and input fields.');
      } else {
        alert('An error occurred while uploading the resource.');
      }
    }
  };

  // Handle file sharing
  const handleShare = (fileUrl) => {
    navigator.clipboard.writeText(fileUrl)
      .then(() => {
        alert('File URL copied to clipboard! Share it with others.');
      })
      .catch(() => {
        alert('Failed to copy file URL. Try again.');
      });
  };

  // Handle file download
  const handleDownload = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div>
      <h1>All Resources</h1>

      <div>
        <h2>Upload New Resource</h2>
        <form onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Resource Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <button type="submit">Upload</button>
        </form>
      </div>

      {loading && <p>Loading resources...</p>}
      {message && <p>{message}</p>}
      <ul>
        {resources.length > 0 ? (
          resources.map((resource) => (
            <li key={resource.resource_id}>
              <strong>{resource.title}</strong>
              <p>Type: {resource.type}</p>
              <p>Uploaded on: {new Date(resource.upload_date).toLocaleString()}</p>
              <p>{resource.description}</p>
              {resource.file_url && (
                <div>
                  <button onClick={() => handleDownload(resource.file_url)}>
                    Download File
                  </button>
                  <button onClick={() => handleShare(`http://localhost:8000${resource.file_url}`)}>
                    Share File
                  </button>
                </div>
              )}
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
